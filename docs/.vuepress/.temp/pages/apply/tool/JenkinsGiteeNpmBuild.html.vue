<template><div><h3 id="概述" tabindex="-1"><a class="header-anchor" href="#概述" aria-hidden="true">#</a> 概述</h3>
<p>因为本次项目涉及接口调试过多，所以弄个持续集成（CI）测试环境。</p>
<p>本次测试使用 Gitee + jenkins 。打包部分先用 npm 做个 build 测试。</p>
<p>预备环境：JDK 、node、git</p>
<br>
<p>先说一个坑，原本图省事，直接通过 docker 安装了 <code v-pre>jenkinsci/blueocean</code> 镜像来安装。</p>
<p>刚开始确实美滋滋，后来到拉代码打包发现，在容器里还怎么打包测试。</p>
<p>所以重新开始。</p>
<br>
<h3 id="jenkins-安装" tabindex="-1"><a class="header-anchor" href="#jenkins-安装" aria-hidden="true">#</a> jenkins 安装</h3>
<p>完整手册看：<a href="https://www.jenkins.io/zh/doc/" target="_blank" rel="noopener noreferrer">Jenkins 用户手册<ExternalLinkIcon/></a></p>
<p>jenkins 下载目录选择自己需要的 war 包：<a href="http://mirrors.jenkins.io/war-stable/" target="_blank" rel="noopener noreferrer">Index of /war-stable<ExternalLinkIcon/></a></p>
<p>上传、设置端口启动：</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">java</span> <span class="token parameter variable">-jar</span> jenkins.war <span class="token parameter variable">--httpPort</span><span class="token operator">=</span><span class="token number">10221</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><br>
<h4 id="初始化" tabindex="-1"><a class="header-anchor" href="#初始化" aria-hidden="true">#</a> 初始化</h4>
<p>浏览器输入 http://IP:10221 打开，进入 jenkins 初始化：</p>
<p><img src="http://shiva.oss-cn-hangzhou.aliyuncs.com/scattered/QQ截图20210828145013.png" alt=""></p>
<p>密码在控制台有输出，也不用去文件里找了：</p>
<p><img src="http://shiva.oss-cn-hangzhou.aliyuncs.com/scattered/QQ截图20210828144958.png" alt=""></p>
<p>jenkins 官方插件下载速度非常慢，先选 <strong><code v-pre>选择插件来安装</code></strong> ，再选 <strong><code v-pre>无</code></strong> ，先跳过后续再装。</p>
<p>也可以使用推荐插件，不过要等个10分钟左右，还会出错。</p>
<p>然后是创建管理员账号，这个自由发挥。 jenkins 有一个默认 admin 账号，密码就是刚刚控制台那个。</p>
<br>
<h4 id="gitee-配置" tabindex="-1"><a class="header-anchor" href="#gitee-配置" aria-hidden="true">#</a> Gitee 配置</h4>
<p>在菜单 Manage jenkins，点击 Manage Plugins，选择 Available 页签。</p>
<p>这里先安装个汉化、再装个 Gitee 插件。</p>
<p>首先在系统配置中，添加 Gitee 令牌：</p>
<p><img src="http://shiva.oss-cn-hangzhou.aliyuncs.com/scattered/QQ截图20210828181652.png" alt=""></p>
<p>在 Gitee 创建一个私人令牌。</p>
<p><img src="http://shiva.oss-cn-hangzhou.aliyuncs.com/scattered/QQ截图20210828181802.png" alt=""></p>
<br>
<h4 id="任务创建" tabindex="-1"><a class="header-anchor" href="#任务创建" aria-hidden="true">#</a> 任务创建</h4>
<p>创建任务，构建一个自由风格的软件项目，主要配置如下：</p>
<p><img src="http://shiva.oss-cn-hangzhou.aliyuncs.com/scattered/QQ截图20210828210951.png" alt=""></p>
<p><img src="http://shiva.oss-cn-hangzhou.aliyuncs.com/scattered/QQ截图20210828182920.png" alt=""></p>
<p><img src="http://shiva.oss-cn-hangzhou.aliyuncs.com/scattered/QQ截图20210828182945.png" alt=""></p>
<p><strong>WebHook 密码和链接需要填写到 Gitee 的仓库配置中</strong></p>
<p><img src="http://shiva.oss-cn-hangzhou.aliyuncs.com/scattered/QQ截图20210828211240.png" alt=""></p>
<p>最后在 <strong>构建、执行shell命令</strong> 填写命令：</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">npm</span> <span class="token function">install</span> <span class="token parameter variable">--registry</span><span class="token operator">=</span>https://registry.npm.taobao.org
<span class="token function">npm</span> run build
<span class="token function">cp</span> <span class="token parameter variable">-rf</span> dist/* /opt/html/showns/
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最后看看测试下就完了。</p>
<br>
<h3 id="参考文章" tabindex="-1"><a class="header-anchor" href="#参考文章" aria-hidden="true">#</a> 参考文章</h3>
<p><a href="https://blog.csdn.net/qq_34272964/article/details/93474659" target="_blank" rel="noopener noreferrer">CentOS7安装Jenkins和卸载_寻找09之夏的博客-CSDN博客_centos jenkins 卸载<ExternalLinkIcon/></a></p>
<p><a href="https://blog.csdn.net/u011477914/article/details/88170074" target="_blank" rel="noopener noreferrer">centos7 Jenkins 安装与卸载_IT小学生-CSDN博客_centos7 jenkins卸载<ExternalLinkIcon/></a></p>
<p><a href="https://blog.csdn.net/qq_34272964/article/details/93747652" target="_blank" rel="noopener noreferrer">Jenkins + Gitee(码云) 实现代码自动化构建_寻找09之夏的博客-CSDN博客<ExternalLinkIcon/></a></p>
<p><a href="https://gitee.com/help/articles/4193#article-header4" target="_blank" rel="noopener noreferrer">Jenkins 插件 - Gitee.com<ExternalLinkIcon/></a></p>
<p><a href="https://www.cnblogs.com/wfd360/p/11314697.html" target="_blank" rel="noopener noreferrer">Jenkins自动化部署入门详细教程 - java老兵 - 博客园 (cnblogs.com)<ExternalLinkIcon/></a></p>
</div></template>


