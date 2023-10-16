import{_ as n,o as s,c as a,f as e}from"./app-831ad1c2.js";const t={},i=e(`<div class="catalog"><ul><li><a href="#huanjin">nginx需要的环境安装</a></li><li><a href="#anzhuang">Nginx安装</a><ul><li><a href="#firewall">检查防火墙</a></li></ul></li><li><a href="#peizhi">Nginx配置</a></li><li><a href="#sslpeizhi">为Nginx配置SSL</a></li><li><a href="#sslgoumai">在阿里云申请SSL证书</a></li><li><a href="#sslanzhaung">证书配置</a><ul><li><a href="#tomcat">tomcat配置</a></li><li><a href="#nginx">Nginx配置</a></li></ul></li></ul></div><blockquote><p>摘要：背景环境为，在一台CentOS阿里云服务器下，有多个不同端口tomcat项目,并需要为这些项目添加SSL加密证书。</p><p>ps：其实这原本是两篇，前后隔了2个月，后来我就放在一起了</p></blockquote><h3 id="nginx需要的环境安装" tabindex="-1"><a class="header-anchor" href="#nginx需要的环境安装" aria-hidden="true">#</a> <span id="huanjin">nginx需要的环境安装</span></h3><p>按顺序敲入下面四个指令：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>yum install gcc-c++
yum install -y pcre pcre-devel
yum install -y zlib zlib-devel
yum install -y openssl openssl-devel
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这四个需要安装的原因分别是：</p><blockquote><p>nginx是C语言开发，建议在linux上运行，本教程使用Centos6.5作为安装环境。安装nginx需要先将官网下载的源码进行编译，编译依赖gcc环境，如果没有gcc环境，需要安装gcc。<br></p></blockquote><blockquote><p>PCRE(Perl Compatible Regular Expressions)是一个Perl库，包括 perl 兼容的正则表达式库。nginx的http模块使用pcre来解析正则表达式，所以需要在linux上安装pcre库。<br></p></blockquote><blockquote><p>zlib库提供了很多种压缩和解压缩的方式，nginx使用zlib对http包的内容进行gzip，所以需要在linux上安装zlib库。<br></p></blockquote><blockquote><p>OpenSSL 是一个强大的安全套接字层密码库，囊括主要的密码算法、常用的密钥和证书封装管理功能及SSL协议，并提供丰富的应用程序供测试或其它目的使用。nginx不仅支持http协议，还支持https（即在ssl协议上传输http），所以需要在linux安装openssl库。</p></blockquote><br><h3 id="nginx安装" tabindex="-1"><a class="header-anchor" href="#nginx安装" aria-hidden="true">#</a> <span id="anzhuang">nginx安装</span></h3><p>首先下载nginx，<a href="http://nginx.org/en/download.html" target="_blank">http://nginx.org/en/download.html</a></p><p>我下载的版本是1.12.1。似乎是看到了Stable version，俗称稳定版，所以下载了这个版本。</p><p>下面的具体安装步骤，我使用FlashFXP和XShell。</p><p>我自己在/usr/local/下建了一个文件夹nginx。然后把下载的nginx-1.12.1.tar.gz放到文件夹下面，然后</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>tar -zxvf nginx-1.12.1.tar.gz
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>解压后进入解压出的文件夹</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>cd nginx-1.12.1
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>接下来要做的事情，就是敲指令，反正看不懂它在做什么。没报问题就行了</p><p>按顺序键入</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>./configure
make
make  install
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>没有出问题的话。会生成些文件。这里有个小情况，我在完成后，在nginx的同级目录下自动生成了一个相同名字的文件。里面就是刚刚生成的文件，配置的指令集都在里面，然而不懂为啥不会合并，反正成功了就好。</p><p>然后进入/nginx/sbin，这个cd指令就不写了，我不知道你们生成文件的位置，找找吧，就在local应该下面</p><p>启动nginx</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>./nginx
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>不出意外的话你就能直接通过ip访问到nginx页面了。</p><p>如果不行先检查nginx是否启动，再检查防火墙。</p><h4 id="检查防火墙是否开放80端口" tabindex="-1"><a class="header-anchor" href="#检查防火墙是否开放80端口" aria-hidden="true">#</a> <span id="firewall">检查防火墙是否开放80端口</span></h4><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>vi /etc/sysconfig/iptables
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>看看是否存在以下行，不存在的话加进去</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>A INPUT -p tcp -m state --state NEW -m tcp --dport 80 -j ACCEPT
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>为方便小白，多讲几句废话</p><p>按一下s，进行编辑。编辑完后ctrl+c，然后敲：wq，回车保存退出</p><p>重启防火墙</p><p>centos 6以前 <code>service iptables restart</code><br> centos 7以后 <code>systemctl restart firewalld.service</code><br></p><h4 id="检查阿里云防火墙是否开启" tabindex="-1"><a class="header-anchor" href="#检查阿里云防火墙是否开启" aria-hidden="true">#</a> 检查阿里云防火墙是否开启</h4><p>阿里云端口需要自己开放，这里简单写一下</p><p>实例--管理--本实例安全组--配置规则--允许公网入方向80端口，优先级1-100</p><p>到这里，应该nginx都安装完成了。</p><br><h3 id="nginx配置" tabindex="-1"><a class="header-anchor" href="#nginx配置" aria-hidden="true">#</a> <span id="peizhi">nginx配置</span></h3><p>这里自己配置2个tomcat，比如端口为8081，8082。就不详细讲了,大胆假设你已经跑起来了。</p><p>然后配置nginx.conf。这里按照我的目录为例</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>cd  /usr/local/nginx/conf
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>下面有一个nginx.conf文件。就是最后的敌人。</p><p>把#注释的去掉点，看起来清楚点。</p><p>然后，直接贴出文件好了，这里也没东西好讲的。</p><p>我只在里面加了2个upstream,和2个server，其它的一行没动。</p><p>编辑完之后别忘了重新进入/nginx/sbin，使新的配置文件生效</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>./nginx -s reload
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>ok!敲完这一行，恭喜你练成了盖世武功。</p><p>这里的ip我用127.0.0.1代理，2个域名分别用 百度 和 谷歌 代替。</p><p>这里例如www.baidu.cn   baidu.cn空格分开表示两个访问地址都能控制。。</p><p>百度谷歌两个项目页面分别在8081和8082两个tomcat下。</p><div class="language-nginx line-numbers-mode" data-ext="nginx"><pre class="language-nginx"><code>
<span class="token comment">#user  nobody;</span>
<span class="token directive"><span class="token keyword">worker_processes</span>  <span class="token number">1</span></span><span class="token punctuation">;</span>

<span class="token comment">#error_log  logs/error.log;</span>
<span class="token comment">#error_log  logs/error.log  notice;</span>
<span class="token comment">#error_log  logs/error.log  info;</span>

<span class="token comment">#pid        logs/nginx.pid;</span>


<span class="token directive"><span class="token keyword">events</span></span> <span class="token punctuation">{</span>
    <span class="token directive"><span class="token keyword">worker_connections</span>  <span class="token number">1024</span></span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>


<span class="token directive"><span class="token keyword">http</span></span> <span class="token punctuation">{</span>
    <span class="token directive"><span class="token keyword">include</span>       mime.types</span><span class="token punctuation">;</span>
    <span class="token directive"><span class="token keyword">default_type</span>  application/octet-stream</span><span class="token punctuation">;</span>

    <span class="token directive"><span class="token keyword">sendfile</span>        <span class="token boolean">on</span></span><span class="token punctuation">;</span>
    <span class="token comment">#tcp_nopush     on;</span>

    <span class="token comment">#keepalive_timeout  0;</span>
    <span class="token directive"><span class="token keyword">keepalive_timeout</span>  <span class="token number">65</span></span><span class="token punctuation">;</span>

    <span class="token comment">#gzip  on;</span>

    <span class="token directive"><span class="token keyword">upstream</span> baidu</span><span class="token punctuation">{</span>
        <span class="token directive"><span class="token keyword">server</span> 127.0.0.1:8081</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
	
    <span class="token directive"><span class="token keyword">upstream</span> google</span> <span class="token punctuation">{</span>
        <span class="token directive"><span class="token keyword">server</span> 127.0.0.1:8082</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span>
        <span class="token directive"><span class="token keyword">listen</span>       <span class="token number">80</span></span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">server_name</span>  www.baidu.cn baidu.cn</span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">location</span> /</span> <span class="token punctuation">{</span>
          <span class="token directive"><span class="token keyword">proxy_pass</span> http://baidu</span><span class="token punctuation">;</span>
          <span class="token directive"><span class="token keyword">proxy_set_header</span>   Host    <span class="token variable">$host</span></span><span class="token punctuation">;</span>
          <span class="token directive"><span class="token keyword">proxy_set_header</span>   X-Real-IP   <span class="token variable">$remote_addr</span></span><span class="token punctuation">;</span>
          <span class="token directive"><span class="token keyword">proxy_set_header</span>   X-Forwarded-For <span class="token variable">$proxy_add_x_forwarded_for</span></span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span>
        <span class="token directive"><span class="token keyword">listen</span>       <span class="token number">80</span></span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">server_name</span>  www.google.cn google.cn</span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">location</span> /</span> <span class="token punctuation">{</span>
          <span class="token directive"><span class="token keyword">proxy_pass</span> http://google</span><span class="token punctuation">;</span>
          <span class="token directive"><span class="token keyword">proxy_set_header</span>   Host    <span class="token variable">$host</span></span><span class="token punctuation">;</span>
          <span class="token directive"><span class="token keyword">proxy_set_header</span>   X-Real-IP   <span class="token variable">$remote_addr</span></span><span class="token punctuation">;</span>
          <span class="token directive"><span class="token keyword">proxy_set_header</span>   X-Forwarded-For <span class="token variable">$proxy_add_x_forwarded_for</span></span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span>
        <span class="token directive"><span class="token keyword">listen</span>       <span class="token number">80</span></span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">server_name</span>  localhost</span><span class="token punctuation">;</span>

        <span class="token comment">#charset koi8-r;</span>

        <span class="token comment">#access_log  logs/host.access.log  main;</span>

        <span class="token directive"><span class="token keyword">location</span> /</span> <span class="token punctuation">{</span>
            <span class="token directive"><span class="token keyword">root</span>   html</span><span class="token punctuation">;</span>
            <span class="token directive"><span class="token keyword">index</span>  index.html index.htm</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
 
        <span class="token directive"><span class="token keyword">error_page</span>   <span class="token number">500</span> <span class="token number">502</span> <span class="token number">503</span> <span class="token number">504</span>  /50x.html</span><span class="token punctuation">;</span>
        <span class="token directive"><span class="token keyword">location</span> = /50x.html</span> <span class="token punctuation">{</span>
            <span class="token directive"><span class="token keyword">root</span>   html</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

    <span class="token punctuation">}</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><br><h3 id="为nginx配置ssl" tabindex="-1"><a class="header-anchor" href="#为nginx配置ssl" aria-hidden="true">#</a> <span id="sslpeizhi">为nginx配置ssl</span></h3><ol><li><p><strong>首先确定nginx安装位置</strong></p><p>例如：我的安装在<code> /usr/local/nginx </code> ，进入<code>sbin</code>目录，查看当前是否已配置</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code> ./usr/local/nginx/sbin/nginx <span class="token parameter variable">-V</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>结果如下图，若<code>configure arguments</code>已配置ssl，则跳过下面的步骤。</p></li></ol><p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/NginxAndTomcatConfigSSL2.png" alt="NginxAndTomcatConfigSSL2"></p><ol start="2"><li><p><strong>configure配置，重新编译</strong></p><p>进入安装文件的根目录，不是nginx根目录，在下载的压缩文件解压后的根目录</p><p>下面命令行中<code>/usr/local/nginx</code>则是安装目录。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>./configure <span class="token parameter variable">--prefix</span><span class="token operator">=</span>/usr/local/nginx --with-http_stub_status_module --with-http_ssl_module
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>然后编译，不需要<code>make install</code>否则会覆盖原有配置</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">make</span> 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li><li><p><strong>关闭nginx，复制配置文件</strong></p><p>首先关闭nginx</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>./usr/local/nginx/sbin/nginx <span class="token parameter variable">-s</span> stop
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>然后将编译生成的文件，拷贝到安装文件夹</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token function">cp</span> objs/nginx /usr/local/nginx/sbin/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这个时候可能会提示是否覆盖，按<code>y</code>然后回车</p></li><li><p><strong>查看配置，重启</strong></p><p>最后查看配置。启动nginx</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code> ./usr/local/nginx/sbin/nginx -V
 ./usr/local/nginx/sbin/nginx -s start
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><br><h3 id="在阿里云申请ssl证书" tabindex="-1"><a class="header-anchor" href="#在阿里云申请ssl证书" aria-hidden="true">#</a> <span id="sslgoumai">在阿里云申请SSL证书</span></h3><ol><li><p><strong>购买免费证书</strong></p><p>在阿里云直接搜索 SSL证书 ，购买证书，如下图。直接付款购买。</p></li></ol><p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/NginxAndTomcatConfigSSL1.png" alt="NginxAndTomcatConfigSSL1"></p><ol start="2"><li><p><strong>申请证书，添加DNS解析</strong></p><p>在证书管理页面，填写信息，域名只能是单域名（毕竟免费）。</p><p>这里的DNS验证，如果域名在当前阿里云账号下，则可以选择自动DNS验证，阿里云帮你直接生成解析记录，若不在阿里云，就要去手动添加解析记录。点击验证，验证成功，提交审核，审核完后会生成证书文件</p><p>解析方式如下图</p></li></ol><p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/NginxAndTomcatConfigSSL3.png" alt="NginxAndTomcatConfigSSL3"></p><p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/NginxAndTomcatConfigSSL4.png" alt="NginxAndTomcatConfigSSL4"></p><ol start="3"><li><p><strong>下载证书</strong></p><p>证书文件生成大约需要10多分钟。</p><p>生成后下载 Tomcat 和 Nginx 两种。</p><p>证书生成后，解析可以删掉。</p></li></ol><h3 id="证书配置" tabindex="-1"><a class="header-anchor" href="#证书配置" aria-hidden="true">#</a> <span id="sslanzhaung">证书配置</span></h3><ol><li><p><strong><span id="tomcat">tomcat配置</span></strong></p><p>都是技术人员，就不多讲了。</p><p>https默认的443端口在nginx进行监听，所以，这里使用了8443端口，加了<code>URIEncoding</code>防止乱码</p><p><code>keystoreFile</code>和<code>keystorePass</code>两个属性是需要配置的，把文件传到服务器，然后指定目录就行。</p><p>记得别忘防火墙开放端口</p><div class="language-xml line-numbers-mode" data-ext="xml"><pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Connector</span> <span class="token attr-name">URIEncoding</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>UTF-8<span class="token punctuation">&quot;</span></span> <span class="token attr-name">port</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>8443<span class="token punctuation">&quot;</span></span> <span class="token attr-name">protocol</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>HTTP/1.1<span class="token punctuation">&quot;</span></span> 
           <span class="token attr-name">SSLEnabled</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>true<span class="token punctuation">&quot;</span></span> <span class="token attr-name">scheme</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>https<span class="token punctuation">&quot;</span></span> <span class="token attr-name">secure</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>true<span class="token punctuation">&quot;</span></span>
           <span class="token attr-name">keystoreFile</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>cert/cert-xxxxxxxx_XXXXXXXXXX.pfx<span class="token punctuation">&quot;</span></span>
           <span class="token attr-name">keystoreType</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>PKCS12<span class="token punctuation">&quot;</span></span>  <span class="token attr-name">keystorePass</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>6h7t7R0B<span class="token punctuation">&quot;</span></span>
           <span class="token attr-name">clientAuth</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>false<span class="token punctuation">&quot;</span></span>  <span class="token attr-name">SSLProtocol</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>TLSv1+TLSv1.1+TLSv1.2<span class="token punctuation">&quot;</span></span>
  <span class="token attr-name">ciphers</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>TLS_RSA_WITH_AES_128_CBC_SHA,TLS_RSA_WITH_AES_256_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA,TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256,TLS_RSA_WITH_AES_128_CBC_SHA256,TLS_RSA_WITH_AES_256_CBC_SHA256<span class="token punctuation">&quot;</span></span><span class="token punctuation">/&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li><li><p><strong><span id="nginx">nginx配置</span></strong></p><p>这里也一样，完整的就不贴了，可以去我上一篇nginx安装里找完整的。</p><p>把两个证书文件传到<code>nginx conf</code>的同级目录，修改<code>ssl_certificate</code> 和<code>ssl_certificate_key</code></p><p>把<code>server_name</code>后面的域名改为你的，ip端口换一下，然后重启nginx就完事。</p><p>这个监听的是https 443端口，不影响http的正常使用。</p><div class="language-nginx line-numbers-mode" data-ext="nginx"><pre class="language-nginx"><code><span class="token directive"><span class="token keyword">upstream</span> httpsPro</span> <span class="token punctuation">{</span>
        <span class="token directive"><span class="token keyword">server</span> 47.121.65.85:8443</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

<span class="token directive"><span class="token keyword">server</span></span> <span class="token punctuation">{</span>
	<span class="token directive"><span class="token keyword">listen</span> <span class="token number">443</span></span><span class="token punctuation">;</span>
	<span class="token directive"><span class="token keyword">server_name</span> www.baidu.com</span><span class="token punctuation">;</span>
	<span class="token directive"><span class="token keyword">ssl</span> <span class="token boolean">on</span></span><span class="token punctuation">;</span>
	
	<span class="token directive"><span class="token keyword">ssl_certificate</span>   cert-xxxxxxxxx_XXXXXXXXXXXX.crt</span><span class="token punctuation">;</span>
	<span class="token directive"><span class="token keyword">ssl_certificate_key</span>  cert-xxxxxxxxx_XXXXXXXXXXXX.key</span><span class="token punctuation">;</span>
	<span class="token directive"><span class="token keyword">ssl_session_timeout</span> <span class="token number">5m</span></span><span class="token punctuation">;</span>
	<span class="token directive"><span class="token keyword">ssl_ciphers</span> ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4</span><span class="token punctuation">;</span>
	<span class="token directive"><span class="token keyword">ssl_protocols</span> TLSv1 TLSv1.1 TLSv1.2</span><span class="token punctuation">;</span>
	<span class="token directive"><span class="token keyword">ssl_prefer_server_ciphers</span> <span class="token boolean">on</span></span><span class="token punctuation">;</span>
	
	<span class="token directive"><span class="token keyword">location</span> /</span> <span class="token punctuation">{</span>
		<span class="token directive"><span class="token keyword">proxy_pass</span> https://httpsPro</span><span class="token punctuation">;</span>
		<span class="token directive"><span class="token keyword">proxy_ignore_headers</span>   Expires Cache-Control</span><span class="token punctuation">;</span>
		<span class="token directive"><span class="token keyword">proxy_set_header</span>   Host    <span class="token variable">$host</span></span><span class="token punctuation">;</span>
		<span class="token directive"><span class="token keyword">proxy_set_header</span>   X-Real-IP   <span class="token variable">$remote_addr</span></span><span class="token punctuation">;</span>
		<span class="token directive"><span class="token keyword">proxy_set_header</span>   X-Forwarded-For <span class="token variable">$proxy_add_x_forwarded_for</span></span><span class="token punctuation">;</span>
		<span class="token directive"><span class="token keyword">proxy_set_header</span>        X-Forwarded-Proto <span class="token variable">$scheme</span></span><span class="token punctuation">;</span>
	<span class="token punctuation">}</span>
    <span class="token punctuation">}</span>	
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol>`,71),p=[i];function l(c,o){return s(),a("div",null,p)}const r=n(t,[["render",l],["__file","NginxBindPortWithDomain.html.vue"]]);export{r as default};