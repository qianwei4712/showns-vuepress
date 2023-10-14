<div class="catalog">

- [前言](#t0)
- [核心概念](#t1)
  - [Route 路由](#t11)
  - [Predicate 断言](#t12)
  - [Filter 过滤器](#t13)
- [Gateway 入门使用](#t2)
- [动态路由](#t3)
- [断言详解](#t4)
- [Filter](#t5)
- [参考文章](#te)

</div>


## <span id="t0">前言</span>

*2021.11.14，spring cloud 以前只零碎用过几个组件，这次系统学一遍* 

环境：`SpringBoot 2.4.2` 、`SpringCloud 2020.0.1` 、`SpringCloud Alibaba 2021.1`、`JDK 8`、`MYSQL 5.7`

这个系列只讲实现，基本不会深入原理。

----

**代码仓库 gateway-demo 分支** ：[Learning Use Cases/Spring Cloud Demo - Gitee.com](https://gitee.com/learning-use-cases/spring-cloud-demo/tree/gateway-demo/)

官方文档：[Spring Cloud Gateway](https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/#gateway-request-predicates-factories)

本文介绍 spring cloud 统一 API 网关框架 gateway。它旨在为微服务架构提供一种简单有效的统一的 API 路由管理方式。

**Spring Cloud Gateway 底层使用了高性能的通信框架Netty**。

> Spring Cloud Gateway 提供统一的路由方式，且基于 Filter 链的方式，提供了网官基本的功能，例如：安全、监控、指标、限流。

![image-20211114133115818](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211114133115818.png)



<br/>

## <span id="t1">核心概念</span>

Spring Cloud Gateway 有三大核心概念，路由、断言、过滤。

![watermarkuZ3poZW5naGVpdG](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/watermarkuZ3poZW5naGVpdG.png)



### <span id="t11">Route 路由</span>

路由是网关的基本构建块。它由一个 ID，一个目标 URI，一组断言和一组过滤器定义。如果断言为真，则路由匹配。



<br/>

### <span id="t12">Predicate 断言</span>

这是一个 Java 8 的 Predicate。

输入类型是一个 ServerWebExchange。我们可以使用它来匹配来自 HTTP 请求的任何内容，例如 headers 或参数。

通俗点讲，就是路由的判断条件。

<br/>

### <span id="t13">Filter 过滤器</span>

请求到达网关后，先在 `Gateway Handler Mapping` 中找到与请求相匹配的路由，将请求发送到  `Gateway Web Mapping` 。

> **这里的 Filter 过滤器与 java 中的拦截器类似，分为了 请求处理之前 和 处理之后 两个方法。**

- **处理前** 过滤方法可以用来：登录校验、权限校验、流量监控、请求日志输出、协议转换等
- **处理后** 过滤方法可以完成：处理日志输出、数据额外包装。

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/006tKfTcly1fr2q2m5jq7j30cb0gjmxm.jpg)

<br/>

## <span id="t2">Gateway 入门使用</span>





pom 依赖：

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
```

启动类需要注册到注册中心：

```java
@EnableEurekaClient
@SpringBootApplication
public class GatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
}
```

application.yml 简单路由演示：

```yaml
server:
  port: 36500
  
spring:
  application:
    name: gateway-service
  cloud:
    gateway:
      discovery:
        locator:
          # 开启从注册中心动态创建路由的功能，利用微服务名进行路由
          enabled: true
      routes:
        - id: consumer-order-routh    #路由的ID，没有固定规则但要求唯一，建议配合服务名
          uri: http://localhost:56400  #匹配后提供服务的路由地址
          predicates:
            - Path=/order/payByOrderId         # 断言，路径相匹配的进行路由
```

使用网关服务 36500 端口，调用客户服务 56400 的方法：

![image-20211122195032766](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211122195032766.png)





还有一种 java 代码配置的路由，但是有点复杂，还是配置来得容易，看看就行

```java
@Configuration
public class GatewayRoute {
    @Bean
    public RouteLocator shivaShowRouteLocator(RouteLocatorBuilder routeLocatorBuilder) {
        RouteLocatorBuilder.Builder routes = routeLocatorBuilder.routes();
        routes.route("mt_route", r -> r.path("/archives").uri("https://tech.meituan.com"));
        return routes.build();
    }
}
```

![image-20211122195314926](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211122195314926.png)





<br/>

## <span id="t3">动态路由</span>

> 将IP端口换为注册中心的服务名，就可以不关心地址，并且可以自动进行负载均衡

![image-20211122215348951](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211122215348951.png)

```yaml
      routes:
        - id: consumer-order-routh    #路由的ID，没有固定规则但要求唯一，建议配合服务名
          uri: lb://CONSUMER-ORDER #匹配后提供服务的路由地址
          predicates:
            - Path=/order/payByOrderId         # 断言，路径相匹配的进行路由
```



<br/>

## <span id="t4">断言详解</span>



利用 Predicate 的特性实现了各种路由匹配规则，有通过 Header、请求参数等不同的条件来进行作为条件匹配到对应的路由。

如果匹配不成功，会报 404 .

![spring-cloud-gateway3](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/spring-cloud-gateway3.png)

### 通过时间匹配

Predicate 支持设置一个时间，在请求进行转发的时候，可以通过判断在这个时间之前或者之后进行转发。

| 断言参数 | 作用         | 示例                                                         |
| -------- | ------------ | ------------------------------------------------------------ |
| After    | 指定时间后   | - After=2019-01-01T00:00:00+08:00[Asia/Shanghai]             |
| Before   | 指定时间前   | - Before=2019-01-01T00:00:00+08:00[Asia/Shanghai]            |
| Betwee   | 指定时间区间 | - Between=2019-01-01T00:00:00+08:00[Asia/Shanghai], 2019-07-01T00:00:00+08:00[Asia/Shanghai] |

但是这个时间是 Spring 是通过 ZonedDateTime 的时间，和我们正常格式不太一样。

需要用到了 main 跑一下就行。



<br/>

### 通过 Cookie 匹配

**Cookie Route Predicate 可以接收两个参数，一个是 Cookie name ,一个是正则表达式。**

路由规则会通过获取对应的 Cookie name 值和正则表达式去匹配，如果匹配上就会执行路由，如果没有匹配上则不执行。

```yaml
routes:
  - id: gateway-service
  uri: https://www.baidu.com
  predicates:
    - Cookie=sessionId, 123456
```

这个路由表示，存在 `sessionId=123456` 的 `cookie` 才匹配成功。

<br/>

### 通过 Header 属性匹配

Header Route Predicate 和 Cookie Route Predicate 一样，也是接收 2 个参数，一个 header 中属性名称和一个正则表达式，这个属性值和正则表达式匹配则执行。

```yaml
routes:
  - id: gateway-service
  uri: https://www.baidu.com
  predicates:
    - Header=X-Request-Id, \d+
```

<br/>

### 通过 Host 匹配

Host Route Predicate 接收一组参数，一组匹配的域名列表，这个模板是一个 ant 分隔的模板，用.号作为分隔符。它通过参数中的主机地址作为匹配规则。

```yaml
routes:
  - id: gateway-service
  uri: https://www.baidu.com
  predicates:
    - Host=**.baidu.com,**.shiva.show
```

<br/>

### 通过请求方式匹配

可以通过是 POST、GET、PUT、DELETE 等不同的请求方式来进行路由。

```yaml
routes:
  - id: gateway-service
  uri: https://www.baidu.com
  predicates:
    - Method=GET
```

<br/>

### 通过请求路径匹配

Path Route Predicate 接收一个匹配路径的参数来判断是否走路由。

```yaml
routes:
  - id: gateway-service
  uri: https://www.baidu.com
  predicates:
    - Path=/payment/{segment},/customer/{segment}
```

这个不需要解释

<br/>

### 通过请求参数匹配

**Query Route Predicate 支持传入两个参数，一个是属性名一个为属性值，属性值可以是正则表达式。**

```yaml
routes:
  - id: gateway-service
  uri: https://www.baidu.com
  predicates:
    - Query=smile
```

只传入参数名，只要请求中包含 smile 属性的参数即可匹配路由。



<br/>

### 通过请求 ip 匹配

Predicate 也支持通过设置某个 ip 区间号段的请求才会路由，RemoteAddr Route Predicate 接受 cidr 符号(IPv4 或 IPv6 )字符串的列表(最小大小为1)，例如 192.168.0.1/16 (其中 192.168.0.1 是 IP 地址，16 是子网掩码)。

```yaml
routes:
  - id: gateway-service
  uri: https://www.baidu.com
  predicates:
    - RemoteAddr=192.168.1.1/24
```

<br/>

## <span id="t5">Filter</span>

Spring Cloud Gateway的过滤器分为 `pre` 和 `post` 两种方式。

- pre：客户端的请求先经过“pre”类型的filter，然后将请求转发到具体的业务服务
- post：收到业务服务的响应之后，再经过“post”类型的filter处理，最后返回响应到客户端



![QQLUQKXENLTWQP5EMD](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/QQLUQKXENLTWQP5EMD.jpg)



然后按类型，还分为 **GatewayFilter** 和  **GatewayFilter**，这些都是内置的过滤器。

- GatewayFilter : 需要通过 `spring.cloud.routes.filters` 配置在具体路由下，只作用在当前路由上或通过 `spring.cloud.default-filters` 配置在全局，作用在指定的路由上。
- GlobalFilter : 全局过滤器，不需要在配置文件中配置，作用在所有的路由上，最终通过 `GatewayFilterAdapter` 包装成 `GatewayFilterChain` 可识别的过滤器，它为请求业务以及路由的URI转换为真实业务服务的请求地址的核心过滤器，不需要配置，系统初始化时加载，并作用在每个路由上。
  

然后把对应文档放上，需要用到了查一下，功能都比较简陋：

- [Spring Cloud Gateway - gateway filter](https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/#gatewayfilter-factories)
- [Spring Cloud Gateway - global filters](https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/#global-filters)

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/watermarktype_ZmFuZ3poZW5naGVp.png)

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9mb3JlenAuYmxvZy5jc2RuLm5ldA==,size_16,color_FFFFFF,t_70.png)

### 自定义过滤器

自定义过滤器可以帮我们实现：全局日志、统一鉴权，只要就这两。

自定义过滤器 示范：

```java
@Slf4j
@Component
public class GatewayFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // 获取token
        List<String> authorization = exchange.getRequest().getHeaders().get("Authorization");
        if (authorization == null || authorization.size() == 0) {
            //没有 token 信息，直接返回
            log.info("【请求链接】：{}，请求无 token 令牌", exchange.getRequest().getURI());
            exchange.getResponse().setStatusCode(HttpStatus.NOT_ACCEPTABLE);
            return exchange.getResponse().setComplete();
        }
        // 打印日志
        log.info("【请求链接】：{}，【请求参数】：{}", exchange.getRequest().getURI(), exchange.getRequest().getQueryParams());

        //转到下一个过滤器
        return chain.filter(exchange);
    }

    /**
     * 加载过滤器的顺序，越小优先级越高
     */
    @Override
    public int getOrder() {
        return 0;
    }
}
```

请求控制台输出：

```java
c.s.demo.gateway.config.GatewayFilter    : 【请求链接】：http://localhost:36500/order/payByOrderId?id=778，【请求参数】：{id=[778]}
```







<br/>

## <span id="te">参考文章</span>

[尚硅谷SpringCloud框架开发教程(SpringCloudAlibaba微服务分布式架构丨Spring Cloud)_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV18E411x7eT?p=66&spm_id_from=pageDriver)

[跟我学SpringCloud | 第十二篇：Spring Cloud Gateway初探 - 极客挖掘机 - 博客园 (cnblogs.com)](https://www.cnblogs.com/babycomeon/p/11161073.html)

[回到疯狂创客圈-Java高并发社群 (cnblogs.com)](https://www.cnblogs.com/crazymakercircle/p/11704077.html)

[Spring cloud gateway 详解和配置使用（文章较长）_荡漾-CSDN博客](https://blog.csdn.net/qq_38380025/article/details/102968559)

[spring cloud gateway之filter篇_方志朋的专栏-CSDN博客](https://blog.csdn.net/forezp/article/details/85057268)
