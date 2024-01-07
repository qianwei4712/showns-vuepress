**清理 buff/cache 缓存**

> sync;echo 3 > /proc/sys/vm/drop_caches

**du 显示当前目录下文件夹大小总和，不遍历子目录**

> du -lh --max-depth=1

**nohup 不输出日志**

> nohup java -jar service.jar >/dev/null 2>&1 &

**netstat 查看网络状况**

> netstat -nat|grep -i "80"|wc -l #统计 80 端口连接数
>
> netstat -a #列出所有端口
>
> netstat -ap #列出在端口上运行的程序

**find 查找**

> find / -type f -size +50M | xargs du -h|sort -n #查找 50M 以上的文件

**grep 查询文件内容**

> grep '收到 MQ 消息:' /var/log/app.log

**history 添加命令执行人和时间**

> export HISTTIMEFORMAT="`whoami` : | %F | %T: | "

**lsof 查看端口被占用**

> lsof -i:8080

**last 显示用户最近登录信息**

> last -10

**CUP 占用前 10 排序**

> ps -eo user,pid,pcpu,pmem,args --sort=-pcpu |head -n 10

**内存占用前 10 排序**

> ps -eo user,pid,pcpu,pmem,args --sort=-pcpu |head -n 10
