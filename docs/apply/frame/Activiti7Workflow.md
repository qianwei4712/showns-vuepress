<div class="catalog">

- [前言](#前言)
- [BPMN 流程定义](#BPMN)
- [Activiti7 基础Demo](#demo)
- [Activiti 常用API](#api)
- [具体业务场景实现](#具体业务场景实现)
    - [环境准备](#环境准备)
    - [员工请假审批](#员工请假审批)
    - [员工离职审批](#员工离职审批)
    - [费用报销多人会签](#费用报销多人会签)
    - [公司缺人离职不批](#公司缺人离职不批)
    - [流程签署自动提醒](#流程签署自动提醒)
- [其他功能](#其他功能)
- [参考文章](#te)

</div>

## <span id="前言">前言</span>

`2022.02.25` 

工作流引擎算是个很好的工具，不过 activiti 组织变动后，不怎么给力了，更新也不积极了。

新的 flowable 听说还不错，不过因为目前项目用了activiti ，先试试水。

- 官网文档：[Documentation | Activiti](https://www.activiti.org/documentation)
- API文档：[Overview (Activiti - Engine 5.22.0 API)](https://www.activiti.org/javadocs/)
- Github 地址：[Activiti/Activiti](https://github.com/Activiti/Activiti)

工作流作用就不比比了，直接进入正题。总体的使用流程如下：

1. 使用 BPMN 建模工具，绘制业务流程图，它的本质是一个规范的 XML 文件
2. 将业务流程图，导入到工作流引擎中，也就是存到数据库里
3. 在业务系统中调用工作流引擎提供的接口

把代码放上：

- 绘图工具仓库地址：[Learning Use Cases/springboot-activiti7-modeler (gitee.com)](https://gitee.com/learning-use-cases/springboot-activiti7-modeler)
- hello world仓库地址：[Learning Use Cases/activiti-first (gitee.com)](https://gitee.com/learning-use-cases/activiti-first)
- 完整业务流程案例：[code of shiva - Gitee.com](https://gitee.com/qianwei4712/code-of-shiva/tree/master/activiti)

<br>

## <span id="BPMN">BPMN 流程定义</span>

首先，应该都见过工作流的流程图：

> BPMN（Business Process Model AndNotation）- 业务流程模型和符号，是一套标准的业务流程建模符号，使用BPMN提供的符号可以创建业务流程。

网上有很多在线绘制网站，例如：

- [BPMN在线作图工具 (52itstyle.vip)](https://bpmn.52itstyle.vip/)
- [在线免费绘图工具 | 裕奥在线绘图工具Freedgo](https://www.freedgo.com/)



### BPMN 图形释义

**事件（Event）**

**用一个圆圈表示**，它是流程中运行过程中发生的事情。



![20201106094336416](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/20201106094336416.png)

**活动（Activity）**

**活动用圆角矩形表示**，一个流程由一个活动或多个活动组成

![clip_image002-1573894978125](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/clip_image002-1573894978125.jpg)

![22111574562726375](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/22111574562726375.png)

**网关 GateWay**

网关用来处理决策，有几种常用网关需要了解：

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/1574563600305.png)



排他网关 (x) 

——只有一条路径会被选择。流程执行到该网关时，按照输出流的顺序逐个计算，当条件的计算结果为true时，继续执行当前网关的输出流；

    如果多条线路计算结果都是 true，则会执行第一个值为 true 的线路。如果所有网关计算结果没有true，则引擎会抛出异常。
    排他网关需要和条件顺序流结合使用，default 属性指定默认顺序流，当所有的条件不满足时会执行默认顺序流。

并行网关 (+) 

——所有路径会被同时选择

    拆分 —— 并行执行所有输出顺序流，为每一条顺序流创建一个并行执行线路。
    合并 —— 所有从并行网关拆分并执行完成的线路均在此等候，直到所有的线路都执行完成才继续向下执行。

包容网关 (+) 

—— 可以同时执行多条线路，也可以在网关上设置条件

    拆分 —— 计算每条线路上的表达式，当表达式计算结果为true时，创建一个并行线路并继续执行
    合并 —— 所有从并行网关拆分并执行完成的线路均在此等候，直到所有的线路都执行完成才继续向下执行。

事件网关 (+) 

—— 专门为中间捕获事件设置的，允许设置多个输出流指向多个不同的中间捕获事件。当流程执行到事件网关后，流程处于等待状态，需要等待抛出事件才能将等待状态转换为活动状态。



**流向 Flow**

流是连接两个流程节点的连线。常见的流向包含以下几种：

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/1574563937457.png)



### BPMN 本质

在 [BPMN在线作图工具 (52itstyle.vip)](https://bpmn.52itstyle.vip/) 随便画了个图：

![image-20220225205812315](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220225205812315.png)

下载后为 BPMN 文件后，文本模式打开，它的实际内容为一个 XML：

<img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220225205919296.png" alt="image-20" style="zoom:70%;" />

<br>



## <span id="demo">Activiti7 基础Demo</span>

代码第一步，整一个 hello world 出来。

这里涉及到两个工程，连一个数据库。

### 环境准备

> **Demo 环境：JDK8 、SpringBoot 2.6.4 、mysql 、activiti 7**

添加POM依赖：

```xml
 <dependency>
     <groupId>org.activiti</groupId>
     <artifactId>activiti-spring-boot-starter</artifactId>
     <version>7.0.0.SR1</version>
</dependency>
```

application 添加 activiti 配置：

```yaml
spring:
  activiti:
    # 线上环境用 false，不然出毛病就嗝屁了
    #1.flase：默认值。activiti在启动时，对比数据库表中保存的版本，如果没有表或者版本不匹配，将抛出异常
    #2.true： activiti会对数据库中所有表进行更新操作。如果表不存在，则自动创建
    #3.create_drop： 在activiti启动时创建表，在关闭时删除表（必须手动关闭引擎，才能删除表）
    #4.drop-create： 在activiti启动时删除原来的旧表，然后在创建新表（不需要手动关闭引擎）
    database-schema-update: true
    #检测历史表是否存在 activiti7默认没有开启数据库历史记录 启动数据库历史记录
    db-history-used: true
    #记录历史等级 可配置的历史级别有none, activity, audit, full
    #none：不保存任何的历史数据，因此，在流程执行过程中，这是最高效的。
    #activity：级别高于none，保存流程实例与流程行为，其他数据不保存。
    #audit：除activity级别会保存的数据外，还会保存全部的流程任务及其属性。audit为history的默认值。
    #full：保存历史数据的最高级别，除了会保存audit级别的数据外，还会保存其他全部流程相关的细节数据，包括一些流程参数等。
    history-level: full
    #校验流程文件，默认校验resources下的processes文件夹里的流程文件
    check-process-definitions: false
```

因为 activiti7 默认集成的权限框架是 SpringSecurity，所以先添加一个配置快速实现。

下面的两个配置都来自官方文档示例：

```java
@Component
public class SecurityUtil {
    private Logger logger = LoggerFactory.getLogger(SecurityUtil.class);

    @Autowired
    private UserDetailsService userDetailsService;

    public void logInAs(String username) {
        UserDetails user = userDetailsService.loadUserByUsername(username);

        if (user == null) {
            throw new IllegalStateException("User " + username + " doesn't exist, please provide a valid user");
        }
        logger.info("> Logged in as: " + username);

        SecurityContextHolder.setContext(
                new SecurityContextImpl(
                        new Authentication() {
                            @Override
                            public Collection<? extends GrantedAuthority> getAuthorities() {
                                return user.getAuthorities();
                            }
                            @Override
                            public Object getCredentials() {
                                return user.getPassword();
                            }
                            @Override
                            public Object getDetails() {
                                return user;
                            }
                            @Override
                            public Object getPrincipal() {
                                return user;
                            }
                            @Override
                            public boolean isAuthenticated() {
                                return true;
                            }
                            @Override
                            public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
                            }
                            @Override
                            public String getName() {
                                return user.getUsername();
                            }
                        }));
        org.activiti.engine.impl.identity.Authentication.setAuthenticatedUserId(username);
    }
}
```

添加用户以及权限信息：

```java
@Configuration
public class PermissionsConfiguration {
    private Logger logger = LoggerFactory.getLogger(PermissionsConfiguration.class);
    @Bean
    public UserDetailsService myUserDetailsService() {
        InMemoryUserDetailsManager inMemoryUserDetailsManager = new InMemoryUserDetailsManager();
        //这里添加用户，后面处理流程时用到的任务负责人，需要添加在这里
        String[][] usersGroupsAndRoles = {
                {"jack", "password", "ROLE_ACTIVITI_USER", "GROUP_activitiTeam"},
                {"rose", "password", "ROLE_ACTIVITI_USER", "GROUP_activitiTeam"},
                {"tom", "password", "ROLE_ACTIVITI_USER", "GROUP_activitiTeam"},
                {"other", "password", "ROLE_ACTIVITI_USER", "GROUP_otherTeam"},
                {"system", "password", "ROLE_ACTIVITI_USER"},
                {"admin", "password", "ROLE_ACTIVITI_ADMIN"},
        };

        for (String[] user : usersGroupsAndRoles) {
            List<String> authoritiesStrings = Arrays.asList(Arrays.copyOfRange(user, 2, user.length));
            logger.info("> Registering new user: " + user[0] + " with the following Authorities[" + authoritiesStrings + "]");
            inMemoryUserDetailsManager.createUser(new User(user[0], passwordEncoder().encode(user[1]),
                    authoritiesStrings.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList())));
        }

        return inMemoryUserDetailsManager;
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

<br>

### BPMN 导入

这里加点新东西，**activiti modeler 设计器，这是一个可以集成在项目里，绘制部署全套流程的界面化工具**。

一步一步来，这里先使用独立版，到后面再整合：

- 绘图工具仓库地址：[Learning Use Cases/springboot-activiti7-modeler (gitee.com)](https://gitee.com/learning-use-cases/springboot-activiti7-modeler)
- 测试Demo仓库地址：[Learning Use Cases/activiti-first (gitee.com)](https://gitee.com/learning-use-cases/activiti-first)

这个小 Demo 有部署接口文档，设计器图形界面两部分，详细自己看 readme。



![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220302113612122.png)

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220302174903889.png)



在设计器中绘制了一个简单流程，然后保存后自动解析存入数据库

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220302154431883.png)

顺便指定审批人

<img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220302173319777.png" style="zoom:80%;" />

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220302154533325.png)



顺便调用一下手动部署的接口

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220302161053179.png)



<br>

### 单元测试

测试主要流程如下：

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220302234513397.png)

模型部署已经在上一步完成，这里直接查询流程定义并启动，然后进行任务审批。

```java
@RunWith(SpringRunner.class)
@SpringBootTest
class ActivitiFirstApplicationTests {
    @Autowired
    private ProcessRuntime processRuntime;
    @Autowired
    private TaskRuntime taskRuntime;
    @Autowired
    private SecurityUtil securityUtil;

    /**
     * 查看流程定义
     */
    @Test
    public void contextLoads() {
        securityUtil.logInAs("system");
        Page<ProcessDefinition> processDefinitionPage =
                processRuntime.processDefinitions(Pageable.of(0, 10));
        System.out.println("可用的流程定义数量：" + processDefinitionPage.getTotalItems());
        for (org.activiti.api.process.model.ProcessDefinition pd : processDefinitionPage.getContent()) {
            System.out.println("流程定义：" + pd);
        }
    }

    /**
     * 启动流程实例
     */
    @Test
    public void testStartProcess() {
        securityUtil.logInAs("system");
        ProcessInstance pi = processRuntime.start(ProcessPayloadBuilder.
                start().
                withProcessDefinitionKey("hello_activiti").
                build());
        System.out.println("流程实例ID：" + pi.getId());
    }


    /**
     * *查询任务，并完成自己的任务
     **/
    @Test
    public void testTask() {
        securityUtil.logInAs("jack");
        Page<Task> taskPage = taskRuntime.tasks(Pageable.of(0, 10));
        if (taskPage.getTotalItems() > 0) {
            for (Task task : taskPage.getContent()) {
                taskRuntime.claim(TaskPayloadBuilder.
                        claim().
                        withTaskId(task.getId()).build());
                System.out.println("任务：" + task);
                taskRuntime.complete(TaskPayloadBuilder.
                        complete().
                        withTaskId(task.getId()).build());
            }
        }
        Page<Task> taskPage2 = taskRuntime.tasks(Pageable.of(0, 10));
        if (taskPage2.getTotalItems() > 0) {
            System.out.println("任务：" + taskPage2.getContent());
        }
    }
}
```

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220302202033846.png)

<br>

### Activiti 表结构

上面的配置中写了自动建表，可以在数据库里看到相应的表和记录。

看到刚才创建的表，我们发现Activiti 的表都以 `ACT_` 开头。 第二部分是表示表的用途的两个字母标识。 用途也和服务的 API 对应。

- **ACT_RE** ：'RE' 表示 repository。 这个前缀的表包含了流程定义和流程静态资源 （图片，规则，等等）。
- **ACT_RU** ：'RU' 表示 runtime。 这些运行时的表，包含流程实例，任务，变量，异步任务，等运行中的数据。 Activiti 只在流程实例执行过程中保存这些数据， 在流程结束时就会删除这些记录。 这样运行时表可以一直很小速度很快。
- **ACT_HI** ：'HI' 表示 history。 这些表包含历史数据，比如历史流程实例， 变量，任务等等。
- **ACT_GE** ：'GE' 表示 general。 通用数据， 用于不同场景下 

| **表分类**   | **表名**              | **解释**                                                     |
| ------------ | --------------------- | ------------------------------------------------------------ |
| 一般数据     |                       |                                                              |
|              | [ACT_GE_BYTEARRAY]    | 通用的流程定义和流程资源，xml文件详细信息在这里              |
|              | [ACT_GE_PROPERTY]     | 系统相关属性                                                 |
| 流程历史记录 |                       |                                                              |
|              | [ACT_HI_ACTINST]      | 历史的流程实例                                               |
|              | [ACT_HI_ATTACHMENT]   | 历史的流程附件                                               |
|              | [ACT_HI_COMMENT]      | 历史的说明性信息                                             |
|              | [ACT_HI_DETAIL]       | 历史的流程运行中的细节信息                                   |
|              | [ACT_HI_IDENTITYLINK] | 历史的流程运行过程中用户关系                                 |
|              | [ACT_HI_PROCINST]     | 历史的流程实例                                               |
|              | [ACT_HI_TASKINST]     | 历史的任务实例，记录所有任务                                 |
|              | [ACT_HI_VARINST]      | 历史的流程运行中的变量信息                                   |
| 流程定义表   |                       |                                                              |
|              | [ACT_RE_DEPLOYMENT]   | 部署单元信息，每部署一次增加一条记录                         |
|              | [ACT_RE_MODEL]        | 模型信息                                                     |
|              | [ACT_RE_PROCDEF]      | 已部署的流程定义，部署每个新的流程定义都会在这张表中增加一条记录 |
| 运行实例表   |                       |                                                              |
|              | [ACT_RU_EVENT_SUBSCR] | 运行时事件                                                   |
|              | [ACT_RU_EXECUTION]    | 运行时流程执行实例，记录当前流程实例的执行情况               |
|              | [ACT_RU_IDENTITYLINK] | 运行时用户关系信息，存储任务节点与参与者的相关信息，记录当前参与任务的用户或组 |
|              | [ACT_RU_JOB]          | 运行时作业                                                   |
|              | [ACT_RU_TASK]         | 运行时任务，记录当前执行的任务                               |
|              | [ACT_RU_VARIABLE]     | 运行时变量表                                                 |





<br>

## <span id="api">Activiti 常用API</span>

这也是个老图了，和新版有点区别，不过无所谓了。

![clip_image002](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/clip_image002.jpg)

总体来说，API 分为 **引擎** 和 **服务** 两部分。

一般项目中，通常是通过引擎拿到服务，不过对现在都是 spring 整合后的，processEngine 对象来负责创建 Service 对象，直接注入使用。



### 引擎创建

在一般项目中，我们都是用配置文件读取：

```java
//直接使用工具类 ProcessEngines，使用classpath下的activiti.cfg.xml中的配置创建processEngine
ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();
System.out.println(processEngine);
```

```java
//先构建ProcessEngineConfiguration
ProcessEngineConfiguration configuration = ProcessEngineConfiguration.createProcessEngineConfigurationFromResource("activiti.cfg.xml");
//通过ProcessEngineConfiguration创建ProcessEngine，此时会创建数据库
ProcessEngine processEngine = configuration.buildProcessEngine();
```

**不过对 SpringBoot 整合后来说，直接注入就行。**



### 服务调用

Activiti 核心服务类，就下面几个：

| service名称           | service作用                                                  |
| --------------------- | ------------------------------------------------------------ |
| **RepositoryService** | **是activiti的资源管理类，提供了管理和控制流程发布包和流程定义的操作。使用工作流建模工具设计的业务流程图需要使用此service将流程定义文件的内容部署到计算机。** |
| RuntimeService        | Activiti的流程运行管理类。可以从这个服务类中获取很多关于流程执行相关的信息 |
| TaskService           | Activiti的任务管理类。可以从这个类中获取任务的信息。         |
| HistoryService        | Activiti的历史管理类，可以查询历史信息，执行流程时，引擎会保存很多数据（根据配置）。比如流程实例启动时间，任务的参与者， 完成任务的时间，每个流程实例的执行路径，等等 |
| ManagerService        | Activiti的引擎管理类，提供了对 Activiti 流程引擎的管理和维护功能，这些功能不在工作流驱动的应用程序中使用，主要用于 Activiti 系统的日常维护。 |



#### 启动流程

**根据已经部署的流程定义，创建一个工作流任务**

```java
// 根据流程定义Id启动流程
ProcessInstance processInstance = runtimeService.startProcessInstanceByKey("hello_activiti");
ProcessInstance pi = processRuntime.start(ProcessPayloadBuilder.
                                          start().
                                          withProcessDefinitionKey("hello_activiti").
                                          build());
```

#### 任务查询

**根据当前用户，查询未处理任务列表**

```java
// 根据流程key 和 任务负责人 查询任务
String assignee = "zhangsan";
List<Task> list = taskService.createTaskQuery()
    .processDefinitionKey("myEvection") //流程Key
    .taskAssignee(assignee)//只查询该任务负责人的任务
    .list();

// 分页查询
securityUtil.logInAs("jack");
Page<Task> taskPage = taskRuntime.tasks(Pageable.of(0, 10));
```

#### 任务处理

**处理指定任务**

```java
// 完成任务,参数：任务id，varibles增量更新变量
taskService.complete(task.getId());
taskService.complete(task.getId(), variables);
```

#### 历史审批查询

**查询已经完成审批的历史记录**

```java
// 获取引擎
ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();
// 获取HistoryService
HistoryService historyService = processEngine.getHistoryService();
// 获取 actinst表的查询对象
HistoricActivityInstanceQuery instanceQuery = historyService.createHistoricActivityInstanceQuery();
// 查询 actinst表，条件：根据 InstanceId 查询
// instanceQuery.processInstanceId("2501");
// 查询 actinst表，条件：根据 DefinitionId 查询
instanceQuery.processDefinitionId("myEvection:1:4");
// 增加排序操作,orderByHistoricActivityInstanceStartTime 根据开始时间排序 asc 升序
instanceQuery.orderByHistoricActivityInstanceStartTime().asc();
// 查询所有内容
List<HistoricActivityInstance> activityInstanceList = instanceQuery.list();
```

#### 流程定义查询

```java
// repositoryService
RepositoryService repositoryService = processEngine.getRepositoryService();
// 得到ProcessDefinitionQuery 对象
ProcessDefinitionQuery processDefinitionQuery = repositoryService.createProcessDefinitionQuery();
//  查询出当前所有的流程定义
//  条件：processDefinitionKey =evection
//          orderByProcessDefinitionVersion 按照版本排序
List<ProcessDefinition> definitionList = processDefinitionQuery.processDefinitionKey("myEvection")
    .orderByProcessDefinitionVersion()
    .desc()
    .list();
```

#### 流程删除

**删除定义的审批流程**

```java
// 流程部署id
String deploymentId = "1";

ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();
// 通过流程引擎获取repositoryService
RepositoryService repositoryService = processEngine
    .getRepositoryService();
//删除流程定义，如果该流程定义已有流程实例启动则删除时出错
repositoryService.deleteDeployment(deploymentId);
//设置true 级联删除流程定义，即使该流程有流程实例启动也可以删除，设置为false非级别删除方式，如果流程
//repositoryService.deleteDeployment(deploymentId, true);
```

> 1. 使用repositoryService删除流程定义，历史表信息不会被删除
> 2. 如果该流程定义下没有正在运行的流程，则可以用普通删除。
> 3. 如果该流程定义下存在已经运行的流程，使用普通删除报错，可用级联删除方法将流程及相关记录全部删除。
>    1. 先删除没有完成流程节点，最后就可以完全删除流程定义信息
>    2. 项目开发中级联删除操作一般只开放给超级管理员使用.



<br>

## <span id="具体业务场景实现">具体业务场景实现</span>

工作流的基础使用方式，现在开始要和企业业务进行关联。

- 代码仓库：[code of shiva - Gitee.com](https://gitee.com/qianwei4712/code-of-shiva/tree/master/activiti)

首先要理解：

> 1. **Activiti 引擎只能操作它自己的相关表**
> 2. **工作流相关表，只存储流程相关信息，不存储任何业务信息，例如：业务单号、业务发生时间、业务审批通过后的后续操作等**

所以在业务系统中嵌入工作流，要配合业务表。

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220312131549059.png)

当然了，这种关联关系，工作流肯定已经给我们预留好了：

在 **表ACT_RU_EXECUTION 运行时流程执行实例** 里，有一个 **BUSINESS_KEY_** 字段，可以用来存放关联业务信息字段。

现在来模拟实现以下几个场景：

1. 员工请假审批（通配、完成任务）
2. 员工离职审批（拒绝申请、审批回调）
3. 费用报销多人会签（多人同时审批）
4. 公司缺人离职不批（流程挂起）
5. 流程签署自动提醒（监听器）

<br>

### <span id="环境准备">环境准备</span>

先做下准备工作，表就不建太多了。。。什么请假表、离职表这些都省略，直接作为 json 保存到 remarks

用 mybatis-plus，减少代码量。

比如有下面这个请假表字段：

```java
@Data
public class AskLeaf implements Serializable {
    //申请人
    private String applicant;
    //申请原因
    private String reason;
    //申请时间
    private Date applyTime;
    //请假时间，日期
    private Date leafTime;
    //审批时间
    private Date approvalTime;
    //最终审批人
    private String finalApprover;
    //审批状态; 0-审批中，1-通过，2-未通过
    private String status;
    //审批备注
    private String remarks;
}
```

显然，我们无法把这些字段保存到工作流的表里。

其次，我们需要对多种审批流进行管理，还需要一个专门为审批流而设计的一个表：

```sql
CREATE TABLE `act_process` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '流程id',
  `instance_id` varchar(50) DEFAULT NULL COMMENT '工作流实例id',
  `process_no` varchar(50) DEFAULT NULL COMMENT '流程编号',
  `process_type` tinyint DEFAULT NULL COMMENT '流程业务类型',
  `process_name` varchar(50) DEFAULT NULL COMMENT '流程名称',
  `relation_bus_no` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '关联业务单号',
  `business_key` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '关联业务单id',
  `apply_user` varchar(50) DEFAULT NULL COMMENT '流程申请人',
  `start_time` datetime DEFAULT NULL COMMENT '流程开始时间',
  `end_time` datetime DEFAULT NULL COMMENT '流程结束时间',
  `is_agree` tinyint DEFAULT '1' COMMENT '最终审批结果',
  `status` tinyint DEFAULT '0' COMMENT '状态',
  `apply_reason` varchar(1024) DEFAULT '0' COMMENT '申请审批原因',
  `final_assignee` varchar(50) DEFAULT NULL COMMENT '终审处理人',
  `actual_assignee_list` varchar(500) DEFAULT NULL COMMENT '流程办理人',
  `current_assignee` varchar(50) DEFAULT NULL COMMENT '当前办理人',
  `current_task` varchar(20) DEFAULT NULL COMMENT '当前办理节点名称',
  `accept_task_time` datetime DEFAULT NULL COMMENT '当前任务接受时间',
  `call_back_url` varchar(128) DEFAULT NULL COMMENT '回调URL',
  `is_delete` tinyint DEFAULT '0' COMMENT '删除标记0未删除1已删除',
  `remarks` text COMMENT '备注',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=COMPACT;
```

这个表可以很好得触达 activiti 的流程，用以最快速的方式查询相应流程资料以及任务。

然后，activiti 自带了 mybatis，会和 mybatis-plus 冲突，需要排除：

```xml
  <dependency>
      <groupId>org.activiti</groupId>
      <artifactId>activiti-spring-boot-starter</artifactId>
      <version>7.0.0.SR1</version>
      <exclusions>
          <exclusion>
              <artifactId>mybatis</artifactId>
              <groupId>org.mybatis</groupId>
          </exclusion>
      </exclusions>
</dependency>
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.5.1</version>
</dependency>
```

修改权限配置，对应角色，后续会用到这些角色：

```java
String[][] usersGroupsAndRoles = {
    {"jack", "password", "user", "GROUP_activitiTeam"},
    {"rose", "password", "user", "GROUP_activitiTeam"},
    {"tom", "password", "groupManager", "GROUP_activitiTeam"},
    {"bob", "password", "projectManager", "GROUP_otherTeam"},
    {"system", "password", "companyManager"},
    {"admin", "password", "admin"},
};
```



<br>

### <span id="员工请假审批">员工请假审批</span>

#### 流程模型

这里已经算是开发内容了，实际系统的开发也差不多就这样。

**这里提到的都是关键步骤，不重要的自己看源码。**

**这里提到的都是关键步骤，不重要的自己看源码。**

**这里提到的都是关键步骤，不重要的自己看源码。**

说三遍了，下面全干货

先在上面提到的模块中画一个流程图

> **ID 为 AskLeaf** ，**整个ID作为后面开发中需要预设到系统里的**。

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220316232635323.png)



> **处理人使用通配符，这里写的 参数名 必须要在系统中 map 中传入值，不然报错**
>
> **这里，我的开发习惯是，填写角色名称**

- applyUser 表示流程发起人
- groupManager 表示流程审批人

`其实这里也有过一个关于业务细节的思考，为什么创建流程的人，还需要占一个审批节点？`

**把创建人作为一个审批节点，可以让创建人有一个撤回的机会。**

比如：张三创建了请假流程，然后日期填错了，但是他自己没有审批，相当于还没有发给领导。

<img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220316153639684.png" alt="image-20220316153639684" style="zoom:80%;" />

审批人换了一个角色。

<img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220316153657933%20-%20%E5%89%AF%E6%9C%AC.png" alt="image-202203161536" style="zoom:80%;" />

好了，部署流程上面已经提过了。

现在开始代码部分：

<img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/1de6bed950f35aed0cd955432c10c282.jpg" alt="1de6bed950f35aed0cd955432c10c282" style="zoom:50%;" />

#### 代码实现流程创建

因为模拟 spring security 所以做了个登录步骤，请求类只包括：登录人、理由和时间：

```java
@Data
public class EmployeeBO implements Serializable {
    private String loginAs;
    private String reason;
    private String leafTime;
}
```

接收数据第一步先登录，然后开始业务处理：

```java
@RequestMapping(value = "/employee/askLeaf")
public Response empAskLeaf(EmployeeBO employeeBO) throws Exception {
    //先登录，然后就有了当前用户
    securityUtil.logInAs(employeeBO.getLoginAs());
    //然后申请请假
    employeeService.askLeaf(employeeBO);
    return Response.builder().code(0).builsd();
}
```

核心的流程创建方法逻辑如下：

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220317094707457.png)

```java
/**
  * 员工请假流程
  */
@Transactional(readOnly = false, rollbackFor = Exception.class)
public void askLeaf(EmployeeBO employeeBO) throws Exception {
    //弄个请假的对象
    AskLeaf askLeaf = instanceFromEmployeeBO(employeeBO);
    //保存流程信息
    ActProcess actProcess = instanceFromEmployeeBO(askLeaf);

    //发起一个审批流
    //启动流程，灵活定义的一些参数：审批人、businessKey、processType 等
    Map<String, Object> variables = workflowService.setStartProcess(actProcess, WorkflowTypeEnum.ASK_LEAF);
    //根据给定的参数，流程实例创建
    ProcessInstance processInstance = runtimeService.startProcessInstanceByKey(
        //这里其实是工作流的ID
        WorkflowTypeEnum.ASK_LEAF.key,
        //然后保存业务key，对应业务表
        actProcess.getBusinessKey(),
        variables);

    //根据流程实例，拿到对应的任务列表；
    List<Task> taskList = taskService.createTaskQuery().processInstanceId(processInstance.getProcessInstanceId()).list();
    if (CollectionUtils.isEmpty(taskList)) {
        throw new Exception("请检查流程负责人是否配置齐全！");
    }
    //拿到第一个要执行的任务
    Task task = taskList.get(0);

    //继续补全流程的其余字段
    //流程ID
    actProcess.setInstanceId(processInstance.getProcessInstanceId());
    //当前任务
    actProcess.setCurrentTask(task.getName());
    //下一个要审批的人名字
    actProcess.setCurrentAssignee(task.getAssignee());
    //任务时间
    actProcess.setAcceptTaskTime(task.getCreateTime());
    //最后再保存
    processMapper.insert(actProcess);
    log.info("流程：{}，创建成功。业务编号：{}", WorkflowTypeEnum.ASK_LEAF.name, processInstance.getBusinessKey());
}
```

其他的跳过不说了，这里比较绕的，应该就是获取 **流程参数** 这个方法：

```java
/**
  * 启动一个流程时，有些参数需要动态返回
  */
public Map<String, Object> setStartProcess(ActProcess process, WorkflowTypeEnum workflowTypeEnum) {
    Map<String, Object> variables = new HashMap<>();
    //申请人
    variables.put(WorkflowConstants.VARIABLE_APPLY_USER, process.getApplyUser());
    //申请理由
    variables.put(WorkflowConstants.VARIABLE_APPLY_REASON, process.getApplyReason());
    //申请类型
    variables.put(WorkflowConstants.VARIABLE_PROCESS_TYPE, process.getProcessType());
    //同意
    variables.put(WorkflowConstants.VARIABLE_IS_AGREE, WorkflowConstants.AGREE);
    //业务key
    variables.put(WorkflowConstants.VARIABLE_BUSINESS_KEY, process.getBusinessKey());
    //关联业务单号
    variables.put(WorkflowConstants.VARIABLE_BILL_NO, process.getRelationBusNo());
    //添加回调方法
    variables.put(WorkflowConstants.VARIABLE_CALLBACK_URL, process.getCallBackUrl());

    //拿到对应流程的审批路线，审批角色列表
    String[] roleCodes = workflowTypeEnum.roles.split(",");

    for (String roleCode : roleCodes) {
        if (StringUtils.isEmpty(roleCode)) {
            continue;
        }
        // TODO 这里肯定要根据实际业务系统修改，目前的用户都是写死的
        // 正常的业务系统中，同一个角色会存在多个人，会有多人同时存在审批权限
        List<String> assigneeNames = new ArrayList<>();
        String[][] usersGroupsAndRoles = PermissionsConfiguration.USERS_GROUPS_AND_ROLES;
        for (String[] usersGroupsAndRole : usersGroupsAndRoles) {
            if (roleCode.equals(usersGroupsAndRole[2])) {
                //查询到了，拥有指定角色的人员
                assigneeNames.add(usersGroupsAndRole[0]);
            }
        }
        variables.put(WorkflowConstants.ROLE_TABLE.get(roleCode), assigneeNames);
    }
    // 最后返回全部的流程启动参数
    return variables;
}
```

在绘制流程图时，我们用了通配符来定义审批角色：`applyUser 表示流程发起人`、`groupManager 表示流程审批人` 

这些都需要通过 **variables** 这个传入到 流程实例 中

 这里的大致逻辑为：

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220317100536964.png)

预设枚举类如下：

```java
public enum WorkflowTypeEnum {

    ASK_LEAF(10, "请假", "AskLeaf", "groupManager", ""),
    RESIGN(20, "离职", "Resign", "companyManager", "");

    public final Integer value;
    public final String name;
    public final String key;
    public final String roles;
    public final String callbackUrl;

    //省略构造方法等
}
```

> **这里的每一个参数都很重要，根据 value 判断流程类别、根据 key 获得流程模型 **
>
> **尤其要注意 roles，这是一个 `,` 拼接的字符串，也是对应审批流的通配符（不包括申请人） **

最后完成执行，打印日志：

```
2022-03-16 14:45:56.068  INFO 520 --- [p-nio-80-exec-2] c.s.a.service.EmployeeService            : 流程：请假，创建成功。业务编号：905a92518b5641f89a7f2327555adf37
```

-----

#### 流程任务查询

然后查看自己的流程就比较简单了，跳过；

这里预设了几种常用的任务情况：

```java
public enum TaskTypeEnum {

    TODO_TASK(1,"我要处理-待办任务"),
    COMPLETE_TASK(2,"我要处理-已办任务"),
    MY_UNFINISH_TASK(3,"我发起-未处理任务"),
    MY_FINISH_TASK(4,"我发起-已处理任务"),
    ALL_TASK(5,"所有任务");

    public Integer  index;
    public String text;

}
```

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220316164651287.png)



#### 确认提交请假申请

刚刚已经提过了，创建请假申请，已经完成了流程的创建。

- **第一个节点依然是申请人提交，表示：创建流程的员工，还需要点击确认**

- 那么对工作流来说，其实，**申请提交这个动作，也是完成任务**

```java
@RequestMapping(value = "/process/submitProcess")
public Response submitProcess(String loginAs, String processId, String isAgree, String comment) throws Exception {
    securityUtil.logInAs(loginAs);
    //这里其实是，拿到 业务流程id
    //再组装完成任务需要的字段内容
    ActProcess process = workflowService.getById(processId);
    CompleteTaskDTO completeTaskDTO = new CompleteTaskDTO();
    completeTaskDTO.setBusinessKey(process.getBusinessKey());
    completeTaskDTO.setProcessType(process.getProcessType());
    completeTaskDTO.setIsAgree(Integer.valueOf(isAgree));
    completeTaskDTO.setComment(comment);
    completeTaskDTO.setAssignee(loginAs);
    //调用另一个方法，因为要用到递归，所以单独提取出来
    boolean result = completeTask(completeTaskDTO);
    // 返回值
    return Response.builder().code(result ? 0 : 1).build();
}
```

>  审批入口，其实需要手动做的就是是否同意，然后填个意见。

核心方法是完成审批 completeTask ，它的主要流程为：

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220317115521200.png)

完成任务的递归方法代码：

```java
 private boolean completeTask(CompleteTaskDTO completeTaskDTO) throws Exception {
     //然后完成任务，业务actprocess 对应的当前任务默认封装在 service里
     List<Task> nextTasks = workflowService.competeTask(completeTaskDTO);
     // 还存在后续任务，那就需要更新当前 actProcess 的字段，而不是全部结束
     if (!CollectionUtils.isEmpty(nextTasks)) {
         workflowService.updateProcess(nextTasks, completeTaskDTO);
     }
     // 下一个节点处理人和当前节点处理人属于同一个 自动处理
     if (!CollectionUtils.isEmpty(nextTasks)) {
         String confirmAssignee = completeTaskDTO.getAssignee();
         List<Task> nextTodoList = nextTasks.stream().filter(nextTask -> nextTask.getAssignee().contains(confirmAssignee)).limit(1).collect(Collectors.toList());
         if (!CollectionUtils.isEmpty(nextTodoList)) {
             log.info("【审核跳过】：{}", nextTodoList);
             completeTaskDTO.setComment("审批连续节点-自动同意");
             completeTask(completeTaskDTO);
         }
     }
     return true;
 }
```

```java
 @Transactional(readOnly = false, rollbackFor = Exception.class)
public List<Task> competeTask(CompleteTaskDTO completeTaskDTO) throws Exception {
    // 审核意见 同意/不同意
    Integer isAgree = completeTaskDTO.getIsAgree();
    // 审批意见
    String comment = completeTaskDTO.getComment();
    // 审批人
    String confirmAssignee = completeTaskDTO.getAssignee();
    // 审批参数
    Map<String, Object> variables = completeTaskDTO.getVariables() == null ? new HashMap<>() : completeTaskDTO.getVariables();

    //添加是否同意到审批参数
    variables.put(WorkflowConstants.VARIABLE_IS_AGREE, isAgree);
    // 查询待办任务
    List<Task> tasks = getTaskByBusinessKey(completeTaskDTO.getBusinessKey(), completeTaskDTO.getProcessType());
    // 从任务列表中，获得审批人包含 confirmAssignee 的任务
    List<Task> currentTasks = tasks.stream().filter(task -> task.getAssignee().contains(confirmAssignee)).collect(Collectors.toList());
    if (CollectionUtils.isEmpty(currentTasks)) {
        throw new Exception("当前操作人(" + confirmAssignee + ")不具备该节点审核资格！");
    }

    // 查询当前办理人（当前任务的办理人）
    Task task = currentTasks.get(0);
    Map<String, Object> existVariables = task.getProcessVariables();

    //节点完成
    completeTask(task, comment, variables);
    // 拿到后续的任务
    List<Task> nextTasks = taskService.createTaskQuery().processInstanceId(task.getProcessInstanceId()).list();
    //如果不存在下一个任务，那就可以调用结束回调方法
    if (CollectionUtils.isEmpty(nextTasks)) {
        // 调用业务回调
        String callbackUrl = (String) existVariables.get(WorkflowConstants.VARIABLE_CALLBACK_URL);
        String businessKey = (String) existVariables.get(WorkflowConstants.VARIABLE_BUSINESS_KEY);
        if (StringUtils.isNotEmpty(callbackUrl) && StringUtils.isNotEmpty(businessKey)) {
            //TODO 这里可以进行业务回调，回调 URL 可以是消息、方法、和接口
        }
    }
    // 如果本次审核被拒绝，或者流程已经结束，相当于流程已经结束
    if (isAgree == 0 || CollectionUtils.isEmpty(nextTasks)) {
        // 更新流程记录
        completeWorkProcess(completeTaskDTO, task);
        return null;
    }
    return nextTasks;
}
```

其中：`updateProcess`、`completeTask` 这几个方法就省略了，全是 `get、set`

> 这里涉及到了完成流程、业务回调的功能。先不涉及，在后面介绍。

<br>

### <span id="员工离职审批">员工离职审批</span>

这个案例中，实现两个功能：**拒绝流程、完成回调。**

有没有发现，在上面的流程中，只是一条线，所以，无论你是同意还是拒绝，都会按顺序往下运行。

现在上新流程：

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220317231423987.png)

与原流程相比，多了几条路线，并为路线设置了跳转条件。

这个也很明显，不过多解释。

> **如果任意一个审批步骤拒绝，就会结束流程**

关键代码如下：

```java
@Transactional(readOnly = false, rollbackFor = Exception.class)
public List<Task> competeTask(CompleteTaskDTO completeTaskDTO) throws Exception {
    ......
     //添加是否同意到审批参数
    variables.put(WorkflowConstants.VARIABLE_IS_AGREE, isAgree);
    ......
    //节点完成
    completeTask(task, comment, variables);
    ......
    // 如果本次审核被拒绝，或者流程已经结束，相当于流程已经结束
    if (isAgree == 0 || CollectionUtils.isEmpty(nextTasks)) {
        // 更新流程记录
        completeWorkProcess(completeTaskDTO, task);
        return null;
    }
    ......
}
```

将是否同意审批的参数传入。

**如果本次的审批为拒绝，那么就直接结束流程，重置 业务process的参数**

在全部流程结束后，还可以触发回调：

```java
//如果不存在下一个任务，那就可以调用结束回调方法
if (CollectionUtils.isEmpty(nextTasks)) {
    // 调用业务回调
    String callbackUrl = (String) existVariables.get(WorkflowConstants.VARIABLE_CALLBACK_URL);
    String businessKey = (String) existVariables.get(WorkflowConstants.VARIABLE_BUSINESS_KEY);
    if (StringUtils.isNotEmpty(callbackUrl) && StringUtils.isNotEmpty(businessKey)) {
        //TODO 这里可以进行业务回调，回调 URL 可以是消息、方法、和接口
        workflowCallBackService.doCallBack(callbackUrl, businessKey);
    }
}
```

```
 [p-nio-80-exec-4] c.s.a.service.WorkflowCallBackService    : 工作流结束，回调触发：com.xxx.xx.x.ss()，回调参数：2df5731025d7410d810631e5b2173889
```

<br>

### <span id="费用报销多人会签">费用报销多人会签</span>

比如有这么一种情况，报销20块钱，需要 3个财务一起审批。

这种多人会签的情况，在实际业务中也很常见。。。

流程就不重新画了，就用那个离职审批，先加一个公司管理员的用户：

```java
{"manager", "password", "companyManager"},
```

那么现在就有两个公司管理员：`manager`、`system`

修改流程如下：

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220318115100069.png)

这里面的几个核心要点：

> 1. **多实例类型要选择：parallel 平行、 sequential 顺序** 
> 2. **多实例集合要命名，这个一般在 Assignee 后加个 List** ，例如 projectManager 对应 projectManagerList
> 3. **多实例变量要填上，和 Assignee 一样就行**
> 4. **完成添加需要补充，这里是只要有一个任务被拒绝，直接结束**

然后在根据角色编号获取 流程定义参数时，需要传入 多实例List 类型：

```java

public final class WorkflowConstants {

    public static final Map<String, String> ROLE_TABLE = new HashMap<>();
    /*
    |角色 |角色英文名|角色编号|
    |总经理 |generalManager|088|
    */
    static {
        ROLE_TABLE.put("groupManager", "groupManagerList");
        ROLE_TABLE.put("projectManager", "projectManagerList");
        ROLE_TABLE.put("companyManager", "companyManagerList");
        ROLE_TABLE.put("admin", "adminList");
    }
}

```

其他不变，看测试结果，可以看到已经有一个 manager 审批，但是流程并没有结束。

![image-20220318124625539](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220318124625539.png)



<br>

### <span id="公司缺人离职不批">公司缺人离职不批</span>

比如现在，公司业务紧张，天天加班，你还想跑路？做梦都别想。

**所以这时候防止大家提交离职审批，可以把离职流程暂时挂起，不允许申请。**

这只是一个简单API，代码一放跳过：

```java
    /**
     * 挂起流程
     * @param status 0-挂起，1-恢复
     */
    @RequestMapping(value = "/process/processSuspend")
    public Response processSuspend(String processKey, String status) {
        //拿到指定的流程定义
        ProcessDefinition processDefinition = repositoryService.createProcessDefinitionQuery().processDefinitionKey(processKey).singleResult();
        // 得到当前流程定义的实例是否都为暂停状态
        boolean suspended = processDefinition.isSuspended();
        //拿到流程定义ID
        String processId = processDefinition.getId();
        if ("0".equals(status)) {
            //恢复，如果是暂停，可以执行激活操作 ,参数1 ：流程定义id ，参数2：是否激活，参数3：激活时间
            repositoryService.activateProcessDefinitionById(processId,
                    true,
                    null
            );
        }
        if ("1".equals(status)) {
            //挂起，如果是激活状态，可以暂停，参数1 ：流程定义id ，参数2：是否暂停，参数3：暂停时间
            repositoryService.suspendProcessDefinitionById(processId,
                    true,
                    null);
        }
        return Response.builder().code(0).build();
    }
```

测试下，把离职停了，最后请假正常创建，离职报错。

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220318213042515.png)



![image-20220318213029686](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220318213029686.png)





<br>

### <span id="流程签署自动提醒">流程签署自动提醒</span>

然后再看最后的事件监听，首先看上面会签中。

只能看到由哪几个角色进行了审批，但是 manager 和 system 是一个环节啊，能不能合在一起呢？

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220318194038333.png)

这里就可以加一个监听了。

<img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220318215948804.png" alt="image-20220318215948804" style="zoom:80%;" />

<img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220318215928549.png" alt="image-20220318215928549" style="zoom:80%;" />



直接加个监听器，继承 `ExecutionListener` ：

```java
@Component
@Slf4j
public class StartListener implements ExecutionListener {

    /**
     * 序列化
     */
    private static final long serialVersionUID = 3599293834301636975L;

    @Override
    public void notify(DelegateExecution execution) {
        log.info("监听到启动了一个新实例");
        // 获取流程变量
        Map<String, Object> variables = execution.getVariables();
        // 开启支持跳过表达式
        variables.put(WorkflowConstants.SKIP_EXPRESSION, true);
        // 将修改同步到流程中
        // execution.setTransientVariables(variables);
        // 这种方式也行。直接设置流程变量
        execution.setVariable(WorkflowConstants.SKIP_EXPRESSION, true);
    }
}
```

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220318223012166.png)

----

会签监听：

```java
@Slf4j
@Component
public class SignListener implements TaskListener {
    private static final long serialVersionUID = 1L;

    @Override
    public void notify(DelegateTask delegateTask) {
        log.info("会签监听");
        //获取流程id
        String exId = delegateTask.getExecutionId();
        Integer isAgree = (Integer) runtimeService.getVariable(exId, "isAgree");
        log.info("结果：{}", isAgree);
    }
}
```



<img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220318220049988.png" alt="image-20220318220049988" style="zoom:80%;" />

<img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220318220030104.png" alt="image-20220318220030104" style="zoom:80%;" />

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220318223349082.png)



<br>

## <span id="其他功能">其他功能</span>

除了上面这些，Activiti 还有很多其他更加复杂的操作功能：

- **网关：排他、并行、包含、事件**
- **触发：短信、邮件等**

因为还没有用到，估计也用不太到，所以就不涉及了。

**That's All ！**

<br>

## <span id="te">参考文章</span>

1. [Activiti7工作流引擎_Roc的博客-CSDN博客_activiti工作流引擎](https://blog.csdn.net/weixin_46990523/article/details/109473507)
2. [黑马程序员java教程最新工作流引擎Activiti7基础到进阶，Activiti和Spring框架、SpringBoot整合_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1H54y167gf?p=3)
3. [BPMN详细介绍_feiniao168的专栏-CSDN博客](https://blog.csdn.net/feiniao168/article/details/83889966)
4. [SpringBoot整合Activiti7使用_菜菜的博客-CSDN博客_springboot整合activiti7](https://blog.csdn.net/qq_34839150/article/details/109903454)
5. [Activiti7工作流引擎之常用API操作_喜羊羊love红太狼-CSDN博客_activiti7的api](https://blog.csdn.net/qq_38423256/article/details/116332791)







