<div class="catalog">

- [Jmeter 压力测试](#jmeter)
- [参考文章](#te)


</div>


## <span id="jmeter">Jmeter 压力测试</span>

1. 下载软件：[Apache JMeter - Download Apache JMeter](http://jmeter.apache.org/download_jmeter.cgi)

![image-20211027000237872](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211027000237872.png)

2. Windows 下解压，直接启动 bin 目录下的 `jmeter.bat` ，即可打开 GUI 界面。
3. 新建一个线程组测试，配置线程请求信息。

![image-20211027001206148](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211027001206148.png)

![image-20211027001651071](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211027001651071.png)



<br/>

4. 添加默认 Request 配置，主要是 IP 端口。

![image-20211027001430828](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211027001430828.png)

![image-20211027001952231](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211027001952231.png)



<br/>

5. 再添加要请求的地址

![image-20211027001934955](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211027001934955.png)

![image-20211027002226027](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211027002226027.png)





<br/>

6. **新增监听器，用于查看压测结果**。这里添加三种：聚合报告、图形结果、用表格查看结果，区别在于结果展现形式不同。

![image-20211027002338026](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211027002338026.png)















<br/>






<br/>

## <span id="te">参考文章</span>

[Jmeter教程(一) - 入门_淡淡的说非-CSDN博客_jmeter](https://blog.csdn.net/yaorongke/article/details/82799609)

[道普云-Fortify WebInspect-Web应用安全测试报告功能演示_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1PV411b7KT)

[软件测试丨安全渗透测试web应用服务器安全_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1wC4y1Y7yX)
