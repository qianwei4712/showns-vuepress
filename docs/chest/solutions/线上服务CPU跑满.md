### 起因

*2022.01.14*

用户反馈系统卡，还出现过一次宕机。

然后我等到一次问题，上服务器一看发现：

> **CPU 跑满，100%，内存稳定。**

首先排除场景问题：

- 磁盘空间没有满
- 数据库连接正常

<br/>

### 问题排查

**首先看占用 CPU 的进程，确定是不是CPU跑满：**

```shell
top
```

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220126142132175.png)

定位到了哪个服务占用 CPU，进程编号为 16625.

<br/>

**然后看日志文件，检查下有没有报错**

但是没看出什么东西，除了数据库、MQ 连接断开，没有其他有用信息。

<br/>

**再看是哪个线程占用了 CPU 资源：**

```shell
 top -Hp 16625
```

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220126144717567.png)

可以看到，16627、16628 两个线程占了很高的 CPU.

<br/>

**jstack 检查下进程是不是进入死循环。**

先将10进制 tid，改为 16进制：

```shell
 printf "%x\n" 16627
 40f3
```

然后打印堆栈信息：

```shell
 jstack 16625 | grep '0x40f3' -C5 --color 
```

```
"GC task thread#0 (ParallelGC)" os_prio=0 tid=0x00007fbdb401e800 nid=0x40f3 runnable 
```

打印结果没有异常。。如果存在异常会出现类似：

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220126154025205.png)

<br/>

### 继续分析

按理说，没有死循环；并且发生 **OutOfMemoryError:java heap space**

那就是某个功能产生了大量计算，创建了大量的对象，导致溢出。

> JDK 8 堆区分为：新生代、老年代、元空间（Meta）；元空间用堆外内存，不需要考虑。

因为服务是默认运行，所以

> **年轻代+老年代 ，默认最大值为 1G**，默认值为电脑物理内存大小 / 4 ，可以用 `-Xmx` 加大（和 `-Xms` 一起使用配置大小相同，防止循环扩容释放而浪费性能）。
>
> **年轻代和老年代默认占比分配为 1 : 2，默认配置为 `-XX:NewRatio=2` **

所以现在需要定位到是年轻代，还是老年代空间不足。或者奢侈点一起加大。

-----

**jstat 打印**

其次，可以继续监控下 GC，持续打印 GC情况

```shell
jstat -gc 16625 5000
```

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220126162904119.png)

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220126165256484.png)

参数说明：

```yaml
S0C：第一个幸存区的大小
S1C：第二个幸存区的大小
S0U：第一个幸存区的使用大小
S1U：第二个幸存区的使用大小
EC：伊甸园区的大小
EU：伊甸园区的使用大小
OC：老年代大小
OU：老年代使用大小
MC：方法区大小
MU：方法区使用大小
CCSC:压缩类空间大小
CCSU:压缩类空间使用大小
YGC：年轻代垃圾回收次数
YGCT：年轻代垃圾回收消耗时间
FGC：老年代垃圾回收次数
FGCT：老年代垃圾回收消耗时间
GCT：垃圾回收消耗总时间
```

<br/>

**Jmap 打印**

```shell
jmap -heap 16625
```

输出结果：

```shell
Attaching to process ID 6970, please wait...
Debugger attached successfully.
Server compiler detected.
JVM version is 25.171-b11

using thread-local object allocation.
Parallel GC with 2 thread(s)

Heap Configuration:
   MinHeapFreeRatio         = 0
   MaxHeapFreeRatio         = 100
   MaxHeapSize              = 2147483648 (2048.0MB)
   NewSize                  = 715653120 (682.5MB)
   MaxNewSize               = 715653120 (682.5MB)
   OldSize                  = 1431830528 (1365.5MB)
   NewRatio                 = 2
   SurvivorRatio            = 8
   MetaspaceSize            = 21807104 (20.796875MB)
   CompressedClassSpaceSize = 1073741824 (1024.0MB)
   MaxMetaspaceSize         = 17592186044415 MB
   G1HeapRegionSize         = 0 (0.0MB)

Heap Usage:
PS Young Generation
Eden Space:
   capacity = 628621312 (599.5MB)
   used     = 177183568 (168.9754180908203MB)
   free     = 451437744 (430.5245819091797MB)
   28.18605806352299% used
From Space:
   capacity = 45088768 (43.0MB)
   used     = 7012960 (6.688079833984375MB)
   free     = 38075808 (36.311920166015625MB)
   15.553674032521803% used
To Space:
   capacity = 41943040 (40.0MB)
   used     = 0 (0.0MB)
   free     = 41943040 (40.0MB)
   0.0% used
PS Old Generation
   capacity = 1431830528 (1365.5MB)
   used     = 1090675464 (1040.1491775512695MB)
   free     = 341155064 (325.35082244873047MB)
   76.17350256691832% used

34220 interned Strings occupying 4078864 bytes.
```

> **最后就是导出 dump，用 VisualVM 分析。**



<br/>

### 参考文章

- [踩坑调优，一次cpu引发的调优_奔跑的蜗牛的专栏-CSDN博客](https://blog.csdn.net/zouheliang/article/details/80537571)
- [如何回答“线上CPU100%排查”面试问题 - 程序员大本营 (pianshen.com)](https://www.pianshen.com/article/94531135796/)
- [线上服务器的cpu使用达到100%了，如何排查、定位和解决该问题？ - 梦飞翔up - 博客园 (cnblogs.com)](https://www.cnblogs.com/enchaolee/p/13626563.html)
- [线上机器CPU 100%怎么排查定位解决？_ReStartForTD-CSDN博客](https://blog.csdn.net/wjb_2016/article/details/107050834)
- [JVM 堆(heap)溢出案例 - SegmentFault 思否](https://segmentfault.com/a/1190000019625967)
- [程序CPU占用率飙升，如何定位线程的堆栈信息？_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV125411b72U?from=search&seid=14946171178356872223&spm_id_from=333.337.0.0)
- [jstat -gc pid 查询jvm 状态_浮生若梦l的博客-CSDN博客](https://blog.csdn.net/qq_32784303/article/details/105293631)

