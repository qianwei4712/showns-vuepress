<template><div><div class="catalog">
<ul>
<li><a href="#t0">前言</a></li>
<li><a href="#t1">核心概念</a>
<ul>
<li><a href="#t11">Route 路由</a></li>
<li><a href="#t12">Predicate 断言</a></li>
<li><a href="#t13">Filter 过滤器</a></li>
</ul>
</li>
<li><a href="#t2">Gateway 入门使用</a></li>
<li><a href="#t3">动态路由</a></li>
<li><a href="#t4">断言详解</a></li>
<li><a href="#t5">Filter</a></li>
<li><a href="#te">参考文章</a></li>
</ul>
</div>
<h2 id="前言" tabindex="-1"><a class="header-anchor" href="#前言" aria-hidden="true">#</a> <span id="t0">前言</span></h2>
<p><em>2021.11.14，spring cloud 以前只零碎用过几个组件，这次系统学一遍</em></p>
<p>环境：<code v-pre>SpringBoot 2.4.2</code> 、<code v-pre>SpringCloud 2020.0.1</code> 、<code v-pre>SpringCloud Alibaba 2021.1</code>、<code v-pre>JDK 8</code>、<code v-pre>MYSQL 5.7</code></p>
<p>这个系列只讲实现，基本不会深入原理。</p>
<hr>
<p><strong>代码仓库 gateway-demo 分支</strong> ：<a href="https://gitee.com/learning-use-cases/spring-cloud-demo/tree/gateway-demo/" target="_blank" rel="noopener noreferrer">Learning Use Cases/Spring Cloud Demo - Gitee.com<ExternalLinkIcon/></a></p>
<p>官方文档：<a href="https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/#gateway-request-predicates-factories" target="_blank" rel="noopener noreferrer">Spring Cloud Gateway<ExternalLinkIcon/></a></p>
<p>本文介绍 spring cloud 统一 API 网关框架 gateway。它旨在为微服务架构提供一种简单有效的统一的 API 路由管理方式。</p>
<p><strong>Spring Cloud Gateway 底层使用了高性能的通信框架Netty</strong>。</p>
<blockquote>
<p>Spring Cloud Gateway 提供统一的路由方式，且基于 Filter 链的方式，提供了网官基本的功能，例如：安全、监控、指标、限流。</p>
</blockquote>
<p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211114133115818.png" alt="image-20211114133115818"></p>
<br/>
<h2 id="核心概念" tabindex="-1"><a class="header-anchor" href="#核心概念" aria-hidden="true">#</a> <span id="t1">核心概念</span></h2>
<p>Spring Cloud Gateway 有三大核心概念，路由、断言、过滤。</p>
<p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/watermarkuZ3poZW5naGVpdG.png" alt="watermarkuZ3poZW5naGVpdG"></p>
<h3 id="route-路由" tabindex="-1"><a class="header-anchor" href="#route-路由" aria-hidden="true">#</a> <span id="t11">Route 路由</span></h3>
<p>路由是网关的基本构建块。它由一个 ID，一个目标 URI，一组断言和一组过滤器定义。如果断言为真，则路由匹配。</p>
<br/>
<h3 id="predicate-断言" tabindex="-1"><a class="header-anchor" href="#predicate-断言" aria-hidden="true">#</a> <span id="t12">Predicate 断言</span></h3>
<p>这是一个 Java 8 的 Predicate。</p>
<p>输入类型是一个 ServerWebExchange。我们可以使用它来匹配来自 HTTP 请求的任何内容，例如 headers 或参数。</p>
<p>通俗点讲，就是路由的判断条件。</p>
<br/>
<h3 id="filter-过滤器" tabindex="-1"><a class="header-anchor" href="#filter-过滤器" aria-hidden="true">#</a> <span id="t13">Filter 过滤器</span></h3>
<p>请求到达网关后，先在 <code v-pre>Gateway Handler Mapping</code> 中找到与请求相匹配的路由，将请求发送到  <code v-pre>Gateway Web Mapping</code> 。</p>
<blockquote>
<p><strong>这里的 Filter 过滤器与 java 中的拦截器类似，分为了 请求处理之前 和 处理之后 两个方法。</strong></p>
</blockquote>
<ul>
<li><strong>处理前</strong> 过滤方法可以用来：登录校验、权限校验、流量监控、请求日志输出、协议转换等</li>
<li><strong>处理后</strong> 过滤方法可以完成：处理日志输出、数据额外包装。</li>
</ul>
<p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/006tKfTcly1fr2q2m5jq7j30cb0gjmxm.jpg" alt=""></p>
<br/>
<h2 id="gateway-入门使用" tabindex="-1"><a class="header-anchor" href="#gateway-入门使用" aria-hidden="true">#</a> <span id="t2">Gateway 入门使用</span></h2>
<p>pom 依赖：</p>
<div class="language-xml line-numbers-mode" data-ext="xml"><pre v-pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>org.springframework.cloud<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>spring-cloud-starter-gateway<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">></span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>启动类需要注册到注册中心：</p>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token annotation punctuation">@EnableEurekaClient</span>
<span class="token annotation punctuation">@SpringBootApplication</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">GatewayApplication</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">SpringApplication</span><span class="token punctuation">.</span><span class="token function">run</span><span class="token punctuation">(</span><span class="token class-name">GatewayApplication</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">,</span> args<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>application.yml 简单路由演示：</p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">server</span><span class="token punctuation">:</span>
  <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">36500</span>
  
<span class="token key atrule">spring</span><span class="token punctuation">:</span>
  <span class="token key atrule">application</span><span class="token punctuation">:</span>
    <span class="token key atrule">name</span><span class="token punctuation">:</span> gateway<span class="token punctuation">-</span>service
  <span class="token key atrule">cloud</span><span class="token punctuation">:</span>
    <span class="token key atrule">gateway</span><span class="token punctuation">:</span>
      <span class="token key atrule">discovery</span><span class="token punctuation">:</span>
        <span class="token key atrule">locator</span><span class="token punctuation">:</span>
          <span class="token comment"># 开启从注册中心动态创建路由的功能，利用微服务名进行路由</span>
          <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span>
      <span class="token key atrule">routes</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">id</span><span class="token punctuation">:</span> consumer<span class="token punctuation">-</span>order<span class="token punctuation">-</span>routh    <span class="token comment">#路由的ID，没有固定规则但要求唯一，建议配合服务名</span>
          <span class="token key atrule">uri</span><span class="token punctuation">:</span> http<span class="token punctuation">:</span>//localhost<span class="token punctuation">:</span><span class="token number">56400</span>  <span class="token comment">#匹配后提供服务的路由地址</span>
          <span class="token key atrule">predicates</span><span class="token punctuation">:</span>
            <span class="token punctuation">-</span> Path=/order/payByOrderId         <span class="token comment"># 断言，路径相匹配的进行路由</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用网关服务 36500 端口，调用客户服务 56400 的方法：</p>
<p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211122195032766.png" alt="image-20211122195032766"></p>
<p>还有一种 java 代码配置的路由，但是有点复杂，还是配置来得容易，看看就行</p>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token annotation punctuation">@Configuration</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">GatewayRoute</span> <span class="token punctuation">{</span>
    <span class="token annotation punctuation">@Bean</span>
    <span class="token keyword">public</span> <span class="token class-name">RouteLocator</span> <span class="token function">shivaShowRouteLocator</span><span class="token punctuation">(</span><span class="token class-name">RouteLocatorBuilder</span> routeLocatorBuilder<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">RouteLocatorBuilder<span class="token punctuation">.</span>Builder</span> routes <span class="token operator">=</span> routeLocatorBuilder<span class="token punctuation">.</span><span class="token function">routes</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        routes<span class="token punctuation">.</span><span class="token function">route</span><span class="token punctuation">(</span><span class="token string">"mt_route"</span><span class="token punctuation">,</span> r <span class="token operator">-></span> r<span class="token punctuation">.</span><span class="token function">path</span><span class="token punctuation">(</span><span class="token string">"/archives"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">uri</span><span class="token punctuation">(</span><span class="token string">"https://tech.meituan.com"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> routes<span class="token punctuation">.</span><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211122195314926.png" alt="image-20211122195314926"></p>
<br/>
<h2 id="动态路由" tabindex="-1"><a class="header-anchor" href="#动态路由" aria-hidden="true">#</a> <span id="t3">动态路由</span></h2>
<blockquote>
<p>将IP端口换为注册中心的服务名，就可以不关心地址，并且可以自动进行负载均衡</p>
</blockquote>
<p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211122215348951.png" alt="image-20211122215348951"></p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code>      <span class="token key atrule">routes</span><span class="token punctuation">:</span>
        <span class="token punctuation">-</span> <span class="token key atrule">id</span><span class="token punctuation">:</span> consumer<span class="token punctuation">-</span>order<span class="token punctuation">-</span>routh    <span class="token comment">#路由的ID，没有固定规则但要求唯一，建议配合服务名</span>
          <span class="token key atrule">uri</span><span class="token punctuation">:</span> lb<span class="token punctuation">:</span>//CONSUMER<span class="token punctuation">-</span>ORDER <span class="token comment">#匹配后提供服务的路由地址</span>
          <span class="token key atrule">predicates</span><span class="token punctuation">:</span>
            <span class="token punctuation">-</span> Path=/order/payByOrderId         <span class="token comment"># 断言，路径相匹配的进行路由</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><br/>
<h2 id="断言详解" tabindex="-1"><a class="header-anchor" href="#断言详解" aria-hidden="true">#</a> <span id="t4">断言详解</span></h2>
<p>利用 Predicate 的特性实现了各种路由匹配规则，有通过 Header、请求参数等不同的条件来进行作为条件匹配到对应的路由。</p>
<p>如果匹配不成功，会报 404 .</p>
<p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/spring-cloud-gateway3.png" alt="spring-cloud-gateway3"></p>
<h3 id="通过时间匹配" tabindex="-1"><a class="header-anchor" href="#通过时间匹配" aria-hidden="true">#</a> 通过时间匹配</h3>
<p>Predicate 支持设置一个时间，在请求进行转发的时候，可以通过判断在这个时间之前或者之后进行转发。</p>
<table>
<thead>
<tr>
<th>断言参数</th>
<th>作用</th>
<th>示例</th>
</tr>
</thead>
<tbody>
<tr>
<td>After</td>
<td>指定时间后</td>
<td>- After=2019-01-01T00:00:00+08:00[Asia/Shanghai]</td>
</tr>
<tr>
<td>Before</td>
<td>指定时间前</td>
<td>- Before=2019-01-01T00:00:00+08:00[Asia/Shanghai]</td>
</tr>
<tr>
<td>Betwee</td>
<td>指定时间区间</td>
<td>- Between=2019-01-01T00:00:00+08:00[Asia/Shanghai], 2019-07-01T00:00:00+08:00[Asia/Shanghai]</td>
</tr>
</tbody>
</table>
<p>但是这个时间是 Spring 是通过 ZonedDateTime 的时间，和我们正常格式不太一样。</p>
<p>需要用到了 main 跑一下就行。</p>
<br/>
<h3 id="通过-cookie-匹配" tabindex="-1"><a class="header-anchor" href="#通过-cookie-匹配" aria-hidden="true">#</a> 通过 Cookie 匹配</h3>
<p><strong>Cookie Route Predicate 可以接收两个参数，一个是 Cookie name ,一个是正则表达式。</strong></p>
<p>路由规则会通过获取对应的 Cookie name 值和正则表达式去匹配，如果匹配上就会执行路由，如果没有匹配上则不执行。</p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">routes</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">id</span><span class="token punctuation">:</span> gateway<span class="token punctuation">-</span>service
  <span class="token key atrule">uri</span><span class="token punctuation">:</span> https<span class="token punctuation">:</span>//www.baidu.com
  <span class="token key atrule">predicates</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> Cookie=sessionId<span class="token punctuation">,</span> <span class="token number">123456</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个路由表示，存在 <code v-pre>sessionId=123456</code> 的 <code v-pre>cookie</code> 才匹配成功。</p>
<br/>
<h3 id="通过-header-属性匹配" tabindex="-1"><a class="header-anchor" href="#通过-header-属性匹配" aria-hidden="true">#</a> 通过 Header 属性匹配</h3>
<p>Header Route Predicate 和 Cookie Route Predicate 一样，也是接收 2 个参数，一个 header 中属性名称和一个正则表达式，这个属性值和正则表达式匹配则执行。</p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">routes</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">id</span><span class="token punctuation">:</span> gateway<span class="token punctuation">-</span>service
  <span class="token key atrule">uri</span><span class="token punctuation">:</span> https<span class="token punctuation">:</span>//www.baidu.com
  <span class="token key atrule">predicates</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> Header=X<span class="token punctuation">-</span>Request<span class="token punctuation">-</span>Id<span class="token punctuation">,</span> \d+
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><br/>
<h3 id="通过-host-匹配" tabindex="-1"><a class="header-anchor" href="#通过-host-匹配" aria-hidden="true">#</a> 通过 Host 匹配</h3>
<p>Host Route Predicate 接收一组参数，一组匹配的域名列表，这个模板是一个 ant 分隔的模板，用.号作为分隔符。它通过参数中的主机地址作为匹配规则。</p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">routes</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">id</span><span class="token punctuation">:</span> gateway<span class="token punctuation">-</span>service
  <span class="token key atrule">uri</span><span class="token punctuation">:</span> https<span class="token punctuation">:</span>//www.baidu.com
  <span class="token key atrule">predicates</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> Host=<span class="token important">**.baidu.com</span><span class="token punctuation">,</span><span class="token important">**.shiva.show</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><br/>
<h3 id="通过请求方式匹配" tabindex="-1"><a class="header-anchor" href="#通过请求方式匹配" aria-hidden="true">#</a> 通过请求方式匹配</h3>
<p>可以通过是 POST、GET、PUT、DELETE 等不同的请求方式来进行路由。</p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">routes</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">id</span><span class="token punctuation">:</span> gateway<span class="token punctuation">-</span>service
  <span class="token key atrule">uri</span><span class="token punctuation">:</span> https<span class="token punctuation">:</span>//www.baidu.com
  <span class="token key atrule">predicates</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> Method=GET
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><br/>
<h3 id="通过请求路径匹配" tabindex="-1"><a class="header-anchor" href="#通过请求路径匹配" aria-hidden="true">#</a> 通过请求路径匹配</h3>
<p>Path Route Predicate 接收一个匹配路径的参数来判断是否走路由。</p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">routes</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">id</span><span class="token punctuation">:</span> gateway<span class="token punctuation">-</span>service
  <span class="token key atrule">uri</span><span class="token punctuation">:</span> https<span class="token punctuation">:</span>//www.baidu.com
  <span class="token key atrule">predicates</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> Path=/payment/<span class="token punctuation">{</span>segment<span class="token punctuation">}</span><span class="token punctuation">,</span>/customer/<span class="token punctuation">{</span>segment<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个不需要解释</p>
<br/>
<h3 id="通过请求参数匹配" tabindex="-1"><a class="header-anchor" href="#通过请求参数匹配" aria-hidden="true">#</a> 通过请求参数匹配</h3>
<p><strong>Query Route Predicate 支持传入两个参数，一个是属性名一个为属性值，属性值可以是正则表达式。</strong></p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">routes</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">id</span><span class="token punctuation">:</span> gateway<span class="token punctuation">-</span>service
  <span class="token key atrule">uri</span><span class="token punctuation">:</span> https<span class="token punctuation">:</span>//www.baidu.com
  <span class="token key atrule">predicates</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> Query=smile
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>只传入参数名，只要请求中包含 smile 属性的参数即可匹配路由。</p>
<br/>
<h3 id="通过请求-ip-匹配" tabindex="-1"><a class="header-anchor" href="#通过请求-ip-匹配" aria-hidden="true">#</a> 通过请求 ip 匹配</h3>
<p>Predicate 也支持通过设置某个 ip 区间号段的请求才会路由，RemoteAddr Route Predicate 接受 cidr 符号(IPv4 或 IPv6 )字符串的列表(最小大小为1)，例如 192.168.0.1/16 (其中 192.168.0.1 是 IP 地址，16 是子网掩码)。</p>
<div class="language-yaml line-numbers-mode" data-ext="yml"><pre v-pre class="language-yaml"><code><span class="token key atrule">routes</span><span class="token punctuation">:</span>
  <span class="token punctuation">-</span> <span class="token key atrule">id</span><span class="token punctuation">:</span> gateway<span class="token punctuation">-</span>service
  <span class="token key atrule">uri</span><span class="token punctuation">:</span> https<span class="token punctuation">:</span>//www.baidu.com
  <span class="token key atrule">predicates</span><span class="token punctuation">:</span>
    <span class="token punctuation">-</span> RemoteAddr=192.168.1.1/24
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><br/>
<h2 id="filter" tabindex="-1"><a class="header-anchor" href="#filter" aria-hidden="true">#</a> <span id="t5">Filter</span></h2>
<p>Spring Cloud Gateway的过滤器分为 <code v-pre>pre</code> 和 <code v-pre>post</code> 两种方式。</p>
<ul>
<li>pre：客户端的请求先经过“pre”类型的filter，然后将请求转发到具体的业务服务</li>
<li>post：收到业务服务的响应之后，再经过“post”类型的filter处理，最后返回响应到客户端</li>
</ul>
<p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/QQLUQKXENLTWQP5EMD.jpg" alt="QQLUQKXENLTWQP5EMD"></p>
<p>然后按类型，还分为 <strong>GatewayFilter</strong> 和  <strong>GatewayFilter</strong>，这些都是内置的过滤器。</p>
<ul>
<li>GatewayFilter : 需要通过 <code v-pre>spring.cloud.routes.filters</code> 配置在具体路由下，只作用在当前路由上或通过 <code v-pre>spring.cloud.default-filters</code> 配置在全局，作用在指定的路由上。</li>
<li>GlobalFilter : 全局过滤器，不需要在配置文件中配置，作用在所有的路由上，最终通过 <code v-pre>GatewayFilterAdapter</code> 包装成 <code v-pre>GatewayFilterChain</code> 可识别的过滤器，它为请求业务以及路由的URI转换为真实业务服务的请求地址的核心过滤器，不需要配置，系统初始化时加载，并作用在每个路由上。</li>
</ul>
<p>然后把对应文档放上，需要用到了查一下，功能都比较简陋：</p>
<ul>
<li><a href="https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/#gatewayfilter-factories" target="_blank" rel="noopener noreferrer">Spring Cloud Gateway - gateway filter<ExternalLinkIcon/></a></li>
<li><a href="https://docs.spring.io/spring-cloud-gateway/docs/current/reference/html/#global-filters" target="_blank" rel="noopener noreferrer">Spring Cloud Gateway - global filters<ExternalLinkIcon/></a></li>
</ul>
<p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/watermarktype_ZmFuZ3poZW5naGVp.png" alt=""></p>
<p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9mb3JlenAuYmxvZy5jc2RuLm5ldA==,size_16,color_FFFFFF,t_70.png" alt=""></p>
<h3 id="自定义过滤器" tabindex="-1"><a class="header-anchor" href="#自定义过滤器" aria-hidden="true">#</a> 自定义过滤器</h3>
<p>自定义过滤器可以帮我们实现：全局日志、统一鉴权，只要就这两。</p>
<p>自定义过滤器 示范：</p>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token annotation punctuation">@Slf4j</span>
<span class="token annotation punctuation">@Component</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">GatewayFilter</span> <span class="token keyword">implements</span> <span class="token class-name">GlobalFilter</span><span class="token punctuation">,</span> <span class="token class-name">Ordered</span> <span class="token punctuation">{</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token class-name">Mono</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Void</span><span class="token punctuation">></span></span> <span class="token function">filter</span><span class="token punctuation">(</span><span class="token class-name">ServerWebExchange</span> exchange<span class="token punctuation">,</span> <span class="token class-name">GatewayFilterChain</span> chain<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 获取token</span>
        <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">></span></span> authorization <span class="token operator">=</span> exchange<span class="token punctuation">.</span><span class="token function">getRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getHeaders</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">"Authorization"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>authorization <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">||</span> authorization<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">//没有 token 信息，直接返回</span>
            log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">"【请求链接】：{}，请求无 token 令牌"</span><span class="token punctuation">,</span> exchange<span class="token punctuation">.</span><span class="token function">getRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getURI</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            exchange<span class="token punctuation">.</span><span class="token function">getResponse</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">setStatusCode</span><span class="token punctuation">(</span><span class="token class-name">HttpStatus</span><span class="token punctuation">.</span><span class="token constant">NOT_ACCEPTABLE</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">return</span> exchange<span class="token punctuation">.</span><span class="token function">getResponse</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">setComplete</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token comment">// 打印日志</span>
        log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">"【请求链接】：{}，【请求参数】：{}"</span><span class="token punctuation">,</span> exchange<span class="token punctuation">.</span><span class="token function">getRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getURI</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> exchange<span class="token punctuation">.</span><span class="token function">getRequest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getQueryParams</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token comment">//转到下一个过滤器</span>
        <span class="token keyword">return</span> chain<span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span>exchange<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 加载过滤器的顺序，越小优先级越高
     */</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">int</span> <span class="token function">getOrder</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token number">0</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>请求控制台输出：</p>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token class-name"><span class="token namespace">c<span class="token punctuation">.</span>s<span class="token punctuation">.</span>demo<span class="token punctuation">.</span>gateway<span class="token punctuation">.</span>config<span class="token punctuation">.</span></span>GatewayFilter</span>    <span class="token operator">:</span> 【请求链接】：http<span class="token operator">:</span><span class="token operator">/</span><span class="token operator">/</span>localhost<span class="token operator">:</span><span class="token number">36500</span><span class="token operator">/</span>order<span class="token operator">/</span>payByOrderId<span class="token operator">?</span>id<span class="token operator">=</span><span class="token number">778</span>，【请求参数】：<span class="token punctuation">{</span>id<span class="token operator">=</span><span class="token punctuation">[</span><span class="token number">778</span><span class="token punctuation">]</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><br/>
<h2 id="参考文章" tabindex="-1"><a class="header-anchor" href="#参考文章" aria-hidden="true">#</a> <span id="te">参考文章</span></h2>
<p><a href="https://www.bilibili.com/video/BV18E411x7eT?p=66&amp;spm_id_from=pageDriver" target="_blank" rel="noopener noreferrer">尚硅谷SpringCloud框架开发教程(SpringCloudAlibaba微服务分布式架构丨Spring Cloud)_哔哩哔哩_bilibili<ExternalLinkIcon/></a></p>
<p><a href="https://www.cnblogs.com/babycomeon/p/11161073.html" target="_blank" rel="noopener noreferrer">跟我学SpringCloud | 第十二篇：Spring Cloud Gateway初探 - 极客挖掘机 - 博客园 (cnblogs.com)<ExternalLinkIcon/></a></p>
<p><a href="https://www.cnblogs.com/crazymakercircle/p/11704077.html" target="_blank" rel="noopener noreferrer">回到疯狂创客圈-Java高并发社群 (cnblogs.com)<ExternalLinkIcon/></a></p>
<p><a href="https://blog.csdn.net/qq_38380025/article/details/102968559" target="_blank" rel="noopener noreferrer">Spring cloud gateway 详解和配置使用（文章较长）_荡漾-CSDN博客<ExternalLinkIcon/></a></p>
<p><a href="https://blog.csdn.net/forezp/article/details/85057268" target="_blank" rel="noopener noreferrer">spring cloud gateway之filter篇_方志朋的专栏-CSDN博客<ExternalLinkIcon/></a></p>
</div></template>


