
<div class="catalog">

- [开场废话](#开场废话)
- [NIO 简单介绍](#NIO介绍)
  - [NIO 代码示例](#NIO代码示例)
  -  [执行流程简介](#执行流程简介)
- [Buffer 缓冲区详解](#Buffer)
- [Channel 通道详解](#Channel)
- [Selector 选择器详解](#Selector )
- [参考文章](#参考文章)

</div>

## <span id="开场废话">开场废话</span>

`2022.04.05`

Java 为了解决 BIO 中，`serverSocket.accept()` 阻塞的问题，在 JDK1.4 推出了 NIO 弥补不足。

Java NlO (New lO）也有人称之为 java non-blocking IO。**NIO 可以完美得替代原本的 IO API，但是实现方式完全不一样。**

```
NIO 可以理解为非阻塞IO，传统IO 的read和write只能阻塞执行，线程在读写期间不能干其他事倩，比如调用socket. read(）时，如果服务器一直没有数据传输过来，线程就一直阻塞;

而 NIO 中可以配置socket为非阻塞模式。
```

<br>

## <span id="NIO介绍">NIO 简单介绍</span>

标准IO 是对字节流的读写，在进行IO之前，首先创建一个流对象，流对象进行读写操作都是按字节 ，一个字节一个字节的来读或写。

**NIO 把IO抽象成块** ，类似磁盘的读写，每次IO操作的单位都是一个块，块被读入内存之后就是一个byte[]，NIO一次可以读或写多个字节，效率也高很多。

NIO有三大核心部分：`Channel（通道）`,`Buffer(缓冲区）`,`Selector（选择器）`

> **数据总是从 Channel(通道）读取到 Buffer(缓冲区）中，或者从缓冲区写入到通道中。**
>
> **Selector(选择器）用于监听多个通道的事件（比如：连接请 求，数据到达等），因此使用单个线程就可以监听多个客户端通道**

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/image-20220407234615866.png)

<br/>

#### Buffer 缓冲区

发送给一个通道的所有数据都必须首先放到缓冲区中，同样地，从通道中读取的任何数据都要先读到缓冲区中。

也就是说，不会直接对通道进行读写数据，而是要先经过缓冲区。

缓冲区实质上是一个数组，但它不仅仅是一个数组。缓冲区提供了对数据的结构化访问，而且还可以跟踪系统的读/写进程。

<br/>

#### Channel 通道

通道 Channel 是对原 I/O 包中的流的模拟，可以通过它读取和写入数据。

通道与流的不同之处在于，流只能在一个方向上移动(一个流必须是 InputStream 或者 OutputStream 的子类)，**而通道是双向的，可以用于读、写或者同时用于读写。**

通道包括以下类型:

- FileChannel: 从文件中读写数据；
- DatagramChannel: 通过 UDP 读写网络中数据；
- SocketChannel: 通过 TCP 读写网络中数据；
- ServerSocketChannel: 可以监听新进来的 TCP 连接，对每一个新进来的连接都会创建一个 SocketChannel。

<br/>

#### Selector 选择器

Selector 是一个 java NIO组件，可以能够检查一个或多个NIO通道，并确定哪些通道已经准备好进行读取或写入。

这样，一个单独的线程可以管理多个channel，从而管理多个网络连接，提高效率

<br/>

### <span id="NIO代码示例">NIO 代码示例</span>

服务端代码如下，主线程，启动监听：

```java
public static void main(String[] args) throws Exception {
    //记录套接字通道事件
    Selector selector = Selector.open();
    //定义一个异步socket对象
    ServerSocketChannel ssc = ServerSocketChannel.open();
    //设置异步
    ssc.configureBlocking(false);
    //获取socket对象
    ServerSocket socket = ssc.socket();
    //绑定端口
    InetSocketAddress address = new InetSocketAddress(9999);
    socket.bind(address);
    //将事件注册selector对象内
    ssc.register(selector, SelectionKey.OP_ACCEPT);
    System.out.println("端口注册完毕!");

    while (true) {
        //查询事件如果一个事件都没有就阻塞
        selector.select();
        //定义一个byte缓冲区来存储收发的数据
        ByteBuffer echoBuffer = ByteBuffer.allocate(10);
        //处理数据
        accept(selector, echoBuffer);
    }
}
```

数据处理方法：

```java
//处理数据
public static void accept(Selector selector, ByteBuffer echoBuffer) {
    SocketChannel sc;
    try {
        //此循环遍例所有产生的事件
        for (SelectionKey key : selector.selectedKeys()) {
            //如果产生的事件为接受客户端连接(当有客户端连接服务器的时候产生)
            if ((key.readyOps() & SelectionKey.OP_ACCEPT) == SelectionKey.OP_ACCEPT) {
                selector.selectedKeys().remove(key);
                //定义一个服务器socket通道
                ServerSocketChannel subssc = (ServerSocketChannel) key.channel();
                //将临时socket对象实例化为接收到的客户端的socket
                sc = subssc.accept();
                //将客户端的socket设置为异步
                sc.configureBlocking(false);
                //将客户端的socket的读取事件注册到事件选择器中
                sc.register(selector, SelectionKey.OP_READ);
                //将本此事件从迭带器中删除
                System.out.println("有新连接:" + sc);

                //如果产生的事件为读取数据(当已连接的客户端向服务器发送数据的时候产生)
            } else if ((key.readyOps() & SelectionKey.OP_READ) == SelectionKey.OP_READ) {
                //将本次事件删除
                selector.selectedKeys().remove(key);
                //临时socket对象实例化为产生本事件的socket
                sc = (SocketChannel) key.channel();
                //定义一个用于存储byte数据的流对象
                ByteArrayOutputStream bos = new ByteArrayOutputStream();
                //先将客户端的数据清空
                echoBuffer.clear();
                //a为读取到数据的长度
                try {
                    //循环读取所有客户端数据到byte缓冲区中,当有数据的时候read函数返回数据长度
                    //NIO会自动的将缓冲区一次容纳不下的自动分段
                    int readInt = 0;
                    while ((readInt = sc.read(echoBuffer)) > 0) {
                        //如果获得数据长度比缓冲区大小小的话
                        if (readInt < echoBuffer.capacity()) {
                            //建立一个临时byte数组,将齐长度设为获取的数据的长度
                            byte[] readByte = new byte[readInt];
                            //循环向此临时数组中添加数据
                            for (int i = 0; i < readInt; i++) {
                                readByte[i] = echoBuffer.get(i);
                            }
                            //将此数据存入byte流中
                            bos.write(readByte);
                        } else {
                            //将读取到的数据写入到byte流对象中
                            bos.write(echoBuffer.array());
                        }
                        //将缓冲区清空，以便进行下一次存储数据
                        echoBuffer.clear();
                    }
                    //当循环结束时byte流中已经存储了客户端发送的所有byte数据
                    System.out.println("接收数据: " + bos);
                } catch (Exception e) {
                    //当客户端在读取数据操作执行之前断开连接会产生异常信息
                    e.printStackTrace();
                    //将本socket的事件在选择器中删除
                    key.cancel();
                    break;
                }
                //获取byte流对象的标准byte对象
                byte[] b = bos.toByteArray();
                //建立这个byte对象的ByteBuffer,并将数据存入
                ByteBuffer byteBuffer = ByteBuffer.allocate(b.length);
                byteBuffer.put(b);
                //向客户端写入收到的数据
                write(byteBuffer, sc);
                //关闭客户端连接
                sc.close();
                //将本socket的事件在选择器中删除
                key.cancel();
            }
        }
    } catch (Exception e) {
        e.printStackTrace();
    } finally {
        System.out.println("连接结束");
        System.out.println("=============================");
    }
}
```

数据回写方法：

```java
//写数据
public static void write(ByteBuffer echoBuffer, SocketChannel sc) {
    //将缓冲区复位以便于进行其他读写操作
    echoBuffer.flip();
    try {
        //向客户端写入数据,数据为接受到数据
        sc.write(echoBuffer);
    } catch (IOException e) {
        e.printStackTrace();
        return;
    }
    System.out.println("返回数据: " + new String(echoBuffer.array()));
}
```

客户端代码：

```java
public static void main(String[] args) {
    NioClient client = new NioClient();
    client.send("66666");
}

//启动连接
public void send(String mssage) {
    try {
        //定义一个记录套接字通道事件的对象
        Selector selector = Selector.open();
        //定义一个服务器地址的对象
        SocketAddress address = new InetSocketAddress("127.0.0.1", 9999);
        //定义异步客户端
        SocketChannel client = SocketChannel.open(address);
        //将客户端设定为异步
        client.configureBlocking(false);
        //在轮讯对象中注册此客户端的读取事件(就是当服务器向此客户端发送数据的时候)
        client.register(selector, SelectionKey.OP_READ);
        //定义用来存储发送数据的byte缓冲区
        ByteBuffer sendbuffer = ByteBuffer.allocate(mssage.length());
        //定义用于接收服务器返回的数据的缓冲区
        ByteBuffer readBuffer = ByteBuffer.allocate(mssage.length());
        //将数据put进缓冲区
        sendbuffer.put(mssage.getBytes(StandardCharsets.UTF_8));
        //将缓冲区各标志复位,因为向里面put了数据标志被改变要想从中读取数据发向服务器,就要复位
        sendbuffer.flip();
        //向服务器发送数据
        client.write(sendbuffer);
        System.out.println("发送数据: " + new String(sendbuffer.array()));

        //利用循环来读取服务器发回的数据
        while (true) {
            //如果客户端连接没有打开就退出循环
            if (!client.isOpen()) {
                break;
            }
            //此方法为查询是否有事件发生如果没有就阻塞,有的话返回事件数量
            int shijian = selector.select();
            //如果没有事件返回循环
            if (shijian == 0) {
                continue;
            }
            this.send(selector, readBuffer, client);
        }
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```

实际发送数据：

```java
//发送数据
public void send(Selector selector, ByteBuffer readBuffer, SocketChannel client) {
    try {
        //遍例所有的事件
        for (SelectionKey key : selector.selectedKeys()) {
            //删除本次事件
            selector.selectedKeys().remove(key);
            //如果本事件的类型为read时,表示服务器向本客户端发送了数据
            if (key.isReadable()) {
                //将临时客户端对象实例为本事件的socket对象
                SocketChannel sc = (SocketChannel) key.channel();
                //定义一个用于存储所有服务器发送过来的数据
                ByteArrayOutputStream bos = new ByteArrayOutputStream();
                //将缓冲区清空以备下次读取
                readBuffer.clear();
                //此循环从本事件的客户端对象读取服务器发送来的数据到缓冲区中
                while (sc.read(readBuffer) > 0) {
                    //将本次读取的数据存到byte流中
                    bos.write(readBuffer.array());
                    //将缓冲区清空以备下次读取
                    readBuffer.clear();
                }
                //如果byte流中存有数据
                if (bos.size() > 0) {
                    //建立一个普通字节数组存取缓冲区的数据
                    System.out.println("接收数据: " + bos);
                    //关闭客户端连接,此时服务器在read读取客户端信息的时候会返回-1
                    client.close();
                    System.out.println("连接关闭!");
                }
            }
        }
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```

<br/>

### <span id="执行流程简介">执行流程简介</span>

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/IO%20%E5%88%86%E7%B1%BB%E5%8F%8A%E5%8C%BA%E5%88%AB.png)









<br/>

## <span id="Buffer">Buffer 缓冲区详解</span>

抽象类 `java.nio.Buffer` 是所有 NIO 缓冲区实现类的父类。

缓冲区包括以下类型： `ByteBuffer`、`CharBuffer`、`ShortBuffer`、`IntBuffer`、`LongBuffer`、`FloatBuffer`、`DoubleBuffer`

下面以 **ByteBuffer** 为例，缓冲区的创建方法用的是：

```java
// 创建一个容量为capacity的 ByteBuffer 对象
public static ByteBuffer allocate(int capacity) {
    if (capacity < 0) throw new IllegalArgumentException();
    return new HeapByteBuffer(capacity, capacity);
}
```

最后还是回到  **ByteBuffer** 的构造方法：

```java
// 使用给定的标记、位置、限制、容量、后备数组和数组偏移量创建一个新缓冲区
// package-private
ByteBuffer(int mark, int pos, int lim, int cap, byte[] hb, int offset) {
    super(mark, pos, lim, cap);
    this.hb = hb;
    this.offset = offset;
}
```

Buffer中的重要概念和字段：

- **容量（capacity)**：作为一个内存块，Buffer具有一定的固定大小，也称为”容量”，缓冲区容量不能为负，并且创建后不能更改（**因为它是数组**）。

- **限制（limit)**：表示缓冲区中可以操作数据的大小（limit后数据不能进行读写）。缓冲区的限制不能为负，并且不能大于其容量。
  - **写入模式，限制等于buffer 的容量。读取模式下，limit 等于写入的数据量。**

- **位置(position)**：下一个要读取或写入的数据的索引。缓冲区的位置不能为负，并且不能大于其限制

- **标记（mark）与重置（reset)**：标记是一个索弓l，通过Buffer中的mark(）方法指定Buffer中一个特定的 position，之后可以通过调用reset(）方法恢复到这个position。
  - **标记、位置、限制、容量遵守以 T 不变式：`0<=mark<=position<=limit<=capacity`**

### 缓冲区流程图解

- capacity: 最大容量；
- position: 当前已经读写的字节数；
- limit: 还可以读写的字节数。

状态变量的改变过程举例:

① 新建一个大小为 8 个字节的缓冲区，此时 position 为 0，而 limit = capacity = 8。capacity 变量不会改变，下面的讨论会忽略它。

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/1bea398f-17a7-4f67-a90b-9e2d243eaa9a.png)

② 从输入通道中读取 5 个字节数据写入缓冲区中，此时 position 移动设置为 5，limit 保持不变。

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/80804f52-8815-4096-b506-48eef3eed5c6.png)

③ 在将缓冲区的数据写到输出通道之前，需要先调用 flip() 方法，这个方法将 limit 设置为当前 position，并将 position 设置为 0。

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/952e06bd-5a65-4cab-82e4-dd1536462f38.png)

④ 从缓冲区中取 4 个字节到输出缓冲中，此时 position 设为 4。

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/b5bdcbe2-b958-4aef-9151-6ad963cb28b4.png)

⑤ 最后需要调用 clear() 方法来清空缓冲区，此时 position 和 limit 都被设置为最初位置。

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/67bf5487-c45d-49b6-b9c0-a058d8c68902.png)



### buffer 常见方法

| 方法                    | 作用                                                   |
| ----------------------- | ------------------------------------------------------ |
| Buffer clear(）         | 清空缓冲区并返回对缓冲区的引用                         |
| Buffer flip(）          | 为将缓冲区的界限设置为当前位置，并将当前位置重置为0    |
| int capacity(）         | 返回Buffer的capacity大小                               |
| boolean hasRemaining(） | 判断缓冲区中是否还有元素                               |
| int limit(）            | 返回Buffer的界限（limit）的位置                        |
| Buffer limit(int n）    | 将设置缓冲区界限为n，并返回一个具有新limit的缓冲区对象 |
| Buffer mark(）          | 对缓冲区设置标记                                       |
| int position(）         | 返回缓冲区的当前位置position                           |
| Buffer position(int n） | 将设置缓冲区的当前位置为n，并返回修改后的Buffer对象    |
| int remaining()         | 返回position和limit之间的元素个数                      |
| Buffer reset(）         | 将位置position转到以前设置的mark所在的位置             |
| Buffer rewind()         | 将位置设为为0．取消设置的mark                          |

### 数据操作方法

**取获取Buffer中的数据** 

- get()：读取单个字节 
- get (byte［〕dst)：批量读取多个字节到dst中 
- get(int index)：读取指定索引位置的字节（不会移动position) 

**放入数据到Buffer中** 

- put(byte b):将给定单个字节写入缓冲区的当前位置 
- put (byte[] src):将src中的字节写入缓存区的当前位置
- put(int index,byte b)L将指定字节写入缓存区的索引位置（不会移动position）

<br/>

## <span id="Channel">Channel 通道详解</span>

通道（Channel)：由 java.nio.channels 包定义的。Channel表示IO源与目标打开的连接。

**Channel 类似于传统的“流”。只不过Channel本身不能直接访问数据，Channel只能与Buffer进行交互。**

> BlO 中的 stream 是单向的，只能用来读或者写，而 NIO 的 Channel 是双向的。

**常用的 Channel 实现类**

- FileChannel：用于读取、写入、映射和操作文件的通道
- DatagramChannel：通过UDP读写网络中的数据通道
- SocketChannel：通过TCP读写网络中额数据
- ServerSocketChannel：可以监听新进来的TCP连接，对每一个新进来的连接都会创建一个 SocketChannel。
  - 【ServerSocketChannel类似ServerSocket，SocketChannel类似Socket】



<br/>

### 通道使用

获取通道的一种方式是对支持通道的对象调用 `getChannel()` 方法，支持这个方法的类如下：

- 本地io：`FileInputStreanm/FileOutputStream`、`RandomAccessFile`

- 网络io：`Socket`、`ServerSocket`、`DatagramSocket`

#### 文件读写

```java
 public static void writeTxt() throws Exception {
     //1.字节输出流通向目标文件
     FileOutputStream fos = new FileOutputStream("C:\\Users\\shiva\\Desktop\\1.txt");
     //2.得到字节输出流对应的通道 Channel
     FileChannel channel = fos.getChannel();
     //3.分配缓存区
     ByteBuffer buffer = ByteBuffer.allocate(1024);
     buffer.put("缓冲区写入数据到txt！".getBytes());
     //4.把缓存区切换为写模式
     buffer.flip();
     channel.write(buffer);
     channel.close();
 }

public static void readTxt() throws Exception {
    FileInputStream is = new FileInputStream("C:\\Users\\shiva\\Desktop\\1.txt");
    FileChannel channel = is.getChannel();
    ByteBuffer buffer = ByteBuffer.allocate(1024);
    channel.read(buffer);
    buffer.flip();
    String rs = new String(buffer.array(), 0, buffer.remaining());
    System.out.println(rs);
}
```

#### 通道复制

`transferForm` 、`transferTo` 两个方法，看代码就行

```java
public static void transfer() throws Exception {
    //输入流
    FileInputStream is = new FileInputStream("C:\\Users\\shiva\\Desktop\\1.txt");
    FileChannel isChannel = is.getChannel();
    //输出流
    FileOutputStream fos = new FileOutputStream("C:\\Users\\shiva\\Desktop\\2.txt");
    FileChannel fosChannel = fos.getChannel();
    //从 XXX 复制
    fosChannel.transferFrom(isChannel, isChannel.position(), isChannel.size());
    //复制到 XXX
    //isChannel.transferTo(isChannel.position(), isChannel.size(), fosChannel);
    isChannel.close();
    fosChannel.close();
}
```

<br/>

## <span id="Selector">Selector 选择器详解</span>

选择器（Selector）是SeIectabIe ChanneI对象的多路复用器，Selector可以同时监控多个 SelectableChannel 的IO状况，

也就是说，**利用 Selector 可使一个单独的线程管理多个 Channel。**

> Selector 能够检测多个注册的通道上篡若有事件发生（注意：多个Channel以事件的方式可以注册到同一个 Selector)；
>
> 如果有事件发生，便获取事件然后针对每个事件进行相应的处理。这样就可以只用一个单线程去管理多个通道，也就是管理多个连接和请求。

> 只有在连接／通道真正有读写事件发生时，才会进行读写，就大大地减少了系统开销，并且不必为每个连接都创建一个线程，不用去维护多个线程 避免了多线程之间的上下文切换导致的开销



<br/>

### Selector 使用

```java
Selector selector = Selector.open();
```

向选择器注册通道：`SelectableChannel.register(Selector sel,int ops);`

```java
ServerSocketChannel ssChannel = ServerSocketChannel.open();
ssChannel.configureBlocking(false);
ssChannel.register(selector, SelectionKey.OP_ACCEPT);
```

**通道必须配置为非阻塞模式，否则使用选择器就没有任何意义了**，

因为如果通道在某个事件上被阻塞，那么服务器就不能响应其它事件，必须等待这个事件处理完毕才能去处理其它事件，显然这和选择器的作用背道而驰。

ops指定，可以监听的事件类型（用可使用Selection Key的四个常量表示）:

- 读：SelectionKey.OP_READ (1)
- 写：SelectionKey.OP_WRITE (4)
- 连接：SelectionKey.OP_CONNECT (8)
- 接收：SelectionKey.OP_ACCEPT (16)
- **若注册时不止监听一个事件，则可以使用‘位或”操作符连接。**

```java
int interestSet = selectionKey.OP_READ | SelectionKey.OP_WERITE
```

### 事件监听

```java
int num = selector.select();
```

使用 select() 来监听到达的事件，它会一直阻塞直到有至少一个事件到达。

```
代码就不写了，上门的示例包含了全流程
```

<br/>

## <span id="参考文章">参考文章</span>

- [黑马Java-IO模式精讲(AIO&BIO&NIO)，Java-IO基础+高级+实战全套教程，黑马程序员行业大牛深度精讲_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1gz4y1C7RK?p=2&spm_id_from=pageDriver)
- [Java NIO - 基础详解 | Java 全栈知识体系 (pdai.tech)](https://www.pdai.tech/md/java/io/java-io-nio.html)
- [nio通信代码实例_一剑问九州的博客-CSDN博客_nio代码示例](https://blog.csdn.net/weixin_39327182/article/details/107252790)
- [NIO之Channel详解_我不是李大侠的博客-CSDN博客_nio的channel](https://blog.csdn.net/l18637220680/article/details/79360451)
- [黑马Java-IO模式精讲(AIO&BIO&NIO) - PDF 教材](https://gitee.com/pic_bed_of_shiva/static-resources/raw/b6c87f51e22c327068bfbbb669bac48d7122a93f/showns/file/%E9%BB%91%E9%A9%ACio%E6%95%99%E6%9D%90.pdf)











