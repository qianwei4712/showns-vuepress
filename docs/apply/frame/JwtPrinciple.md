
<div class="catalog">

- [前言](#t0)
- [认证发展历程](#t1)
  - [session+cookie](#t11)
  - [Token 机制](#t12)
  - [JWT 认证](#t13)
- [重新认识 JWT](#t2)
  - [JWT 结构](#t21)
  - [JWT 优势](#t22)
  - [JWT 缺陷](#t23)
- [JWT 认证架构设计](#t3)
- [代码示例](#t4)
- [注解切面认证](#t5)
- [参考文章](#te)

</div>


## <span id="t0">前言</span>

`2021.11.11`

- 官网地址：[https://jwt.io/introduction/](https://jwt.io/introduction/)
- 测试 Demo 地址：[jwt-unit · Learning Use Cases/Demo4j of First - 码云](https://gitee.com/learning-use-cases/demo4j-of-first/tree/master/jwt-unit)

![image-20211111212052896](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211111212052896.png)

> JSON Web 令牌（JWT）是一个开放式标准（RFC 7519），它定义了一种紧凑且自成一体的方式，用于将各方之间的信息安全传输为 JSON 对象。
>
> 此信息可以验证和信任，因为它是数字签名的。JWT 可以使用秘密（使用 **HMAC** 算法）或使用 **RSA** 或 **ECDSA** 的公/私密密钥对进行签名。

说人话，就是通过 JSON 形式作为 Web 应用中的令牌，用于在各方之间安全地将信息作为 JSON 对象传输。在数据传输过程中还可以完成数据加密、签名等相关处理。

----

官网的介绍中，JWT 的使用场景为：

- **授权**： 这是使用 JWT 最常见的方案。登录后，每个后续请求都将包括 JWT，允许用户访问该令牌允许的路线、服务和资源。单签名是当今广泛使用的 JWT 功能，因为它的开销很小，并且能够轻松地跨不同域使用。
- **信息交换**：JSON网络代币是各方安全传递信息的好方法。例如，因为 JWT 可以签名，因此使用公共/私人密钥对，您可以确定发送者就是他们所说的他们是谁。此外，由于签名是使用头和有效载荷计算的，您还可以验证内容是否未被篡改。





<br/>



## <span id="t1">认证发展历程</span>

### <span id="t11">Session+Cookie</span>

借用一下以上的的图片，因为 HTTP 是无状态请求，所以每一次请求都是全新的。

所以在早期，身份认证需要使用 Cookie + Session，客户端、服务端两个信息认证。



![在这里插入图片描述](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/20200624091112221.png)

在 web 应用早期，单体应用中可以满足使用。但是随着 web 体系发展，也有许多缺点：

- session 保存在内存或者缓存中，每次请求都需要认证 session ，增大服务器压力
- 服务扩展困难，session 需要集中管理，在分布式系统上存在先天缺陷
- 因为是基于 cookie 来进行用户识别的, cookie如果被截获，用户就会很容易受到跨站请求伪造的攻击



<br/>

### <span id="t12">Token 机制</span>

颁发 Token 最开始的使用流程可以看下图。

在刚开始，我们创建的 Token 都是 UUID，并保存到数据库，是一种比较粗糙的方式。

![image-20211111220342658](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211111220342658.png)

当然上述流程依然会有许多的优化操作，例如：

- token 保存到缓存，提高读取速度
- 客户端将 token 保存到 cookie 中，每次请求自动携带
- 服务端在拦截器中进行验证，全局配置

--------

这种 token 机制，对比传统 session 对移动端和分布式系统更加友好，存在以下优点：

- **支持跨域访问**：`cookie`是无法跨域的，而`token`由于没有用到`cookie`(前提是将`token`放到请求头中)，所以跨域后不会存在信息丢失问题
- **无状态**：`token`机制在服务端不需要存储`session`信息，因为token自身包含了所有登录用户的信息，所以可以减轻服务端压力
- **更适用CDN**：可以通过内容分发网络请求服务端的所有资料
- **更适用于移动端**：当客户端是非浏览器平台时，`cookie`是不被支持的，此时采用`token`认证方式会简单很多
- **无需考虑CSRF**：由于不再依赖`cookie`，所以采用token认证方式不会发生 CSRF，所以也就无需考虑 CSRF 的防御

<br/>

### <span id="t13">JWT 认证</span>

> **JWT 作为 Token 的一种实现方式，非常彻底得贯彻了无状态请求的理念，甚至有点矫枉过正。**



主要实现流程如下：

1. 与上述相同，客户端登录，服务端对账号密码进行验证。
2. 验证通过后，服务端将 **用户的ID或者其他信息作为 JWT Payload（负载）**，**将其与头部分别进行 Base6 4编码拼接后签名，形成一个JWT(Token)**。
3. 服务端将 JWT 字符串返回，客户端退出时删除 JWT。
4. 服务端每次 **请求时将 JWT 放入 HTTP Header 中的 Authorization 位。** (解决XSS和XSRF问题)
5. 服务端检查 JWT 是否存在，是否正确、是否过期

其实和 Token 机制没有太大的区别。

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/SJ4S5W1CAW511CS5.jpg)

<br/>



## <span id="t2">重新认识 JWT</span>

仔细对比 JWT 和 Token 可以发现很多区别。

### <span id="t21">JWT 结构</span>

在开始之前，先了解 JWT 的结构，JWT 是一串字符串，例如：

```
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.
eyJpZCI6ICIxMDA4NiIsIm5hbWUiOiAic2hpdmEiLCJyb2xlcyI6IFsiYWRtaW4iLCJ0ZXN0Il0sImxvZ2luVGltZSI6MTYzNjY0NjUxNDAwMCwiZXhwIjozNjAwMDAwfQ==.
-xN_h82PHVTCMA9vdoHrcZxH-x5mb11y1537t3rGzcM
```

JWT 字符串中有两个点，把字符串分割成三段，如图：

![image-20211111231005846](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211111231005846.png)

#### **标头 Header**

> header 有两个组成部分：令牌的类型（typ）和所使用的算法（alg），例如：HMAC、SHA256 或 RSA。它会使用 Base64 编码组成 JWT 结构的第一部分。

注意：Base64 是一种编码，也就是说，它是可以被翻译回原来的样子来的。它并不是一种加密过程。

例如 上面的 JWT 例子中的 Header ，通过解密为：

```json
{"typ":"JWT","alg":"HS256"}
```

![image-20211111232444218](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211111232444218.png)



#### **负载 Payload**

中间部分是负载，我们以前都是生成一个UUID作为令牌返回。但是 JWT 将用户信息直接返回到客户端，就是将信息添加到负载 Payload 上。

> 负载包含声明。声明是有关实体（通常是用户）和其他数据的声明。同样的，它会使用 Base64 编码组成 JWT 结构的第二部分

官方提醒，负载部分不要加入敏感信息。

通过在负载部分，我们放的都是一些基础信息，例如：`令牌颁发服务系统`、`用户名`、`角色`、`用户ID`、`部门`、`企业`、`登录过期时间` 等。

```json
{
  "id": "10086",
  "name": "shiva",
  "roles": ["admin","test"],
  "loginTime":1636646514000,
  "expire":3600000
}
```

**官方标准中注册的声明** (建议但不强制使用) ：

- **iss**: jwt签发者
- **sub**: jwt所面向的用户
- **aud**: 接收jwt的一方
- **exp**: jwt的过期时间，这个过期时间必须要大于签发时间
- **nbf**: 定义在什么时间之前，该jwt都是不可用的.
- **iat**: jwt的签发时间
- **jti**: jwt的唯一身份标识，主要用来作为一次性token,从而回避重放攻击。



#### **验证 Singurater**

JWT中，Header 、Payload 都相当于是明文传输。所以，作为身份验证得功能，就在 Singurater 中实现。

验签字符串得获得方式为：

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211113174922936.png)

可以很明显看出，加密方式、明文、加密后密文，都已经拿到了。只有一个 密钥secret 是服务端自己保存得。

> 所以，JWT 作为身份验证，唯一的核心就是这个密钥。这个密钥用于加密、和验证。



<br/>

### <span id="t22">JWT 优势</span>

- 简洁(Compact): 可以通过URL，POST参数或者在HTTP header发送，因为数据量小，传输速度也很快
- 自包含(Self-contained)：负载中包含了所有用户所需要的信息，避免了多次查询数据库
- 因为Token是以JSON加密的形式保存在客户端的，所以JWT是跨语言的，原则上任何 web 形式都支持。
- 不需要在服务端保存会话信息，特别适用于分布式微服务。
- 最后最后，上手简单，学习成本极低。



<br/>

### <span id="t23">JWT 缺陷</span>

- JWT 因为将过期时间留在负载，对一个已颁发的 JWT，**服务端丧失了主动过期的权限，一旦 JWT 泄露，只能等到它过期而别无他法** 。对于部分对主动过期有要求的系统来说不适合用 jwt
- 因为负载可以存放数据，通常会不自觉将很多信息加到里面。对比元数据，JWT 采用base64编码，至少是原数据量的 4/3 大小。**会导致 JWT 很长，导致请求 header 比 body 还大** 。而SessionId只是很短的一个字符串，因此使用JWT的Http请求比使用Session的开销大得多。
- 根据推荐设计，JWT的过期时间是参与了JWT的签名过程（exp字段），这样会导致按标准实现的JWT token无法续签，因为过期时间是签名的一部分，那就无法续签这个JWT本身，需要分发新的token。

> 这里总结了 JWT 的设计权限，通常我们会在服务端加入 redis 来做状态存储，以便实现主动过期。
>
> 但是这和 session 又有什么区别，还不如直接用 session 来得开销小。



<br/>

## <span id="t3">JWT 认证架构设计</span>

实际应用中，一般也就两种场景：

### **统一认证**

![image-20211112222314448](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211112222314448.png)

- 在应用网关验签后，获取用户信息。
- 优点是：可以做到无侵入校验，对验证无感知。
- 缺点是：请求、验证都集中在网关，并发压力提高后容易出问题。代码执行效率低，很多不需要验签的请求也会过网关验签。

<br/>



### **独立认证**

![image-20211112222236072](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211112222236072.png)

- 在每个模块，或者控制器来进行验签判断。
- 优点是：控制灵活，可以按需进行校验。
- 缺点是：需要手动添加代码，提高了问题出现率。

<br/>



## <span id="t4">代码示例</span>

其实，针对 JWT 这个小应用，应该不需要写什么代码。因为验证逻辑和使用场景都非常明显。

**这里就先做个简单测试，实际应用自行修改，工具类请自行封装、全局配置自行维护**

pom 依赖：

```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt</artifactId>
    <version>0.9.1</version>
</dependency>
```

登录，颁发 jwt ：

```java
 public static final String SECRET = "S@&op@!@.S5!)(@{";

@RequestMapping("login")
public Result<Object> login(String username, String password) {
    if (!"admin".equals(username) || !"admin".equals(password)) {
        return Result.builder().code(1).message("用户名或密码错误").build();
    }
    // 准备 负载数据
    Map<String, Object> payload = new HashMap<>();
    payload.put("id", 1);
    payload.put("username", username);
    payload.put("roles", new String[]{"admin", "test"});
    payload.put("loginTime", System.currentTimeMillis());

    // 组装 JWT 令牌
    String jwt = Jwts.builder()
        .setHeaderParam("typ", "JWT")
        .setHeaderParam("alg", "HS256")
        .setClaims(payload)
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + 30 * 60 * 1000))
        .signWith(SignatureAlgorithm.HS256, SECRET)
        .compact();

    return Result.builder().code(0).message("登录成功").data(jwt).build();
}
```

> **注意：先添加 claims 再添加过期时间！**

![image-20211113151054896](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211113151054896.png)



验证测试：

```java
@RequestMapping("confirmJwt")
public Result<Object> confirmJwt(HttpServletRequest request) {
    String jwt = request.getHeader("Authorization");
    try {
        // 验证
        Claims body = Jwts.parser().setSigningKey(SECRET).parseClaimsJws(jwt).getBody();
        System.out.println(body.getIssuedAt());
        System.out.println(body.getExpiration());
        System.out.println(body.get("roles"));
        return Result.builder().code(0).message("校验成功").data(body.toString()).build();
    } catch (ExpiredJwtException e) {
        e.printStackTrace();
        return Result.builder().code(1).message("JWT 过期").build();
    } catch (UnsupportedJwtException e) {
        e.printStackTrace();
    } catch (MalformedJwtException e) {
        e.printStackTrace();
        return Result.builder().code(1).message("非正常 JWT ").build();
    } catch (SignatureException e) {
        e.printStackTrace();
        return Result.builder().code(1).message("JWT签名不匹配").build();
    }
    return Result.builder().code(1).message("验证出错").build();
}
```

![image-20211113151541870](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211113151541870.png)



<br/>



## <span id="t5">注解切面认证</span>

实际项目中，肯定是会有方法区分，有的需要认证，有的不需要。就像上面架构设计中的第二个方式。

现在对需要认证的进行统一方法配置，要做到尽量少代码，现在我们通用的方式是加注解。

> **主要思路：自定义注解 + 拦截器**

下面给个例子。

添加自定义注解：

```java
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface IgnoreJwt {
    /**
     * 是否忽略 jwt 验证
     */
    boolean ignored() default true;
}
```

添加拦截器：

```java
@Component
public class AuthorizationInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        String jwt = request.getHeader("Authorization");
        // 如果不是映射到方法直接通过
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }
        HandlerMethod handlerMethod = (HandlerMethod) handler;
        Method method = handlerMethod.getMethod();
        //检查是否有 IgnoreJwt 注释，有则跳过认证
        if (method.isAnnotationPresent(IgnoreJwt.class)) {
            IgnoreJwt ignoreJwt = method.getAnnotation(IgnoreJwt.class);
            if (ignoreJwt.ignored()) {
                return true;
            }
        }

        // 省略其他验证，直接拿 jwt
        Claims claims = Jwts.parser().setSigningKey("S@&op@!@.S5!)(@{").parseClaimsJws(jwt).getBody();
        //放入attribute以便后面调用
        request.setAttribute("claims", claims);

        return HandlerInterceptor.super.preHandle(request, response, handler);
    }
}
```





<br/>

## <span id="te">参考文章</span>

[【编程不良人】JWT认证原理、流程整合springboot实战应用,前后端分离认证的解决方案!_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1i54y1m7cP)

[五分钟带你了解啥是JWT - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/86937325)

[什么是 JWT -- JSON WEB TOKEN - 简书 (jianshu.com)](https://www.jianshu.com/p/576dbf44b2ae)

[JWT(JSON Web Token)简介 - 竹林听雨行 - 博客园 (cnblogs.com)](https://www.cnblogs.com/cxxtreasure/p/14173315.html)

[JWT详解 | 包包的Tech Pool (baobao555.tech)](https://www.baobao555.tech/posts/4cc42459/)

[SpringBoot整合JWT_AkiraNicky的博客-CSDN博客](https://blog.csdn.net/AkiraNicky/article/details/99307713)

[利用Springboot实现Jwt认证_菜鸡的博客-CSDN博客](https://blog.csdn.net/qq_43948583/article/details/104437752)

[【IT老齐024】前后端分离架构下JWT认证该怎么设计？_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1C44y1k7VC?spm_id_from=333.999.0.0)

[【IT老齐025】无状态的JWT令牌如何实现续签功能？_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1ov411N7iw?spm_id_from=333.999.0.0)

[利用Springboot实现Jwt认证_菜鸡的博客-CSDN博客](https://blog.csdn.net/qq_43948583/article/details/104437752)
