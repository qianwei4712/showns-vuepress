import{_ as r,b as n,o,c as l,a as e,d as a,e as i,f as s}from"./app-36b09dbd.js";const c={},m=s('<div class="catalog"><ul><li><a href="#jmeter">Jmeter 压力测试</a></li><li><a href="#te">参考文章</a></li></ul></div><h2 id="jmeter-压力测试" tabindex="-1"><a class="header-anchor" href="#jmeter-压力测试" aria-hidden="true">#</a> <span id="jmeter">Jmeter 压力测试</span></h2>',2),h={href:"http://jmeter.apache.org/download_jmeter.cgi",target:"_blank",rel:"noopener noreferrer"},p=s('<p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211027000237872.png" alt="image-20211027000237872"></p><ol start="2"><li>Windows 下解压，直接启动 bin 目录下的 <code>jmeter.bat</code> ，即可打开 GUI 界面。</li><li>新建一个线程组测试，配置线程请求信息。</li></ol><p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211027001206148.png" alt="image-20211027001206148"></p><p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211027001651071.png" alt="image-20211027001651071"></p><br><ol start="4"><li>添加默认 Request 配置，主要是 IP 端口。</li></ol><p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211027001430828.png" alt="image-20211027001430828"></p><p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211027001952231.png" alt="image-20211027001952231"></p><br><ol start="5"><li>再添加要请求的地址</li></ol><p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211027001934955.png" alt="image-20211027001934955"></p><p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211027002226027.png" alt="image-20211027002226027"></p><br><ol start="6"><li><strong>新增监听器，用于查看压测结果</strong>。这里添加三种：聚合报告、图形结果、用表格查看结果，区别在于结果展现形式不同。</li></ol><p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211027002338026.png" alt="image-20211027002338026"></p><br><br><h2 id="参考文章" tabindex="-1"><a class="header-anchor" href="#参考文章" aria-hidden="true">#</a> <span id="te">参考文章</span></h2>',18),g={href:"https://blog.csdn.net/yaorongke/article/details/82799609",target:"_blank",rel:"noopener noreferrer"},d={href:"https://www.bilibili.com/video/BV1PV411b7KT",target:"_blank",rel:"noopener noreferrer"},u={href:"https://www.bilibili.com/video/BV1wC4y1Y7yX",target:"_blank",rel:"noopener noreferrer"};function _(b,f){const t=n("ExternalLinkIcon");return o(),l("div",null,[m,e("ol",null,[e("li",null,[a("下载软件："),e("a",h,[a("Apache JMeter - Download Apache JMeter"),i(t)])])]),p,e("p",null,[e("a",g,[a("Jmeter教程(一) - 入门_淡淡的说非-CSDN博客_jmeter"),i(t)])]),e("p",null,[e("a",d,[a("道普云-Fortify WebInspect-Web应用安全测试报告功能演示_哔哩哔哩_bilibili"),i(t)])]),e("p",null,[e("a",u,[a("软件测试丨安全渗透测试web应用服务器安全_哔哩哔哩_bilibili"),i(t)])])])}const y=r(c,[["render",_],["__file","WebSafeTest.html.vue"]]);export{y as default};
