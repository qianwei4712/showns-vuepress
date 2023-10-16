### 背景介绍

`2022.10.13`

> ruoyi 框架开发的一个项目，因为导出大量使用注解，在写入数据过程中产生反射耗时过长，导致前端请求超时。

网上找了下没有什么根本解决办法，开始分析下：

1. 第一反应就是多线程写入，但是用的是 `SXSSFWorkbook` ；它是直接写入持久化到磁盘的，所以可能存在数据顺序不正确（脑补的，没深入研究）
2. 否定上一个，就想用异步下载的方式：其实就是先返回，后台开线程创建，过段时间前端再下载
3. 这样的话，如果前端轮询显得不够优雅，再加一个下载中心，保存记录和下载地址
4. 但是又不想加表，只是导出而已，所以引入 Redis

<br/>

### 设想方案

基础版方案：

> - 引入 Redis，将导出记录和导出状态（完成、未完成）保存在缓存中
> - 将文件保存在 阿里云 OSS里，因为 OSS 可以直接设置生命周期，直接设置 1天过期
>   - 这样的话，Redis 和 OSS 同时过期，干净卫生
> - 前端还要加一个下载中心页面，数据直接从Redis里下载
>   - 因为可能存在数据权限问题，所以这里对文件记录要做区分
>   - 缓存的 Key 可以是： **DOWNLOAD:USERID:UUID**
>   - 缓存的 Value 可以是：**{ 创建状态（进行中、成功）、创建时间、文件名、OSS文件路径、创建人、请求参数 }**

看起来好像可以了，但是这里还有几个细节

1. 如果前端重复请求，那不是一直在创建大文件？这不是无所谓的对服务器加压吗
2. 每次下载还得切换到下载中心，点击下载，操作不够流程

针对这两个问题，再对上述方案做下改进：

> - **在前端可以设置一个轮询（说好的不优雅呢），根据第一次下载返回的ID下载，只要后台一完成，就可以直接下载，不再切换页面**
> - **相同请求，一定时间内（例如 5分钟）不再重新创建生成文件：相同请求人、相同请求、相同请求参数**

所以，总体的流程为：

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/%E6%96%87%E4%BB%B6%E4%B8%8B%E8%BD%BDRedisOSS%E4%B8%8D%E5%8A%A0%E8%A1%A8%E8%87%AA%E5%8A%A8%E8%BF%87%E6%9C%9F.png)





<br/>

### 后台代码实现

`细节可以自行优化`

Redis 中保存的记录对象：

```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExportCacheDTO implements Serializable {
    //文件id
    private String uuid;
    //文件名
    private String fileName;
    //创建人
    private String createBy;
    //创建时间
    private String createTime;
    //创建时间戳
    private long timestamp;
    //导出状态，false-创建中，true-已创建
    private boolean complete;
    //文件OSS地址
    private String url;
    //本次导出请求参数
    private String params;

}
```

返回前端的结果集：

```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExportDownloadBO implements Serializable {
    /**
     * 当前导出状态；
     * 0-第一次创建（可以用UUID轮询），1-创建中（可以用UUID轮询），2-已创建（url可以直接下载）
     */
    private int status;
    private String uuid;
    private String url;
}
```

导出工具类：

