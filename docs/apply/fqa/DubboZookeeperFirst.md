
<div class="catalog">

- [废话](#废话)
- [Hello World](#HelloWorld)
  - [安装 zookeeper](#安装zookeeper)
  - [Dubbo 最基础使用](#Dubbo最基础使用)
- [其他简单应用功能](#其他简单应用功能)
  - [同名服务接口区分](#同名服务接口区分)
  - [自带负载均衡](#自带负载均衡)
  - [Zookeeper 密码连接](#Zookeeper密码连接)
- [参考文章](#te)

</div>



## <span id="废话">废话</span>

`2022.07.21，先看官方文档，来个 hello world`

- zookeeper下载地址：[Index of /zookeeper (apache.org)](https://downloads.apache.org/zookeeper/)
- Dubbo3 官方文档地址：[Dubbo3 简介 | Apache Dubbo](https://dubbo.incubator.apache.org/zh/docs/introduction/)
- 简单Demo代码：[dubbo-zookeeper · Learning Use Cases/Demo4j of First - 码云 - 开源中国 (gitee.com)](https://gitee.com/learning-use-cases/demo4j-of-first/tree/master/dubbo-zookeeper)

> 注意！！！zookeeper 3.5 以上版本，一定要下载 *.bin.tar.gz，一定要带有 bin



<br>

## <span id="HelloWorld">Hello World</span>

### <span id="安装zookeeper">安装 zookeeper</span>

1. 下载、上传、解压
2. 修改配置文件 conf 下的 zoo_sample.cfg，名字改成 zoo.cfg
3. 重要配置修改，按需添加:

```properties
# 文件存储路径，pid和其他，temp容易被linux自动清掉
dataDir=/opt/software/zookeeper/cachefile
# 端口修改
clientPort=27268
# 通信心跳时间，Zookeeper服务器与客户端心跳时间，单位毫秒
tickTime = 2000
# LF初始通信时限，初始连接能容忍的最多心跳数
initLimit = 10
# LF同步通信时限，超过次数没响应就从服务器列表删除
syncLimit = 5
```

4. 启动命令，进入 bin 文件夹下：

```shell
# 启动 Zookeeper
./zkServer.sh start
```

- 不用说， status 状态，stop 关闭
- 状态Mode: standalone-单节点；leader-主节点，follower-从节点

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/image-20220723222824504.png)

<br>

### <span id="Dubbo最基础使用">Dubbo 最基础使用</span>

添加 pom 依赖，dubbo 和 zookeeper：

```xml
 <dependency>
     <groupId>org.apache.dubbo</groupId>
     <artifactId>dubbo-spring-boot-starter</artifactId>
     <version>3.0.7</version>
</dependency>

<dependency>
    <groupId>org.apache.dubbo</groupId>
    <artifactId>dubbo-dependencies-zookeeper</artifactId>
    <version>3.0.7</version>
    <type>pom</type>
</dependency>
```

application配置：

```yaml
dubbo:
  application:
    name: provider   #暴露服务的名字
  registry: # 连接的zookeeper地址
    address: zookeeper://127.0.0.1:27268
  config-center:
    address: zookeeper://127.0.0.1:27268
  metadata-report:
    address: zookeeper://127.0.0.1:27268
  #协议端口
  protocol:
    name: dubbo
    port: -1
  scan:
    base-packages: cn.shiva
```

主启动类加上注解：

```java
@EnableDubbo
```

服务提供方，就一个接口和一个实现类：

```java
public interface IProviderService {
    String getMessageById(String id);
}
```

```java
@DubboService
public class ProviderServiceImpl implements IProviderService {
    @Override
    public String getMessageById(String id) {
        return "Dubbo 3 服务提供，输入参数id : " + id;
    }
}
```

服务调用方,需要一个一模一样的接口：

```java
public interface IProviderService {
    String getMessageById(String id);
}
```

```java
@RestController
@RequestMapping(value = "/consumer")
public class ConsumerController {

    @DubboReference
    private IProviderService providerService;

    @RequestMapping("/index")
    public String index() {
        return providerService.getMessageById("111");
    }
}
```

调用截图：

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/image-20220723223625225.png)



<br>

## <span id="其他简单应用功能">其他简单应用功能</span>

- Dubbo 的参考手册，还蛮全的：[参考手册 | Apache Dubbo](https://dubbo.incubator.apache.org/zh/docs3-v2/java-sdk/reference-manual/)

### <span id="同名服务接口区分">同名服务接口区分</span>

上面是的最基础的 1:1:1 结构。

如果现在有 多个服务提供方，恰好两个服务提供方，恰好两个服务提供方，有同一个暴露的接口名。

例如：

- `dubbo.application.name=provider` 提供服务；`IProviderService` 接口；`ProviderServiceImpl` 实现类
- `dubbo.application.name=provider2` 提供服务；`IProviderService` 接口；`ProviderServiceImpl` 实现类
- `@DubboReference` 无其他参数来调用接口

> **这就会造成，`@DubboReference` 无法判断，到底需要调用哪个服务的实现类。**

---

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/image-20220724193222141.png)

```java
@DubboService(group = "provider", version = "1.0")
@DubboService(group = "provider2", version = "1.1")
```

使用注解把两个实现类做区分

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/image-20220724192738334.png)

<br>

### <span id="自带负载均衡">自带负载均衡</span>

dubbo 自带负载均衡：[负载均衡 | Apache Dubbo](https://dubbo.apache.org/zh/docs/v3.0/references/features/loadbalance/#m-zhdocsv30referencesfeaturesloadbalance)

老生常谈了，

| 类型           | 名称        | 说明                                                         |
| -------------- | ----------- | ------------------------------------------------------------ |
| random         | 随机        | 按照权重的设置随机概率，设置 weight                          |
| roundrobin     | 轮询        | 按照权重设置轮询比率，设置 weight                            |
| leastactive    | 最少活跃    | 响应快的提供者接受越多请求，响应慢的接受越少请求             |
| consistenthash | 一致性 Hash | 相同参数的请求总是发到同一个服务提供者（相同参数默认是指请求的第一个参数）根据服务提供者ip设置hash环，携带相同的参数总是发送的同一个服务提供者 |

注解的时候加一下负载就行了：

```java
@DubboService(group = "provider", version = "1.0", loadbalance = "roundrobin")
```

```java
@DubboReference(group = "provider", version = "1.0", loadbalance = "roundrobin")
```

运行结果，一比一权重的轮询：



![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/image-20220724223205414.png)

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/image-20220724223213880.png)





<br>

### <span id="Zookeeper密码连接">Zookeeper 密码连接</span>

因为上面改了 zookeeper 端口，所以客户端不能直接用 2181 端口：

```shell
./zkCli.sh -server localhost:27268
```

进入客户端后，创建用户名密码，然后重启：

```shell
# 用户名:密码
addauth digest zookeeper:zkPwd123
# auth:用户名:密码:
setAcl / auth:zookeeper:zkPwd123:cdrwa
```

然后修改配置文件：

```yaml
dubbo:
  application:
    name: provider   #暴露服务的名字
  registry: # 连接的zookeeper地址
    address: zookeeper://zookeeper:zkPwd123@127.0.0.1:27268
  config-center:
    address: zookeeper://zookeeper:zkPwd123@127.0.0.1:27268
  metadata-report:
    address: zookeeper://zookeeper:zkPwd123@127.0.0.1:27268
```





<br>

## <span id="te">参考文章</span>

- [ZooKeeper的安装_成大事啊的博客-CSDN博客_zookeeper安装](https://blog.csdn.net/m0_49683806/article/details/124626742)
- [dubbo两个同名接口 - CSDN](https://www.csdn.net/tags/NtTakg0sMjYyMDYtYmxvZwO0O0OO0O0O.html)
- [Dubbo负载均衡策略_geejkse_seff的博客-CSDN博客_dubbo负载均衡策略](https://blog.csdn.net/geejkse_seff/article/details/123734483)
- [Dubbo负载均衡 - 动力节点 (bjpowernode.com)](http://www.bjpowernode.com/tutorial_dubbo/261.html)
- [更改Zookeeper端口后无法使用./zkCli.sh连接怎么办_不忘初心mm的博客-CSDN博客](https://blog.csdn.net/ma18845639852/article/details/125059896)
- [zookeeper 设置用户密码 - CSDN](https://www.csdn.net/tags/MtTaAgxsNjMwMjU4LWJsb2cO0O0O.html)
- [zookeeper服务注册中心 设置连接时的账号密码策略_梦里藍天的博客-CSDN博客_zookeeper设置账号密码](https://blog.csdn.net/ren365880/article/details/107707899)
- [duboo配置zookeeper账号密码认证链接_L_limo的博客-CSDN博客_zookeeper 密码 连接](https://blog.csdn.net/L_limo/article/details/111296862)













