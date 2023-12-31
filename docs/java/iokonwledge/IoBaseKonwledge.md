

## 开场废话

`2022.04.01`

作为CRUD 程序员，基本没有关注IO部分，最近接触硬件，再来学一学。

在这之前，先说明下几个概念：同步和异步、阻塞和非阻塞。

**同步和异步：**

- **同步：** 同步就是发起一个调用后，被调用者未处理完请求之前，调用不返回。
- **异步：** 异步就是发起一个调用后，立刻得到被调用者的回应表示已接收到请求，但是被调用者并没有返回结果，此时我们可以处理其他的请求，被调用者通常依靠事件，回调等机制来通知调用者其返回结果。

**阻塞和非阻塞：**

- **阻塞：** 阻塞就是发起一个请求，调用者一直等待请求结果返回，也就是当前线程会被挂起，无法从事其他任务，只有当条件就绪才能继续。
- **非阻塞：** 非阻塞就是发起一个请求，调用者不用一直等着结果返回，可以先去干其他事情。

这里看似很类似，再解释下两组之间的关系。

1. 同步异步是涉及调用方和服务方双方的，
2. 阻塞非阻塞是只涉及到调用方。

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/webp.webp)

<br/>

## Unix 五种 IO 模型



这里还涉及到 5 种 IO 模型，这里随便写一下贴个图，详细的就看大佬们的介绍就行了：



| IO模型                             | 说明                                                         |
| ---------------------------------- | ------------------------------------------------------------ |
| 阻塞I/O（blocking I/O）            | `同步阻塞 IO 模型是最常用的一个模型，也是最简单的模型`。<br/>在linux中，`默认情况下所有的socket都是blocking`。它符合人们最常见的思考逻辑。`阻塞就是进程 "被" 休息, CPU处理其它进程去了`。 |
| 非阻塞I/O （nonblocking I/O）      | `同步非阻塞就是 “每隔一会儿瞄一眼进度条” 的轮询（polling）方式`。<br/>在这种模型中，`设备是以非阻塞的形式打开的`。<br/>这意味着 IO 操作不会立即完成，read 操作可能会返回一个错误代码，说明这个命令不能立即满足（EAGAIN 或 EWOULDBLOCK）。 |
| I/O复用（I/O multiplexing）        | 由于同步非阻塞方式需要不断主动轮询，轮询占据了很大一部分过程，轮询会消耗大量的CPU时间，<br/>而 “后台” 可能有多个任务在同时进行，人们就想到了循环查询多个任务的完成状态，只要有任何一个任务完成，就去处理它。<br/>如果轮询不是进程的用户态，而是有人帮忙就好了。`那么这就是所谓的 “IO 多路复用”`。 |
| 信号驱动I/O （signal driven I/O ） | 首先我们允许Socket进行信号驱动IO,并安装一个信号处理函数，进程继续运行并不阻塞。<br/>当数据准备好时，进程会收到一个SIGIO信号，可以在信号处理函数中调用I/O操作函数处理数据。 |
| 异步I/O （asynchronous I/O）       | `用户进程进行aio_read系统调用之后，无论内核数据是否准备好，都会直接返回给用户进程，然后用户态进程可以去做别的事情`。<br/>等到socket数据准备好了，内核直接复制数据给进程，`然后从内核向进程发送通知`。`IO两个阶段，进程都是非阻塞的`。 |

详细的看看这个可以：

