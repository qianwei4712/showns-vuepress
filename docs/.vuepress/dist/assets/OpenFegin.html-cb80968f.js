import{_ as p,b as o,o as c,c as i,a as n,d as s,e as t,f as e}from"./app-36b09dbd.js";const l={},u=e('<div class="catalog"><ul><li><a href="#t1">前言</a></li><li><a href="#t2">OpenFegin 使用</a></li><li><a href="#t3">自定义 FeignClient</a></li><li><a href="#t4">OkHttpClient</a></li><li><a href="#te">参考文章</a></li></ul></div><h2 id="前言" tabindex="-1"><a class="header-anchor" href="#前言" aria-hidden="true">#</a> <span id="t1">前言</span></h2><p><em>2021.10.25，spring cloud 以前只零碎用过几个组件，这次系统学一遍</em></p><p>环境：<code>SpringBoot 2.4.2</code> 、<code>SpringCloud 2020.0.1</code> 、<code>SpringCloud Alibaba 2021.1</code>、<code>JDK 8</code>、<code>MYSQL 5.7</code></p><p>这个系列只讲实现，基本不会深入原理。</p><hr>',6),k=n("strong",null,"代码仓库 openFegin-demo 分支",-1),r={href:"https://gitee.com/learning-use-cases/spring-cloud-demo/tree/openFegin-demo/",target:"_blank",rel:"noopener noreferrer"},d={href:"https://spring.io/projects/spring-cloud-openfeign#overview",target:"_blank",rel:"noopener noreferrer"},v=e(`<p>本文介绍 spring cloud 远程服务调用组件 OpenFegin。</p><blockquote><p>Fegin 是一个声明式 Web 服务客户端，只需要创建一个接口并加上注解，即可通过注册中心被调用。</p></blockquote><p>看几个层次关系。</p><ol><li>Fegin 内置了 Ribbon ，实现了客户端负载均衡，调用注册中心获取服务列表。</li><li>Fegin 自己实现了声明式注解定义接口，通过这个接口就可以调用注册中心服务。</li><li>OpenFegin 在 Fegin 的基础上，实现了 Spring MVC 的支持，通过动态代理产生实现类。</li></ol><br><h2 id="openfegin-使用" tabindex="-1"><a class="header-anchor" href="#openfegin-使用" aria-hidden="true">#</a> <span id="t2">OpenFegin 使用</span></h2><p>添加依赖：</p><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>org.springframework.cloud<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>spring-cloud-starter-openfeign<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Application 添加注解：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@EnableFeignClients</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>对应服务控制器，客户端编写 Fegin 接口：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@FeignClient</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">&quot;PAYMENT-SERVICE&quot;</span><span class="token punctuation">)</span>
<span class="token annotation punctuation">@Component</span>
<span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">PaymentServiceFegin</span> <span class="token punctuation">{</span>
    <span class="token annotation punctuation">@GetMapping</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">&quot;/payment/getById&quot;</span><span class="token punctuation">)</span>
    <span class="token class-name">Result</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">PaymentDTO</span><span class="token punctuation">&gt;</span></span> <span class="token function">getById</span><span class="token punctuation">(</span><span class="token annotation punctuation">@RequestParam</span><span class="token punctuation">(</span><span class="token string">&quot;id&quot;</span><span class="token punctuation">)</span> <span class="token class-name">Long</span> id<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对应远程服务端控制器：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@RestController</span>
<span class="token annotation punctuation">@RequestMapping</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">&quot;/payment&quot;</span><span class="token punctuation">)</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">PaymentController</span> <span class="token punctuation">{</span>

    <span class="token annotation punctuation">@Autowired</span>
    <span class="token keyword">private</span> <span class="token class-name">PaymentMapper</span> paymentMapper<span class="token punctuation">;</span>

    <span class="token annotation punctuation">@Value</span><span class="token punctuation">(</span><span class="token string">&quot;\${server.port}&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> port<span class="token punctuation">;</span>

    <span class="token annotation punctuation">@ResponseBody</span>
    <span class="token annotation punctuation">@GetMapping</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">&quot;getById&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">public</span> <span class="token class-name">Result</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Payment</span><span class="token punctuation">&gt;</span></span> <span class="token function">getById</span><span class="token punctuation">(</span><span class="token class-name">Long</span> id<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">Payment</span> payment <span class="token operator">=</span> paymentMapper<span class="token punctuation">.</span><span class="token function">selectById</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>payment <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> <span class="token class-name">Result</span><span class="token punctuation">.</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Payment</span><span class="token punctuation">&gt;</span></span><span class="token function">builder</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">code</span><span class="token punctuation">(</span><span class="token class-name">CodeEnum</span><span class="token punctuation">.</span><span class="token constant">SUCCESS</span><span class="token punctuation">.</span>code<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">message</span><span class="token punctuation">(</span><span class="token string">&quot;查询成功，服务端口：&quot;</span> <span class="token operator">+</span> port<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">data</span><span class="token punctuation">(</span>payment<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> <span class="token class-name">Result</span><span class="token punctuation">.</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Payment</span><span class="token punctuation">&gt;</span></span><span class="token function">builder</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">code</span><span class="token punctuation">(</span><span class="token class-name">CodeEnum</span><span class="token punctuation">.</span><span class="token constant">UNSATISFIED</span><span class="token punctuation">.</span>code<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">message</span><span class="token punctuation">(</span><span class="token string">&quot;未查询到指定记录&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>开放接口：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Autowired</span>
<span class="token keyword">private</span> <span class="token class-name">PaymentServiceFegin</span> paymentServiceFegin<span class="token punctuation">;</span>

<span class="token annotation punctuation">@ResponseBody</span>
<span class="token annotation punctuation">@GetMapping</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">&quot;getFromOpenFegin&quot;</span><span class="token punctuation">)</span>
<span class="token keyword">public</span> <span class="token class-name">Result</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">PaymentDTO</span><span class="token punctuation">&gt;</span></span> <span class="token function">getFromOpenFegin</span><span class="token punctuation">(</span><span class="token class-name">Long</span> id<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> paymentServiceFegin<span class="token punctuation">.</span><span class="token function">getById</span><span class="token punctuation">(</span>id<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>调用结果：</p><p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211023215411654.png" alt="image-20211023215411654"></p><p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211023215439456.png" alt="image-20211023215439456"></p><p>可见，默认依然是轮询策略。</p><br><h2 id="自定义-feignclient" tabindex="-1"><a class="header-anchor" href="#自定义-feignclient" aria-hidden="true">#</a> <span id="t3">自定义 FeignClient</span></h2><p><code>@FeignClient</code> 注解的 configuration 参数，默认是通过 <code>FeignClientsConfiguration</code> 类定义的，可以配置 Client，Contract，Encoder/Decoder 等。</p><p><code>FeignClientsConfiguration</code> 类中的配置方法及默认值如下：</p><ul><li><strong>feignContract</strong>: SpringMvcContract</li><li><strong>feignDecoder</strong>: ResponseEntityDecoder</li><li><strong>feignEncoder</strong>: SpringEncoder</li><li><strong>feignLogger</strong>: Slf4jLogger</li><li><strong>feignBuilder</strong>: Feign.Builder</li><li><strong>feignClient</strong>: LoadBalancerFeignClient（开启Ribbon时）或默认的HttpURLConnection</li></ul><p>在 <code>ComponentScan</code> 外进行配置：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Configuration</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">MyConfiguration</span> <span class="token punctuation">{</span>
	<span class="token annotation punctuation">@Bean</span>
	<span class="token keyword">public</span> <span class="token class-name">Contract</span> <span class="token function">feignContract</span><span class="token punctuation">(</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">}</span>
 
	<span class="token annotation punctuation">@Bean</span>
	<span class="token keyword">public</span> <span class="token class-name">Encoder</span> <span class="token function">feignEncoder</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">}</span>
 
	<span class="token annotation punctuation">@Bean</span>
	<span class="token keyword">public</span> <span class="token class-name">Decoder</span> <span class="token function">feignDecoder</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">}</span>
 
	<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后在<code>@FeignClient</code> 注解时使用：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@FeignClient</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">&quot;PAYMENT-SERVICE&quot;</span><span class="token punctuation">,</span> configuration <span class="token operator">=</span> <span class="token class-name">MyConfiguration</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span>
<span class="token annotation punctuation">@Component</span>
<span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">PaymentServiceFegin</span> <span class="token punctuation">{</span>
    <span class="token annotation punctuation">@GetMapping</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">&quot;/payment/getById&quot;</span><span class="token punctuation">)</span>
    <span class="token class-name">Result</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">PaymentDTO</span><span class="token punctuation">&gt;</span></span> <span class="token function">getById</span><span class="token punctuation">(</span><span class="token annotation punctuation">@RequestParam</span><span class="token punctuation">(</span><span class="token string">&quot;id&quot;</span><span class="token punctuation">)</span> <span class="token class-name">Long</span> id<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>也可以使用 yml 进行配置：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">feign</span><span class="token punctuation">:</span>
  <span class="token key atrule">client</span><span class="token punctuation">:</span>
	<span class="token key atrule">config</span><span class="token punctuation">:</span>
	  <span class="token key atrule">feignName</span><span class="token punctuation">:</span> PAYMENT<span class="token punctuation">-</span>SERVICE
		<span class="token key atrule">connectTimeout</span><span class="token punctuation">:</span> <span class="token number">5000</span>
		<span class="token key atrule">readTimeout</span><span class="token punctuation">:</span> <span class="token number">5000</span>
		<span class="token key atrule">loggerLevel</span><span class="token punctuation">:</span> full
		<span class="token key atrule">encoder</span><span class="token punctuation">:</span> com.example.MyEncoder
		<span class="token key atrule">decoder</span><span class="token punctuation">:</span> com.example.MyDecoder
		<span class="token key atrule">contract</span><span class="token punctuation">:</span> com.example.MyContract
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><br><h2 id="okhttpclient" tabindex="-1"><a class="header-anchor" href="#okhttpclient" aria-hidden="true">#</a> <span id="t4">OkHttpClient</span></h2><p>Feign 最终发送 Request 请求以及接收 Response 响应都是由 Client 组件来完成的。</p><p>首先说明一点，默认的 HttpURLConnection 存在一些问题，一般推荐使用 <code>OkHttpClient</code> 或者自己封装。</p><p>例如，默认的 Client 如下：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">Default</span> <span class="token keyword">implements</span> <span class="token class-name">Client</span> <span class="token punctuation">{</span>
        <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">SSLSocketFactory</span> sslContextFactory<span class="token punctuation">;</span>
        <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">HostnameVerifier</span> hostnameVerifier<span class="token punctuation">;</span>
 
        <span class="token keyword">public</span> <span class="token class-name">Default</span><span class="token punctuation">(</span><span class="token class-name">SSLSocketFactory</span> sslContextFactory<span class="token punctuation">,</span> <span class="token class-name">HostnameVerifier</span> hostnameVerifier<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>sslContextFactory <span class="token operator">=</span> sslContextFactory<span class="token punctuation">;</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>hostnameVerifier <span class="token operator">=</span> hostnameVerifier<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
 
        <span class="token keyword">public</span> <span class="token class-name">Response</span> <span class="token function">execute</span><span class="token punctuation">(</span><span class="token class-name">Request</span> request<span class="token punctuation">,</span> <span class="token class-name">Options</span> options<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">IOException</span> <span class="token punctuation">{</span>
            <span class="token class-name">HttpURLConnection</span> connection <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">convertAndSend</span><span class="token punctuation">(</span>request<span class="token punctuation">,</span> options<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">convertResponse</span><span class="token punctuation">(</span>connection<span class="token punctuation">,</span> request<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        
        <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token comment">//代码省略</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>这种情况下，由于缺乏连接池的支持，在达到一定流量的后服务肯定会出问题 。</strong></p><p>加入依赖：</p><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">&gt;</span></span>io.github.openfeign<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">&gt;</span></span>feign-okhttp<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>version</span><span class="token punctuation">&gt;</span></span>10.2.0<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>version</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>添加配置：</p><div class="language-yaml line-numbers-mode" data-ext="yml"><pre class="language-yaml"><code><span class="token key atrule">feign</span><span class="token punctuation">:</span>
  <span class="token key atrule">okhttp</span><span class="token punctuation">:</span>
    <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>超时配置：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Configuration</span>
<span class="token annotation punctuation">@ConditionalOnClass</span><span class="token punctuation">(</span><span class="token class-name">Feign</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span>
<span class="token annotation punctuation">@AutoConfigureBefore</span><span class="token punctuation">(</span><span class="token class-name">FeignAutoConfiguration</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">OkHttpConfig</span> <span class="token punctuation">{</span>
    <span class="token annotation punctuation">@Bean</span>
    <span class="token keyword">public</span> <span class="token class-name"><span class="token namespace">okhttp3<span class="token punctuation">.</span></span>OkHttpClient</span> <span class="token function">okHttpClient</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name"><span class="token namespace">okhttp3<span class="token punctuation">.</span></span>OkHttpClient<span class="token punctuation">.</span>Builder</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token comment">//设置连接超时</span>
                <span class="token punctuation">.</span><span class="token function">connectTimeout</span><span class="token punctuation">(</span><span class="token number">60</span><span class="token punctuation">,</span> <span class="token class-name">TimeUnit</span><span class="token punctuation">.</span><span class="token constant">SECONDS</span><span class="token punctuation">)</span>
                <span class="token comment">//设置读超时</span>
                <span class="token punctuation">.</span><span class="token function">readTimeout</span><span class="token punctuation">(</span><span class="token number">60</span><span class="token punctuation">,</span> <span class="token class-name">TimeUnit</span><span class="token punctuation">.</span><span class="token constant">SECONDS</span><span class="token punctuation">)</span>
                <span class="token comment">//设置写超时</span>
                <span class="token punctuation">.</span><span class="token function">writeTimeout</span><span class="token punctuation">(</span><span class="token number">60</span><span class="token punctuation">,</span> <span class="token class-name">TimeUnit</span><span class="token punctuation">.</span><span class="token constant">SECONDS</span><span class="token punctuation">)</span>
                <span class="token comment">//是否自动重连</span>
                <span class="token punctuation">.</span><span class="token function">retryOnConnectionFailure</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">connectionPool</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">ConnectionPool</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
                <span class="token comment">//构建OkHttpClient对象</span>
                <span class="token punctuation">.</span><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p><strong>可见 OkHttp 配置是全局生效的，这里需要注意下。</strong></p></blockquote><br><h2 id="参考文章" tabindex="-1"><a class="header-anchor" href="#参考文章" aria-hidden="true">#</a> <span id="te">参考文章</span></h2>`,47),m={href:"https://www.bilibili.com/video/BV18E411x7eT?p=36",target:"_blank",rel:"noopener noreferrer"},g={href:"https://blog.csdn.net/taiyangdao/article/details/81359394",target:"_blank",rel:"noopener noreferrer"},b={href:"https://blog.csdn.net/u010277958/article/details/88730889",target:"_blank",rel:"noopener noreferrer"},y={href:"https://www.cnblogs.com/zk-blog/p/12465951.html",target:"_blank",rel:"noopener noreferrer"},f={href:"https://segmentfault.com/a/1190000039889836?utm_source=sf-hot-article",target:"_blank",rel:"noopener noreferrer"};function h(C,w){const a=o("ExternalLinkIcon");return c(),i("div",null,[u,n("p",null,[k,s(" ："),n("a",r,[s("Learning Use Cases/Spring Cloud Demo - Gitee.com"),t(a)])]),n("p",null,[s("官方文档："),n("a",d,[s("Spring Cloud OpenFeign"),t(a)])]),v,n("p",null,[n("a",m,[s("尚硅谷SpringCloud框架开发教程(SpringCloudAlibaba微服务分布式架构丨Spring Cloud)_哔哩哔哩_bilibili"),t(a)])]),n("p",null,[n("a",g,[s("Spring Cloud OpenFeign详解_成长的足迹-CSDN博客_openfeign"),t(a)])]),n("p",null,[n("a",b,[s("Feign-使用HttpClient和OkHttp_u010277958的博客-CSDN博客_feign okhttp"),t(a)])]),n("p",null,[n("a",y,[s("使用HttpClient和OkHttp调用服务的区别（附示例代码） - 骑着蜗牛看海呀 - 博客园 (cnblogs.com)"),t(a)])]),n("p",null,[n("a",f,[s("Spring Cloud OpenFeign入门和实战 - SegmentFault 思否"),t(a)])])])}const _=p(l,[["render",h],["__file","OpenFegin.html.vue"]]);export{_ as default};
