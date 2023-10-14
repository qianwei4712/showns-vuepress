
## 开场废话

`2022.04.16，终于到 Netty 了，就是奔着这个来的`

> 官方说明：Netty 是一个异步的，事件驱动的网络应用框架，可以快速开发可维护的高性能协议服务器和客户端。
>

- GitHub 地址：[netty/netty: Netty project - an event-driven asynchronous network application framework (github.com)](https://github.com/netty/netty)
- 官方文档：[Netty.docs: Netty.docs: Home](https://netty.io/wiki/index.html)
- [Netty权威指南 第2版 带书签目录 完整版.pdf · Drawing Bed of First/static-resources - 码云 - 开源中国 (gitee.com)](https://gitee.com/pic_bed_of_shiva/static-resources/blob/master/showns/ebook/Netty权威指南 第2版 带书签目录 完整版.pdf)

Netty 在网络编程中的地位，相当于 Spring 在 JavaEE 体系中的地位，是当之无愧的武林霸主。

使用 Netty 的框架包括：`Spark`、`RocketMQ`、`ElasticSearch`、`Dubbo`、`Zookeeper`等，都是大名鼎鼎啊；

----

上面已经说过了，Netty 是基于 NIO 开发的网络协议框架，稳定版本是 4.1;

Netty 5 已经被废弃，原本是为了引入 AIO，后来发现效果不好。

<br/>

## 入门示例代码

引入依赖：

```xml
<dependency>
    <groupId>io.netty</groupId>
    <artifactId>netty-all</artifactId>
    <version>4.1.75.Final</version>
</dependency>
```

服务端代码：

```java
class NettyServer {

    public static void main(String[] args) throws Exception {
        run(9999);
    }

    public static void run(int port) {
        // NioEventLoopGroup，可以简单理解为  线程池+Selector;
        // bossGroup: 用来accept客户端连接
        EventLoopGroup bossGroup = new NioEventLoopGroup();
        // workerGroup: 处理客户端数据的读写操作
        EventLoopGroup workerGroup = new NioEventLoopGroup();
        try {
            // 启动服务的辅助类，有关socket的参数可以通过ServerBootstrap进行设置
            ServerBootstrap b = new ServerBootstrap();
            b.group(bossGroup, workerGroup)
                    // 选择服务 Scoket 实现类，通常使用 NioServerSocketChannel，表示基于 NIO 的服务器端实现
                    .channel(NioServerSocketChannel.class)
                    // 配置参数，服务端可连接队列数 100
                    .option(ChannelOption.SO_BACKLOG, 100)
                    .handler(new LoggingHandler(LogLevel.INFO))
                    // 通常会为新 SocketChannel 通过添加一些 handler，来设置 ChannelPipeline。
                    // ChannelInitializer 是一个特殊的handler，其中initChannel方法可以为SocketChannel 的 pipeline 添加指定 handler。
                    .childHandler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        public void initChannel(SocketChannel ch) {
                            // 添加业务处理类，如果存在多个将会按顺序进行处理
//                            ch.pipeline().addLast(new StringDecoder());
                            ch.pipeline().addLast(new NioServerHandler());
                        }
                    });

            //绑定端口，启动服务
            ChannelFuture f = b.bind(port).sync();
            // 等待通道关闭
            f.channel().closeFuture().sync();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // Shut down all event loops to terminate all threads.
            bossGroup.shutdownGracefully();
            workerGroup.shutdownGracefully();
        }

    }
}
```

```java
class NioServerHandler extends ChannelInboundHandlerAdapter {
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        ByteBuf buf = (ByteBuf) msg;
        byte[] req = new byte[buf.readableBytes()];
        buf.readBytes(req);
        String body = new String(req, StandardCharsets.UTF_8);
        System.out.println("服务端收到消息：" + body);
        ByteBuf resp;
        if ("hello".equals(body)) {
            resp = Unpooled.copiedBuffer("netty received".getBytes(StandardCharsets.UTF_8));
        } else {
            resp = Unpooled.copiedBuffer("fu*k nertty".getBytes(StandardCharsets.UTF_8));
        }
        ctx.write(resp);
    }
    @Override
    public void channelReadComplete(ChannelHandlerContext ctx) throws Exception {
        ctx.flush();
    }
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        System.out.println("Unexpected exception from downstream." + cause);
        ctx.close();
    }
}
```

- Netty 对 `EventLoopGroup` 接口针对不同的传输协议提供了不同的实现
- Scoket 实现类中，除了 `NioServerSocketChannel`，还有以下两种：

![image-20220420224115555](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/image-20220420224115555.png)

<br/>

客户端代码：

```java
class NettyClient {
    public static void main(String[] args) throws Exception {
        run("127.0.0.1", 9999, 1024, "hello");
    }

    public static void run(String host, int port, int firstMessageSize, String msg) throws Exception {
        EventLoopGroup group = new NioEventLoopGroup();
        try {
            Bootstrap b = new Bootstrap();
            b.group(group)
                    .channel(NioSocketChannel.class)
                    .option(ChannelOption.TCP_NODELAY, true)
                    .handler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        public void initChannel(SocketChannel ch) {
                            ch.pipeline().addLast(new NioClientHandler(firstMessageSize, msg));
                        }
                    });

            ChannelFuture f = b.connect(host, port).sync();
            f.channel().closeFuture().sync();
        } finally {
            group.shutdownGracefully();
        }
    }
}
```

```java
class NioClientHandler extends ChannelInboundHandlerAdapter {
    private final ByteBuf firstMessage;

    public NioClientHandler(int firstMessageSize, String msg) {
        if (firstMessageSize <= 0) {
            throw new IllegalArgumentException("firstMessageSize: " + firstMessageSize);
        }
        byte[] req = msg.getBytes(StandardCharsets.UTF_8);
        firstMessage = Unpooled.buffer(firstMessageSize);
        firstMessage.writeBytes(req);
    }

    @Override
    public void channelActive(ChannelHandlerContext ctx) {
        ctx.writeAndFlush(firstMessage);
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        ByteBuf buf = (ByteBuf) msg;
        byte[] req = new byte[buf.readableBytes()];
        buf.readBytes(req);
        String body = new String(req, StandardCharsets.UTF_8);
        System.out.println("客户端收到消息：" + body);
    }

    @Override
    public void channelReadComplete(ChannelHandlerContext ctx) throws Exception {
        ctx.flush();
    }
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        System.out.println("Unexpected exception from downstream." + cause);
        ctx.close();
    }
}

```

- ChannelInboundHandlerAdapter 实现类的几个重点方法：

> 1. **channelActive** : 当客户端和服务端建立连接后会调用
> 2. **channelRead** : 收到消息时将会调用，可以用来处理消息
> 3. **exceptionCaught** : 发生异常时会调用，可以用来打印断开连接日志，断开触发等



测试运行：

```
服务端收到消息：hello

客户端收到消息：netty received
```

<br/>

### ChannelOption 常见配置

| 参数                                 | 作用                       | 说明                                                         |
| ------------------------------------ | -------------------------- | ------------------------------------------------------------ |
| ChannelOption.CONNECT_TIMEOUT_MILLIS | 最长尝试连接时间           | 用在客户端建立连接时，如果在指定毫秒内无法连接，会抛出 timeout 异常 |
| ChannelOption.SO_BACKLOG             | 设置队列的大小             | 对应 tcp协议 listen函数中的backlog参数，函数用来初始化服务端可连接队列<br>服务端处理客户端连接请求是顺序处理的，所以同一时间只能处理一个客户端连接<br/>多个客户端时，服务端将不能处理的客户端连接请求放在队列中等待处理，backlog参数指定了队列的大小 |
| ChannelOption.SO_REUSEADDR           | 允许重复使用本地地址和端口 | 对应于套接字选项中的SO_REUSEADDR，这个参数表示允许重复使用本地地址和端口 |
| ChannelOption.SO_KEEPALIVE           | 设置长链接心跳             | 当设置该选项以后，如果在两小时内没有数据的通信时，TCP会自动发送一个活动探测数据报文。<br/>不推荐只使用这个参数来维持长链接，还是要自己写。 |
| ChannelOption.SO_SNDBUF              | 用于操作发送缓冲区的大小   | 发送缓冲区用于保存发送数据，直到发送成功。                   |
| ChannelOption.SO_RCVBUF              | 用于操作接收缓冲区的大小   | 接收缓冲区用于保存网络协议站内收到的数据，直到应用程序读取成 功 |
| ChannelOption.SO_LINGER              | 关闭Socket的延迟时间       | 0表示socket.close()方法立即返回，OS放弃发送缓冲区的数据直接向对端发送RST包，对端收到复位错误。<br/>非0 表示调用socket.close()方法的线程被阻塞直到延迟时间到或发送缓冲区中的数据发送完毕，若超时，则对端会收到复位错误。 |
| ChannelOption.TCP_NODELAY            | 立即发送数据，默认值为Ture | Nagle算法是将小的数据包组装为更大的帧然后进行发送，而不是输入一次发送一次,<br/>因此在数据包不足的时候会等待其他数据的到了，组装成大的数据包进行发送，<br/>虽然该方式有效提高网络的有效负载，但是却造成了延时，，适用于文件传输。 |
| ChannelOption.IP_TOS                 | 设施优先级和QoS            | IP参数，设置IP头部的Type-of-Service字段，用于描述IP包的优先级和QoS选项。 |

> 来源：[Netty ChannelOption参数详解 - 简书 (jianshu.com)](https://www.jianshu.com/p/975b30171352)
>

<br/>

## 解码器使用

### 拆包粘包

在讲解码器之前，得先了解下 **拆包粘包** 问题，介绍跳过

- 理论基础可以看：[TCP 粘包、拆包问题，及解决方案 · 语雀 (yuque.com)](https://www.yuque.com/shiva/lct37n/dxczcg)
- 测试代码：[jdk-source/src/main/java/netty/demo2](https://gitee.com/learning-use-cases/junit-of-scattered/tree/e9558d9369d098d42eedd175c44ffbc4c48b269a/jdk-source/src/main/java/netty/demo2)

这里先使用 Netty 自带的 `LineBasedFrameDecoder` 和 `StringDecoder` 解码器来测试，先使用最基础的按行分割。

----

对上面的代码进行修改，然后再测试。

服务端和客户端都添加业务处理解码器：

```java
ch.pipeline().addLast(new LineBasedFrameDecoder(1024));
ch.pipeline().addLast(new StringDecoder());
```

NioServerHandler 处理类，channelRead 读取方法修改：

```java
private int count;

@Override
public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
    //收到消息，打印
    String body = (String) msg;
    System.out.println("收到消息次数：" + ++count + "服务端收到消息：" + body);
    //返回消息，时间戳
    String time = System.currentTimeMillis() + System.getProperty("line.separator");
    ByteBuf  resp = Unpooled.copiedBuffer(time.getBytes(StandardCharsets.UTF_8));;
    ctx.writeAndFlush(resp);
}
```

> 因为用了 `StringDecoder` 解码器，直接转 string 就能用

----

NioClientHandler 处理类，channelActive 方法修改：

```java
@Override
public void channelActive(ChannelHandlerContext ctx) {
    ByteBuf message = null;
    byte[] bytes = ("hello~ mother fucker! " + System.getProperty("line.separator")).getBytes(StandardCharsets.UTF_8);
    for (int i = 0; i < 10; i++) {
        message = Unpooled.buffer(bytes.length);
        message.writeBytes(bytes);
        ctx.writeAndFlush(message);
    }
}

@Override
public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
    String body = (String) msg;
    System.out.println("客户端收到消息：" + body);
}
```

打印效果：

```
收到消息次数：1服务端收到消息：hello~ mother fucker!
.....
收到消息次数：10服务端收到消息：hello~ mother fucker!
```

```
客户端收到消息：1650685447037
...
客户端收到消息：1650685447044
```

<br/>

#### LineBasedFrameDecoder

> 行分隔符解码器，遇到 `\n` 或 `\r\n` ，则认为是一个完整的报文

工作原理如下：

1. 依次遍历 ByteBuf 中的可读字节，判断是否有 `\n` 或 `\r\n` 。
2. 如果有，就从此位置结束读取，把读取到的字节组成一个数据包。
3. 然后发到下一个解码器。

**如果读取到最大长度，仍然没有读取到换行符，则会抛出异常。同时忽略已经读到的流数据。**

<br/>

#### DelimiterBasedFrameDecoder

> 分隔符解码器，作用与 LineBasedFrameDecoder 类似，**只不过分隔符可以自己指定**

可以这么用，只要把指定的分隔符传入就行：

```java
new ServerBootstrap()
    .childHandler(new DelimiterBasedFrameDecoder(1024, Unpooled.copiedBuffer("$$".getBytes()))
```

<br/>

#### LengthFieldBasedFrameDecoder

> 通过在包头增加消息体长度的解码器，解析数据时首先获取首部长度，然后定长读取socket中的数据。

- 感觉这个会比较重要，所以单独写了个文章
- 传送门：[LengthFieldBasedFrameDecoder 解码器 · 语雀 (yuque.com)](https://www.yuque.com/shiva/lct37n/bbg5ml)



<br/>

#### 其他解码器

| 解码器                  | 作用                                                         |
| ----------------------- | ------------------------------------------------------------ |
| StringDecoder           | StringDecoder 功能比较明显，把收到的数据包转为字符串，然后继续调用后续的 Handler. |
| FixedLengthFrameDecoder | 定长协议解码器，可以指定固定的字节数算一个完整的报文         |
| Base64Decoder           | 用于Base64编码                                               |
| JsonObjectDecoder       | json格式解码器，当检测到匹配数量的"{" 、”}”或”[””]”时，则认为是一个完整的 json |
| MessageToMessageDecoder | 将一个本身就包含完整报文信息的对象转换成另一个Java对象       |



<br/>

### 自定义解码器

其实也没什么好说的，

1. 实现 `ByteToMessageDecoder` 字节转消息解码器。
2. 重写 `decode` 解码方法。

```java
public class MyByteToLongDecoder extends ByteToMessageDecoder {
    /**
     * decode() 会根据接收的数据，被调用多次，知道确定没有新的元素添加到list,
     * 或者是 ByteBuf 没有更多的可读字节为止。
     * 如果 list 不为空，就会将 list 的内容传递给下一个 handler
     * @param ctx 上下文对象
     * @param in 入站后的 ByteBuf
     * @param out 将解码后的数据传递给下一个 handler
     * @throws Exception
     */
    @Override
    protected void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) throws Exception {
        // long 类型 为 8 字节
        if (in.readableBytes() >= 8) {
            out.add(in.readLong());
        }
    }
}
```

> 解码器最重要的，是对 **ByteBuf** 消息的读取，这个其实和正常消息读取也没啥区别。



<br/>

## 编码器

先说下 Java 序列化 Serializable，本来因为很少接触网络编程，基本就是转个json。确实不知道序列化有什么坑。

反正都知道是抄的，直接写结论吧：

1. **Java 序列化最致命的问题是无法跨语言**，所以在调用其他语言开发的应用时，就不能使用。
2. 序列化后包太大，浪费资源。
3. 序列化的性能太低，通俗讲就是序列化的速度慢

---

然后《Netty 权威指南》 推荐了几个编码器：`Google Protobuf` 、 `Facebook Thrift` 、`JBoss Marshalling`

还特地开一章介绍了 `MessagePack` 编码器。

大体使用方式都差不多，都单独写个测试类，不介绍了，看跳转链接吧：

- [MessagePack 编码器 · 语雀 (yuque.com)](https://www.yuque.com/shiva/lct37n/uis8a1)

其他两个编码器，没见过，算了跳过



<br/>

## 私有协议开发

Netty 可以用来实现各种网络协议，比如 HTTP、WebScoket 等。

- [HTTP 协议开发应用 · 语雀 (yuque.com)](https://www.yuque.com/shiva/lct37n/lz4af0)

但是实在是不明白应用场景是什么，略过好了，直接看私有协议。

> 这一章就是定义一个私有协议，并且做代码实现。
>
> 其实就是把书里的代码都敲一遍。实际开发中的私有协议肯定是根据规范确定的。

---

### 协议栈通信模型

所有的非标准协议，都可以被成为私有协议，即便是国家出的标准版行业协议。

我们先确定一个协议通信模型，然后再来做实现。

Netty 协议栈通信模型的流程可以参考：

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/image-20220501215917933.png)

1. Netty 协议栈客户端发送握手请求消息，携带节点 ID 等有效身份认证信息
2. Netty 协议栈服务端对握手请求消息进行合法性校验，包括节点ID有效性校验、节点重复登录校验和IP地址合法性校验，校验通过后，返回登录成功的握手应答消息;
3. 链路建立成功之后，客户端发送业务消息;
4. 链路成功之后，服务端发送心跳消息;
5. 链路建立成功之后，客户端发送心跳消息;
6. 链路建立成功之后，服务端发送业务消息;
7. 服务端退出时，服务端关闭连接，客户端感知对方关闭连接后，被动关闭客户端连接。

<br>

### 消息定义

消息格式定义分为消息头和消息体。

- **header** ：消息头，变长；
- **body** ：消息体，变长；对于请求消息，它是方法的参数，对于响应消息，它是返回值

#### 消息头格式

| 名称       | 类型                | 长度 | 描述                                               |
| ---------- | ------------------- | ---- | -------------------------------------------------- |
| crcCode    | int                 | 32   | Netty 消息校验码；                                 |
| length     | int                 | 32   | 消息长度，整个消息的长度。**包括消息头和消息体。** |
| sessionID  | long                | 64   | 集群节点内全局唯一，由会话ID生成器生成             |
| type       | byte                | 8    | 消息类型                                           |
| priority   | byte                | 8    | 消息优先级，0-255                                  |
| attachment | Map<String, Object> | 变长 | 可选字段，用于扩展消息头                           |

**crcCode**

定义校验码为：carCode = 固定值 + 主版本号 + 次版本号

- 固定值：0xABEF ，占2个字节
- 主版本号：1-255，占1个字节
- 次版本号：1-255，占1个字节

**type**

- 0：业务消息请求
- 1：业务响应请求
- 2：业务 ONE WAY 消息，既是请求又是响应；意思应该是不需要响应
- 3：握手请求消息
- 4：握手应答消息
- 5：心跳请求消息
- 6：心跳应答消息

<br>

### 可靠性设计

#### 心跳机制

心跳机制时序图如下。

> **当然不单单是客户端可以断开链接，如果服务端在N次没有收到心跳消息，也需要断开链接；**

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/image-20220605144837465.png)

<br>

#### 重复登录保护

这个也没啥需要特殊解释的，就两点：

1. **连接需要做身份校验；账号密码、IP白名单**
2. **校验当前的IP和账号是否已建立连接，检查缓存**

<br>

#### 消息缓存重发

这个也好理解，弄个队列，缓存断开链接时的消息，链接建立后重新发送。



<br/>

## 参考文章

- [Java N(A)IO - 框架: Netty | Java 全栈知识体系 (pdai.tech)](https://www.pdai.tech/md/java/io/java-io-nio-netty.html)
- [黑马程序员Netty全套教程，全网最全Netty深入浅出教程，Java网络编程的王者_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1py4y1E7oA?p=53)
- [Netty - Java 技术驿站 (cmsblogs.com)](https://www.cmsblogs.com/item/1114760968)
- [Netty源码分析 - 文集 - 简书 (jianshu.com)](https://www.jianshu.com/nb/7269354)
- [showns/file/黑马Netty教程源码资料.rar · Drawing Bed of First/static-resources - Gitee.com](https://gitee.com/pic_bed_of_shiva/static-resources/blob/19cdedd5f020b7e2173d4c658114a52e0f0395fd/showns/file/黑马Netty教程源码资料.rar)
- [Netty ChannelOption参数详解 - 简书 (jianshu.com)](https://www.jianshu.com/p/975b30171352)
- [Socket中SO_REUSEADDR详解_明潮的博客-CSDN博客_reuseaddr](https://blog.csdn.net/u010144805/article/details/78579528)
- [channelOption中的属性了解_Gin_Chou的博客-CSDN博客](https://blog.csdn.net/qq_28198181/article/details/82152338)
- [Netty之启动类、编解码器等源码解析及粘包、拆包问题_踩踩踩从踩的博客-CSDN博客](https://blog.csdn.net/qq_33373609/article/details/120575389)
- [Netty源码分析——拆包器之LineBasedFrameDecoder - 简书 (jianshu.com)](https://www.jianshu.com/p/3dfa2a9c1cc0)
- [(1条消息) LineBasedFrameDecoder解决粘包半包源码分析_star++的博客-CSDN博客_linebasedframedecoder半包原理](https://blog.csdn.net/weixin_38312719/article/details/108763753)
- [解码器LengthFieldBasedFrameDecoder_书唐瑞的博客-CSDN博客](https://blog.csdn.net/qq_45859054/article/details/115253892)
- [netty自定义解码器 decoder - 简书 (jianshu.com)](https://www.jianshu.com/p/38a3546098ae)

























