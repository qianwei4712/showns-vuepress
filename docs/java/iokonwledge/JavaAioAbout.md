## <span id="开场废话">开场废话</span>

`2022.04.15`

Java 在 JDK 1.7 版本对 NIO 库做了升级，实现了完全异步通信的新 IO 套字节以及通道，这种新 IO 也被称为 AIO；

上面几篇也介绍过了 IO 的分类，以及IO都是需要操作系统支持的。

- **BIO 和 NIO 都是同步IO（服务端未完成操作时不返回），而 AIO 时操作系统层面实现的 异步IO**

> 异步IO则是采用 **“订阅-通知”模式** :  即应用程序向操作系统注册IO监听，然后继续做自己的事情。当操作系统发生IO事件，并且准备好数据后，在主动通知应用程序，触发相应的函数:

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/java-io-aio-1.png)

> **Windows 内核中，实现了真正的异步IO支持，但是在 Linux 中没有很好实现异步IO，而是使用 Epoll 模拟（IO复用）**

这里也可以插一句，为什么 Netty 用的是 NIO，而不是更高级的 AIO：

- AIO 在 UNIX 系统上不比 NIO 快（作者原话），因为 UNIX 没有很好实现嘛
- Netty 整体架构是基本 reactor 模型，而 AIO 是 proactor 模型，混合在一起会比较混乱
- AIO 接收数据需要预先分配缓冲区，NIO 需要接收时才需要分配缓存，所以对连接数量非常大但流量小的情况，内存浪费很多

<br/>

## <span id="代码示例">代码示例</span>

服务端代码：

```java
class AioServer {

    public static void main(String[] args) throws Exception {
        listen();
    }

    private static void listen() throws Exception {
        //弄一个线程池
        ExecutorService threadPool = Executors.newFixedThreadPool(20);
        //这个线程池用来作为，异步IO的共享线程
        AsynchronousChannelGroup group = AsynchronousChannelGroup.withThreadPool(threadPool);
        //然后准备好  ServerSocket
        final AsynchronousServerSocketChannel server = AsynchronousServerSocketChannel.open(group);

        //设置要监听的端口
        server.bind(new InetSocketAddress(8888));
        System.out.println("服务已启动，监听端口：8888");

        //为AsynchronousServerSocketChannel注册监听，注意只是为AsynchronousServerSocketChannel通道注册监听
        //并不包括为 随后客户端和服务器 socketchannel通道注册的监听
        server.accept(null, new CompletionHandler<AsynchronousSocketChannel, Object>() {
            /**
             * 注意，我们分别观察 this、socketChannel、attachment三个对象的id。
             * 来观察不同客户端连接到达时，这三个对象的变化，以说明ServerSocketChannelHandle的监听模式
             */
            @Override
            public void completed(AsynchronousSocketChannel socketChannel, Object attachment) {

                //每次都要重新注册监听(一次注册，一次响应)，但是由于“文件状态标示符”是独享的，所以不需要担心有“漏掉的”事件
                server.accept(attachment, this);

                //为这个新的socketChannel注册“read”事件，以便操作系统在收到数据并准备好后，主动通知应用程序
                //在这里，由于我们要将这个客户端多次传输的数据累加起来一起处理，所以我们将一个stringbuffer对象作为一个“附件”依附在这个channel上
                ByteBuffer readBuffer = ByteBuffer.allocate(50);
                socketChannel.read(readBuffer, new StringBuffer(), new SocketChannelReadHandle(socketChannel, readBuffer));
            }

            @Override
            public void failed(Throwable exc, Object attachment) {
                System.out.println("IO 操作是失败: " + exc);
            }
        });

        //等待，以便观察现象(这个和要讲解的原理本身没有任何关系，只是为了保证守护线程不会退出)
        Thread.sleep(Integer.MAX_VALUE);
    }

    /**
     * 负责对每一个socketChannel的数据获取事件进行监听。<p>
     * <p>
     * 重要的说明: 一个socketchannel都会有一个独立工作的SocketChannelReadHandle对象(CompletionHandler接口的实现)，
     * 其中又都将独享一个“文件状态标示”对象FileDescriptor、
     * 一个独立的由程序员定义的Buffer缓存(这里我们使用的是ByteBuffer)、
     * 所以不用担心在服务器端会出现“窜对象”这种情况，因为JAVA AIO框架已经帮您组织好了。<p>
     * <p>
     * 但是最重要的，用于生成channel的对象: AsynchronousChannelProvider是单例模式，无论在哪组socketchannel，
     * 对是一个对象引用(但这没关系，因为您不会直接操作这个AsynchronousChannelProvider对象)。
     */
    static class SocketChannelReadHandle implements CompletionHandler<Integer, StringBuffer> {

        private final AsynchronousSocketChannel socketChannel;

        /**
         * 专门用于进行这个通道数据缓存操作的ByteBuffer<br>
         * 当然，您也可以作为CompletionHandler的attachment形式传入。<br>
         * 这是，在这段示例代码中，attachment被我们用来记录所有传送过来的Stringbuffer了。
         */
        private final ByteBuffer byteBuffer;

        public SocketChannelReadHandle(AsynchronousSocketChannel socketChannel, ByteBuffer byteBuffer) {
            this.socketChannel = socketChannel;
            this.byteBuffer = byteBuffer;
        }

        /* (non-Javadoc)
         * @see java.nio.channels.CompletionHandler#completed(java.lang.Object, java.lang.Object)
         */
        @Override
        public void completed(Integer result, StringBuffer historyContext) {
            //如果条件成立，说明客户端主动终止了TCP套接字，这时服务端终止就可以了
            if (result == -1) {
                try {
                    this.socketChannel.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
                return;
            }
            System.out.println("completed(Integer result, Void attachment) : 然后我们来取出通道中准备好的值");
            /*
             * 实际上，由于我们从Integer result知道了本次channel从操作系统获取数据总长度
             * 所以实际上，我们不需要切换成“读模式”的，但是为了保证编码的规范性，还是建议进行切换。
             *
             * 另外，无论是JAVA AIO框架还是JAVA NIO框架，都会出现“buffer的总容量”小于“当前从操作系统获取到的总数据量”，
             * 但区别是，JAVA AIO框架中，我们不需要专门考虑处理这样的情况，因为JAVA AIO框架已经帮我们做了处理(做成了多次通知)
             * */
            this.byteBuffer.flip();
            byte[] contexts = new byte[1024];
            this.byteBuffer.get(contexts, 0, result);
            this.byteBuffer.clear();
            String nowContent = new String(contexts, 0, result, StandardCharsets.UTF_8);
            historyContext.append(nowContent);
            System.out.println("================目前的传输结果: " + historyContext);

            //随便返回点什么
            this.byteBuffer.get(contexts, 0, result);
            this.byteBuffer.flip();
            this.socketChannel.write(byteBuffer);

            //如果条件成立，说明还没有接收到“结束标记”
            if (historyContext.indexOf("over") == -1) {
                return;
            }

            //=========================================================================
            //          和上篇文章的代码相同，我们以“over”符号作为客户端完整信息的标记
            //=========================================================================
            System.out.println("=======收到完整信息，开始处理业务=========");
            historyContext = new StringBuffer();

            //还要继续监听(一次监听一次通知)
            this.socketChannel.read(this.byteBuffer, historyContext, this);
        }

        /* (non-Javadoc)
         * @see java.nio.channels.CompletionHandler#failed(java.lang.Throwable, java.lang.Object)
         */
        @Override
        public void failed(Throwable exc, StringBuffer historyContext) {
            System.out.println("=====发现客户端异常关闭，服务器将关闭TCP通道");
            try {
                this.socketChannel.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
```

