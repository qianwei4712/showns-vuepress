

## 前言

*2021.10.15* 

起因是在项目中，我自己习惯都是在拦截器中拿参数、打日志。

> 但是一个接口对接方比较独特，参数都写在 `request流` 里面

也是第一次遇到。

**但是问题是，request 流中的数据，只能被读取一次，现在日志打印读取了，后面 controller 里就没有了。**





<br/>

## 问题复现

接口接收数据对象：

```java
@Data
public class QueryDTO {
    public String id;
    public Integer type;
}
```

接口方法：

```java
@RestController
@RequestMapping(value = "stream")
public class StreamController {

    @PostMapping(value = "errorDemo")
    public String errorDemo(@RequestBody QueryDTO queryDTO, HttpServletRequest request) {
        return JSONObject.toJSONString(queryDTO);
    }

}
```

拦截器配置：

```java
@Configuration
public class InterceptorConfig implements WebMvcConfigurer {
    @Autowired
    private StreamInterceptor streamInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(streamInterceptor).addPathPatterns("/**/errorDemo");
        WebMvcConfigurer.super.addInterceptors(registry);
    }
}
```

拦截器获取流数据打印日志：

```java
@Slf4j
@Configuration
public class StreamInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        BufferedReader br = request.getReader();
        String str2;
        StringBuilder wholeStr = new StringBuilder();
        while ((str2 = br.readLine()) != null) {
            wholeStr.append(str2);
        }
        log.info("【请求链接】：{}，【请求参数】：{}", request.getRequestURI(), wholeStr.toString());
        return true;
    }
}
```

postman 调用：

![image-20211016134049322](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211016134049322.png)



控制台打印：

```
2021-10-16 13:40:19.816  INFO 11916 --- [p-nio-80-exec-2] cn.shiva.config.StreamInterceptor        : 【请求链接】：/stream/errorDemo，【请求参数】：{    "id":"123",    "type":1}

2021-10-16 13:40:19.864 ERROR 11916 --- [p-nio-80-exec-2] o.a.c.c.C.[.[.[/].[dispatcherServlet]    : Servlet.service() for servlet [dispatcherServlet] in context with path [] threw exception [Request processing failed; nested exception is java.lang.IllegalStateException: getReader() has already been called for this request] with root cause
java.lang.IllegalStateException: getReader() has already been called for this request
	at org.apache.catalina.connector.Request.getInputStream(Request.java:1074) ~[tomcat-embed-core-9.0.53.jar:9.0.53]
```

原因上面已经说过了，request 流中的数据已经被读取了。





<br/>

## 为什么只能读取一次

**request** 的body数据只能通过 **getInputStream()** 和 **getReader()** 方法读取。

因为我使用的方式是 **`BufferedReader.readLine()`** 方法，这个方法的源码有兴趣可以读一读。简单讲就是：

> **通过指针位置获取 char 数组数据，每次读取移动指针位置。读完指针移到数组尾了，那就没数据了。**



所以，讲道理的话，只需要想办法从头再开始读就行了，并且 `BufferedReader` 是支持标记重置的：

```java
public boolean markSupported() {
    return true;
}
```

但是，实际情况可能不是这样。 愿意也弄不清楚，以后看 IO 的时候再研究。

----

其他说明：

`CoyoteReader` + `InputBuffer` 为默认实现方式。默认 buffer 大小为 8K，大约 4000 个字。

```java
public static final int DEFAULT_BUFFER_SIZE = 8192;
```

如果一行超出 8K ，头部数据将会永久丢失，而缓存的 8k 则可以重复使用。





<br/>

## HttpServletRequestWrapper 方式

这种方式在网上找到的比较多，

1. 简单来说，就是通过自定义的 `HttpServletRequestWrapper` 备份一下流的数据。
2. 自定义 `HttpServletRequestWrapper` 调用父类 `request.getInputStream()` 读取全部数据出来保存在一个byte数组内。
3. 当再次获取流数据的时候，自定义的 `HttpServletRequestWrapper` 就会用 byte 数组重新生成一个新的流。
4. 备份的流数据仍然保留在byte数组中。



