从下面文件中挑选了几个常用的

- [250 个拿来即用 shell 脚本.pdf](https://gitee.com/pic_bed_of_shiva/static-resources/raw/6e5fad6bfaca8b9f4190e1376f7e70f763389d8f/showns/file/【强推】250个拿来即用shell脚本.pdf)

### MySQL 数据库备份单循环

> 每天自动保存数据库的全部数据，并且已数据库名进行命名；
>
> 最长保存时间为 15 天。

```shell

#!/bin/bash
DATE=$(date +%F_%H-%M-%S)
BACKUP_DIR="/data/db_backup/$(date +%F)"
HOST="localhost"
USER="backup"
PASS="123.com"
DB_LIST=$(mysql -h$HOST -u$USER -p$PASS -s -e "show databases;" 2>/dev/null | egrep -v "Database|information_schema|mysql|performance_schema|sys")

# Create backup directory for the current date
mkdir -p $BACKUP_DIR

# Backup databases and save in the current date's directory
for DB in $DB_LIST; do
    BACKUP_NAME="$BACKUP_DIR/${DB}_${DATE}.sql"
    if ! mysqldump -h$HOST -u$USER -p$PASS -B $DB >$BACKUP_NAME 2>/dev/null; then
        echo "$BACKUP_NAME 备份失败!"
    fi
done

# Delete directories older than 15 days
find /data/db_backup/* -maxdepth 0 -type d -mtime +15 -exec rm -r {} \;
```

### Nginx 访问日志分析脚本

```shell
#!/bin/bash
# 日志格式: $remote_addr - $remote_user [$time_local] "$request" $status
$body_bytes_sent "$http_referer" "$http_user_agent" "$http_x_forwarded_for"
LOG_FILE=$1
echo "统计访问最多的10个IP"
awk '{a[$1]++}END{print "UV:",length(a);for(v in a)print v,a[v]}' $LOG_FILE | sort
-k2 -nr | head -10
echo "----------------------"

echo "统计时间段访问最多的IP"
awk '$4>="[01/Dec/2018:13:20:25" && $4<="[27/Nov/2018:16:20:49"{a[$1]++}END{for(v
in a)print v,a[v]}' $LOG_FILE | sort -k2 -nr | head -10
echo "----------------------"

echo "统计访问最多的10个页面"
awk '{a[$7]++}END{print "PV:",length(a);for(v in a){if(a[v]>10)print v,a[v]}}'
$LOG_FILE | sort -k2 -nr
echo "----------------------"

echo "统计访问页面状态码数量"
awk '{a[$7" "$9]++}END{for(v in a){if(a[v]>5)print v,a[v]}}'
```

### DOS 攻击防范（自动屏蔽攻击 IP）

```shell
#!/bin/bash
DATE=$(date +%d/%b/%Y:%H:%M)
#nginx日志
LOG_FILE=/usr/local/nginx/logs/demo2.access.log
#分析ip的访问情况
ABNORMAL_IP=$(tail -n5000 $LOG_FILE | grep $DATE | awk '{a[$1]++}END{for(i in
a)if(a[i]>10)print i}')
for IP in $ABNORMAL_IP; do
	if [ $(iptables -vnL | grep -c "$IP") -eq 0 ]; then
		iptables -I INPUT -s $IP -j DROP
		echo "$(date +'%F_%T') $IP" >>/tmp/drop_ip.log
	fi
done
```

### 批量检测网站是否异常并邮件通知

```shell
#!/bin/bash
URL_LIST="www.baidu.com www.ctnrs.com www.der-matech.net.cn www.der-matech.com.cn www.der-matech.cn www.der-matech.top www.der-matech.org"
for URL in $URL_LIST; do
	FAIL_COUNT=0
	for ((i = 1; i <= 3; i++)); do
		HTTP_CODE=$(
			curl -o /dev/null --connect-timeout 3 -s -w "%{http_code}"
			$URL
		)
		if [ $HTTP_CODE -eq 200 ]; then
			echo "$URL OK"
			break
		else
			echo "$URL retry $FAIL_COUNT"
			let FAIL_COUNT++
		fi
	done
	if [ $FAIL_COUNT -eq 3 ]; then
		echo "Warning: $URL Access failure!"
		echo "网站$URL坏掉，请及时处理" | mail -s "$URL网站高危" 506230116@qq.com
	fi
done

```

### 定时清空文件内容，定时记录文件大小

> 每小时执行一次脚本（任务计划），当时间为 0 点或 12 点时，将目标目录下的所有文件内#容清空，但不删除文件，其他时间则只统计各个文件的大小
>
> 一个文件一行，输出到以时#间和日期命名的文件中，需要考虑目标目录下二级、三级等子目录的文件

```shell
#!/bin/bash

logfile=/tmp/$(date +%H-%F).log
n=$(date +%H)
if [ $n -eq 00 ] || [ $n -eq 12 ]; then
	#通过for循环，以find命令作为遍历条件，将目标目录下的所有文件进行遍历并做相应操作
	for i in $(find /data/log/ -type f); do
		true >$i
	done
else
	for i in $(find /data/log/ -type f); do
		du -sh $i >>$logfile
	done
fi

```

### 扫描主机端口状态

```shell
#!/bin/bash
HOST=$1
PORT="22 25 80 8080"
for PORT in $PORT; do
	if echo &>/dev/null >/dev/tcp/$HOST/$PORT; then
		echo "$PORT open"
	else
		echo "$PORT close"
	fi
done

```

### 监控主机的磁盘空间

> 当使用空间超过 90％，就通过发 mail 来发警告

```shell
#!/bin/bash
#monitor available disk space
#提取本服务器的IP地址信息
IP=$(ifconfig eth0 | grep "inet addr" | cut -f 2 -d ":" | cut -f 1 -d " ")
SPACE=$(df -hP | awk '{print int($5)}')
if [ $SPACE -ge 90 ]; then
	echo "$IP 服务器 磁盘空间 使用率已经超过90%，请及时处理。" | mail -s "$IP 服务器硬盘告警" mail@163.com
fi
```

### http 心跳检测

```shell
URL="http://192.168.22.191/index.html"
THHP_CODE=$(curl -o /dev/null -s -w "%{http_code}" "${URL}")
if [ $HTTP_CODE != 200 ]; then
	echo -e "apache code:"$HTTP_CODE""
fi
```
