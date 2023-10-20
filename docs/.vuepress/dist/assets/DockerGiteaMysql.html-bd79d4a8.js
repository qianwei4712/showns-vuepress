import{_ as r,r as l,o as t,c as i,b as a,d as s,a as n,f as o}from"./app-7e2007b0.js";const d={},c=o(`<h3 id="概述" tabindex="-1"><a class="header-anchor" href="#概述" aria-hidden="true">#</a> 概述</h3><p>搭建一个企业代码仓库，网上对比一圈，发现 gitea 比较受欢迎。</p><ul><li>选用 docker 作为 gitea 容器</li><li>主服务器装 mysql ，团队5人以下用 SQLite 3 也够用 。</li></ul><br><h3 id="mysql-安装" tabindex="-1"><a class="header-anchor" href="#mysql-安装" aria-hidden="true">#</a> mysql 安装</h3><ol><li>MySQL 安装</li></ol><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">wget</span> <span class="token parameter variable">-i</span> <span class="token parameter variable">-c</span> http://dev.mysql.com/get/mysql57-community-release-el7-10.noarch.rpm 
yum <span class="token parameter variable">-y</span> <span class="token function">install</span> mysql57-community-release-el7-10.noarch.rpm 
yum <span class="token parameter variable">-y</span> <span class="token function">install</span> mysql-community-server 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>启动 MySql ，并查看运行状态</li></ol><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>systemctl start mysqld.service 
systemctl status mysqld.service 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3"><li>查看默认root权限密码，然后修改密码。</li></ol><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">grep</span> <span class="token string">&quot;password&quot;</span> /var/log/mysqld.log
mysql <span class="token parameter variable">-uroot</span> <span class="token parameter variable">-p</span> 
alter user <span class="token string">&#39;root&#39;</span>@<span class="token string">&#39;localhost&#39;</span> identified by <span class="token string">&#39;password&#39;</span><span class="token punctuation">;</span>
FLUSH PRIVILEGES<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="4"><li>创建新用户，授权，并设置登陆ip</li></ol><div class="language-SQL line-numbers-mode" data-ext="SQL"><pre class="language-SQL"><code>create user &#39;gitea&#39;@&#39;%&#39; identified by &#39;password&#39;;
grant all privileges on *.* to &#39;gitea&#39;@&#39;%&#39;  identified by &#39;password&#39; with grant option;
FLUSH PRIVILEGES;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="5"><li>最后创建 gitea 数据库，编码使用 utfmb4</li></ol><br><h3 id="docker-gitea-安装" tabindex="-1"><a class="header-anchor" href="#docker-gitea-安装" aria-hidden="true">#</a> docker gitea 安装</h3><p>直接拉最新版的 gitea</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker</span> pull gitea/gitea
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>服务器准备两个开放端口，例如 <code>52125</code>、<code>36523</code></p><p>容器映射 <code>22</code> 和 <code>3000</code> 端口到服务器的 <code>52125</code>、<code>36523</code>端口</p><p>官网启动方式：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">--name</span><span class="token operator">=</span>gitea <span class="token parameter variable">-p</span> <span class="token number">52125</span>:22 <span class="token parameter variable">-p</span> <span class="token number">36523</span>:3000 <span class="token parameter variable">-v</span> /var/lib/gitea:/data gitea/gitea:latest
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>本次启动方式(新增两个参数，可以根据需要选择)：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">--privileged</span><span class="token operator">=</span>true <span class="token parameter variable">--restart</span><span class="token operator">=</span>always <span class="token parameter variable">--name</span><span class="token operator">=</span>gitea <span class="token parameter variable">-p</span> <span class="token number">52125</span>:22 <span class="token parameter variable">-p</span> <span class="token number">36523</span>:3000 <span class="token parameter variable">-v</span> /var/lib/gitea:/data gitea/gitea:latest
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><blockquote><p>--privileged=true 使用该参数，container内的root拥有真正的root权限（可根据需要选择是否要该参数）</p><p>--restart=always 自动重启容器（可根据需要选择是否要该参数）</p><p>-p 端口映射（宿主机端口：容器端口）</p><p>-v 容器卷挂载 （宿主机目录 ：容器目录），把配置文件保存在宿主机，可以随时重置镜像不影响使用</p></blockquote><br><h3 id="初始化" tabindex="-1"><a class="header-anchor" href="#初始化" aria-hidden="true">#</a> 初始化</h3><p>启动后访问：<strong><code>http://ip:36523</code></strong> ，进入初始化</p><ul><li>数据库：选择 mysql 的填写连接信息、使用 SQLite 3 的使用默认位置将仓库保存到宿主机</li><li>SSH 服务域名：改为 公网IP，或者域名</li><li>SSH 端口：改为映射的公网端口 <code>52125</code></li><li>Gitea 基本URL：localhost 改为 公网IP 或域名，端口改为映射端口 <code>36523</code></li></ul><br><h3 id="参考文章" tabindex="-1"><a class="header-anchor" href="#参考文章" aria-hidden="true">#</a> 参考文章</h3>`,31),p={href:"https://www.toutiao.com/i6675622107390411276/",target:"_blank",rel:"noopener noreferrer"},u={href:"https://blog.csdn.net/shuai8624/article/details/107564659/",target:"_blank",rel:"noopener noreferrer"};function m(v,b){const e=l("ExternalLinkIcon");return t(),i("div",null,[c,a("p",null,[a("a",p,[s("你在 Docker 中跑 MySQL？恭喜你，好下岗了！ (toutiao.com)"),n(e)])]),a("p",null,[a("a",u,[s("docker安装gitea(不好使你打我)_臭小子的博客-CSDN博客"),n(e)])])])}const g=r(d,[["render",m],["__file","DockerGiteaMysql.html.vue"]]);export{g as default};