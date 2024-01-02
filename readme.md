## 路的尽头在哪

<div style="text-align: center;">

![logo](/docs/.vuepress/public/img/favicon.ico)

</div>

<span style="font-weight:bold;font-size:18px">
<a href="https://qianwei4712.gitee.io/showns-vuepress/chest/" target="_blank">链接：路的尽头在哪</a>
</span>

## 当前部署方式 1 : vercel 静态服务器

[Vercel.com](https://Vercel.com) 提供了一种简单而高效的方式来部署静态网站。它可以自动化部署 Github 仓库项目，而且它是免费的（海外服务器还不用备案）

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20240102230028.png)

## 当前部署方式 2 : Gitee Pages

部署在 Gitee Pages，本仓库的 `release` 分支

步骤如下（在 VS code 命令行环境下）：

> 在打包之前先把 config.js 中的 base、head 参数，添加 `/showns-vuepress` 路径；
>
> 因为在 Github 上是根目录发布；在 Gitee Pages 里需要再加个子路径

1. 先编译打包到 dist 文件夹，再建一个 release，到时候用来上传

```shell
pnpm run docs:build
cd docs/.vuepress/dist
mkdir release
cd release
```

2. 因为编译的时候，会删除原来的文件夹，所以要重新初始化 git 仓库

```shell
git init
git remote add origin https://gitee.com/qianwei4712/showns-vuepress.git
git pull origin release
```

3. 把原来的仓库拉下来全删掉，把新的复制进去上传

```shell
git rm -rf .
git clean -fdx
cd ..
Get-ChildItem -Exclude release | Move-Item -Destination .\release\
cd release
git add .
git commit --allow-empty -m "v1.2.1"
git branch release
git checkout release
git push origin release
```

## 发展历程等废话

1. 起因是 2019 受到 **@pdai** 大佬的启发，写了一个简单的静态博客
2. 19-22 年，陆续在上面添加了上百篇学记笔记和踩坑的记录，后来比较忙么时间搞了
3. 到 2023 年发现，那个站太简陋了，所以打算重新搞一个。就有了本仓库

> 历史仓库，19-22 年的 原始文档上传仓库入口：[旧版本，Gitee 仓库地址](https://gitee.com/qianwei4712/showns)
