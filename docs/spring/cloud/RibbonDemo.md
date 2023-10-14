

## 前言

*2021.10.23，spring cloud 以前只零碎用过几个组件，这次系统学一遍* 

环境：`SpringBoot 2.4.2` 、`SpringCloud 2020.0.1` 、`SpringCloud Alibaba 2021.1`、`JDK 8`、`MYSQL 5.7`

这个系列只讲实现，基本不会深入原理。

----

**代码仓库 ribbon-demo 分支** ：[Learning Use Cases/Spring Cloud Demo - Gitee.com](https://gitee.com/learning-use-cases/spring-cloud-demo/tree/ribbon-demo/)

本文介绍 spring cloud 负载均衡工具 Ribbon ，提供客户端负载均衡算法和服务调用。Ribbon 提供了：连接超时、重试、负载均衡规则配置等一系列完善配置。

Ribbon 也半死不活，不更新了只维护，但还是要了解下。

<br/>

## 负载均衡差异

公司目前项目负载均衡仍然使用的是 nginx。两者的差别是：

- Nginx 是服务器负载均衡，所有请求都由 Nginx 转发实现。

![image-20211023010004866](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211023010004866.png)

- Ribbon 是本地负载均衡，在调用服务的时候会从注册中心下载注册服务列表到JVM（消费者方的），从本地调用 RPC 实现。

![image-20211023005809138](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211023005809138.png)

<br/>



## Ribbon 使用

一句话概括 Ribbon 其实就是： **负载均衡 + RestTemplate** ，它同时实现了负载均衡算法实现 和 服务调用。

客户端 POM 引入依赖：

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-ribbon</artifactId>
    <version>2.2.6.RELEASE</version>
</dependency>
```

Application 加上服务发现的注解：

```java
@EnableDiscoveryClient
```

加入 restTemplate 配置：

```java
@Configuration
public class ApplicationContextConfig {
    // 让这个RestTemplate在请求时拥有客户端负载均衡的能力
    @LoadBalanced
    @Bean
    public RestTemplate getRestTemplate() {
        return new RestTemplate();
    }
}
```

调用方式：

```java
@Resource
private RestTemplate restTemplate;

 /**
   * 从订单服务调用支付服务数据
   */
@ResponseBody
@GetMapping(value = "getPaymentFromOrderServer")
public Result<Object> getPaymentFromOrderServer(Long id) {
    String uri = "http://payment-service" + "/payment/getById?id=" + id;
    //调用支付服务
    ResponseEntity<Result> responseEntity = restTemplate.getForEntity(uri, Result.class);

    return Result.builder().code(CodeEnum.SUCCESS.code).message("查询成功").data(responseEntity).build();
}
```

服务注册情况：

![image-20211023100543467](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211023100543467.png)



调用结果，轮询调用两个服务：

![image-20211023100713551](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211023100713551.png)

![image-20211023100732140](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211023100732140.png)





<br/>

## 负载均衡算法

需要自定义负载均衡算法、或者 Ribbon 其他配置，可以通过外部的属性`.ribbon.*`来配置一些Ribbon Client。

Spring Cloud Netflix为ribbon提供了如下的Beans(BeanType beanName: ClassName):

- IClientConfig ribbonClientConfig: DefaultClientConfigImpl
- IRule ribbonRule: ZoneAvoidanceRule
- IPing ribbonPing: NoOpPing
- ServerList ribbonServerList: ConfigurationBasedServerList
- ServerListFilter ribbonServerListFilter: ZonePreferenceServerListFilter
- ILoadBalancer ribbonLoadBalancer: ZoneAwareLoadBalancer

> 警告：配置 不能被 @ComponentScan 在 main application context。
>
> 这样的话，它将被所有 @RibbonClients 共享。如果你使用 @ComponentScan (or @SpringBootApplication) ，你需要避免它被包括其中。(例如：放它到一个独立的，无重叠的包里，或者指明不被@ComponentScan扫描)。

**简单来说，就是别放在 Application 所在的包下面。**

----

Ribbon 的算法策略有以下几种，不过 Ribbon已经不更新了，而且 OpenFegin 也默认实现了，到时候再说。这里就不测试了。

![image-20211023120833720](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211023120833720.png)



<br/>

## 参考文章

[尚硅谷SpringCloud框架开发教程(SpringCloudAlibaba微服务分布式架构丨Spring Cloud)_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV18E411x7eT?p=36)

[Spring Cloud ribbon - Spring Cloud中国社区](http://docs.springcloud.cn/user-guide/ribbon/)

[Ribbon详解 - 简书 (jianshu.com)](https://www.jianshu.com/p/1bd66db5dc46)