客户端代码：

```java
public class AioClient {

    public static void main(String[] args) throws Exception {
        new AioClient().connect("localhost", 8888);
    }

    private final AsynchronousSocketChannel client;

    public AioClient() throws Exception {
        client = AsynchronousSocketChannel.open();
    }

    public void connect(String host, int port) throws Exception {
        client.connect(new InetSocketAddress(host, port), null, new CompletionHandler<Void, Void>() {
            @Override
            public void completed(Void result, Void attachment) {
                try {
                    client.write(ByteBuffer.wrap("这是一条测试数据".getBytes())).get();
                    System.out.println("已发送至服务器");
                } catch (Exception ex) {
                    ex.printStackTrace();
                }
            }
            @Override
            public void failed(Throwable exc, Void attachment) {
                exc.printStackTrace();
            }
        });

        final ByteBuffer bb = ByteBuffer.allocate(1024);
        client.read(bb, null, new CompletionHandler<Integer, Object>() {
            @Override
            public void completed(Integer result, Object attachment) {
                System.out.println("IO 操作完成:" + result);
                System.out.println("获取反馈结果:" + bb);
            }
            @Override
            public void failed(Throwable exc, Object attachment) {
                exc.printStackTrace();
            }
        });

        Thread.sleep(Integer.MAX_VALUE);
    }
}
```





<br/>

## <span id="参考文章">参考文章</span>

- [Java AIO - 异步IO详解 | Java 全栈知识体系 (pdai.tech)](https://www.pdai.tech/md/java/io/java-io-aio.html)
- [Netty 学习笔记（三）、AIO 简单介绍_吃饭睡觉胖胖胖的博客-CSDN博客_aio netty](https://blog.csdn.net/meiyongdesan/article/details/109034696)
- [netty的基本概念-AIO详解_小马的学习笔记的博客-CSDN博客_aio netty](https://blog.csdn.net/madongyu1259892936/article/details/109668948)
- [Netty为什么放弃使用AIO - 米九虫 - 博客园 (cnblogs.com)](https://www.cnblogs.com/mr-ao/p/14585898.html)











