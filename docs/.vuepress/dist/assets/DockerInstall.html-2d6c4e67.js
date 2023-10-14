import{_ as t,o as a,c as e,f as s}from"./app-36b09dbd.js";const n={},d=s(`<div class="catalog"><ul><li><a href="#t1">安装docker</a></li><li><a href="#t2">更改国内镜像源</a></li><li><a href="#t3">镜像操作</a></li><li><a href="#t4">容器操作</a></li><li><a href="#t5">docker hub</a></li><li><a href="#t6">常用命令</a></li><li><a href="#te">参考文章</a></li></ul></div><h3 id="安装docker" tabindex="-1"><a class="header-anchor" href="#安装docker" aria-hidden="true">#</a> <span id="t1">安装docker</span></h3><ol><li>先安装依赖，设置软件源</li></ol><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>yum update
yum <span class="token function">install</span> <span class="token parameter variable">-y</span> yum-utils device-mapper-persistent-data lvm2
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>下载安装docker</li></ol><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>yum clean all
yum makecache fast
yum <span class="token parameter variable">-y</span> <span class="token function">install</span> docker-ce
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="3"><li>启动docker服务，设置开机启动，查看版本</li></ol><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>systemctl start <span class="token function">docker</span>
systemctl <span class="token builtin class-name">enable</span> <span class="token function">docker</span>
<span class="token function">docker</span> version
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当看到 <code>Client</code> 和 <code>Server</code> 两部分时，说明安装成功。</p><br><h3 id="更改国内镜像源" tabindex="-1"><a class="header-anchor" href="#更改国内镜像源" aria-hidden="true">#</a> <span id="t2">更改国内镜像源</span></h3><p>docker 镜像搜索可以前往：<a href="https://hub.docker.com/" target="_blank">https://hub.docker.com/</a></p><p>但是这个镜像仓库和 maven 仓库一样下载较慢，先配置为国内镜像，修改配置：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code> <span class="token function">vim</span> /etc/docker/daemon.json
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>改为如下配置：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">{</span>
  <span class="token string">&quot;registry-mirrors&quot;</span><span class="token builtin class-name">:</span> <span class="token punctuation">[</span>
     <span class="token string">&quot;https://registry.docker-cn.com&quot;</span>,
     <span class="token string">&quot;http://hub-mirror.c.163.com&quot;</span>,
     <span class="token string">&quot;https://docker.mirrors.ustc.edu.cn&quot;</span>,
     <span class="token string">&quot;http://hub-mirror.c.163.com&quot;</span>
   <span class="token punctuation">]</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后，加载Docker配置 ，重启Docker服务</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>systemctl daemon-reload
systemctl restart docker.service
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><br><h3 id="镜像操作" tabindex="-1"><a class="header-anchor" href="#镜像操作" aria-hidden="true">#</a> <span id="t3">镜像操作</span></h3><table><thead><tr><th><strong>操作</strong></th><th><strong>命令</strong></th><th><strong>举例</strong></th><th><strong>说明</strong></th></tr></thead><tbody><tr><td>检索</td><td>docker search 关键字</td><td>docker search tomcat</td><td>去docker hub上检索镜像的详细信息，如镜像的Tag</td></tr><tr><td>拉取</td><td>docker pull 镜像名:tag</td><td>docker pull tomcat</td><td>:tag是可选的，tag表示版本标签，多为软件的版本，默认是latest</td></tr><tr><td>列表</td><td>docker images [-a]</td><td>docker images</td><td>查看所有本地镜像</td></tr><tr><td>删除</td><td>docker rmi 镜像id <br> docker rmi 镜像名:tag</td><td>docker rmi 7b8b75c878d4</td><td>删除id为7b8b75c878d4的本地镜像</td></tr><tr><td>创建镜像</td><td>docker commit [容器id]</td><td>docker commit -a shiva 9aa80af66c55</td><td><strong>-a：<strong>作者名；</strong>-c：</strong> 使用Dockerfile指令来创建镜像 ；<strong>-m：</strong> 提交信息； <strong>-p ：</strong> 在commit时，将容器暂停。</td></tr></tbody></table><br><h3 id="容器操作" tabindex="-1"><a class="header-anchor" href="#容器操作" aria-hidden="true">#</a> <span id="t4">容器操作</span></h3><table><thead><tr><th><strong>操作</strong></th><th><strong>命令</strong></th></tr></thead><tbody><tr><td>根据镜像创建并启动容器(没有端口映射)</td><td>docker run --name mytomcat1 -d tomcat:latest</td></tr><tr><td>查看运行中的容器</td><td>docker ps</td></tr><tr><td>查看所有的容器</td><td>docker ps -a</td></tr><tr><td>停止运行中的容器</td><td>docker stop 容器id或容器名</td></tr><tr><td>启动容器</td><td>docker start 容器id或容器名</td></tr><tr><td>删除容器</td><td>docker rm 容器id或容器名</td></tr><tr><td>根据镜像创建并启动做了端口映射的容器</td><td>docker run --name mytomcat2 -d -p 8888:8080 tomcat <br>#说明：-d后台运行<br>-p将主机的端口映射到容器的一个端口。 主机端口：容器内部的端口</td></tr><tr><td>进入容器内部</td><td>docker exec -it 容器id或容器名 /bin/bash <br> #说明：-it参数：容器的 Shell 映射到当前的 Shell，然后你在本机窗口输入的命令，就会传入容器。<br> /bin/bash：容器启动以后，内部第一个执行的命令。这里是启动 Bash，保证用户可以使用 Shell。</td></tr><tr><td>查看容器的日志</td><td>docker logs 容器名或者容器id</td></tr></tbody></table><p>容器操作常用的其实也就2个命令，创建容器具体参数如下：</p><p><strong>创建容器</strong></p><blockquote><p>语法：docker run [OPTIONS] IMAGE [COMMAND][ARG...]</p><p>例如：docker run -itd --name ds1 -p 44400:22 -p 44403:8081 8ffb01469aba</p></blockquote><p><strong>docker run 参数如下：</strong></p><ul><li>-t: 为容器重新分配一个伪输入终端，通常与 -i 同时使用</li><li>-i: 以交互模式运行容器，通常与 -t 同时使用</li><li>-d: 后台运行容器，并返回容器ID</li><li>--name: 为容器指定一个名称</li><li>-p: 端口映射，格式为：主机(宿主)端口:容器端口</li><li>-v: 挂载宿主机文件夹，格式为： 宿主机文件夹：容器文件夹</li><li>--link: 添加链接到另一个容器</li><li>-m: 设置容器使用内存最大值；</li></ul><p><strong>进入容器</strong></p><blockquote><p>语法： docker exec -it 容器id或容器名 /bin/bash</p></blockquote><p><code>docker attach 容器id或容器名</code> 也能进入容器，不过退出后，也随之停止容器。</p><br><h3 id="docker-hub" tabindex="-1"><a class="header-anchor" href="#docker-hub" aria-hidden="true">#</a> <span id="t5">docker hub</span></h3><p>创建一个仓库，因为我这里只是上传一些基础镜像，弄个基础 public 的仓库就行。</p><p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20210923192909298.png" alt="image-20210923192909298"></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 登陆，输入账号密码</span>
<span class="token function">docker</span> login
<span class="token comment"># 先将容器提交成镜像，格式为：docker commit &lt;exiting-Container&gt; &lt;hub-user&gt;/&lt;repo-name&gt;[:&lt;tag&gt;]</span>
<span class="token function">docker</span> commit <span class="token parameter variable">-a</span> <span class="token string">&quot;shiva&lt;qianwei4712@163.com&gt;&quot;</span> 58ee1d5fb9aa openjdk8-yz:latest
<span class="token comment"># 重新打 tag，可以重命名，格式为：docker tag &lt;existing-image&gt; &lt;hub-user&gt;/&lt;repo-name&gt;[:&lt;tag&gt;]</span>
<span class="token function">docker</span> tag openjdk8-yz:latest shivashow/yz:jdk8
<span class="token comment"># 将打完 tag 的镜像上传，格式：docker push &lt;hub-user&gt;/&lt;repo-name&gt;:&lt;tag&gt;</span>
<span class="token function">docker</span> push shivashow/yz:jdk8
<span class="token comment"># 上传成功的镜像可以拉去了</span>
<span class="token function">docker</span> pull shivashow/yz:jdk8
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20210923194352816.png" alt="image-20210923194352816"></p><br><h3 id="常用命令" tabindex="-1"><a class="header-anchor" href="#常用命令" aria-hidden="true">#</a> <span id="t6">常用命令</span></h3><ul><li>批量删除 none 镜像 ： <code>docker images | grep none | awk &#39;{print $3}&#39; | xargs docker rmi</code></li></ul><br><h3 id="参考文章" tabindex="-1"><a class="header-anchor" href="#参考文章" aria-hidden="true">#</a> <span id="te">参考文章</span></h3><p><a href="https://baijiahao.baidu.com/s?id=1626633654476933953" target="_blank">https://baijiahao.baidu.com/s?id=1626633654476933953</a></p><p><a href="https://blog.csdn.net/liqun_super/article/details/88304094" target="_blank">https://blog.csdn.net/liqun_super/article/details/88304094</a></p><p><a href="https://www.cnblogs.com/wzz2500/p/11437820.html" target="_blank">https://www.cnblogs.com/wzz2500/p/11437820.html</a></p><p><a href="https://www.cnblogs.com/luoposhanchenpingan/p/11285392.html" target="_blank">https://www.cnblogs.com/luoposhanchenpingan/p/11285392.html</a></p><p><a href="https://www.cnblogs.com/scajy/p/11934144.html" target="_blank">https://www.cnblogs.com/scajy/p/11934144.html</a></p><p><a href="https://www.cnblogs.com/zlgxzswjy/p/10560058.html" target="_blank">https://www.cnblogs.com/zlgxzswjy/p/10560058.html</a></p><p><a href="https://my.oschina.net/lwenhao/blog/2086037" target="_blank">https://my.oschina.net/lwenhao/blog/2086037</a></p><p><a href="https://www.cnblogs.com/ruanqj/p/7374544.html" target="_blank">https://www.cnblogs.com/ruanqj/p/7374544.html</a></p>`,51),r=[d];function i(l,c){return a(),e("div",null,r)}const p=t(n,[["render",i],["__file","DockerInstall.html.vue"]]);export{p as default};
