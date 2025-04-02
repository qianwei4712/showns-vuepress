<div class="catalog">

- [理论基础](#理论基础)
  - [分布式锁的常见问题](#分布式锁的常见问题)
- [基于SetNX的Redis分布式锁](#基于SetNX的Redis分布式锁)
- [基于Redisson的分布式锁](#基于Redisson的分布式锁)
- [参考文章](#参考文章)

</div>

`2025.03.31`

好久没学习新东西了，又要开始卷代码和应用了.......





### <span id="理论基础">理论基础</span>

##### 可重入锁

- **重点：当前线程拿到了A锁，在获得之后重新尝试获取A锁，可以直接拿到，不需要重新竞争锁。**
- 使用场景：
  1. 递归调用：方法A获取锁后调用方法B，方法B也需要获取同一把锁
  2. 嵌套调用：在同步代码块中调用另一个需要相同锁的同步代码块
  3. 回调函数：在持有锁的情况下调用回调函数（异常抛出重新调用），而回调函数也需要获取同一把锁
- 实现核心点：**根据线程来区分锁，每个线程有自己的线程ID，根据线程ID来区分是否可重入**

##### 分布式锁

- 多线程并发情况下，同时对一个共享资源进行读写。在分布式微服务的场景下，分布式锁的应用甚至比消息队列还广泛（暴露我们小公司没有微服务）
- JVM的锁只是本地线程级别，无法在分布式环境下锁住多个线程，所以需要引入独立的锁服务，一般是 Redis、Zookeeper，这两性能好。

![image-20250401225728014](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/image-20250401225728014.png)

##### lua 语言

它可以把多个命令，写到一个脚本中，然后进行原子性操作。

在多个命令的执行过程中不会有其他命令插入进来。我们可以用这个脚本，进行redis操作，保证原子性。

##### <span id="分布式锁的常见问题">分布式锁的常见问题</span>

1. **加锁和解锁必须是同一个客户端**

这个好理解：

- 第一，为了防止其他线程非法释放锁；否则会破坏互斥性，导致多个线程同时进入临界区
- 第二，保证锁的唯一性；**通常使用"客户端ID + 线程ID"作为持有者标识（这个重要！！！）**
- 第三，为了维护可重入性；同一线程可以多次获取同一把锁

2. **避免死锁情况**

- 如果获得锁的线程因为意外情况，中断执行了（宕机、服务更新），怎么办？？？那其他线程就永远不能获得锁了。

> **这种情况下就需要加一个锁的过期时间，防止锁一直不释放。**

![image-20250402114714729](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/image-20250402114714729-17435659555661.png)

这个图中，绘制了基础的实现流程；没有加上看门狗的机制，不过大部分情况下也能用了，只要设置的过期时间注意一点。

<br>

- 但是另一个问题，如果业务执行比较慢，在过期时间内，没有执行完毕，那锁就自动释放了。。。

> 所以这种时候，就需要 **分布式锁 进行自动续期；我们就需要加一个额外线程，检测是否还在执行业务，这就是大名鼎鼎的 看门狗机制**

![image-20250402115150924](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/image-20250402115150924.png)

全套的逻辑差不多就这些了（自己写逻辑其实没用，直接写redisson就好了）

<br>

### <span id="基于SetNX的Redis分布式锁">基于SetNX的Redis分布式锁</span>

> `SETNX` 是 Redis 提供的一种**原子操作**，全称是 “SET if Not exists”，用于在指定的键不存在时设置键值，并返回操作结果（但是实际上不用他）

#### SetNX 基础用法

- 原子性：`SETNX` 是 Redis 的原子操作，多个客户端并发访问时，只会有一个操作成功。
- 幂等性：如果键已存在，则后续的 `SETNX` 调用不会影响当前值。
- 轻量级锁：`SETNX` 常用于实现分布式锁，通过确保某个键唯一存在来锁定资源。

```shell
SETNX lock_key "123"
```

如果 `lock_key` 不存在，则设置键值为 `"123"`，并返回 `1`；如果 `lock_key` 已存在，则不执行任何操作，返回 `0`。

#### 过期时间问题

- SetNX 加锁和设置过期时间两个操作并不是原子性的，还是可能出现加锁之后宕机的情况。所以不能用这个方式

好在 Redis 提供了改进版本的 `SET` 命令，可以直接设置键值并附加过期时间：

```shell
SET key value NX EX seconds
```

- **NX**：表示仅当键不存在时才执行设置操作（相当于 `SETNX`）。
- **EX seconds**：设置过期时间，单位为秒
- 这是一个 原子操作，无需再单独调用 `EXPIRE`。

<br/>

#### 分布式锁Demo

> 从别人那抄一点代码得了，我反正肯定优先使用工具。。。粗略看了一下，应该没加看门狗

```java
public class RedisLockUtil {
 
    private String LOCK_KEY = "redis_lock";
 
    // key的持有时间，5ms
    private long EXPIRE_TIME = 5;
 
    // 等待超时时间，1s
    private long TIME_OUT = 1000;
 
    // redis命令参数，相当于nx和px的命令合集
    private SetParams params = SetParams.setParams().nx().px(EXPIRE_TIME);
 
    // redis连接池，连的是本地的redis客户端
    JedisPool jedisPool = new JedisPool("127.0.0.1", 6379);
 
    /**
     * 加锁
     *
     * @param id
     *            线程的id，或者其他可识别当前线程且不重复的字段
     * @return
     */
    public boolean lock(String id) {
        Long start = System.currentTimeMillis();
        Jedis jedis = jedisPool.getResource();
        try {
            for (;;) {
                // SET命令返回OK ，则证明获取锁成功
                String lock = jedis.set(LOCK_KEY, id, params);
                if ("OK".equals(lock)) {
                    return true;
                }
                // 否则循环等待，在TIME_OUT时间内仍未获取到锁，则获取失败
                long l = System.currentTimeMillis() - start;
                if (l >= TIME_OUT) {
                    return false;
                }
                try {
                    // 休眠一会，不然反复执行循环会一直失败
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        } finally {
            jedis.close();
        }
    }
 
    /**
     * 解锁
     *
     * @param id
     *            线程的id，或者其他可识别当前线程且不重复的字段
     * @return
     */
    public boolean unlock(String id) {
        Jedis jedis = jedisPool.getResource();
        // 删除key的lua脚本
        String script = "if redis.call('get',KEYS[1]) == ARGV[1] then" + "   return redis.call('del',KEYS[1]) " + "else"
            + "   return 0 " + "end";
        try {
            String result =
                jedis.eval(script, Collections.singletonList(LOCK_KEY), Collections.singletonList(id)).toString();
            return "1".equals(result);
        } finally {
            jedis.close();
        }
    }
}
```

别人的测试代码：(直接复制。我觉得应该不需要用这种原始的方式来实现.......)

```java
public class RedisLockTest {
    private static RedisLockUtil demo = new RedisLockUtil();
    private static Integer NUM = 101;
 
    public static void main(String[] args) {
        for (int i = 0; i < 100; i++) {
            new Thread(() -> {
                String id = Thread.currentThread().getId() + "";
                boolean isLock = demo.lock(id);
                try {
                 // 拿到锁的话，就对共享参数减一
                    if (isLock) {
                        NUM--;
                        System.out.println(NUM);
                    }
                } finally {
                 // 释放锁一定要注意放在finally
                    demo.unlock(id);
                }
            }).start();
        }
    }
}
```

<br>

### <span id="基于Redisson的分布式锁">基于Redisson的分布式锁</span>

> Redisson是一个在Redis的基础上实现的Java驻内存数据网格（In-Memory Data Grid）。它不仅提供了一系列的分布式的Java常用对象，还提供了许多分布式服务。

#### 准备工作

```xml
<dependency>
     <groupId>org.redisson</groupId>
     <artifactId>redisson</artifactId>
     <version>3.17.7</version>
</dependency>
```

```java
@Configuration
public class RedissonConfig {
    @Bean
    public RedissonClient redissonClient() {
        // 配置类
        Config config = new Config();
        // 添加redis地址，这里添加了单点的地址，也可以使用config.useClusterServers()添加集群地址
        config.useSingleServer()
                .setAddress("redis://127.0.0.1:6379");
        // 创建客户端
        return Redisson.create(config);
    }
}
```

上面是最基础的配置工作；然后搞个最简单的代码

```java
@Test
public void rdsFirstTest() throws InterruptedException {
    RLock lock = redissonClient.getLock("anyLock");//可重入锁
    //获取锁
    //boolean isLock = lock.tryLock(1, 3, TimeUnit.SECONDS);//参数：等待时间，锁失效时间，时间单位（看门狗机制会失效）
    boolean isLock = lock.tryLock();//不设置参数默认采用看门狗机制,采用默认失效时间30秒
    try {
        if (isLock) {
            System.out.println("获取到分布式锁");
        } else {
            System.out.println("没有获取到");
        }
        //通过睡眠 查看看门狗机制是否生效，不能打断点
        TimeUnit.SECONDS.sleep(60);
    } finally {
        //释放锁
        lock.unlock();
    }
}
```

![image-20250402160216283](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/image-20250402160216283.png)

可以看到redis加锁成功，Key是线程ID



#### 测试可重入性

```java
private static int index = 0;

@Test
public void reEntryTest() throws InterruptedException {
    index++;
    RLock lock = redissonClient.getLock("anyLock");//可重入锁
    //获取锁
    boolean isLock = lock.tryLock();//不设置参数默认采用看门狗机制,采用默认失效时间30秒
    try {
        if (isLock) {
            System.out.println("获取到分布式锁");
        } else {
            System.out.println("没有获取到");
        }
        TimeUnit.SECONDS.sleep(10);
        //递归五次，测试一下看看重入是不是生效
        if (index > 5) {
            return;
        }
        //递归调用
        reEntryTest();
    } finally {
        //释放锁
        lock.unlock();
    }
}
```

执行效果：

![image-20250402161541946](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/image-20250402161541946.png)

![image-20250402161532640](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/image-20250402161532640.png)

#### 看看源码

```java
<T> RFuture<T> tryLockInnerAsync(long waitTime, long leaseTime, TimeUnit unit, long threadId, RedisStrictCommand<T> command) {
    return evalWriteAsync(getRawName(), LongCodec.INSTANCE, command,
                          "if (redis.call('exists', KEYS[1]) == 0) then " +
                          "redis.call('hincrby', KEYS[1], ARGV[2], 1); " +
                          "redis.call('pexpire', KEYS[1], ARGV[1]); " +
                          "return nil; " +
                          "end; " +
                          "if (redis.call('hexists', KEYS[1], ARGV[2]) == 1) then " +
                          "redis.call('hincrby', KEYS[1], ARGV[2], 1); " +
                          "redis.call('pexpire', KEYS[1], ARGV[1]); " +
                          "return nil; " +
                          "end; " +
                          "return redis.call('pttl', KEYS[1]);",
                          Collections.singletonList(getRawName()), unit.toMillis(leaseTime), getLockName(threadId));
}

protected RFuture<Boolean> unlockInnerAsync(long threadId) {
    return evalWriteAsync(getRawName(), LongCodec.INSTANCE, RedisCommands.EVAL_BOOLEAN,
                          "if (redis.call('hexists', KEYS[1], ARGV[3]) == 0) then " +
                          "return nil;" +
                          "end; " +
                          "local counter = redis.call('hincrby', KEYS[1], ARGV[3], -1); " +
                          "if (counter > 0) then " +
                          "redis.call('pexpire', KEYS[1], ARGV[2]); " +
                          "return 0; " +
                          "else " +
                          "redis.call('del', KEYS[1]); " +
                          "redis.call('publish', KEYS[2], ARGV[1]); " +
                          "return 1; " +
                          "end; " +
                          "return nil;",
                          Arrays.asList(getRawName(), getChannelName()), LockPubSub.UNLOCK_MESSAGE, internalLockLeaseTime, getLockName(threadId));
}
```

核心的加锁、解锁代码；也容易看懂。

<br>

### <span id="参考文章">参考文章</span>

[【Java教程】锁的分类：可重入锁、不可重入锁，2023Java入门必备教程！_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1xh4y1r7Eg/?vd_source=e768d8ae5d35e9620400ecb1e8983682)

[分布式锁的深度解析和全面对比_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1RkUaY5E8e/?spm_id_from=333.1387.upload.video_card.click&vd_source=e768d8ae5d35e9620400ecb1e8983682)

[Redisson分布式锁的深度解析_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1PDBxYJELG/?spm_id_from=333.788.recommend_more_video.1&vd_source=e768d8ae5d35e9620400ecb1e8983682)

[如何用Redis实现分布式锁_redis分布式锁-CSDN博客](https://blog.csdn.net/fuzhongmin05/article/details/119251590)

[面试官：分布式锁有什么作用？如何实现分布式锁？_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV16h411K7jS/?vd_source=e768d8ae5d35e9620400ecb1e8983682)

[Redis SETNX 详解-CSDN博客](https://blog.csdn.net/T_Y_F_/article/details/144238022)

[这才叫细：带你深入理解Redis分布式锁-CSDN博客](https://blog.csdn.net/weixin_43167418/article/details/113533251)

[redisson分布式锁的使用方法_redisson分布式锁使用-CSDN博客](https://blog.csdn.net/qq_64688685/article/details/138917882)

