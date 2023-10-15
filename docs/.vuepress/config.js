import { defineUserConfig, defaultTheme } from 'vuepress'

export default defineUserConfig({
    //插件添加
    plugins: [
    ],
    //基础信息配置
    lang: 'zh-CN',
    title: '路的尽头在哪',
    description: '做人最重要的是开心',
    base: '/showns-vuepress/',

    // 默认主题配置
    theme: defaultTheme({
        //顶部的大菜单分类
        navbar: [
            {
                text: 'Java',
                children: [
                    {
                        text: 'Java面向对象基础', link: '/java/oopbase/Java8NewChara.html',
                    },
                    {
                        text: 'Java集合知识体系', link: '/java/collections/CollectionRelationDiagram.html',
                    },
                    {
                        text: 'Java IO知识体系', link: '/java/iokonwledge/IoBaseKonwledge.html',
                    },
                    {
                        text: 'Java 多线程与并发', link: '/java/thread/ThreadTheoryBase.html',
                    },
                    {
                        text: 'Java 虚拟机', link: '/java/jvm/JvmTotalSee.html',
                    },
                    {
                        text: '散记', link: '/java/fqa/OldBoysThoughts.html',
                    },
                ],
            }, {
                text: 'Spring',
                children: [
                    {
                        text: 'Spring 基础', link: '/spring/base/IoCAndDI.html',
                    },
                    {
                        text: 'Spring Boot', link: '/spring/boot/LogbackIntegre.html',
                    },
                    {
                        text: 'Spring cloud', link: '/spring/cloud/eurekaDemo.html',
                    },
                    {
                        text: 'Spring FQA', link: '/spring/fqa/VersionSelect.html',
                    },
                ],
            }, {
                text: '应用',
                children: [
                    {
                        text: '框架', link: '/apply/frame/MysqlPrinciple.html',
                    },
                    {
                        text: '中间件', link: '/apply/middleware/NginxLoadBalancing.html',
                    },
                    {
                        text: '工具', link: '/apply/tool/MysqldumpBackupSql.html',
                    },
                    {
                        text: '散记', link: '/apply/fqa/SomethingNotes.html',
                    },
                ],
            }, {
                text: '攻城狮',
                children: [
                    {
                        text: '服务器', link: '/deploy/server/CommonSoftwareDeploy.html',
                    },
                    {
                        text: '设计与方法论', link: '/deploy/designpattern/RegularExpression.html',
                    },
                    {
                        text: '算法与数据结构', link: '/deploy/structure/WhatisHash.html',
                    },
                    {
                        text: '散记', link: '/deploy/fqa/SomethingNotes.html',
                    },
                ],
            }, {
                text: '百宝箱',
                link: '/'
            },
        ],

        // 左边侧边栏
        sidebarDepth: 0,//关闭提取文章标题
        sidebar: {
            '/java/': [
                {
                    text: 'Java面向对象基础',
                    children: [
                        {
                            text: '封装、继承、多态', link: '/java/oopbase/EncapInheritPolymo.html',
                        }, {
                            text: '接口、抽象类、内部类', link: '/java/oopbase/InterAbstInner.html',
                        }, {
                            text: 'Java 注解学习', link: '/java/oopbase/JavaAnnotation.html',
                        }, {
                            text: 'Object通用方法、枚举', link: '/java/oopbase/CommonMethodAndEnum.html',
                        }, {
                            text: '类型信息、反射', link: '/java/oopbase/RunTimeReflect.html',
                        }, {
                            text: 'Java 8 版本特性', link: '/java/oopbase/Java8NewChara.html',
                        },
                    ],
                }, {
                    text: 'Java集合知识体系',
                    children: [
                        {
                            text: '集合类的关系图', link: '/java/collections/CollectionRelationDiagram.html',
                        }, {
                            text: 'Collection - ArrayList 源码分析', link: '/java/collections/ArrayListSource.html',
                        }, {
                            text: 'Collection - LinkedList 源码分析', link: '/java/collections/LinkedListSource.html',
                        }, {
                            text: 'Collection - Vector 源码分析', link: '/java/collections/VectorSource.html',
                        }, {
                            text: 'Collection - ArrayDeque 栈和队列的首选对象', link: '/java/collections/StackAndQueue.html',
                        }, {
                            text: 'Collection - PriorityQueue 源码分析', link: '/java/collections/PriorityQueueSource.html',
                        }, {
                            text: 'Map - 侃晕面试官的HashMap源码', link: '/java/collections/HashMapSource.html',
                        }, {
                            text: 'Map - TreeMap 源码解读', link: '/java/collections/TreeMapSource.html',
                        }, {
                            text: 'Collection - HashSet & TreeSet', link: '/java/collections/AboutUtilSet.html',
                        }, {
                            text: 'Map - LinkedHashMap 源码解读', link: '/java/collections/LinkedHashMap.html',
                        }, {
                            text: 'Map - WeakHashMap 源码解读', link: '/java/collections/WeakHashMap.html',
                        }, {
                            text: '集合类常见比较', link: '/java/collections/CollectionComparison.html',
                        },
                    ],
                }, {
                    text: 'Java I/O知识体系',
                    children: [
                        {
                            text: '理论基础、学习导论', link: '/java/iokonwledge/IoBaseKonwledge.html',
                        }, {
                            text: 'Java BIO - 同步阻塞IO流', link: '/java/iokonwledge/JavaBioAbout.html',
                        }, {
                            text: 'Java NIO - 非阻塞IO流', link: '/java/iokonwledge/JavaNioAbout.html',
                        }, {
                            text: 'Java AIO - 异步IO流', link: '/java/iokonwledge/JavaAioAbout.html',
                        }, {
                            text: '《Netty 权威指南》 跟着学', link: '/java/iokonwledge/NettyStudy.html',
                        }
                    ],
                }, {
                    text: 'Java多线程与并发',
                    children: [
                        {
                            text: '并发理论基础', link: '/java/thread/ThreadTheoryBase.html',
                        }, {
                            text: 'Java 线程基础概念', link: '/java/thread/ThreadBaseConcept.html',
                        }, {
                            text: '关键字 synchronized 介绍', link: '/java/thread/Synchronized.html',
                        }, {
                            text: '关键字 volatile 介绍', link: '/java/thread/Volatile.html',
                        }, {
                            text: 'CAS、Unsafe、原子类详解', link: '/java/thread/AtomicCasUnSafe.html',
                        }, {
                            text: 'JUC锁：核心类 AQS 原理图文详解', link: '/java/thread/AbstractQueuedSynchronizer.html',
                        }, {
                            text: 'JUC锁: LockSupport 简介', link: '/java/thread/LockSupport.html',
                        }, {
                            text: 'JUC工具类: CountDownLatch 详解', link: '/java/thread/CountDownLatch.html',
                        }, {
                            text: 'JUC工具类: CyclicBarrier 简介', link: '/java/thread/CyclicBarrier.html',
                        }
                    ],
                }, {
                    text: 'Java虚拟机',
                    children: [
                        {
                            text: 'JVM 资料汇总', link: '/java/jvm/JvmTotalSee.html',
                        }, {
                            text: 'JVM 基础：虚拟机及字节码文件', link: '/java/jvm/ByteCodeFile.html',
                        }, {
                            text: 'JVM 基础：类加载机制介绍', link: '/java/jvm/ClassLoader.html',
                        }, {
                            text: 'JVM 基础：运行时数据区模型解读', link: '/java/jvm/RuntimeStruc.html',
                        }, {
                            text: 'JVM 基础：执行引擎工作原理', link: '/java/jvm/ExecutionEngine.html',
                        }, {
                            text: 'JVM 基础：垃圾回收算法和概念', link: '/java/jvm/GcAlgorithmn.html',
                        }, {
                            text: 'JVM 基础：垃圾收集器', link: '/java/jvm/GarbageCollection.html',
                        }, {
                            text: '调优排错：性能监控命令及工具', link: '/java/jvm/MonitorTools.html',
                        }
                    ],
                }, {
                    text: '散记',
                    children: [
                        {
                            text: '大佬们的思想 - 博客汇总', link: '/java/fqa/OldBoysThoughts.html',
                        }, {
                            text: '发在语雀不配单独提出来', link: '/java/fqa/SomethingNotes.html',
                        }, {
                            text: '判断线程池任务全部完成的姿势', link: '/java/fqa/JudgeThreadPoolDone.html',
                        }, {
                            text: 'cookie 和 session 解读', link: '/java/fqa/CookieAndSession.html',
                        }
                    ],
                }
            ],
            '/spring/': [
                {
                    text: 'Spring 基础',
                    children: [
                        {
                            text: 'Spring 架构介绍及本地搭建', link: '/spring/base/ArchitectureIntro.html',
                        }, {
                            text: '控制反转(IoC)、依赖注入(DI)', link: '/spring/base/IoCAndDI.html',
                        }, {
                            text: 'Bean 管理，创建、注入方式', link: '/spring/base/BeanConfigoure.html',
                        }, {
                            text: 'Spring AOP 切面实现与原理', link: '/spring/base/SpringAspect.html',
                        },
                    ],
                }, {
                    text: 'Spring Boot',
                    children: [
                        {
                            text: 'SpringBoot - logback 日志配置', link: '/spring/boot/LogbackIntegre.html',
                        }, {
                            text: 'SpringBoot - activeMQ 消息队列', link: '/spring/boot/ActiveMqIntegre.html',
                        },
                    ],
                }, {
                    text: 'Spring cloud',
                    children: [
                        {
                            text: 'Cloud - eureka 注册中心', link: '/spring/cloud/eurekaDemo.html',
                        }, {
                            text: 'Cloud - ribbon 负载均衡', link: '/spring/cloud/RibbonDemo.html',
                        }, {
                            text: 'Cloud - OpenFegin 注册服务调用', link: '/spring/cloud/OpenFegin.html',
                        }, {
                            text: 'Cloud - hystrix 熔断、降级', link: '/spring/cloud/HystrixDemo.html',
                        }, {
                            text: 'Cloud - gateway 网关服务', link: '/spring/cloud/GatewayDemo.html',
                        }
                    ],
                }, {
                    text: 'FQA',
                    children: [
                        {
                            text: 'SpringCloud 版本及对应关系', link: '/spring/fqa/VersionSelect.html',
                        }, {
                            text: '发在语雀不配单独提出来', link: '/spring/fqa/SomethingNotes.html',
                        }
                    ],
                }
            ],
            '/apply/': [
                {
                    text: '框架',
                    children: [
                        {
                            text: 'Database - MySQL 原理深入简介', link: '/apply/frame/MysqlPrinciple.html',
                        }, {
                            text: 'JWT - 无状态身份认证令牌', link: '/apply/frame/JwtPrinciple.html',
                        }, {
                            text: 'Mybatis-Plus 多数据源', link: '/apply/frame/MybatisPlusDbs.html',
                        }, {
                            text: 'Quartz - 任务调度框架整合使用', link: '/apply/frame/QuartzBaseApply.html',
                        }, {
                            text: 'Activiti - Workflow 最佳实战案例', link: '/apply/frame/Activiti7Workflow.html',
                        },
                    ],
                }, {
                    text: '中间件',
                    children: [
                        {
                            text: 'Nginx 负载均衡及双机主从模式', link: '/apply/middleware/NginxLoadBalancing.html',
                        }, {
                            text: 'Tomcat 8 参数配置性能优化', link: '/apply/middleware/TomcatOptimize.html',
                        }, {
                            text: 'MQ 的作用及主流 MQ 对比', link: '/apply/middleware/MqCompare.html',
                        }, {
                            text: 'RabbitMQ - 安装及基础使用', link: '/apply/middleware/RabbitMqBase.html',
                        }, {
                            text: 'RabbitMQ - 死信队列、延迟队列', link: '/apply/middleware/RabbitMqHighClass.html',
                        }, {
                            text: 'Redis 缓存 - 常见配置与应用案例', link: '/apply/middleware/RedisStudy.html',
                        }
                    ],
                }, {
                    text: '工具',
                    children: [
                        {
                            text: '使用mysqldump定时备份sql', link: '/apply/tool/MysqldumpBackupSql.html',
                        }, {
                            text: 'Jenkins、Gitee 自动化部署', link: '/apply/tool/JenkinsGiteeNpmBuild.html',
                        }, {
                            text: 'Jenkins、Dockerfile 容器部署', link: '/apply/tool/JenkinsMavenDockerfile.html',
                        },
                    ],
                }, {
                    text: '散记',
                    children: [
                        {
                            text: '发在语雀不配单独提出来', link: '/apply/fqa/SomethingNotes.html',
                        }, {
                            text: 'Dubbo3 + Zookeeper 基础案例', link: '/apply/fqa/DubboZookeeperFirst.html',
                        }, {
                            text: '使用 Explain 进行 SQL 分析', link: '/apply/fqa/ExplainKeyColumn.html',
                        }, {
                            text: 'Docker、Gitea、Mysql 企业仓库', link: '/apply/fqa/DockerGiteaMysql.html',
                        }
                    ],
                }
            ],
            '/deploy/': [
                {
                    text: '服务器',
                    children: [
                        {
                            text: '常用软件安装', link: '/deploy/server/CommonSoftwareDeploy.html',
                        }, {
                            text: 'Linux 常用命令', link: '/deploy/server/LinuxCommonCommand.html',
                        }, {
                            text: 'nginx 域名转发并配置SSL证书', link: '/deploy/server/NginxBindPortWithDomain.html',
                        }, {
                            text: 'docker 安装及基本用法', link: '/deploy/server/DockerInstall.html',
                        }, {
                            text: 'docker-compose 使用方法', link: '/deploy/server/DockerCompose.html',
                        },
                    ],
                }, {
                    text: '设计与方法论',
                    children: [
                        {
                            text: '常用详解:正则表达式', link: '/deploy/designpattern/RegularExpression.html',
                        }, {
                            text: '开发安全:Web 常见攻击详解', link: '/deploy/designpattern/WebAttackSafe.html',
                        }, {
                            text: '开发安全:Web 应用常见测试', link: '/deploy/designpattern/WebSafeTest.html',
                        }, {
                            text: '创建型模式', link: '/deploy/designpattern/CreationMode.html',
                        }, {
                            text: '结构型模式', link: '/deploy/designpattern/StructuralMode.html',
                        }, {
                            text: '行为型模式', link: '/deploy/designpattern/BehavioralMode.html',
                        }
                    ],
                }, {
                    text: '算法与数据结构',
                    children: [
                        {
                            text: '到底什么是 Hash', link: '/deploy/structure/WhatisHash.html',
                        }, {
                            text: '各类常用树的介绍', link: '/deploy/structure/TreeAndCommons.html',
                        }, {
                            text: '数据结构 - 堆(Heap)', link: '/deploy/structure/WhatisHeap.html',
                        }, {
                            text: '操作系统中heap和stack的区别', link: '/deploy/structure/HeapAndStack.html',
                        }, {
                            text: '排序算法', link: '/deploy/structure/SortingAlgorithm.html',
                        },
                    ],
                }, {
                    text: '散记',
                    children: [
                        {
                            text: '发在语雀不配单独提出来', link: '/deploy/fqa/SomethingNotes.html',
                        }, {
                            text: 'GET 和 POST 的真正区别', link: '/deploy/fqa/CompareGetPsot.html',
                        }, {
                            text: '在线电子书、下载链接', link: '/deploy/fqa/EbookOnline.html',
                        }
                    ],
                }
            ],
        },

    }),


    //统一环境配置
    port: 80,//开发环境端口
})