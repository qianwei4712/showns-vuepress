<div class="catalog">

- [前言](#t0)
- [示例代码](#t1)
  - [Hello World](#t11)
  - [切入点扩展](#t12)
  - [切入点表达式](#t13)
- [实现原理](#t2)
- [参考文章](#te)

</div>


## <span id="t0">前言</span>

`2022.09.14 忙着搞私活，好久没学习了`

> **AOP 切面的作用是：将重复的代码抽取成一个方法，当需要的时候进行调用，而不影响业务正常使用，不侵入代码。**

- 测试代码：[spring-aop · Learning Use Cases/Demo4j of First - 码云 - 开源中国 (gitee.com)](https://gitee.com/learning-use-cases/demo4j-of-first/tree/master/spring-aop)

先把定义放上，可能不是很好懂。。。

| 术语     | 定义                                                         | 说明                                                         |
| -------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 连接点   | 在程序执行过程中某个特定的点，比如某方法调用的时候或者处理异常的时候。<br/>在Spring AOP中，一个连接点*总是*表示一个方法的执行。 | **类里面哪些方法可以被增强**，这些方法称为连接点<br/>其实就是目标方法，在目标方法中要实现目标方法的功能和切面功能。 |
| 切入点   | 匹配连接点的断言。通知和一个切入点表达式关联，并在满足这个切入点的连接点上运行； | **实际被真正增强的方法**，称为切入点<br/>代理类中有的方法被增强了，有的没有，被增强的这些叫切入点。 |
| 切面     | 一个关注点的模块化，这个关注点可能会横切多个对象             | 把通知应用到切入点的过程叫做切面<br/>就是那些重复的、公共的、通用的功能，例如：日志、事务、权限 |
| 通知     | 在切面的某个特定的连接点上执行的动作，包括了“around”、“before”和“after”等 | 来指定切入的时机，在目标方法执行前还是执行后还是出错时       |
| 目标对象 | 被一个或者多个切面所通知的对象。也被称做 被通知（advised）对象 | 其实就是目标方法                                             |

再生动一些看看这个图：

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/1216877-20170829192756640-1408945673.png)

----

然后这里的通知类型有：

| @Before() | @AfterReturning            | @Around  | @AfterThrowing() | @After()                  |
| --------- | -------------------------- | -------- | ---------------- | ------------------------- |
| 前置通知  | 后置通知（也叫做返回通知） | 环绕通知 | 异常通知         | 最终通知（相当于finally） |



<br/>

## <span id="t1">示例代码</span>

### <span id="t11">Hello World</span>

原始的 XML 配置方式、配置文件方式就不写了，直接使用 springboot 进行注册案例。

要看配置文件方式的，进传送门：[Spring配置切面的几种方式 - 张财华 - 博客园 (cnblogs.com)](https://www.cnblogs.com/zhangcaihua/p/12930900.html)

首先引入依赖：

```xml
 <dependency>
     <groupId>org.springframework.boot</groupId>
     <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

测试类：

```java
@Slf4j
@RunWith(SpringRunner.class)
@SpringBootTest(classes = {SpringAopApplication.class})
public class SpringAopApplicationTests {
    @Autowired
    private NoticeService noticeService;
    @Test
    public void test() {
        log.info("上级方法调用返回值：{}",noticeService.listNotice());
    }
}
```

service连接点：

```java
@Slf4j
@Service
public class NoticeService {
    public String listNotice() {
        log.info("开始执行 service 方法");
//        int i =1/0;
        return "方法执行结束，返回";
    }
}
```

切面：

```java
@Slf4j
@Aspect
@Component
public class ServiceAspect {
    @Before("execution(* cn.shiva.springaop.service.NoticeService.*(..))")
    public void before() {
        log.info("1.前置通知，方法执行之前。");
    }
    @AfterReturning("execution(* cn.shiva.springaop.service.NoticeService.*(..))")
    public void afterReturning() {
        log.info("2.后置通知，方法返回参数之后。");
    }
    @After("execution(* cn.shiva.springaop.service.NoticeService.*(..))")
    public void after() {
        log.info("3.最终通知，全部执行结束之后。");
    }
    @AfterThrowing("execution(* cn.shiva.springaop.service.NoticeService.*(..))")
    public void afterThrowing() {
        log.info("9.异常通知，抛出异常之后。");
    }
    @Around("execution(* cn.shiva.springaop.service.NoticeService.*(..))")
    public Object around(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        log.info("环绕通知执行之前");
        proceedingJoinPoint.proceed();//被增强的方法执行
        log.info("环绕通知执行之后");
        return "环绕通知返回值";
    }
}
```

执行结果如下：

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/image-20220914233959167.png)

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/image-20220914234038176.png)

---

环绕通知需要入参 `ProceedingJoinPoint` ，然后启动 参数去执行方法来进行增强：

> **环绕通知 = 前置通知 + 目标执行方法 + 后置通知**

其他说明：

- `proceedingJoinPoint.proceed()` 的作用就是执行目标方法，也就是上述例子中得 `NoticeService.listNotice`
- 这里可以多次调用 `proceedingJoinPoint.proceed()` ，也可以对返回值进行修改处理
- **最后调用的返回值，其实是环绕通知的返回值。**



<br/>

### <span id="t12">切入点扩展</span>

#### 切入点抽取

```java
@Pointcut(value = "execution(* cn.shiva.springaop.service.NoticeService.*(..))")
public void pointCut() {
}
@Before("pointCut()")
@AfterReturning("pointCut()")
@After("pointCut()")
@AfterThrowing("pointCut()")
@Around("pointCut()")
```

> 顺便提一句，如果 **多个增强类**对同一个方法（或多个方法）增强，设置增强类的优先级：在增强类上添加注解 **@Order(数字)** ，数字越小优先级越高。

#### 注解切入

定义注解和方法:

```java
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
public @interface LogAspect {
}

@LogAspect
public void getNotice() {
    log.info("开始执行 service 方法");
}
```

注解切入：

```java
@Slf4j
@Aspect
@Order(1)
@Component
public class AnnotationAspect {
    @Pointcut("@annotation(cn.shiva.springaop.config.LogAspect)")
    public void annotationPointCut() {
    }
    @Before("annotationPointCut()")
    public void before() {
        log.info("XXXX.注解切入的前置通知，方法执行之前。还加了Order(1)，在正常前置之前");
    }
}
```

执行结果：

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/image-20220915134404918.png)



<br/>

### <span id="t13">切入点表达式</span>

下面部分全是抄的：[AspectJ - noob_fly的个人空间 - OSCHINA - 中文开源技术交流社区](https://my.oschina.net/u/3434392/blog/1625493)

> `execution(modifiers-pattern? ret-type-pattern declaring-type-pattern? name-pattern(param-pattern)throws-pattern?)`
>
> 其中后面跟着“?”的是可选项

括号中各个 pattern 分别表示：

- 修饰符匹配（modifier-pattern?）
- 返回值匹配（ret-type-pattern）：  可以为 * 表示任何返回值，全路径的类名等
- 类路径匹配（declaring-type-pattern?）
- 方法名匹配（name-pattern）：可以指定方法名 或者 * 代表所有，set* 代表以 set 开头的所有方法
- 参数匹配（(param-pattern)）：可以指定具体的参数类型。
  - <span style="color:red;font-weight:bold">多个参数间用 “,” 隔开，各个参数也可以用 "" 来表示匹配任意类型的参数</span>
  - <span style="color:green;font-weight:bold">".." 表示零个或多个任意参数</span>
  - <span style="color:blue;font-weight:bold">eg. (String) 表示匹配一个 String 参数的方法；(*,String) 表示匹配有两个参数的方法，第一个参数可以是任意类型，而第二个参数是 String 类型</span>
- 异常类型匹配（throws-pattern?）

常见的一些表达式：

> - 任意公共方法的执行：`execution(public * *(..))`
> - 任何一个以 “set” 开始的方法的执行：`execution(* set*(..))`
> - AccountService 接口的任意方法的执行：`execution(* com.xyz.service.AccountService.*(..))`
> - 定义在 service 包里的任意方法的执行： `execution(* com.xyz.service.*.*(..))`
> - 定义在 service 包和所有子包里的任意类的任意方法的执行：`execution(* com.xyz.service..*.*(..))`
>   第一个 * 表示匹配任意的方法返回值， ..(两个点) 表示零个或多个，第一个.. 表示 service 包及其子包，第二个 * 表示所有类，第三个 * 表示所有方法，第二个.. 表示方法的任意参数个数
> - 定义在 pointcutexp 包和所有子包里的 JoinPointObjP2 类的任意方法的执行：`execution(* com.test.spring.aop.pointcutexp..JoinPointObjP2.*(..))")`
> - pointcutexp 包里的任意类： `within(com.test.spring.aop.pointcutexp.*)`
> - pointcutexp 包和所有子包里的任意类：`within(com.test.spring.aop.pointcutexp..*)`
> - 实现了 Intf 接口的所有类，如果 Intf 不是接口，限定 Intf 单个类：`this(com.test.spring.aop.pointcutexp.Intf)`
>   当一个实现了接口的类被 AOP 的时候，用 getBean 方法必须 cast 为接口类型，不能为该类的类型
> - 带有 @Transactional 标注的所有类的任意方法： 
>   - `@within(org.springframework.transaction.annotation.Transactional)`
>   - `@target(org.springframework.transaction.annotation.Transactional)`
> - 带有 @Transactional 标注的任意方法：`@annotation(org.springframework.transaction.annotation.Transactional)`
>   @within 和 @target 针对类的注解，@annotation 是针对方法的注解
> - 参数带有 @Transactional 标注的方法：`@args(org.springframework.transaction.annotation.Transactional)`
> - 参数为 String 类型 (运行是决定) 的方法： args(String)



<br/>

## <span id="t2">实现原理</span>

AOP 要达到的效果是，保证开发者不修改源代码的前提下，去为系统中的业务组件添加某种通用功能。

AOP 的本质是由 AOP 框架修改业务组件的多个方法的源代码，看到这其实应该明白了，AOP 其实就是前面一篇文章讲的代理模式的典型应用。

按照 AOP 框架修改源代码的时机，可以将其分为两类：

- 静态 AOP 实现， AOP 框架在编译阶段对程序源代码进行修改，生成了静态的 AOP 代理类（生成的 *.class 文件已经被改掉了，需要使用特定的编译器），比如 AspectJ。
- **动态 AOP 实现， AOP 框架在运行阶段对动态生成代理对象（在内存中以 JDK 动态代理，或 CGlib 动态地生成 AOP 代理类），如 SpringAOP。**

下面给出常用 AOP 实现比较

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/758949-20190529225400887-1590896890.png)



### 源码导读

以下部分也是抄的：[SpringAOP的源码解析 - bei_er - 博客园 (cnblogs.com)](https://www.cnblogs.com/yuanbeier/archive/2022/04/17/16155353.html)

完整源码分析分三部分:SpringAOP的初始化、创建动态代理、代理方法调用过程。

#### AOP初始化

**整体代码流程图如下：**

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/1105368-20220417114707929-300887102.png)

1. 创建 AnnotationConfigApplicationContext() 容器。
2. 在invokeBeanFactoryPostProcessors()中，会调用 ConfigurationClassPostProcessor 的 postProcessBeanDefinitionRegistry() 。在此方法中，会找到 @EnableAspectJAutoProxy 的 @Import 属性传入的 AspectJAutoProxyRegistrar.class 类。并且执行该类的registerBeanDefinitions() 方法，创建类型为 AnnotationAwareAspectJAutoProxyCreator 、名称为org.springframework.aop.
   config.internalAutoProxyCreator的 RootBeanDefinition注册到BeanDefinitionRegistry中。
3. 在 registerBeanPostProcessors() 中会根据上面一步生成的 RootBeanDefinition对象创建 AnnotationAwareAspectJAutoProxyCreator 的实例。
4. 在 finishBeanFactoryInitialization() 中第一次执行到 AbstractAutowireCapableBeanFactory.createBean() 时，会执行一段这样的代码，如下

```java
try {
        // 让 BeanPostProcessors 有机会返回一个代理而不是目标 bean 实例
        Object bean = resolveBeforeInstantiation(beanName, mbdToUse);
        if (bean != null) {
            return bean;
        }
}
```

```java
@Nullable
protected Object resolveBeforeInstantiation(String beanName, RootBeanDefinition mbd) {
		Object bean = null;
		if (!Boolean.FALSE.equals(mbd.beforeInstantiationResolved)) {
			// Make sure bean class is actually resolved at this point.
			if (!mbd.isSynthetic() && hasInstantiationAwareBeanPostProcessors()) {
				Class<?> targetType = determineTargetType(beanName, mbd);
				if (targetType != null) {
					bean = applyBeanPostProcessorsBeforeInstantiation(targetType, beanName);
					if (bean != null) {
						bean = applyBeanPostProcessorsAfterInitialization(bean, beanName);
					}
				}
			}
			mbd.beforeInstantiationResolved = (bean != null);
		}
		return bean;
}

```

```java
@Nullable
protected Object applyBeanPostProcessorsBeforeInstantiation(Class<?> beanClass, String beanName) {
	    for (InstantiationAwareBeanPostProcessor bp : getBeanPostProcessorCache().instantiationAware) {
             Object result = bp.postProcessBeforeInstantiation(beanClass, beanName);
             if (result != null) {
               return result;
             }
           }
         return null;
}
```

以上代码会执行 AnnotationAwareAspectJAutoProxyCreator 的 postProcessBeforeInstantiation() 方法。在该方法中会 执行 shouldSkip() 方法。代码如下：

```java
@Override
protected boolean shouldSkip(Class<?> beanClass, String beanName) {
    // TODO: Consider optimization by caching the list of the aspect names
 // 找到所有候选的 Advisors
 List<Advisor> candidateAdvisors = findCandidateAdvisors();
 for (Advisor advisor : candidateAdvisors) {
     if (advisor instanceof AspectJPointcutAdvisor &&
         ((AspectJPointcutAdvisor) advisor).getAspectName().equals(beanName)) {
         return true;
     }
 }
 return super.shouldSkip(beanClass, beanName);
}
```

在 findCandidateAdvisors 中具体会生成所有的 Advisors。

```java
@Override
protected List<Advisor> findCandidateAdvisors() {
		// 找到所有的 实现了 Advisor.class 接口的类，并且生成候选的 Advisors.
		List<Advisor> advisors = super.findCandidateAdvisors();
		// 创建所有的带了 @Aspect 特性的切面类 .
		if (this.aspectJAdvisorsBuilder != null) {
			advisors.addAll(this.aspectJAdvisorsBuilder.buildAspectJAdvisors());
		}
		return advisors;
}
```

aspectJAdvisorsBuilder.buildAspectJAdvisors() 是核心。方法里面的逻辑如下：

> **1.获取容器里所有的beanNames.** 
>
> **2.遍历 beanNames，根据beanName获取对应的beanType对象。**
>
> **3.判断beanType是否有@Aspect注解。** 
>
> **4.如果有，调用getAdvisorMethods()通过反射获取该类型所有的 advisor 的 method 元数据。** 
>
> **5.遍历 methods 调用 getAdvisor() 获取 Advisor 对象（InstantiationModelAwarePointcutAdvisorImpl）** 
>
> **6.添加到 this.advisorsCache 中。**

<br/>

#### 创建动态代理

在创建Bean的生命周期的 initializeBean 方法中，会执行`AnnotationAwareAspectJAutoProxyCreator`的`postProcessAfterInitialization`方法。

该方法会拿缓存 `BeanFactoryAspectJAdvisorsBuilder.advisorsCache` 中所有 advisor 的 pointCut 去匹配正在创建的实例Bean的所有方法。

如果 advisor 和 Bean 的某一个方法能匹配上，则把该advisor添加到 advisor的候选集合中。直到找出匹配Bean的所有Adsivors。

最后根据Adsivor的候选集合和Bean类型创建动态代理对象ProxyFactory。



![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/1105368-20220417115138701-47844988.png)





<br/>

#### 代理方法调用过程

以 JdkDynamicAopProxy 为例，在调用方法的时候会直接调用 JdkDynamicAopProxy.invoke()方法，里面的大概逻辑如下：

1.获取被代理的实现类；

2.找出所有匹配被调用方法的 advisor，并且转成具体的通知拦截器 MethodInterceptor，返回通知拦截器链。转换代码如下：

```java
List<MethodInterceptor> interceptors = new ArrayList<>(3);
// 从Advisor中获取 Advice
Advice advice = advisor.getAdvice();
// 如果 advice 本身就实现了  MethodInterceptor 接口 ，则直接进行转换
if (advice instanceof MethodInterceptor) {
    interceptors.add((MethodInterceptor) advice);
}
// AfterReturningAdviceInterceptor MethodBeforeAdviceInterceptor  ThrowsAdviceInterceptor 
// 这三种是通过适配器的方式进行转换 MethodInterceptor类型
for (AdvisorAdapter adapter : this.adapters) {
    if (adapter.supportsAdvice(advice)) {
        interceptors.add(adapter.getInterceptor(advisor));
    }
}
if (interceptors.isEmpty()) {
    throw new UnknownAdviceTypeException(advisor.getAdvice());
}
return interceptors.toArray(new MethodInterceptor[0]);
```

3.创建 ReflectiveMethodInvocation 对象（该对象中包括了 代理对象、被代理对象、执行的方法、方法参数、被代理对象的类型、通知拦截器链），执行该对象的proceed()方法，该方法中会进行通知拦截器链的递归调用，具体调用流程如下图。ReflectiveMethodInvocation 对象在通知拦截器链调用中作用很关键，有衔接各个拦截器的作用。



![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/1105368-20220417115155224-2003609266.png)

**说明：**

1.在proceed方法中，会先判断当前拦截器链的索引，如果索引等于最后一个那么则执行被代理类的方法。

2.如果不是，那么先获取该通知拦截器并且执行该拦截器的 proceed 方法（方法接受 ReflectiveMethodInvocation 对象实例），每个通知拦截器中都会调用 ReflectiveMethodInvocation 对象实例 的proceed 方法。在这里会形成递归调用。

3.通知拦截器的排序请看下图：
![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/1105368-20220417115210998-704142856.png)

4.五个通知拦截器的代码解释请看上面的代码流程图。





<br/>

## <span id="te">参考文章</span>

- [Spring之理解AOP（面向切面）_Bwy_1004的博客-CSDN博客_spring面向切面的理解](https://blog.csdn.net/qq_42338744/article/details/125529713)
- [Spring中切面详解（AOP） - 简书 (jianshu.com)](https://www.jianshu.com/p/817848e78094)
- [Spring配置切面的几种方式 - 张财华 - 博客园 (cnblogs.com)](https://www.cnblogs.com/zhangcaihua/p/12930900.html)
- [Spring AOP_骆驼整理说的博客-CSDN博客_spring切面](https://blog.csdn.net/xing_jian1/article/details/122937948)
- [Spring AOP——Spring 中面向切面编程 - SharpCJ - 博客园 (cnblogs.com)](https://www.cnblogs.com/joy99/p/10941543.html)
- [spring-aop切面_ssehs的博客-CSDN博客_springaop切面](https://blog.csdn.net/ssehs/article/details/113740700)
- [【手写JAVA笔记】Spring面向切面编程的几个核心注解_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1j3411h7Jv?spm_id_from=333.337.search-card.all.click&vd_source=e768d8ae5d35e9620400ecb1e8983682)
- [spring相关—AOP编程—切入点、连接点 - 康星悦 - 博客园 (cnblogs.com)](https://www.cnblogs.com/kangxingyue-210/p/7449924.html)
- [Spring的艺术（五）：通俗易懂的AOP切面详解_Java鱼仔的博客-CSDN博客_aop的切面是什么](https://blog.csdn.net/qq_41973594/article/details/111145727)
- [Chapter 6. 使用Spring进行面向切面编程（AOP） (jb51.net)](http://shouce.jb51.net/spring/aop.html)
- [AspectJ - noob_fly的个人空间 - OSCHINA - 中文开源技术交流社区](https://my.oschina.net/u/3434392/blog/1625493)
- [SpringAOP的源码解析 - bei_er - 博客园 (cnblogs.com)](https://www.cnblogs.com/yuanbeier/archive/2022/04/17/16155353.html)
