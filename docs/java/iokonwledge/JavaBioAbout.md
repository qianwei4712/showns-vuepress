
<div class="catalog">

- [开场废话](#开场废话)
- [传统的BIO通信方式](#传统的BIO通信方式)
  - [BIO的问题](#BIO的问题)
  - [多线程优化-伪异步](#多线程优化)
- [BIO 代码模拟](#BIO代码模拟)
  - [一Client、一Server](#一Client、一Server)
  - [多Client、一Server](#多Client、一Server)
  - [伪异步实现](#伪异步实现)
- [BIO 问题根源](#BIO问题根源)
- [参考文章](#参考文章)

</div>

## <span id="开场废话">开场废话</span>

`2022.04.03`

BIO 就是 blocking IO，同步并阻塞（传统阻塞型），它是最简单的IO工作方式，服务器实现模式为**一个连接一个线程**。

> 应用程序向操作系统请求网络IO操作，这时应用程序会一直等待；另一方面，操作系统收到请求后，也会等待，直到网络上有数据传到监听端口；
>
> 操作系统在收集数据后，会把数据发送给应用程序；最后应用程序受到数据，并解除等待状态。

类似就是这样：

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/image-20220403094819434.png)

<br>

## <span id="传统的BIO通信方式">传统的BIO通信方式</span>

以前大多数网络通信方式都是阻塞模式的，即:

- 客户端向服务器端发出请求后，客户端会一直等待(不会再做其他事情)，直到服务器端返回结果或者网络出现问题。
- 服务器端同样的，当在处理某个客户端A发来的请求时，另一个客户端B发来的请求会等待，直到服务器端的这个处理线程完成上一个处理。

<img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/java-io-bio-1.png" style="zoom:80%;" />

<br>



### <span id="BIO的问题">BIO 的问题</span>

这里可能需要着重解释。

对我们这些习惯使用 Spring 全家桶的初级玩家，虽然能看懂这在说什么，但是却无法理解到位。因为我们习惯使用的都是 JDK 8。

> **正在的传统 BIO 模式下，应该说阻塞的其实是主线程**

举个例子：

- **我们写了一个服务端，监听 8090 端口**
- **那么在BIO的限制下，这个 8090 端口一次只能连接一个请求**
- **这时候如果有多个客户端请求，同时只能处理一个请求**

这显然是有问题的。

<br>

### <span id="多线程优化">多线程优化-伪异步</span>

这么严重的问题，大佬们肯定是会想办法解决的，所以就有了多线程处理，伪异步方式。

这个方式可以在 BIO 下实现多客户端连接，实际上是

- **主线程 8090 不负责处理实际业务，只负责接收连接请求**
- **主线程接收到连接请求后，再创建一个新线程，新线程负责和请求建立长连接**
- **这样就达到了异步的实现**

<img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/java-io-bio-2.png" style="zoom:80%;" />

当然，应用层面的解决方案都不能实际解决问题，只能延迟问题暴露的时间。

这种方式的问题在于：

1. **服务器虽然是多线程处理业务，但是操作系统通知accept()的方式还是单个的** ， 所以操作系统接收数据依然是一个一个来的。
2. 长链接会占用线程资源，操作系统的线程是有限的，但是 **线程开的越多，CPU切换线程花费的时间就越长** 。
3. JVM 创建线程是需要分配空间的，也是很费性能的

> **所以，BIO真正的问题其实不是阻塞等待，而是操作系统层面，对 accept()、read() 的操作点都是被阻塞**

<br>

## <span id="BIO代码模拟">BIO 代码模拟</span>

### <span id="一Client、一Server">一Client、一Server</span>

传统基础一对一 socket：

```java
public static void main(String[] args) throws IOException {
    System.out.println("===服务端启动===");
    //1.定义一个ServerSocket对象进行服务端的端口注册
    ServerSocket ss = new ServerSocket(9999);
    // 2. 监听客户端的Socket连接请求
    Socket socket = ss.accept();
    //3.从socket管道中得到一个字节输入流对象
    InputStream is = socket.getInputStream();
    //4.把字节输入流包装成一个缓存字符输入流
    BufferedReader br = new BufferedReader(new InputStreamReader(is));
    String msg;
    while ((msg = br.readLine()) != null) {
        System.out.println("服务端接收到：" + msg);
    }
}
```

```java
public static void main(String[] args) throws IOException {
    //1.创建Socket对象请求服务端的连接
    Socket socket = new Socket("127.0.0.1", 9999);
    //2.从Socket对象中获取一个字节输出流
    OutputStream os = socket.getOutputStream();
    //3.把字节输出流包装成一个打印流
    PrintStream ps = new PrintStream(os);
    //控制台数据
    Scanner scanner = new Scanner(System.in);
    while (true) {
        ps.println(scanner.nextLine());
        ps.flush();
    }
}
```

<br>

### <span id="多Client、一Server">多Client、一Server</span>

两个线程来发起请求，但是服务端只有一个接受线程：

```java
public static void main(String[] args) throws IOException {
    new Thread(() -> instanceSocket()).start();
    new Thread(() -> instanceSocket()).start();
}

public static void instanceSocket() {
    try {
        //1.创建Socket对象请求服务端的连接
        Socket socket = new Socket("127.0.0.1", 9999);
        //2.从Socket对象中获取一个字节输出流
        OutputStream os = socket.getOutputStream();
        //3.把字节输出流包装成一个打印流
        PrintStream ps = new PrintStream(os);
        //控制台数据,发5条数据
        for (int i = 0; i < 5; i++) {
            Thread.sleep((long) (Math.random() * 100));
            ps.println(Math.random());
            ps.flush();
        }
        socket.close();
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```

服务端只有一个线程：

```java
public static void main(String[] args) throws IOException {
    System.out.println("===服务端启动===");
    //1.定义一个ServerSocket对象进行服务端的端口注册
    ServerSocket ss = new ServerSocket(9999);
    while (true){
        //循环监听
        //2. 监听客户端的Socket连接请求
        Socket socket = ss.accept();
        //3.从socket管道中得到一个字节输入流对象
        InputStream is = socket.getInputStream();
        //拿到请求方的端口
        int sourcePort = socket.getPort();
        //4.把字节输入流包装成一个缓存字符输入流
        BufferedReader br = new BufferedReader(new InputStreamReader(is));
        String msg;
        while ((msg = br.readLine()) != null) {
            System.out.println("接收来自端口:" + sourcePort + "，的消息，内容：" + msg);
        }
    }
}
```

所以只有第一个线程结束后，才能接收第二个请求的连接：

```
===服务端启动===
接收来自端口:13246，的消息，内容：0.5565519439232993
接收来自端口:13246，的消息，内容：0.9260834025244232
接收来自端口:13246，的消息，内容：0.5878731082829873
接收来自端口:13246，的消息，内容：0.8354214340809363
接收来自端口:13246，的消息，内容：0.8136386830166947
接收来自端口:13247，的消息，内容：0.5332692450686916
接收来自端口:13247，的消息，内容：0.6679386892347156
接收来自端口:13247，的消息，内容：0.2991566117277602
接收来自端口:13247，的消息，内容：0.13682948827391217
接收来自端口:13247，的消息，内容：0.5830977040433732
```



<br>

### <span id="伪异步实现">伪异步实现</span>

上面已经说过了，弄个线程池来接收请求链接。

客户端代码不变，服务端修改为线程池进行业务处理：

```java
 public static void main(String[] args) throws IOException {
     System.out.println("===服务端启动===");
     //1.定义一个ServerSocket对象进行服务端的端口注册
     ServerSocket ss = new ServerSocket(9999);
     ThreadPoolExecutor pool = new ThreadPoolExecutor(3, 3, 120, TimeUnit.SECONDS, new ArrayBlockingQueue<Runnable>(100));
     while (true) {
         //2. 监听客户端的Socket连接请求
         Socket socket = ss.accept();
         pool.execute(instanceSocket(socket));
     }
 }

public static Runnable instanceSocket(Socket socket) {
    return () -> {
        try {
            //3.从socket管道中得到一个字节输入流对象
            InputStream is = socket.getInputStream();
            //拿到请求方的端口
            int sourcePort = socket.getPort();
            //4.把字节输入流包装成一个缓存字符输入流
            BufferedReader br = new BufferedReader(new InputStreamReader(is));
            String msg;
            while ((msg = br.readLine()) != null) {
                System.out.println("接收来自端口:" + sourcePort + "，的消息，内容：" + msg);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    };
}
```

打印结果：

```
===服务端启动===
接收来自端口:14094，的消息，内容：0.0784982639146562
接收来自端口:14093，的消息，内容：0.41119231709991066
接收来自端口:14094，的消息，内容：0.6091203361403802
接收来自端口:14093，的消息，内容：0.9141225888543466
接收来自端口:14093，的消息，内容：0.9052556254115217
接收来自端口:14094，的消息，内容：0.6466857483862705
接收来自端口:14093，的消息，内容：0.7838232857236332
接收来自端口:14094，的消息，内容：0.3363937180511376
接收来自端口:14094，的消息，内容：0.8810532858771326
接收来自端口:14093，的消息，内容：0.24303075043130606
```

<br/>

## <span id="BIO问题根源">BIO 问题根源</span>

可以看到，打印出来的输出数据，端口已经是随机的了。

到这里也可以看到：

```java
 //2. 监听客户端的Socket连接请求
 Socket socket = ss.accept();
```

这一步是在主线程内的，不同线程间的切换要向CPU抢资源

**所以还没有建立连接的新请求，都必须排队进行 accept**

----

下面开始复制大佬的文章：

API文档中对于 serverSocket.accept() 方法的使用描述:

> Listens for a connection to be made to this socket and accepts it. The method blocks until a connection is made.

serverSocket.accept()会被阻塞? 这里涉及到阻塞式同步IO的工作原理:

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/java-io-bio-4.png)

- 注意，是询问操作系统。也就是说socket套接字的IO模式支持是基于操作系统的，那么自然同步IO/异步IO的支持就是需要操作系统级别的了。如下图:

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/java-io-bio-5.png)

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/java-io-bio-6.png)

如果操作系统没有发现有套接字从指定的端口X来，那么操作系统就会等待。

这样serverSocket.accept()方法就会一直等待。

这就是为什么accept()方法为什么会阻塞: 它内部的实现是使用的操作系统级别的同步IO



<br/>

## <span id="参考文章">参考文章</span>

- [Java IO - BIO 详解 | Java 全栈知识体系 (pdai.tech)](https://www.pdai.tech/md/java/io/java-io-bio.html)
- [黑马Java-IO模式精讲(AIO&BIO&NIO)，Java-IO基础+高级+实战全套教程，黑马程序员行业大牛深度精讲_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1gz4y1C7RK?p=2&spm_id_from=pageDriver)