```java
/**
 * 导出缓存封装工具类
 *
 * @author shiva   2022-10-13 21:04
 */
@Slf4j
@Component
public class ExportCacheUtil {

    @Autowired
    private AliyunOssUpload aliyunOssUpload;
    @Autowired
    private RedisCache redisCache;
    @Autowired
    private ThreadPoolConfig pool;

    /**
     * 重复请求标志，放在请求实体参数的 map 里面
     */
    private static final String REPEAT_DOWNLOAD_FLAG = "repeatDownload";
    /**
     * 文件下载redis键的前缀，当前结构为 前缀 + 用户id + UUID
     */
    private static final String CACHE_DOWNLOAD_KEY_PREFIX = "CACHE_DOWNLOAD:";
    /**
     * OSS的前缀，用来设置做生命周期的匹配规则
     */
    private static final String DOWN_FILE_CACHE_REDIS = "downfilecacheredis";

    /**
     * 有效的间隔时间，时间太长实时数据会发生变化
     */
    private static final int INTERVAL = 3 * 60 * 1000;


    public AjaxResult downloadFromCache(MPBaseEntity entity, Class clazz, List list, String fileName, String exportType) {
        // 1.先判断，是不是轮询请求创建结束的下载地址
        // 从请求参数里，拿到第一次请求获取到的 UUID
        String repeatRequestUid = (String) entity.getParams().get(REPEAT_DOWNLOAD_FLAG);
        if (StringUtils.isNotBlank(repeatRequestUid)) {
            // 如果真的存在，那就要进入分支，开始获取Redis里的数据了
            return AjaxResult.success(redisUidFilter(repeatRequestUid, exportType));
        }
        // ******* 第一个判断分支结束 ******************************************************

        // 2.再判断找个用户是否已经请求过了，主要判断 请求人、请求参数、导出类型
        String requestParams = JSONObject.toJSONString(entity);
        //这里有三个结果：创建成功（true,有地址），正在创建中（false,没地址），第一次创建（null，null）
        ExportDownloadBO exportDownloadBO = redisParamsFilter(requestParams, exportType);
        if (0 != exportDownloadBO.getStatus()) {
            //不等于0，就是创建中，已创建；都可以直接返回
            return AjaxResult.success(exportDownloadBO);
        }
        // ******* 第二个判断分支结束 ******************************************************

        // 3.最后才是实际开始生成文件
        // 先生成UUID
        String uuid = UUID.randomUUID().toString();
        //开启线程，执行任务
        LoginUser loginUser = SecurityUtils.getLoginUser();
        pool.threadPoolTaskExecutor().execute(() ->
                createWorkBook(clazz, list, fileName, requestParams, uuid, loginUser, exportType));
        //返回前端，开始轮询
        exportDownloadBO.setUuid(uuid);
        return AjaxResult.success("正在获取中，稍后可以到下载中心下载", exportDownloadBO);
    }

    /**
     * 实际创建文件，保存到OSS中，保存到 redis中
     */
    public void createWorkBook(Class clazz, List list, String fileName, String requestParams, String uuid, LoginUser loginUser, String exportType) {
        // 开始了，创建导出对象
        ExcelUtil<?> util = new ExcelUtil<>(clazz);
        OutputStream out = null;
        String absoluteFile = null;
        try {
            // 先创建一个 Value，预先放到缓存里
            ExportCacheDTO cacheDTO = ExportCacheDTO.builder()
                    .uuid(uuid).fileName(fileName).createBy(loginUser.getUser().getNickName())
                    .createTime(DateUtils.dateTimeNow(DateUtils.YYYY_MM_DD_HH_MM_SS)).timestamp(System.currentTimeMillis())
                    .complete(false).params(requestParams)
                    .build();
            // 塞到缓存里， 24 小时过期
            redisCache.setCacheObject(CACHE_DOWNLOAD_KEY_PREFIX + loginUser.getUserId() + ":" + exportType + ":" + uuid,
                    cacheDTO, 24, TimeUnit.HOURS);

            // ******* 开始实际创建文件以及上传 ******************************************************
            // ******* 这个部分代码可以替换，不一定非要使用OSS，留在本地3天删除也可以 ******************************************************

            util.init(list, fileName, Excel.Type.EXPORT);
            util.writeSheet();
            absoluteFile = util.getAbsoluteFile(util.encodingFilename(fileName));
            out = new FileOutputStream(absoluteFile);
            util.wb.write(out);
            // 在把 file文件转成 mp 文件
            File file = new File(absoluteFile);
            MultipartFile cMultiFile = getMultipartFile(file);
            // 传到OSS，然后拿到URI地址
            String url = aliyunOssUpload.upload(DOWN_FILE_CACHE_REDIS, cMultiFile);

            // ******* 实际创建文件以及上传结束 ******************************************************

            //补全字段，重新塞一下
            cacheDTO.setComplete(true);
            cacheDTO.setUrl(url);
            redisCache.setCacheObject(CACHE_DOWNLOAD_KEY_PREFIX + loginUser.getUserId() + ":" + exportType + ":" + uuid, cacheDTO, 24, TimeUnit.HOURS);
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            IOUtils.closeQuietly(util.wb);
            IOUtils.closeQuietly(out);
            // 最后要把本地文件删掉，别占磁盘空间
            FileUtils.deleteFile(absoluteFile);
        }
    }


    /**
     * 根据UUID，从redis中检索
     */
    private ExportDownloadBO redisUidFilter(String uuid, String exportType) {
        //拿到了可以直接返回
        ExportCacheDTO cacheObject = redisCache.getCacheObject(CACHE_DOWNLOAD_KEY_PREFIX + SecurityUtils.getUserId() + ":" + exportType + ":" + uuid);
        if (cacheObject == null || !cacheObject.isComplete()) {
            //空的，或者还在创建中
            return ExportDownloadBO.builder()
                    .status(1).uuid(uuid)
                    .build();
        }
        return ExportDownloadBO.builder()
                .status(2).uuid(uuid)
                .url(cacheObject.getUrl())
                .build();
    }

    /**
     * 根据请求参数（实体类转json），从redis中检索
     */
    private ExportDownloadBO redisParamsFilter(String params, String exportType) {
        // 拿到全部这个用户的导出记录，1天内
        Collection<String> keys = redisCache.keys(CACHE_DOWNLOAD_KEY_PREFIX + SecurityUtils.getUserId() + ":" + exportType + ":*");
        // 循环判断，是不是同一个请求类型和参数
        for (String key : keys) {
            ExportCacheDTO cacheObject = redisCache.getCacheObject(key);
            //请求在3分钟内，并且参数相同；
            // 1.首先需要判断：有效期内。其次是参数相同
            // 2.其次判断，是否创建成功，成功了直接返回，没成功的话也可以结束了，不用再次创建
            if ((System.currentTimeMillis() - cacheObject.getTimestamp()) < INTERVAL && params.equals(cacheObject.getParams())) {
                if (cacheObject.isComplete()) {
                    return ExportDownloadBO.builder()
                            .status(2).uuid(cacheObject.getUuid())
                            .url(cacheObject.getUrl())
                            .build();
                } else {
                    return ExportDownloadBO.builder()
                            .status(1).uuid(cacheObject.getUuid())
                            .build();
                }
            }
        }
        //第一次创建，还没有UUID
        return ExportDownloadBO.builder().status(0).build();
    }

    /**
     * file 文件转 MultipartFile
     */
    private static MultipartFile getMultipartFile(File file) {
        FileItem item = new DiskFileItemFactory().createItem("file"
                , MediaType.MULTIPART_FORM_DATA_VALUE
                , true
                , file.getName());
        try (InputStream input = new FileInputStream(file);
             OutputStream os = item.getOutputStream()) {
            IOUtils.copy(input, os);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid file: " + e, e);
        }
        return new CommonsMultipartFile(item);
    }

}
```



