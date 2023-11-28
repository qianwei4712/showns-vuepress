## 路的尽头在哪

<div style="text-align:center">

![logo](/docs/.vuepress/public/img/favicon.ico)

</div>

<span style="font-weight:bold;font-size:18px">
<a href="https://qianwei4712.gitee.io/showns-vuepress/chest/" target="_blank">链接：路的尽头在哪</a>
</span>

## 当前部署方式

部署在 Gitee Pages，本仓库的 `release` 分支

步骤如下：

1. 先编译打包到 dist 文件夹，再建一个 release，到时候用来上传

> pnpm run docs:build
> cd docs/.vuepress/dist
> mkdir release

2. 因为编译的时候，会删除原来的文件夹，所以要重新初始化 git 仓库

> git init
> git remote add origin https://gitee.com/qianwei4712/showns-vuepress.git
> git pull origin release

3. 把原来的仓库拉下来全删掉，把新的复制进去上传

> git rm -rf .
> git clean -fdx
> git add .
> git commit --allow-empty -m "v1.2.1"
> git branch release
> git checkout release
> git push origin release

## 发展历程等废话

1. 起因是 2019 受到 **@pdai** 大佬的启发，写了一个简单的静态博客
2. 19-22 年，陆续在上面添加了上百篇学记笔记和踩坑的记录，后来比较忙么时间搞了
3. 到 2023 年发现，那个站太简陋了，所以打算重新搞一个。就有了本仓库

> 历史仓库，19-22 年的 原始文档上传仓库入口：[旧版本，Gitee 仓库地址](https://gitee.com/qianwei4712/showns)
