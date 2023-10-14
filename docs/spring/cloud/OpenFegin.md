<div class="catalog">

- [前言](#t1)
- [OpenFegin 使用](#t2)
- [自定义 FeignClient](#t3)
- [OkHttpClient](#t4)
- [参考文章](#te)

</div>





## <span id="t1">前言</span>

*2021.10.25，spring cloud 以前只零碎用过几个组件，这次系统学一遍* 

环境：`SpringBoot 2.4.2` 、`SpringCloud 2020.0.1` 、`SpringCloud Alibaba 2021.1`、`JDK 8`、`MYSQL 5.7`

这个系列只讲实现，基本不会深入原理。

----

**代码仓库 openFegin-demo 分支** ：[Learning Use Cases/Spring Cloud Demo - Gitee.com](https://gitee.com/learning-use-cases/spring-cloud-demo/tree/openFegin-demo/)

官方文档：[Spring Cloud OpenFeign](https://spring.io/projects/spring-cloud-openfeign#overview)

本文介绍 spring cloud 远程服务调用组件 OpenFegin。

> Fegin 是一个声明式 Web 服务客户端，只需要创建一个接口并加上注解，即可通过注册中心被调用。

看几个层次关系。

1. Fegin 内置了 Ribbon ，实现了客户端负载均衡，调用注册中心获取服务列表。
2. Fegin 自己实现了声明式注解定义接口，通过这个接口就可以调用注册中心服务。
3. OpenFegin 在 Fegin 的基础上，实现了 Spring MVC 的支持，通过动态代理产生实现类。





<br/>

## <span id="t2">OpenFegin 使用</span>

添加依赖：

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

Application 添加注解：

```java
@EnableFeignClients
```

对应服务控制器，客户端编写 Fegin 接口：

```java
@FeignClient(value = "PAYMENT-SERVICE")
@Component
public interface PaymentServiceFegin {
    @GetMapping(value = "/payment/getById")
    Result<PaymentDTO> getById(@RequestParam("id") Long id);
}
```

对应远程服务端控制器：

```java
@RestController
@RequestMapping(value = "/payment")
public class PaymentController {

    @Autowired
    private PaymentMapper paymentMapper;

    @Value("${server.port}")
    private String port;

    @ResponseBody
    @GetMapping(value = "getById")
    public Result<Payment> getById(Long id) {
        Payment payment = paymentMapper.selectById(id);
        if (payment != null) {
            return Result.<Payment>builder().code(CodeEnum.SUCCESS.code).message("查询成功，服务端口：" + port).data(payment).build();
        } else {
            return Result.<Payment>builder().code(CodeEnum.UNSATISFIED.code).message("未查询到指定记录").build();
        }
    }

}
```

开放接口：

```java
@Autowired
private PaymentServiceFegin paymentServiceFegin;

@ResponseBody
@GetMapping(value = "getFromOpenFegin")
public Result<PaymentDTO> getFromOpenFegin(Long id) {
    return paymentServiceFegin.getById(id);
}
```





调用结果：

![image-20211023215411654](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211023215411654.png)



![image-20211023215439456](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211023215439456.png)



可见，默认依然是轮询策略。

<br/>

## <span id="t3">自定义 FeignClient</span>

`@FeignClient` 注解的 configuration 参数，默认是通过 `FeignClientsConfiguration` 类定义的，可以配置 Client，Contract，Encoder/Decoder 等。

`FeignClientsConfiguration` 类中的配置方法及默认值如下：

- **feignContract**: SpringMvcContract
- **feignDecoder**: ResponseEntityDecoder
- **feignEncoder**: SpringEncoder
- **feignLogger**: Slf4jLogger
- **feignBuilder**: Feign.Builder
- **feignClient**: LoadBalancerFeignClient（开启Ribbon时）或默认的HttpURLConnection

在 `ComponentScan` 外进行配置：

```java
@Configuration
public class MyConfiguration {
	@Bean
	public Contract feignContract(...) {...}
 
	@Bean
	public Encoder feignEncoder() {...}
 
	@Bean
	public Decoder feignDecoder() {...}
 
	...
}
```

然后在`@FeignClient` 注解时使用：

```java
@FeignClient(value = "PAYMENT-SERVICE", configuration = MyConfiguration.class)
@Component
public interface PaymentServiceFegin {
    @GetMapping(value = "/payment/getById")
    Result<PaymentDTO> getById(@RequestParam("id") Long id);
}
```

也可以使用 yml 进行配置：

```yaml
feign:
  client:
	config:
	  feignName: PAYMENT-SERVICE
		connectTimeout: 5000
		readTimeout: 5000
		loggerLevel: full
		encoder: com.example.MyEncoder
		decoder: com.example.MyDecoder
		contract: com.example.MyContract
```

<br/>

## <span id="t4">OkHttpClient</span>

Feign 最终发送 Request 请求以及接收 Response 响应都是由 Client 组件来完成的。

首先说明一点，默认的 HttpURLConnection 存在一些问题，一般推荐使用 `OkHttpClient` 或者自己封装。

例如，默认的 Client 如下：

```java
public static class Default implements Client {
        private final SSLSocketFactory sslContextFactory;
        private final HostnameVerifier hostnameVerifier;
 
        public Default(SSLSocketFactory sslContextFactory, HostnameVerifier hostnameVerifier) {
            this.sslContextFactory = sslContextFactory;
            this.hostnameVerifier = hostnameVerifier;
        }
 
        public Response execute(Request request, Options options) throws IOException {
            HttpURLConnection connection = this.convertAndSend(request, options);
            return this.convertResponse(connection, request);
        }
        
        ......//代码省略
}
```

**这种情况下，由于缺乏连接池的支持，在达到一定流量的后服务肯定会出问题 。**  



加入依赖：

```xml
<dependency>
    <groupId>io.github.openfeign</groupId>
    <artifactId>feign-okhttp</artifactId>
    <version>10.2.0</version>
</dependency>
```

添加配置：

```yaml
feign:
  okhttp:
    enabled: true
```

超时配置：

```java
@Configuration
@ConditionalOnClass(Feign.class)
@AutoConfigureBefore(FeignAutoConfiguration.class)
public class OkHttpConfig {
    @Bean
    public okhttp3.OkHttpClient okHttpClient() {
        return new okhttp3.OkHttpClient.Builder()
                //设置连接超时
                .connectTimeout(60, TimeUnit.SECONDS)
                //设置读超时
                .readTimeout(60, TimeUnit.SECONDS)
                //设置写超时
                .writeTimeout(60, TimeUnit.SECONDS)
                //是否自动重连
                .retryOnConnectionFailure(true)
                .connectionPool(new ConnectionPool())
                //构建OkHttpClient对象
                .build();
    }
}
```

> **可见 OkHttp 配置是全局生效的，这里需要注意下。**







<br/>

## <span id="te">参考文章</span>

[尚硅谷SpringCloud框架开发教程(SpringCloudAlibaba微服务分布式架构丨Spring Cloud)_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV18E411x7eT?p=36)

[Spring Cloud OpenFeign详解_成长的足迹-CSDN博客_openfeign](https://blog.csdn.net/taiyangdao/article/details/81359394)

[Feign-使用HttpClient和OkHttp_u010277958的博客-CSDN博客_feign okhttp](https://blog.csdn.net/u010277958/article/details/88730889)

[使用HttpClient和OkHttp调用服务的区别（附示例代码） - 骑着蜗牛看海呀 - 博客园 (cnblogs.com)](https://www.cnblogs.com/zk-blog/p/12465951.html)

[Spring Cloud OpenFeign入门和实战 - SegmentFault 思否](https://segmentfault.com/a/1190000039889836?utm_source=sf-hot-article)