准备一个相同的方法：

```java
@PostMapping(value = "wapperDemo")
public String wapperDemo(@RequestBody QueryDTO queryDTO, HttpServletRequest request) {
    return JSONObject.toJSONString(queryDTO);
}
```

准备一个过滤器，配置这个方法：

```java
@Configuration
public class FilterConfig {
    @Autowired
    private StreamFilter streamFilter;

    @Bean
    public FilterRegistrationBean registFilter() {
        FilterRegistrationBean registration = new FilterRegistrationBean();
        registration.setFilter(streamFilter);
        registration.addUrlPatterns("/stream/wapperDemo");
        registration.setName("streamFilter");
        registration.setOrder(1);
        return registration;
    }
}
```

过滤器内打印参数：

```java
@Slf4j
@Component
public class StreamFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {

        WrappedHttpServletRequest requestWrapper = new WrappedHttpServletRequest((HttpServletRequest) request);

        String params = requestWrapper.getRequestParams();
        log.info("【请求链接】：{}，【请求参数】：{}", ((HttpServletRequest) request).getRequestURI(), params);

        chain.doFilter(requestWrapper, response);
    }
}
```

继承 **HttpServletRequestWrapper** 类，重写方法：

```java
public class WrappedHttpServletRequest extends HttpServletRequestWrapper {

    private byte[] bytes;
    private WrappedServletInputStream wrappedServletInputStream;

    public WrappedHttpServletRequest(HttpServletRequest request) throws IOException {
        super(request);
        // 读取输入流里的请求参数，并保存到bytes里
        bytes = IOUtils.toByteArray(request.getInputStream());
        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes);
        this.wrappedServletInputStream = new WrappedServletInputStream(byteArrayInputStream);

        reWriteInputStream();

    }

    /**
     * 把参数重新写进请求里
     */
    public void reWriteInputStream() {
        wrappedServletInputStream.setStream(new ByteArrayInputStream(bytes != null ? bytes : new byte[0]));
    }

    @Override
    public ServletInputStream getInputStream() throws IOException {
        return wrappedServletInputStream;
    }

    @Override
    public BufferedReader getReader() throws IOException {
        return new BufferedReader(new InputStreamReader(wrappedServletInputStream));
    }

    /**
     * 获取post参数，可以自己再转为相应格式
     */
    public String getRequestParams() throws IOException {
        return new String(bytes, this.getCharacterEncoding());
    }

    private class WrappedServletInputStream extends ServletInputStream {

        public void setStream(InputStream stream) { this.stream = stream; }

        private InputStream stream;

        public WrappedServletInputStream(InputStream stream) {  this.stream = stream; }

        @Override
        public int read() throws IOException { return stream.read(); }

        @Override
        public boolean isFinished() { return true; }

        @Override
        public boolean isReady() { return true; }

        @Override
        public void setReadListener(ReadListener readListener) { }
    }
}
```

代码比较明显，就是拿到流数据保存到 `byte[]` 数据，重新写入。



好，开始测试：

![image-20211016171633262](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211016171633262.png)

控制台打印：

```
2021-10-16 17:15:43.979  INFO 13400 --- [p-nio-80-exec-5] cn.shiva.config.StreamFilter             : 【请求链接】：/stream/wapperDemo，【请求参数】：{
    "id":"123",
    "type":1
}
```



<br/>

## 参考文章

[httpServletRequest中的流只能读取一次的原因 - 一人浅醉- - 博客园 (cnblogs.com)](https://www.cnblogs.com/yepei/p/7011081.html)

[获取request输入流_ZHL's Blog-CSDN博客_从request中获取输入流](https://blog.csdn.net/zhanghanlun/article/details/81611893)

[java HttpServletRequest 重复流读取 - 花开浪漫拾 - 博客园 (cnblogs.com)](https://www.cnblogs.com/wulm/p/11082100.html)

[java HttpServletRequest 重复流读取 (shuzhiduo.com)](https://www.shuzhiduo.com/A/x9J2en7ez6/)

[完美解决request请求流只能读取一次的问题_java_脚本之家 (jb51.net)](https://www.jb51.net/article/193961.htm)
