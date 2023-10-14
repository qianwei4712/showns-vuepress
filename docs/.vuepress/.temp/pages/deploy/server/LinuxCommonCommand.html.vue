<template><div><p><strong>清理 buff/cache 缓存</strong></p>
<blockquote>
<p>sync;echo 3 &gt; /proc/sys/vm/drop_caches</p>
</blockquote>
<p><strong>du 显示当前目录下文件夹大小总和，不遍历子目录</strong></p>
<blockquote>
<p>du  -lh  --max-depth=1</p>
</blockquote>
<p><strong>nohup 不输出日志</strong></p>
<blockquote>
<p>nohup java -jar service.jar &gt;/dev/null 2&gt;&amp;1 &amp;</p>
</blockquote>
<p><strong>netstat 查看网络状况</strong></p>
<blockquote>
<p>netstat -nat|grep -i &quot;80&quot;|wc -l      #统计80端口连接数</p>
<p>netstat -a      #列出所有端口</p>
<p>netstat -ap    #列出在端口上运行的程序</p>
</blockquote>
<p><strong>find 查找</strong></p>
<blockquote>
<p>find / -type f -size +50M | xargs du -h|sort -n   #查找50M以上的文件</p>
</blockquote>
<p><strong>grep 查询文件内容</strong></p>
<blockquote>
<p>grep '收到MQ消息:' /var/log/app.log</p>
</blockquote>
<p><strong>history 添加命令执行人和时间</strong></p>
<blockquote>
<p>export HISTTIMEFORMAT=&quot;<code v-pre>whoami</code> : | %F | %T: | &quot;</p>
</blockquote>
<p><strong>lsof 查看端口被占用</strong></p>
<blockquote>
<p>lsof -i:8080</p>
</blockquote>
<p><strong>last 显示用户最近登录信息</strong></p>
<blockquote>
<p>last  -10</p>
</blockquote>
</div></template>


