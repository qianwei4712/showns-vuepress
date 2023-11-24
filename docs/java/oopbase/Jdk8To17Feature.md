<div class="catalog">

- [JDK 9](#9)
- [JDK 10](#10)
- [JDK 11](#11)
- [JDK 12](#12)
- [JDK 13](#13)
- [JDK 14](#14)
- [JDK 15](#15)
- [JDK 16](#16)
- [JDK 17](#17)
- [参考文章](#te)

</div>

> 现在已经是 `2023-11`，JDK21 都发布了，公司主力还是 8，罪过罪过；
>
> 先整理 9-17，再整理 18-21；明年开始就是 21 了。。

> 只挑选一些，自以为重要，或者对实际编码有影响的改进。。

## <span id="9">JDK 9</span>

![img](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/java-9.png)

### 集合相关新增

**集合新增了工厂构建方式：**

```java
        //工厂模式创建集合，简化代码，不错不错
        List<String> strings = List.of("1", "2");
        Set<String> strings1 = Set.of("1", "2");
        Map<String, String> k1 = Map.of("k1", "v1", "k2", "v2");
```

**Stream 中增加了新的方法 ofNullable、dropWhile、takeWhile：**

第一个 `ofNullable` ，想了想应该不怎么实用：

```java
        //Stream，可以传入为空参数，少做一步判空判断
        Stream.ofNullable(null).forEach(System.out::println);
        //但是返回为传入得泛型。又好像没那么实用
        Stream<List<String>> listStream = Stream.ofNullable(List.of("1", "2"));
```

第二个 `dropWhile` ，丢弃流中满足给定条件的元素，**直到遇到第一个不满足条件的元素**：

```java
        //1满足条件，2不满足，后面不再执行，直接结束
        List<Integer> collect = List.of(1, 2, 3, 4, 5).stream()
                .dropWhile(i -> i % 2 != 0)
                .collect(Collectors.toList());
```

第三个 `takeWhile` 和 `dropWhile` 相反；会将满足条件得收集起来。

### JVM

> **G1 设为默认的垃圾回收器实现，CMS 垃圾回收器已经被声明为废弃**

其他得看不懂，有这一句就够了。

## <span id="10">JDK 10</span>

![img](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/java-10.jpg)

其他的好像和开发没什么影响；只有一点还有点用 `var` ：

下面是一个使用 `var` 关键字的示例：

```java
var message = "Hello, World!";
var numbers = List.of(1, 2, 3, 4, 5);
```

在上面的示例中，我们使用 `var` 关键字声明了两个变量 `message` 和 `numbers`。

编译器会根据初始化表达式的类型推断出变量的类型。在第一行中，`message` 的类型将被推断为 `String`，因为初始化表达式是一个字符串字面值。在第二行中，`numbers` 的类型将被推断为 `List<Integer>`，因为初始化表达式是一个整数列表。

使用 `var` 关键字可以简化代码，尤其是在涉及复杂的泛型类型或匿名类型时。它可以提高代码的可读性和可维护性，并减少冗余的类型声明。

需要注意的是，`var` 关键字只能用于局部变量的声明，不能用于方法的参数、方法的返回类型或类的字段。此外，虽然 `var` 关键字可以简化代码，但过度使用它可能会降低代码的可读性，因此在使用时应适度。

## <span id="11">JDK 11</span>

![img](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/java-11.jpg)

JDK 11 是 8 之后的另一个 LTS 版本；不过好像除了 GC 变化，没啥大的变化。

### 标准 HTTP Client 升级

Java 11 中的新 Http Client API，提供了对 HTTP/2 等业界前沿标准的支持，同时也向下兼容 HTTP/1.1，精简而又友好的 API 接口，与主流开源 API（如：Apache HttpClient、Jetty、OkHttp 等）类似甚至拥有更高的性能。

与此同时它是 Java 在 Reactive-Stream 方面的第一个生产实践，其中广泛使用了 Java Flow API，终于让 Java 标准 HTTP 类库在扩展能力等方面，满足了现代互联网的需求，是一个难得的现代 Http/2 Client API 标准的实现，Java 工程师终于可以摆脱老旧的 HttpURLConnection 了。

下面模拟 Http GET 请求并打印返回内容：

```java
  		// 创建一个 HTTP 客户端
        HttpClient client = HttpClient.newHttpClient();

        // 创建一个 HTTP 请求
        HttpRequest request = HttpRequest.newBuilder()
                .uri(new URI("https://api.example.com/users"))
                .GET()
                .build();

        // 发送请求并获取响应
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        // 处理响应
        int statusCode = response.statusCode();
        String responseBody = response.body();

        System.out.println("Status Code: " + statusCode);
        System.out.println("Response Body: " + responseBody);
```

和工具类差不多了，以后可以不用第三方了

## <span id="12">JDK 12</span>

![img](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/java-12.png)

switch 功能强化：

```java
private static String getText(int number) {
    String result = switch (number) {
        case 1, 2 -> "one or two";
        case 3 -> "three";
        case 4, 5, 6 -> "four or five or six";
        default -> "unknown";
    };
    return result;
}
```

## <span id="13">JDK 13</span>

![img](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/java-13.jpg)

## <span id="14">JDK 14</span>

![img](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/java-14.png)

<span id="15">JDK 15</span>

![img](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/java-15.png)

## <span id="16">JDK 16</span>

![img](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/java-16.png)

## <span id="17">JDK 17</span>

![img](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/java-17.png)

## <span id="te">参考文章</span>

1. [Java 9 新特性概述 | Java 全栈知识体系 (pdai.tech)](https://www.pdai.tech/md/java/java8up/java9.html)
1. [JDK 新特性篇：JDK 9 新特性详解-CSDN 博客](https://blog.csdn.net/zhiqi_l163991102/article/details/131414766)
1. [Java 10 新特性概述 | Java 全栈知识体系 (pdai.tech)](https://www.pdai.tech/md/java/java8up/java10.html)
1. [Java 11 新特性概述 | Java 全栈知识体系 (pdai.tech)](https://www.pdai.tech/md/java/java8up/java11.html)
1. [Java 12 新特性概述 | Java 全栈知识体系 (pdai.tech)](https://www.pdai.tech/md/java/java8up/java12.html)
1. [Java 13 新特性概述 | Java 全栈知识体系 (pdai.tech)](https://www.pdai.tech/md/java/java8up/java13.html)
1. [Java 14 新特性概述 | Java 全栈知识体系 (pdai.tech)](https://www.pdai.tech/md/java/java8up/java14.html)
1. [Java 15 新特性概述 | Java 全栈知识体系 (pdai.tech)](https://www.pdai.tech/md/java/java8up/java15.html)
1. [Java 16 新特性概述 | Java 全栈知识体系 (pdai.tech)](https://www.pdai.tech/md/java/java8up/java16.html)
1. [Java 17 新特性概述 | Java 全栈知识体系 (pdai.tech)](https://www.pdai.tech/md/java/java8up/java17.html)