<br/>

### 前端请求

前端的话，封装了一个方法，根据后台方法进行轮询、递归。

```javascript
    /**
     * 处理下载返回状态的判断逻辑
     * 0-第一次创建（可以用UUID轮询），1-创建中（可以用UUID轮询），2-已创建（url可以直接下载）
     */
    repeatExport(data) {
      const that = this
      if (data == null){
        return;
      }
      // 0-第一次创建（可以用UUID轮询）
      // 1-创建中（可以用UUID轮询）
      if (data.status === 0 || data.status === 1) {
        //一秒后开始执行，相当于进行了递归
        setTimeout(function(){
          that.queryParams = that.addRepeatUid(
            that.queryParams,
            data.uuid,
          );
          exportOperationRecord(that.queryParams).then(response => {
            that.repeatExport(response.data)
          })
        }, 1000)
      }
      // 2-已创建（url可以直接下载）
      if (data.status === 2) {
        window.open(data.url, "_blank");
        that.clearRepeatUid(that.queryParams);
      }
    },
    // 请求参数加上 uid
    addRepeatUid(params, uid) {
      let search = params;
      search.params =
        typeof search.params === "object" &&
        search.params !== null &&
        !Array.isArray(search.params) ?
          search.params : {};
      search.params["repeatDownload"] = uid;
      return search;
    },
    clearRepeatUid(params){
      let search = params;
      delete search.params["repeatDownload"];
    },
```

> 这里的下载方法还得优化下，会被浏览器拦截



<br/>

### 下载中心

> - **就是根据 用户id，使用 keys 拿到全部key**
> - **循环组装返回就行，一天有效期也不会有太多数据**



<br/>

### 参考文章

- [Excel导出功能超时解决方案 -- 异步处理 - 程序员大本营](https://www.pianshen.com/article/31601618407/)
- [ruoyi系统导入容易超时解决方案(redis+多线程)-pudn.com](https://www.pudn.com/news/6228cf709ddf223e1ad143c8.html)

- [超好用的Excel异步导出功能_小道仙97的博客-CSDN博客_异步导出excel](https://blog.csdn.net/Tomwildboar/article/details/120106329)
