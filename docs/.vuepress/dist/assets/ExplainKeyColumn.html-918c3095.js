import{_ as t,b as o,o as p,c as r,a as n,d as a,e,f as l}from"./app-36b09dbd.js";const c={},i=l(`<h2 id="前言" tabindex="-1"><a class="header-anchor" href="#前言" aria-hidden="true">#</a> 前言</h2><p><em>2022.01.03，MySQL 汇总优化前置章节</em></p><blockquote><p>使用 <strong>EXPLAIN</strong> 关键字可以模拟优化器执行 SQL 查询语句，从而知道 MySQL 是如何处理你的 SQL 语句的，从而分析性能瓶颈。</p></blockquote><p>它的作用如下：</p><p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220103224348730.png" alt=""></p><p>官方文档连接如下：</p><ul><li><strong>EXPLAIN 格式在线文档：</strong> https://dev.mysql.com/doc/refman/8.0/en/explain-output.html</li></ul><p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/1641203466485-200f4879-96d3-4afb-80c1-ebe4e750c24e.png" alt=""></p><br><h2 id="执行计划字段" tabindex="-1"><a class="header-anchor" href="#执行计划字段" aria-hidden="true">#</a> 执行计划字段</h2><p>使用以下 SQL 作为例子：</p><div class="language-sql line-numbers-mode" data-ext="sql"><pre class="language-sql"><code><span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token keyword">DISTINCT</span>
	opt<span class="token punctuation">.</span>order_bill_no 
<span class="token keyword">FROM</span>
	wms_order_detail opt
	<span class="token keyword">LEFT</span> <span class="token keyword">JOIN</span> wms_order wo <span class="token keyword">ON</span> wo<span class="token punctuation">.</span>id <span class="token operator">=</span> opt<span class="token punctuation">.</span>order_id 
	<span class="token operator">AND</span> wo<span class="token punctuation">.</span>del_flag <span class="token operator">=</span> <span class="token number">0</span>
	<span class="token keyword">LEFT</span> <span class="token keyword">JOIN</span> wms_entry_detail wed <span class="token keyword">ON</span> opt<span class="token punctuation">.</span>id <span class="token operator">=</span> wed<span class="token punctuation">.</span>order_detail_id 
	<span class="token operator">AND</span> wed<span class="token punctuation">.</span>del_flag <span class="token operator">=</span> <span class="token number">0</span> 
<span class="token keyword">WHERE</span>
	opt<span class="token punctuation">.</span>del_flag <span class="token operator">=</span> <span class="token number">0</span> 
	<span class="token operator">AND</span> opt<span class="token punctuation">.</span>deliver_box_num <span class="token operator">!=</span> wed<span class="token punctuation">.</span>sign_box_num 
	<span class="token operator">AND</span> <span class="token punctuation">(</span> wo<span class="token punctuation">.</span>order_status <span class="token operator">=</span> <span class="token string">&#39;40&#39;</span> <span class="token operator">OR</span> wo<span class="token punctuation">.</span>order_status <span class="token operator">=</span> <span class="token string">&#39;50&#39;</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>执行结果先给个截图：</p><p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/1641210500055-3a53225c-0f37-4680-b465-a8f1e4313376.png" alt=""></p><p>各字段说明、以及关注点如下：</p><p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/20210108 MySQL 优化总结.png" alt=""></p><br><h3 id="extra-说明" tabindex="-1"><a class="header-anchor" href="#extra-说明" aria-hidden="true">#</a> extra 说明</h3><p>extra 主要类型及说明如下：</p><p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/20210108 MySQL 优化总结-16416314296521.png" alt=""></p><br><h2 id="参考文章" tabindex="-1"><a class="header-anchor" href="#参考文章" aria-hidden="true">#</a> 参考文章</h2>`,22),d={href:"https://blog.csdn.net/qq_44836294/article/details/107620909",target:"_blank",rel:"noopener noreferrer"},u={href:"https://blog.csdn.net/eagle89/article/details/80433723",target:"_blank",rel:"noopener noreferrer"},k={href:"https://blog.csdn.net/weixin_34050389/article/details/92054757",target:"_blank",rel:"noopener noreferrer"};function h(m,_){const s=o("ExternalLinkIcon");return p(),r("div",null,[i,n("ol",null,[n("li",null,[n("a",d,[a("SQL执行计划_Jay的博客-CSDN博客_sql执行计划"),e(s)])]),n("li",null,[n("a",u,[a("explain执行计划详解_eagle89的专栏-CSDN博客_explain执行计划"),e(s)])]),n("li",null,[n("a",k,[a("Explain中的filtered列_weixin_34050389的博客-CSDN博客"),e(s)])])])])}const b=t(c,[["render",h],["__file","ExplainKeyColumn.html.vue"]]);export{b as default};
