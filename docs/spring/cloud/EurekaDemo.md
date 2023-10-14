

## 前言

*2021.10.20，spring cloud 以前只零碎用过几个组件，这次系统学一遍* 

环境：`SpringBoot 2.4.2` 、`SpringCloud 2020.0.1` 、`SpringCloud Alibaba 2021.1`、`JDK 8`、`MYSQL 5.7`

这个系列只讲实现，基本不会深入原理。

----

**代码仓库 eureka-demo 分支** ：[Learning Use Cases/Spring Cloud Demo - Gitee.com](https://gitee.com/learning-use-cases/spring-cloud-demo/tree/eureka-demo/)



本文介绍 spring cloud 服务注册中心 Eureka 。虽然 Eureka 已经停更了，但是很多老项目都是用这个注册中心，做下各种功能介绍。

![image-20211021220506550](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211021220506550.png)

Eureka 可以实现服务调用、负载均衡、容错，服务注册与发现。下面是 Eureka 的架构图。



<img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211020215151011.png" alt="image-20211020215151011" style="zoom:80%;" />



<br/>

## Eureka 介绍

Eureka 包含两个组件：Eureka Server 和 Eureka Client。

- Eureka Server ：服务提供者，Client 启动后到 Server 进行注册，Server中的服务注册表中将会存储所有可用服务节点的信息，服务节点的信息可以在界面中直观的看到。
  - **Eureka Server 自身也是一个服务，默认情况下会自动注册到注册中心。** 
  - Eureka Server 通过 **Register、Get、Renew** 等接口提供服务的 **注册、发现和心跳检测** 等服务。
- Eureka Client ：客户端。在应用启动后，会 向Eureka Server 发送心跳，**默认周期为30秒**
  - 如果 Eureka Server 在多个心跳周期内没有接收到某个节点的心跳，Eureka Server将会从服务注册表中把这个**服务节点移除（默认90秒）**



其他主要功能如下：

> **Register(服务注册)**：把自己的IP和端口注册给Eureka。
>
> **Renew(服务续约)**：发送心跳包，每30秒发送一次。告诉Eureka自己还活着。
>
> **Cancel(服务下线)**：当provider关闭时会向Eureka发送消息，把自己从服务列表中删除。防止consumer调用到不存在的服务。
>
> **Get Registry(获取服务注册列表)**：获取其他服务列表。
>
> **Replicate(集群中数据同步)**：eureka集群中的数据复制与同步。
>
> **Make Remote Call(远程调用)**：完成服务的远程调用。

<br/>

## Eureka Service

新建一个 springboot 模块，pom 文件添加依赖：

```xml
 <!-- 注册中心服务 -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
</dependency>
```

yml 配置文件：

```yaml
server:
  port: 46500

# 单机版
eureka:
  instance:
    # eureka服务端的实例名字
    hostname: localhost
  client:
    # 表示不向注册中心注册自己
    register-with-eureka: false
    #表示自己就是注册中心，职责是维护服务实例，并不需要去检索服务
    fetch-registry: false
    service-url:
      #设置与eureka server交互的地址查询服务和注册服务都需要依赖这个地址
      defaultZone: http://${eureka.instance.hostname}:${server.port}/eureka/
```

Application 启动类添加注解：

```java
@EnableEurekaServer
@SpringBootApplication
public class EurekaApplication {
    public static void main(String[] args) {
        SpringApplication.run(EurekaApplication.class, args);
    }
}
```

启动服务，输入注册中心地址：http://localhost:46500/ ，出现控制台运行成功。

![image-20211020223827167](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211020223827167.png)



<br/>

## Eureka Client

注册服务添加 eureka 客户端依赖：

```xml
<!-- 注册中心服务，客户端 -->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
```

Application 启动类添加注解：

```java
@EnableEurekaClient
```

yml 配置文件，添加注册中心相关配置：

```yaml
# 单机版
eureka:
  client:
    # 是否向注册中心注册自己
    register-with-eureka: true
    # 是否从注册中心抓取已有的注册信息 默认true，集群必须设置为true
    fetchRegistry: true
    service-url:
      # 设置与eureka server交互的地址查询服务和注册服务都需要依赖这个地址
      defaultZone: http://127.0.0.1:46500/eureka
```

启动两个服务，客户端控制台打印：

```
2021-10-20 22:54:27.426  INFO 11032 --- [nfoReplicator-0] com.netflix.discovery.DiscoveryClient    : DiscoveryClient_PAYMENT-SERVICE/DESKTOP-OKMJ135:payment-service:57000: registering service...
2021-10-20 22:54:27.569  INFO 11032 --- [nfoReplicator-0] com.netflix.discovery.DiscoveryClient    : DiscoveryClient_PAYMENT-SERVICE/DESKTOP-OKMJ135:payment-service:57000 - registration status: 204
```

eureka 控制界面注册服务可见：

![image-20211020225523294](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211020225523294.png)





<br/>

## 集群搭建

Eureka 自带实现了集群互备。只要多起一个服务，加个配置就可以。

配置文件修改：

```yaml
server:
  port: 46500

# 集群版
eureka:
  instance:
    # eureka服务端的实例名字
    hostname: localhost
  client:
    # 表示不向注册中心注册自己
    register-with-eureka: false
    #表示自己就是注册中心，职责是维护服务实例，并不需要去检索服务
    fetch-registry: false
    service-url:
      #设置与eureka server交互的地址查询服务和注册服务都需要依赖这个地址
      defaultZone: http://127.0.0.1:46501/eureka/
```

其实也没什么修改，只是注册地址换一下，本来是自身，现在是其他服务。

- 多个 `defaultZone` 地址，用 `,` 分割。
- `hostname` 最好区别，可以用 ip 作为名称。



<br/>

## 服务发现

这部分看看得了，Application 启动类添加注解：

```java
@EnableDiscoveryClient
```

调用测试：

```java
@Autowired
private DiscoveryClient discoveryClient;

@ResponseBody
@GetMapping(value = "discovery")
public String discovery(){
    return discoveryClient.getServices().toString();
}
```

拿到服务就能调用：

![image-20211021214646105](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211021214646105.png)





<br/>



## 自我保护

下面的红字应该都见过：

![image-20211021214744019](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211021214744019.png)

一句话解释，作用就是：

> 某时刻某一个微服务不可用了，Eureka 不会立刻清理，依旧会对该微服务的信息进行保存，属于 CAP理论内的 AP 分支。



这就要讲到著名的 CAP 理论：

Brewer教授当时想象的分布式场景是webservice，一组websevrice后台运行着众多的server，对service的读写会反应到后台的server集群，并对CAP进行了定义：

- C（一致性）：所有的节点上的数据时刻保持同步
- A（可用性）：每个请求都能接受到一个响应，无论响应成功或失败
- P（分区容错）：系统应该能持续提供服务，即使系统内部有消息丢失（分区）



**CAP三者不可兼得**，该如何取舍：

1. CA : 优先保证一致性和可用性，放弃分区容错。 这也意味着放弃系统的扩展性，系统不再是分布式的，有违设计的初衷。

2. CP : 优先保证一致性和分区容错性，放弃可用性。在数据一致性要求比较高的场合(譬如:zookeeper,Hbase) 是比较常见的做法，一旦发生网络故障或者消息丢失，就会牺牲用户体验，等恢复之后用户才逐渐能访问。

3. AP : 优先保证可用性和分区容错性，放弃一致性。NoSQL中的Cassandra 就是这种架构。跟CP一样，放弃一致性不是说一致性就不保证了，而是逐渐的变得一致。









<br/>

## 参考文章

[尚硅谷SpringCloud框架开发教程(SpringCloudAlibaba微服务分布式架构丨Spring Cloud)_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV18E411x7eT?p=3)

[SpringBoot和Spring Cloud以及SpringCloud Alibaba版本对应关系_蔡徐坤冲充崇的博客-CSDN博客](https://blog.csdn.net/weixin_45873488/article/details/120347340)

[cloud2020: 尚硅谷cloud2020 学习代码 (gitee.com)](https://gitee.com/lixiaogou/cloud2020)

[SpringCloud之Eureka注册中心原理及其搭建 - kosamino - 博客园 (cnblogs.com)](https://www.cnblogs.com/jing99/p/11576133.html)

[CAP理论的理解 - John_nok - 博客园 (cnblogs.com)](https://www.cnblogs.com/mingorun/p/11025538.html)

[CAP理论_老码农的专栏-CSDN博客_cap理论](https://blog.csdn.net/chen77716/article/details/30635543)
