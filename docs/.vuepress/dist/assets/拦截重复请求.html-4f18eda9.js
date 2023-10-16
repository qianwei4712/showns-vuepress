import{_ as e,r as c,o,c as l,b as n,d as a,a as t,f as p}from"./app-831ad1c2.js";const i={},u=p('<h2 id="前言-废话" tabindex="-1"><a class="header-anchor" href="#前言-废话" aria-hidden="true">#</a> 前言（废话）</h2><p>接口幂等性就是对同一操作发起了多次请求的对数据的影响是一致不变的，不会因为多次的请求而产生副作用。</p><p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/微信截图_20220225105348.png" alt=""></p><p>最常见的例子就是包括：同一个订单多次支付，不会重复扣款。</p><p>在我们编程中常见幂等</p><ul><li>select：查询天然幂等</li><li>delete：删除也是幂等，删除同一个多次效果一样</li><li>update：直接更新某个值的，幂等</li><li>update：更新累加操作的，非幂等</li><li>insert：非幂等操作，每次新增一条</li></ul><br><h2 id="解决方案" tabindex="-1"><a class="header-anchor" href="#解决方案" aria-hidden="true">#</a> 解决方案</h2><p>大佬的文章里已经介绍了很多种：</p>',9),k={href:"https://juejin.cn/post/6844903894384902158",target:"_blank",rel:"noopener noreferrer"},r={href:"https://gitee.com/pic_bed_of_shiva/static-resources/blob/8ac35cde1f880d0689cd560b3d1d8a601cfed6c9/showns/images/%E7%BD%91%E9%A1%B5%E6%8D%95%E8%8E%B7_29-12-2021_234846_juejin.cn.jpeg",target:"_blank",rel:"noopener noreferrer"},d=p(`<p>本文的解决方案参考自 ruoyi 框架，与上面博客中的对比，ruoyi 的重复提交方案引入了注解自定义判断，也更加灵活。</p><p>工作流程如下：</p><p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211231140141550.png" alt=""></p><p>倒是也不复杂。</p><blockquote><p>这里提一句，若依框架加了过滤器实现重复读取流数据，顺序：<strong>过滤前 - 拦截前 - Action处理 - 拦截后 - 过滤后。</strong></p></blockquote><p>然后基于我们自己的使用习惯，用 ehcache 做缓存，修改过滤器包装流获取，开始贴代码。</p><br><h2 id="代码实现" tabindex="-1"><a class="header-anchor" href="#代码实现" aria-hidden="true">#</a> 代码实现</h2><p>准备 RepeatSubmitInterceptor 拦截器：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Component</span>
<span class="token keyword">public</span> <span class="token keyword">abstract</span> <span class="token keyword">class</span> <span class="token class-name">RepeatSubmitInterceptor</span> <span class="token keyword">implements</span> <span class="token class-name">HandlerInterceptor</span> <span class="token punctuation">{</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">preHandle</span><span class="token punctuation">(</span><span class="token class-name">HttpServletRequest</span> request<span class="token punctuation">,</span> <span class="token class-name">HttpServletResponse</span> response<span class="token punctuation">,</span> <span class="token class-name">Object</span> handler<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>handler <span class="token keyword">instanceof</span> <span class="token class-name">HandlerMethod</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">HandlerMethod</span> handlerMethod <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">HandlerMethod</span><span class="token punctuation">)</span> handler<span class="token punctuation">;</span>
            <span class="token class-name">Method</span> method <span class="token operator">=</span> handlerMethod<span class="token punctuation">.</span><span class="token function">getMethod</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token class-name">RepeatSubmit</span> annotation <span class="token operator">=</span> method<span class="token punctuation">.</span><span class="token function">getAnnotation</span><span class="token punctuation">(</span><span class="token class-name">RepeatSubmit</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>annotation <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">isRepeatSubmit</span><span class="token punctuation">(</span>request<span class="token punctuation">,</span> annotation<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    <span class="token class-name">Resp</span> error <span class="token operator">=</span> <span class="token class-name">Resp</span><span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span>annotation<span class="token punctuation">.</span><span class="token function">message</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token class-name">ServletUtils</span><span class="token punctuation">.</span><span class="token function">renderString</span><span class="token punctuation">(</span>response<span class="token punctuation">,</span> <span class="token class-name">JSONObject</span><span class="token punctuation">.</span><span class="token function">toJSONString</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
            <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 验证是否重复提交由子类实现具体的防重复提交的规则
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">abstract</span> <span class="token keyword">boolean</span> <span class="token function">isRepeatSubmit</span><span class="token punctuation">(</span><span class="token class-name">HttpServletRequest</span> request<span class="token punctuation">,</span> <span class="token class-name">RepeatSubmit</span> annotation<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>需要验证重复提交的注解，<strong>时间间隔在这里</strong>：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 自定义注解防止表单重复提交
 * <span class="token keyword">@author</span> shiva   2021/12/30 22:55
 */</span>
<span class="token annotation punctuation">@Inherited</span>
<span class="token annotation punctuation">@Target</span><span class="token punctuation">(</span><span class="token class-name">ElementType</span><span class="token punctuation">.</span><span class="token constant">METHOD</span><span class="token punctuation">)</span>
<span class="token annotation punctuation">@Retention</span><span class="token punctuation">(</span><span class="token class-name">RetentionPolicy</span><span class="token punctuation">.</span><span class="token constant">RUNTIME</span><span class="token punctuation">)</span>
<span class="token annotation punctuation">@Documented</span>
<span class="token keyword">public</span> <span class="token annotation punctuation">@interface</span> <span class="token class-name">RepeatSubmit</span> <span class="token punctuation">{</span>
    <span class="token doc-comment comment">/**
     * 间隔时间(ms)，小于此时间视为重复提交.
     * 因为 ehcache 无法针对单个 key 设置过期时间，所以需要同步修改 ehcache.xml
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">int</span> <span class="token function">interval</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">default</span> <span class="token number">2000</span><span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 提示消息
     */</span>
    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">message</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">default</span> <span class="token string">&quot;不允许重复提交，请稍后再试&quot;</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最后实际的拦截判断方法：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Component</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">SameUrlDataInterceptor</span> <span class="token keyword">extends</span> <span class="token class-name">RepeatSubmitInterceptor</span> <span class="token punctuation">{</span>
    <span class="token doc-comment comment">/**
     * 请求参数
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">final</span> <span class="token class-name">String</span> <span class="token constant">REPEAT_PARAMS</span> <span class="token operator">=</span> <span class="token string">&quot;repeatParams&quot;</span><span class="token punctuation">;</span>
    <span class="token doc-comment comment">/**
     * 请求时间
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">final</span> <span class="token class-name">String</span> <span class="token constant">REPEAT_TIME</span> <span class="token operator">=</span> <span class="token string">&quot;repeatTime&quot;</span><span class="token punctuation">;</span>

    <span class="token annotation punctuation">@SuppressWarnings</span><span class="token punctuation">(</span><span class="token string">&quot;unchecked&quot;</span><span class="token punctuation">)</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">isRepeatSubmit</span><span class="token punctuation">(</span><span class="token class-name">HttpServletRequest</span> request<span class="token punctuation">,</span> <span class="token class-name">RepeatSubmit</span> annotation<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">String</span> nowParams <span class="token operator">=</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>request <span class="token keyword">instanceof</span> <span class="token class-name">RepeatedlyRequestWrapper</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">RepeatedlyRequestWrapper</span> repeatedlyRequest <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">RepeatedlyRequestWrapper</span><span class="token punctuation">)</span> request<span class="token punctuation">;</span>
            nowParams <span class="token operator">=</span> <span class="token class-name">RepeatedlyRequestWrapper</span><span class="token punctuation">.</span><span class="token function">getBodyString</span><span class="token punctuation">(</span>repeatedlyRequest<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token comment">// body参数为空，获取Parameter的数据</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token class-name">StringUtils</span><span class="token punctuation">.</span><span class="token function">isEmpty</span><span class="token punctuation">(</span>nowParams<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            nowParams <span class="token operator">=</span> <span class="token class-name">JSONObject</span><span class="token punctuation">.</span><span class="token function">toJSONString</span><span class="token punctuation">(</span>request<span class="token punctuation">.</span><span class="token function">getParameterMap</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token comment">//收集参数和请求时间</span>
        <span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">Object</span><span class="token punctuation">&gt;</span></span> nowDataMap <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">HashMap</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        nowDataMap<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token constant">REPEAT_PARAMS</span><span class="token punctuation">,</span> nowParams<span class="token punctuation">)</span><span class="token punctuation">;</span>
        nowDataMap<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token constant">REPEAT_TIME</span><span class="token punctuation">,</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token comment">// 请求地址（作为存放cache的key值）</span>
        <span class="token class-name">String</span> url <span class="token operator">=</span> request<span class="token punctuation">.</span><span class="token function">getRequestURI</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// 这里还有判断，是不是同一个用户，两个用户同一个请求会造成不同结果</span>
        <span class="token comment">// 唯一值，这里的目的时把请求，按照用户进行分组，每个用户都有一个key</span>
        <span class="token class-name">String</span> userIdKey <span class="token operator">=</span> <span class="token class-name">SysUtils</span><span class="token punctuation">.</span><span class="token function">getUser</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getId</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token class-name">StringUtils</span><span class="token punctuation">.</span><span class="token function">isBlank</span><span class="token punctuation">(</span><span class="token class-name">SysUtils</span><span class="token punctuation">.</span><span class="token function">getUser</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getId</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">//没有用户也能访问的，放在一起</span>
            userIdKey <span class="token operator">=</span> url<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token comment">// 唯一标识（指定key + 消息头）</span>
        <span class="token class-name">String</span> cacheRepeatKey <span class="token operator">=</span> <span class="token class-name">Constant</span><span class="token punctuation">.</span><span class="token constant">REPEAT_SUBMIT_KEY</span> <span class="token operator">+</span> userIdKey<span class="token punctuation">;</span>
        <span class="token comment">//拿到缓存对象</span>
        <span class="token class-name">Object</span> sessionObj <span class="token operator">=</span> <span class="token class-name">CacheUtils</span><span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token class-name">CacheUtils</span><span class="token punctuation">.</span><span class="token constant">REPEAT_SUBMIT_CACHE</span><span class="token punctuation">,</span> cacheRepeatKey<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// 实际判断方法</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>sessionObj <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">Object</span><span class="token punctuation">&gt;</span></span> sessionMap <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">Object</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">)</span> sessionObj<span class="token punctuation">;</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>sessionMap<span class="token punctuation">.</span><span class="token function">containsKey</span><span class="token punctuation">(</span>url<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">Object</span><span class="token punctuation">&gt;</span></span> preDataMap <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">Object</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">)</span> sessionMap<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>url<span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">compareParams</span><span class="token punctuation">(</span>nowDataMap<span class="token punctuation">,</span> preDataMap<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> <span class="token function">compareTime</span><span class="token punctuation">(</span>nowDataMap<span class="token punctuation">,</span> preDataMap<span class="token punctuation">,</span> annotation<span class="token punctuation">.</span><span class="token function">interval</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">Object</span><span class="token punctuation">&gt;</span></span> cacheMap <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">HashMap</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        cacheMap<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span>url<span class="token punctuation">,</span> nowDataMap<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">CacheUtils</span><span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token class-name">CacheUtils</span><span class="token punctuation">.</span><span class="token constant">REPEAT_SUBMIT_CACHE</span><span class="token punctuation">,</span> cacheRepeatKey<span class="token punctuation">,</span> cacheMap<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 判断参数是否相同
     */</span>
    <span class="token keyword">private</span> <span class="token keyword">boolean</span> <span class="token function">compareParams</span><span class="token punctuation">(</span><span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">Object</span><span class="token punctuation">&gt;</span></span> nowMap<span class="token punctuation">,</span> <span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">Object</span><span class="token punctuation">&gt;</span></span> preMap<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">String</span> nowParams <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">)</span> nowMap<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token constant">REPEAT_PARAMS</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">String</span> preParams <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">)</span> preMap<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token constant">REPEAT_PARAMS</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> nowParams<span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>preParams<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 判断两次间隔时间
     */</span>
    <span class="token keyword">private</span> <span class="token keyword">boolean</span> <span class="token function">compareTime</span><span class="token punctuation">(</span><span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">Object</span><span class="token punctuation">&gt;</span></span> nowMap<span class="token punctuation">,</span> <span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">Object</span><span class="token punctuation">&gt;</span></span> preMap<span class="token punctuation">,</span> <span class="token keyword">int</span> interval<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">long</span> time1 <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">Long</span><span class="token punctuation">)</span> nowMap<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token constant">REPEAT_TIME</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">long</span> time2 <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">Long</span><span class="token punctuation">)</span> preMap<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token constant">REPEAT_TIME</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> <span class="token punctuation">(</span>time1 <span class="token operator">-</span> time2<span class="token punctuation">)</span> <span class="token operator">&lt;</span> interval<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>


<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在拦截器加配置：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Configuration</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">WebMvcConfig</span> <span class="token keyword">implements</span> <span class="token class-name">WebMvcConfigurer</span> <span class="token punctuation">{</span>
    <span class="token annotation punctuation">@Autowired</span>
    <span class="token keyword">private</span> <span class="token class-name">SameUrlDataInterceptor</span> sameUrlDataInterceptor<span class="token punctuation">;</span>

    <span class="token annotation punctuation">@Value</span><span class="token punctuation">(</span><span class="token string">&quot;\${adminPath}&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">protected</span> <span class="token class-name">String</span> adminPath<span class="token punctuation">;</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">addInterceptors</span><span class="token punctuation">(</span><span class="token class-name">InterceptorRegistry</span> registry<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 重复提交校验，根据注解来判断是否需要验证重复提交</span>
        registry<span class="token punctuation">.</span><span class="token function">addInterceptor</span><span class="token punctuation">(</span>sameUrlDataInterceptor<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">addPathPatterns</span><span class="token punctuation">(</span>adminPath <span class="token operator">+</span> <span class="token string">&quot;/**&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">WebMvcConfigurer</span><span class="token punctuation">.</span><span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">addInterceptors</span><span class="token punctuation">(</span>registry<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><br><h2 id="参考文章" tabindex="-1"><a class="header-anchor" href="#参考文章" aria-hidden="true">#</a> 参考文章</h2>`,18),m={href:"https://juejin.cn/post/6844903894384902158",target:"_blank",rel:"noopener noreferrer"},v={href:"https://www.sohu.com/a/287773228_120045139",target:"_blank",rel:"noopener noreferrer"};function b(g,h){const s=c("ExternalLinkIcon");return o(),l("div",null,[u,n("ul",null,[n("li",null,[n("p",null,[n("a",k,[a("幂等问题 8种方案解决重复提交 - 掘金 (juejin.cn)"),t(s)])])]),n("li",null,[n("p",null,[n("a",r,[a("备用截图地址"),t(s)])])])]),d,n("p",null,[n("a",m,[a("幂等问题 8种方案解决重复提交 - 掘金 (juejin.cn)"),t(s)])]),n("p",null,[n("a",v,[a("拦截器和过滤器监听器的区别执行顺序_action (sohu.com)"),t(s)])])])}const w=e(i,[["render",b],["__file","拦截重复请求.html.vue"]]);export{w as default};
