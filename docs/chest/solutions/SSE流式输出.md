<div class="catalog">

- [基本介绍](#基本介绍)
- [特点对比](#特点对比)
- [测试代码](#测试代码)
- [基于SpringBoot的集成案例](#基于SpringBoot的集成案例)
- [参考文章](#参考文章)

</div>

### <span id="基本介绍">基本介绍</span>

`2025.04.03` *最近高产似母猪.....*

- 测试Demo地址：[code of shiva - GitHub.com](https://github.com/Temporary-of-Mine/code-of-shiva/tree/master/server-sent-events)

从GPT开始，本来我就打算学一下 SSE，那时候刚出现流式回答让人眼前一亮，不过当时用不上也就没研究。

> SSE( Server-sent Events )基于 HTTP 协议，它是 WebSocket 的一种轻量代替方案。

相当于我们在 HTTP 协议下，发送一个请求之后，可以持续获得相应。

这对我们后端的接口开发来说，刚开始看到还是很新奇的，有点类似 websocket

![image-20250403234130538](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/image-20250403234130538.png)

<br>

### <span id="特点对比">特点对比</span>

##### HTTP轮询

短轮询是最简单的，也不用过多介绍。

**优点：**代码简单，是个人都能写

**缺点：**开销巨巨巨巨巨大

##### 服务器发送事件（SSE）

> SSE 是基于传统的 HTTP 协议实现的，采用了长轮询（[long-polling](https://zhida.zhihu.com/search?content_id=242267906&content_type=Article&match_order=1&q=long-polling&zhida_source=entity)）机制。客户端通过向服务器发送一个 HTTP 请求，服务器保持连接打开并周期性地向客户端发送数据。SSE 通过 [EventSource](https://zhida.zhihu.com/search?content_id=242267906&content_type=Article&match_order=1&q=EventSource&zhida_source=entity) 对象来实现，在客户端可以通过监听 onmessage 事件来接收服务器端发送的数据。

SSE 适用于需要服务器向客户端单向实时推送数据的场景，例如实时更新的统计数据、股票行情、站内消息等。

*SSE默认支持断线重连，还不错......*

**优点：**简单易用，对服务器压力小，浏览器兼容性好，自动重连

**缺点：**只支持单向通信，无法进行双向交互。

##### Websocket

WebSocket 适用于需要客户端和服务器之间实时双向通信的场景，例如聊天室、小游戏应用等。

**优点：**支持双向通信，实时性更高，可以实现更丰富的交互效果。

**缺点：**需要独立的 TCP 连接，对服务器压力更大，浏览器兼容性相对较差。

##### Webhooks

这是由服务端发起，基于事件的实时推送技术。要求客户端也能接收处理HTTP请求，可以从外部访问到服务。一般用在：支付回调、自动化任务、集成第三方服务

**优点：**实时性好、架构简单、容易出现异常

**缺点：**依赖外部服务、安全性不能保障、数据处理由限制

<br>



### <span id="测试代码">测试代码</span>

为了简单起见，用 thymeleaf 模板做页面，反正里面也是 vue 调接口。

> **注意注意：SSE返回数据的格式为下述公式，这是标准格式。不然不会触发 onmessage 方法**

$$
data: + 内容 + \n\n
$$

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>测试SSE</title>
    <script th:src="@{/static/vue.global.js}"></script>
</head>
<body>
<div id="app">
    <div>
        <button @click="send">发起调用</button>
        <button @click="end">中止输出</button>
    </div>
    <div style="margin-top: 15px">
        <textarea v-model="content" rows="20">
        </textarea>
    </div>

</div>
<script>
    Vue.createApp({
        el: '#app',
        data() {
            return {
                content: "",
                sse: null,
            }
        },
        created() {
        },
        methods: {
            send() {
                const that = this
                if (that.sse) return; // 避免重复创建
                //TODO 会自动重连，就算后台已经完成了本次接口调用，也会重新链接；所以只能做一个demo
                that.sse = new EventSource('/sse');
                that.sse.onmessage = function (evt) {
                    if (evt.data.indexOf("event: close") !== -1) {
                        that.sse.close()
                        this.sse = null
                        return
                    }
                    that.content = that.content + evt.data
                }
            },
            end() {
                if (this.sse == null) {
                    return
                }
                this.sse.close()
                this.sse = null
            }
        }
    }).mount("#app");
</script>

</body>
</html>
```

```java
@RequestMapping("sse")
public void sse(HttpServletResponse response) {
    //设置返回格式，SSE
    response.setContentType("text/event-stream");
    response.setCharacterEncoding("UTF-8");

    AtomicBoolean isRunning = new AtomicBoolean(true);
    int count = 0;

    try (PrintWriter writer = response.getWriter()) {
        // 检测客户端是否断开（通过 IOException）
        // TODO 示例代码：最多发送 30 条
        while (isRunning.get() && count < 30) {
            count++;
            String data = "data: " + DateUtil.format(new Date(), "yyyy-MM-dd HH:mm:ss") + "\n\n";
            writer.write(data);
            writer.flush();

            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                isRunning.set(false);
            }
        }

        // 主动发送关闭事件
        writer.write("event: close\ndata: Connection closed by server\n\n");
        writer.flush();
    } catch (IOException e) {
        // 客户端断开连接时触发
        System.out.println("Client disconnected");
    }
}
```

![image-20250406224232740](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/image-20250406224232740.png)



<br/>

### <span id="基于SpringBoot的集成案例">基于SpringBoot的集成案例</span>

Spring自带的SSE更加方便：

```java
@RequestMapping("springSSE")
public SseEmitter springSSE(HttpServletResponse response) {
    // 3S超时
    SseEmitter emitter = new SseEmitter(10000L);
    // 注册回调函数，处理服务器向客户端推送的消息
    emitter.onCompletion(() -> {
        System.out.println("Connection completed");
        // 在连接完成时执行一些清理工作
    });
    emitter.onTimeout(() -> {
        System.out.println("Connection timeout");
        // 在连接超时时执行一些处理
        emitter.complete();
    });
    // 在后台线程中模拟实时数据
    new Thread(() -> {
        try {
            for (int i = 0; i < 10; i++) {
                emitter.send(SseEmitter.event().name("message").data("[" + new Date() + "] Data #" + i));
                Thread.sleep(1000);
            }
            emitter.complete(); // 数据发送完成后，关闭连接
        } catch (IOException | InterruptedException e) {
            emitter.completeWithError(e); // 发生错误时，关闭连接并报错
        }
    }).start();

    return emitter;
}
```





<br>

### <span id="参考文章">参考文章</span>

[WebSocket和SSE的区别 - 知乎](https://zhuanlan.zhihu.com/p/693619584)

[SSE技术详解：使用 HTTP 做服务端数据推送应用的技术-腾讯云开发者社区-腾讯云](https://cloud.tencent.com/developer/article/1999650)

[HTTP轮询 vs SSE vs WebSocket vs WebHooks_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1aC411H7tG/)

[【IT老齐237】超好用Web服务端主动推送技术SSE_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1Ke4y117UH/?spm_id_from=333.337.search-card.all.click&vd_source=e768d8ae5d35e9620400ecb1e8983682)

[Vue+（SSE）EventSource实现流式输出_vue sse-CSDN博客](https://blog.csdn.net/qq_51201589/article/details/140455494)

[09. Springboot集成sse服务端推流-腾讯云开发者社区-腾讯云](https://cloud.tencent.com/developer/article/2384205?policyId=1003)



