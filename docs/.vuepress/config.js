import { defineUserConfig, defaultTheme } from 'vuepress'


export default defineUserConfig({
    //插件添加
    plugins: [
    ],
    //基础信息配置
    lang: 'zh-CN',
    title: '路的尽头在哪',
    description: '做人最重要的是开心',

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
                        text: 'Spring 基础', link: '/java/oopbase/Java8NewChara.html',
                    },
                    {
                        text: 'Spring Boot', link: '/java/collections/CollectionRelationDiagram.html',
                    },
                    {
                        text: 'Spring cloud', link: '/java/iokonwledge/IoBaseKonwledge.html',
                    },
                    {
                        text: 'Spring FQA', link: '/java/thread/ThreadTheoryBase.html',
                    },
                ],
            }, {
                text: '应用',
                children: [
                    {
                        text: '框架', link: '/java/oopbase/Java8NewChara.html',
                    },
                    {
                        text: '中间件', link: '/java/collections/CollectionRelationDiagram.html',
                    },
                    {
                        text: '工具', link: '/java/iokonwledge/IoBaseKonwledge.html',
                    },
                    {
                        text: '散记', link: '/java/fqa/OldBoysThoughts.html',
                    },
                ],
            }, {
                text: '攻城狮',
                children: [
                    {
                        text: '服务器', link: '/java/oopbase/Java8NewChara.html',
                    },
                    {
                        text: '设计与方法论', link: '/java/collections/CollectionRelationDiagram.html',
                    },
                    {
                        text: '算法与数据结构', link: '/java/iokonwledge/IoBaseKonwledge.html',
                    },
                    {
                        text: '散记', link: '/java/fqa/OldBoysThoughts.html',
                    },
                ],
            }, {
                text: '百宝箱',
                children: [
                    {
                        text: 'Java面向对象基础', link: '/java/oopbase/Java8NewChara.html',
                    }
                ],
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
            ]
        },

    }),


    //统一环境配置
    port: 80,//开发环境端口
})