- [IO 模型 - Unix IO 模型 | Java 全栈知识体系 (pdai.tech)](https://www.pdai.tech/md/java/io/java-io-model.html)
- [聊聊Linux 五种IO模型 - 简书 (jianshu.com)](https://www.jianshu.com/p/486b0965c296)
- [聊聊Linux 五种IO模型，截图备删 · Gitee.com](https://gitee.com/pic_bed_of_shiva/static-resources/commit/785bed010972e3ca982005c2c29725b8bcd42538)

###  阻塞式 I/O

应用进程被阻塞，直到数据复制到应用进程缓冲区中才返回。

应该注意到，在阻塞的过程中，其它程序还可以执行，因此阻塞不意味着整个操作系统都被阻塞。

因为其他程序还可以执行，因此不消耗 CPU 时间，这种模型的执行效率会比较高，但是线程资源比较浪费。

![java-io-model-0](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/java-io-model-0.png)



### 非阻塞式 I/O

应用进程执行系统调用之后，内核返回一个错误码。应用进程可以继续执行，但是需要不断的执行系统调用来获知 I/O 是否完成，这种方式称为轮询(polling)。

由于 CPU 要处理更多的系统调用，因此这种模型是比较低效的。

![java-io-model-1](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/java-io-model-1.png)



###  I/O 复用

使用 select 或者 poll 等待数据，并且可以等待多个套接字中的任何一个变为可读，这一过程会被阻塞，当某一个套接字可读时返回。之后再使用 recvfrom 把数据从内核复制到进程中。

它可以让单个进程具有处理多个 I/O 事件的能力。又被称为 Event Driven I/O，即事件驱动 I/O。

如果一个 Web 服务器没有 I/O 复用，那么每一个 Socket 连接都需要创建一个线程去处理。如果同时有几万个连接，那么就需要创建相同数量的线程。并且相比于多进程和多线程技术，I/O 复用不需要进程线程创建和切换的开销，系统开销更小。

![java-io-model-2](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/java-io-model-2.png)





### 信号驱动 I/O

应用进程使用 sigaction 系统调用，内核立即返回，应用进程可以继续执行，也就是说等待数据阶段应用进程是非阻塞的。内核在数据到达时向应用进程发送 SIGIO 信号，应用进程收到之后在信号处理程序中调用 recvfrom 将数据从内核复制到应用进程中。

相比于非阻塞式 I/O 的轮询方式，信号驱动 I/O 的 CPU 利用率更高。

![java-io-model-3](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/java-io-model-3.png)

### 异步 I/O

进行 aio_read 系统调用会立即返回，应用进程继续执行，不会被阻塞，内核会在所有操作完成之后向应用进程发送信号。

异步 I/O 与信号驱动 I/O 的区别在于，异步 I/O 的信号是通知应用进程 I/O 完成，而信号驱动 I/O 的信号是通知应用进程可以开始 I/O。

![java-io-model-4](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/java-io-model-4.png)

<br/>

## Java 流处理分类

大佬根据 **传输方式**、**数据操作** 两方面，对 Java 的 IO 进行了分类。

### IO理解分类 - 传输方式

从数据传输方式或者说是运输方式角度看，可以将 IO 类分为：`字节流`、`字符流`

- 字节流读取单个字节，字符流读取单个字符(一个字符根据编码的不同，对应的字节也不同，如 UTF-8 编码是 3 个字节，中文编码是 2 个字节。)
- 字节流用来处理二进制文件(图片、MP3、视频文件)，字符流用来处理文本文件(可以看做是特殊的二进制文件，使用了某种编码，人可以阅读)。

> 简而言之，`字节`是个计算机看的，`字符`才是给人看的 -------- @pdai



#### 字节流

列举下常见的，反正API里也都有；我用的少，但是感觉常用的就红色几个

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/image-20220402235211897.png)



#### 字符流

字符流其实和字节流都有一一对应。

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/image-20220403001229922.png)



<br/>

### IO理解分类 - 数据操作

这个也没法讲，遇到了对应百度就行。

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/image-20220403001629430.png)



<br/>

## Java IO使用场景

1、 BIO 方式适用于连接数目比小且固定的架构，这种方式对服务器资源要求比较高，并发局限于应用中， jDK1.4 以前的唯一选择，但程序简单易理解。
2、 NIO 方式适用于连接数目多且连接比较短（轻操作）的架构，比如聊天服务器，弹幕系统，服务器间通讯等。 编程比较复杂，jDK1 .4 开始支持。
3、 AIO 方式使用于连接数目多且连接比较长（重操作）的架构，比如相册服务器，充分调用OS参与并发操作， 编程比较复杂，JDK7 开始支持。


<br/>

## 参考文章

- [黑马Java-IO模式精讲(AIO&BIO&NIO)，Java-IO基础+高级+实战全套教程，黑马程序员行业大牛深度精讲_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1gz4y1C7RK?p=2&spm_id_from=pageDriver)
- [♥Java IO知识体系详解♥ | Java 全栈知识体系 (pdai.tech)](https://www.pdai.tech/md/java/io/java-io-overview.html)
- [(1条消息) Java面试常考的 BIO，NIO，AIO 总结_有梦想的小树的博客-CSDN博客_bio nio](https://blog.csdn.net/m0_38109046/article/details/89449305)
- [同步和异步、阻塞和非阻塞的区别 - SegmentFault 思否](https://segmentfault.com/a/1190000004240246)



