
<div class="catalog">

- [前言](#前言)
- [CLH 队列](#CLH队列)
- [AQS 源码](#AQS源码)
  - [字段属性](#字段属性)
  - [主要方法](#主要方法)
- [独占/共享模式](#独占/共享模式)
- [ReentrantLock 独占模式](#ReentrantLock)
  - [lock 获得锁](#lock获得锁)
  - [失败进入队列](#失败进入队列)
  - [队列节点请求锁](#队列节点请求锁)
  - [unlock 释放锁](#unlock释放锁)
- [CountDownLatch 共享模式](#CountDownLatch)
  - [主线程 await](#主线程await)
  - [主线程阻塞等待](#主线程阻塞等待)
  - [countDown 释放锁](#countDown释放锁)
- [参考文章](#参考文章)

</div>


## <span id="前言">前言</span>

*2021.12.02 说实话，AQS 确实没了解过* ，阅读 Java 版本为 **1.8.0.25**。

- 源码：
  - [AbstractQueuedSynchronizer.java - Gitee.com](https://gitee.com/qianwei4712/JDK1.8.0.25-read/blob/master/src/main/java/java/util/concurrent/locks/AbstractQueuedSynchronizer.java)
  - [ReentrantLock.java - Gitee.com](https://gitee.com/qianwei4712/JDK1.8.0.25-read/blob/3f92b4eec860628a343b044ef2ea22abf296b352/src/main/java/java/util/concurrent/locks/ReentrantLock.java)
  - [CountDownLatch.java - Gitee.com](https://gitee.com/qianwei4712/JDK1.8.0.25-read/blob/3f92b4eec860628a343b044ef2ea22abf296b352/src/main/java/java/util/concurrent/CountDownLatch.java)
- 中文文档：[Java 8 中文版 - 在线API中文手册 - 码工具 (matools.com)](https://www.matools.com/api/java8)

AbstractQueuedSynchronizer 翻译过来是：**抽象队列同步器** 

> AQS 是用来构建 锁 或者 其他同步器组件的 基础框架。通过内置的 **FIFO 双向队列**，来完成资源获取线程的排队工作，并通过一个 **int 类型变量** 表示持有锁的状态。

AQS 解决了 实现同步器时涉及当的大量细节问题，例如：获取同步状态、FIFO同步队列。它不仅能够极大地减少实现工作，而且也不必处理在多个位置上发生的竞争问题。

在基于 AQS 构建的同步器中，只能在一个时刻发生阻塞，从而降低上下文切换的开销，提高了吞吐量。

常见的 AQS 应用 API 类包括：`ReentrantLock` 、`ReentrantReadWriteLock` 、`CountDownLatch` 、`Semaphore`

因为 AQS 是 Abstract 抽象类，一些方法都是空的，所以后面会根据 ReentrantLock 举例。



<br/>

## <span id="CLH队列">CLH 队列</span>

AQS 主要依靠 **CLH队列的变体** 来实现队列阻塞、等待、唤醒机制，保证锁的分配功能。CLH 队列将暂时获取不到锁的线程加入到队列中，这个队列就是 AQS 的抽象表现。

> CLH 将请求共享资源的线程封装成队列的节点，通过 CAS、自旋锁 以及 LockSupport.park() 的方式，维护 state 变量的状态，使并发达到同步控制的效果。

效果图如下：

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/721070-20170504110246211-10684485.png)

**在 AQS 中，基础单元是由 Thread 封装的 Node 节点。**

内部类 Node 节点代码：

```java
    static final class Node {
        // 模式，分为共享与独占
        // 节点在共享模式下等待的标记
        static final Node SHARED = new Node();
        // 独占模式
        static final Node EXCLUSIVE = null;

        // 结点状态
        // CANCELLED，值为1，表示当前的线程被取消
        // SIGNAL，值为-1，表示当前节点的后继节点包含的线程需要运行，也就是unpark
        // CONDITION，值为-2，表示当前节点在等待condition，也就是在condition队列中
        // PROPAGATE，值为-3，表示当前场景下后续的acquireShared能够得以执行
        // 值为0，表示当前节点在sync队列中，等待着获取锁
        static final int CANCELLED =  1;
        static final int SIGNAL    = -1;
        static final int CONDITION = -2;
        static final int PROPAGATE = -3;

        // 当前节点线程.在构造时初始化并在使用后置空.
        volatile Thread thread;
        // 上一个节点
        volatile Node prev;
        // 下一个节点
        volatile Node next;

        // 结点状态
        volatile int waitStatus;
        // 下一个等待者
        Node nextWaiter;

        /**
         * 如果节点在共享模式下等待，则返回 true。
         */
        final boolean isShared() {
            return nextWaiter == SHARED;
        }

        // 前驱结点不为空，返回
        final Node predecessor() throws NullPointerException {
            // 保存前驱结点
            Node p = prev;
            // 前驱结点为空，抛出异常
            if (p == null)
                throw new NullPointerException();
            else // 前驱结点不为空，返回
                return p;
        }

        // 用于建立初始头部或共享标记
        Node() { }

        // 用来添加等待线程节点
        Node(Thread thread, Node mode) {
            this.nextWaiter = mode;
            this.thread = thread;
        }

        Node(Thread thread, int waitStatus) { // Used by Condition
            this.waitStatus = waitStatus;
            this.thread = thread;
        }
    }
```

很常规的内部节点类，可以看到是一个双向链表。入队出队无非就是指针的移动，全部略过。

和 AQS 相关的也就是一个模式和等待状态，下面再讲。



<br/>

## <span id="AQS源码">AQS 源码</span>



### <span id="字段属性">字段属性</span>

AQS 的基础属性包括：队列链表的指针、锁状态属性、以及 CAS 相关。

```java
    /**
     * 队列头指针。只能通过set方法修改。
     * 如果 head 存在，则保证其 waitStatus 不会被 CANCELLED
     */
    private transient volatile Node head;
    /**
     * 队列尾指针。只能通过添加新节点
     */
    private transient volatile Node tail;
    /**
     * 共享变量，使用volatile修饰保证线程可见性
     */
    private volatile int state;
    /**
     * 自旋时间
     * The number of nanoseconds for which it is faster to spin rather than to use timed park.
     * A rough estimate suffices to improve responsiveness with very short timeouts.
     */
    static final long spinForTimeoutThreshold = 1000L;

    /**
     * Setup to support compareAndSet. We need to natively implement
     * this here: For the sake of permitting future enhancements, we
     * cannot explicitly subclass AtomicInteger, which would be
     * efficient and useful otherwise. So, as the lesser of evils, we
     * natively implement using hotspot intrinsics API. And while we
     * are at it, we do the same for other CASable fields (which could
     * otherwise be done with atomic field updaters).
     */
    // Unsafe类实例
    private static final Unsafe unsafe = Unsafe.getUnsafe();
    // Unsafe类实例
    private static final long stateOffset;
    // head内存偏移地址
    private static final long headOffset;
    // head内存偏移地址
    private static final long tailOffset;
    // tail内存偏移地址
    private static final long waitStatusOffset;
    // tail内存偏移地址
    private static final long nextOffset;
```

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211205143057176-16386858903311.png)





### <span id="主要方法">主要方法</span>

AQS 就一个无参构造方法

```java
    /**
     * 创建一个初始同步状态为零的新的 AbstractQueuedSynchronizer实例。
     */
    protected AbstractQueuedSynchronizer() { }
```

那么根据字段，刚创建的 AQS ：**默认 state = 0、head / tail 为 null**

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/82077ccf14127a87b77cefd1ccf562d3253591.png)

AQS 主要提供了如下一些方法，先混个脸熟：

- `getState()`：返回同步状态的当前值；
- `setState(int newState)`：设置当前同步状态；
- `compareAndSetState(int expect, int update)`：使用 CAS 设置当前状态，该方法能够保证状态设置的原子性；
- `tryAcquire(int arg)`：独占式获取同步状态，获取同步状态成功后，其他线程需要等待该线程释放同步状态才能获取同步状态；
- `tryRelease(int arg)`：独占式释放同步状态；
- `tryAcquireShared(int arg)`：共享式获取同步状态，返回值大于等于0则表示获取成功，否则获取失败；
- `tryReleaseShared(int arg)`：共享式释放同步状态；
- `isHeldExclusively()`：当前同步器是否在独占式模式下被线程占用，一般该方法表示是否被当前线程所独占；
- `acquire(int arg)`：独占式获取同步状态，如果当前线程获取同步状态成功，则由该方法返回，否则，将会进入同步队列等待，该方法将会调用可重写的tryAcquire(int arg)方法；
- `acquireInterruptibly(int arg)`：与acquire(int arg)相同，但是该方法响应中断，当前线程为获取到同步状态而进入到同步队列中，如果当前线程被中断，则该方法会抛出InterruptedException异常并返回；
- `tryAcquireNanos(int arg,long nanos)`：超时获取同步状态，如果当前线程在nanos时间内没有获取到同步状态，那么将会返回false，已经获取则返回true；
- `acquireShared(int arg)`：共享式获取同步状态，如果当前线程未获取到同步状态，将会进入同步队列等待，与独占式的主要区别是在同一时刻可以有多个线程获取到同步状态；
- `acquireSharedInterruptibly(int arg)`：共享式获取同步状态，响应中断；
- `tryAcquireSharedNanos(int arg, long nanosTimeout)`：共享式获取同步状态，增加超时限制；
- `release(int arg)`：独占式释放同步状态，该方法会在释放同步状态之后，将同步队列中第一个节点包含的线程唤醒；
- `releaseShared(int arg)`：共享式释放同步状态；



<br/>

## <span id="独占/共享模式">独占/共享模式</span>

AQS提供了两种工作模式：独占(exclusive)模式 和 共享(shared)模式。

```java
static final class Node {
    // 模式，分为共享与独占
    // 节点在共享模式下等待的标记
    static final Node SHARED = new Node();
    // 独占模式
    static final Node EXCLUSIVE = null;
}
```

- **独占模式： 同一时间只有一个线程能拿到锁执行，锁的状态只有0和1两种情况。**
- **共享模式： 同一时间有多个线程可以拿到锁协同工作，锁的状态大于或等于0。**

|                独占模式                 |         共享模式          |
| :-------------------------------------: | :-----------------------: |
|           tryAcquire(int arg)           | tryAcquireShared(int arg) |
|            acquire(int arg)             |  acquireShared(int arg)   |
| acquireQueued(final Node node, int arg) | doAcquireShared(int arg)  |
|           tryRelease(int arg)           | tryReleaseShared(int arg) |
|            release(int arg)             |  releaseShared(int arg)   |



<br/>

## <span id="ReentrantLock">ReentrantLock 独占模式</span>

> **ReentrantLock 内部聚合了一个 AQS 的实现类 Sync，并通过 Sync 实现了线程同步管理** 

因为 AQS 是作为基础设施，所以比较抽象，所以通过 ReentrantLock 的实际应用场景来说明 AQS 的独占模式。

ReentrantLock 基础使用代码：

```java
class ReentrantLockTest {

    //初始化选择公平锁、非公平锁
    public static Lock lock = new ReentrantLock(true);

    public static void main(String[] args) {
        //两个线程同时启动
        new Thread(ReentrantLockTest::run).start();
        new Thread(ReentrantLockTest::run).start();
    }

    public static void run() {
        lock.lock();
        try {
            //业务代码.....
            System.out.println(Thread.currentThread().getName());
        } finally {
            lock.unlock();
        }
    }
}
```

ReentrantLock 可以选择公平锁和非公平锁：

```java
 // 构造方法默认为非公平锁
public ReentrantLock() {
    sync = new NonfairSync();
}
// true 为公平锁，false 为非公平锁
public ReentrantLock(boolean fair) {
    sync = fair ? new FairSync() : new NonfairSync();
}
```

- **公平锁：**先到先得，先进入队列排队的线程先获得锁
- **非公平锁（默认）：**所有等待线程都随机抢占锁

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211212163744957-16393059900761.png)

两者的区别也就是一两个判断方法，他们都是继承自 Sync ，也就是它们都是 AQS 的子类。下面以公平锁为例，逐步深入源码。

<br/>

### <span id="lock获得锁">lock 获得锁</span>

根据示例运行，第一个执行的是 lock 方法，该源码方法如下，主要看下注解：

```java
    /**
     * 获得锁，Acquires the lock.
     * <p>如果其他线程没有持有锁，则当前线程获取该锁并立即返回，将锁持有计数设置为 1。
     * <p>如果当前线程已经持有锁，那么持有计数加一并且该方法立即返回，
     * <p>如果锁被另一个线程持有，那么当前线程将被禁用以进行线程调度并处于休眠状态，直到获得锁为止，此时锁持有计数设置为 1。
     */
    public void lock() {
        sync.lock();
    }
```

sync 则是根据构造方法时确定的锁类型（公平锁、非公平锁），实际调用链路如下：



![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211212190540209.png)

FairSync.lock ：

```sql
final void lock() {  acquire(1); }
```

再往上调用 AQS 的 acquire 方法，获取锁：

```sql
    /**
     * 以独占模式获取锁，忽略中断。
     * 通过至少调用一次 {@link #tryAcquire} 实现，成功返回。
     * 否则线程会排队，可能会反复阻塞和解除阻塞，调用 {@link #tryAcquire} 直到成功。
     * 该方法可用于实现方法{@link Lock#lock}。
     *
     * @param arg 这个值被传送到 {@link #tryAcquire}，但不会被解释，可以代表任何你喜欢的东西。
     */
    public final void acquire(int arg) {
        if (!tryAcquire(arg) && acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
            selfInterrupt();
    }
    
    /**
     * 中断当前线程的便捷方法。
     */
    static void selfInterrupt() {
        Thread.currentThread().interrupt();
    }
```

看注释文档，可以大概知道，acquire 方法的作用是试图获得锁，失败则进入队列。这个小方法是这样的：

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211216224410855.png)

然后 AQS.tryAcquire 方法的说明：

```java
    /**
     * 尝试以独占模式获取。该方法应该查询对象的状态是否允许以独占模式获取它，如果允许则获取它。
     * <p>此方法始终由执行获取的线程调用。
     * 如果此方法报告失败，acquire 方法可能会将线程排队，如果它尚未排队，直到收到来自某个其他线程的释放信号。
     * 这可用于实现方法 {@link Lock#tryLock()}。
     *
     * @param arg 该值始终是传递给获取方法的值，或者是在进入条件等待时保存的值。
     *            该值是未经解释的，可以表示您喜欢的任何内容。
     * @return {@code true} 如果成功。成功后，该对象已获得锁。
     * @throws IllegalMonitorStateException 如果获取会将这个同步器置于非法状态。必须以一致的方式抛出此异常，同步才能正常工作。
     * @throws UnsupportedOperationException 如果不支持独占模式
     */
    protected boolean tryAcquire(int arg) {
        throw new UnsupportedOperationException();
    }
```

AQS里是个空方法，在 FairSync 中重写如下：

```java
/**
  * tryAcquire 的公平版本。
  * 除非递归调用或没有服务员或是第一个，否则不要授予访问权限。
  */
protected final boolean tryAcquire(int acquires) {
    //获得当前线程
    final Thread current = Thread.currentThread();
    //获得当前 AQS.state 状态
    int c = getState();
    if (c == 0) { // 如果state=0，表示目前没有线程正在占用锁
        // 再做个判断：CAS操作成功 并且 队列中没有线程等待
        if (!hasQueuedPredecessors() && compareAndSetState(0, acquires)) {
            //设置占用线程为当前线程
            setExclusiveOwnerThread(current);
            return true;
        }
    }
    else if (current == getExclusiveOwnerThread()) { // 如果当前线程，就是 AQS独占模式同步的当前所有者
        // 重新设置 AQS.state 的值，一般传入参数是 1，所以 state 都是 +1
        int nextc = c + acquires;
        if (nextc < 0)
            // 如果超出锁计数，因为 state 是 int 类型，所以重入次数 最多 2^31 -1
            throw new Error("Maximum lock count exceeded");
        setState(nextc);
        return true;
    }
    // 除了上面两种拿到锁的情况，其他没拿到锁返回 false
    return false;
}
```

> **因为是公平锁，需要判断下当前线程前，是否有排队线程；公平锁，先到先得**

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/auwnksnda.jpg)

到这里，如果是第一个试图获取锁的线程，已经获得锁了。并且无需进入排队队列。

`if (!tryAcquire(arg) && acquireQueued(addWaiter(Node.EXCLUSIVE), arg))` 判断中， `tryAcquire` 返回 true 后，就不再调用 `acquireQueued`

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211218235448600.png)

<br/>

### <span id="失败进入队列">失败进入队列</span>

ok，现在第二线程开始调用 lock 方法。

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211219142402516.png)

这个时候 线程A 依然持有锁，可以确定 `tryAcquire` 返回确定为 **false** ，那么就会调用 `acquireQueued` 方法：

```java
public final void acquire(int arg) {
    if (!tryAcquire(arg) && acquireQueued(addWaiter(Node.EXCLUSIVE), arg))
        selfInterrupt();
}
```

先调用 `addWaiter(Node.EXCLUSIVE), arg)` ，使用独占模式添加节点：

```java
 /**
   * 为当前线程和给定模式创建和排队节点。
   * @param mode Node.EXCLUSIVE for exclusive, Node.SHARED for shared
   * @return the new node
   */
private Node addWaiter(Node mode) {
    //为当前调用线程，新建节点
    Node node = new Node(Thread.currentThread(), mode);
    // 试试enq的快速路径;失败时备份到完整的 enq
    Node pred = tail;//拿到队列尾
    if (pred != null) {//如果队尾不为空，表示目前队列中有等待线程
        //新节点加入，连接
        node.prev = pred;
        //CAS 替换队尾，成功后再返回
        if (compareAndSetTail(pred, node)) {
            pred.next = node;
            return node;
        }
    }
    //没进入 if，然后说明没有等待线程
    enq(node);
    return node;
}

 /**
   * 将节点插入队列，必要时进行初始化。
   * @param node the node to insert
   * @return node's predecessor
   */
private Node enq(final Node node) {
    for (;;) {
        Node t = tail;//拿到队尾
        if (t == null) { // 没有队尾，需要初始化；队尾和队头相同
            if (compareAndSetHead(new Node()))
                tail = head;
        } else {// 线程加到最后
            node.prev = t;
            if (compareAndSetTail(t, node)) {
                t.next = node;
                return t;
            }
        }
    }
}
```

链表队列，队尾加节点倒是没有什么特殊的，不加解释了。

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211220225127179.png)

<br/>

### <span id="队列节点请求锁">队列节点请求锁</span>

**公平锁，进入等待状态休息，直到其他线程彻底释放资源后唤醒自己，自己再拿到资源，然后就可以去干自己想干的事了**。

没错，就是这样！是不是跟医院排队拿号有点相似~~acquireQueued() 就是干这件事：**在等待队列中排队拿号（中间没其它事干可以休息），直到拿到号后再返回**。

以新线程节点为参数，进入 `acquireQueued` 方法：

```java
/**
  * 以独占不间断模式获取已在队列中的线程。
  * 由条件等待方法以及获取使用。
  * @param node 节点
  * @param arg the acquire argument
  * @return {@code true} if interrupted while waiting
  */
final boolean acquireQueued(final Node node, int arg) {
    boolean failed = true;
    try {
        boolean interrupted = false;
        for (;;) {
            // 获得当前节点的前驱节点，前驱结点不为空则返回，否则报异常
            // ！！！注意，这一步要么异常、要么返回节点
            final Node p = node.predecessor();
            // ！！！上一个节点是头节点（也就是占位空节点，那么表示当前节点应该是实际意义上的第一个等待线程）
            // ！！！那么，根据公平锁的顺序，第一个等待线程优先尝试获得锁，并且如果获得锁，则进入第一个if
            if (p == head && tryAcquire(arg)) {
                // 那当前线程设置为头节点
                setHead(node);
                p.next = null; // help GC
                failed = false;
                // 返回 false，表示不需要被重点
                return interrupted;
            }
            //如果自己可以休息了，就通过park()进入waiting状态，直到被unpark()。如果不可中断的情况下被中断了，那么会从park()中醒过来，发现拿不到资源，从而继续进入park()等待。
            if (shouldParkAfterFailedAcquire(p, node) && parkAndCheckInterrupt())
                interrupted = true;//如果等待过程中被中断过，哪怕只有那么一次，就将interrupted标记为true
        }
    } finally {
        //最后在返回之前，当前线程取消试图获取锁
        if (failed) cancelAcquire(node);
    }
}
```

工作流程如图（这么多死循环，也不怕耗资源）：

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211220233350113.png)



> - **for 循环不间断试图获取锁，进第一个 if 表示拿到锁了**
> - **第二个 if 则是用于检查 线程节点的状态，比如有的队列节点取消等待，修改优先级等。**

```java
/**
 * 检查和更新未能获取的节点的状态。 如果线程应该阻塞，则返回 true。
 * 这是所有获取循环中的主要信号控制。要求 pred == node.prev。
 * @param pred 前驱节点
 * @param node 当前节点
 * @return 如果当前节点需要被阻塞，那么返回 true
 */
private static boolean shouldParkAfterFailedAcquire(Node pred, Node node) {
    //获得前驱节点的线程节点状态
    int ws = pred.waitStatus;
    if (ws == Node.SIGNAL)
        // 这个节点已经设置了状态，要求释放信号，所以它可以安全地停放。
        // SIGNAL，值为-1，表示当前节点的后继节点包含的线程需要运行，也就是unpark
        return true;
    if (ws > 0) {
        do {
            // CANCELLED，值为1；前驱节点被取消。跳过前驱并重试。
            //如果前驱放弃了，那就一直往前找，直到找到最近一个正常等待的状态，并排在它的后边。
            node.prev = pred = pred.prev;
        } while (pred.waitStatus > 0);
        pred.next = node;
    } else {
        //如果前驱正常，那就把前驱的状态设置成SIGNAL，告诉它拿完号后通知自己一下。有可能失败，人家说不定刚刚释放完呢！
        compareAndSetWaitStatus(pred, ws, Node.SIGNAL);
    }
    return false;
}

private final boolean parkAndCheckInterrupt() {
    LockSupport.park(this);//调用park()使线程进入waiting状态
    return Thread.interrupted();//调用park()使线程进入waiting状态
}
```

这里也有个流程，简单写下：

1. **第一次循环：进入（空节点.waitStatus = 0 ，Thread B.waitStatus = 0），结束后（空节点.waitStatus = -1，Thread B.waitStatus = 0）**
2. **第二次进入循环：（空节点.waitStatus = -1，Thread B.waitStatus = 0），因为前驱节点状态为 -1，返回 true**
3. **第二次循环返回true，然后进入 parkAndCheckInterrupt 方法，这时候 Thread B 进入 waiting 状态，真正得坐上当朝太子位。**

总算快搞一半了。。

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/QQLUQ1222KXENLTWQP5EMD-16400151225781.jpg)

当然，在 线程A 持有锁期间，N个线程试图获得锁，变成如图所示：

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211221210119733.png)

到目前为止，线程B 已经进入 waiting 状态，等待唤醒获得锁了。



<br/>

### <span id="unlock释放锁">unlock 释放锁</span>

那么现在 线程A 完成运行，在 finally 中调用 unlock，先看看 unlock 方法：

```java
    /**
     * 尝试释放此锁。
     * <p>如果当前线程是此锁的持有者，则持有计数递减。如果保持计数现在为零，则释放锁。
     * 如果当前线程不是此锁的持有者，则抛出 {@link IllegalMonitorStateException}。
     * @throws IllegalMonitorStateException if the current thread does not hold this lock
     */
    public void unlock() {
        sync.release(1);
    }
```

注释说得很清楚了，再向上调用：

```java
/**
  * 独占模式下释放锁。如果 {@link #tryRelease} 返回 true，通过解除阻塞一个或多个线程来实现。
  * 这个方法可以用来实现 {@link Lock#unlock}.
  * @param arg 释放锁参数.  这个值被传送到 {@link #tryRelease} 但没有被解释，可以代表任何你喜欢的东西。
  * @return the value returned from {@link #tryRelease}
  */
public final boolean release(int arg) {
    if (tryRelease(arg)) {//释放锁成功则进入
        Node h = head;
        //如果链表头不为空，并且状态不是0（表示没有等待线程）
        if (h != null && h.waitStatus != 0)
            //进入方法，唤醒锁
            unparkSuccessor(h);
        return true;
    }
    //释放锁不成功，返回 false
    return false;
}

 // 释放锁方法
protected final boolean tryRelease(int releases) {
    int c = getState() - releases;
    // 当前线程如果不持有锁，抛出异常
    if (Thread.currentThread() != getExclusiveOwnerThread())
        throw new IllegalMonitorStateException();
    boolean free = false; //返回结果默认 false
    if (c == 0) {//如果 state 减到 0，则进入执行
        free = true;// 释放锁成功
        setExclusiveOwnerThread(null);//将持有锁线程设置为 null
    }
    setState(c);
    return free;
}
```

主要流程：

1. **调用 `tryRelease` 尝试释放锁，释放成功后 `state = 0` 、持有锁线程为 `null`** 
2. **如果释放成功，判断是否有等待线程，有的话唤醒等待线程。**

然后调用 unparkSuccessor 方法唤醒：

```java
/**
  * 唤醒节点的后继节点（如果存在）。
  * @param node the node
  */
private void unparkSuccessor(Node node) {
    // 如果状态是负数(也就是signal=-1)，尝试清除预期的信号
    // 如果此操作失败或等待线程更改状态，也不影响
    int ws = node.waitStatus;
    //置零当前线程所在的结点状态，允许失败。
    if (ws < 0) compareAndSetWaitStatus(node, ws, 0);

    //找到下一个需要唤醒的结点s
    Node s = node.next;
    if (s == null || s.waitStatus > 0) {//如果为空或已取消
        s = null;
        //啰里啰唆的也不看了，反正是寻找下一个需要唤醒的线程
        for (Node t = tail; t != null && t != node; t = t.prev)
            if (t.waitStatus <= 0) s = t;
    }
    //找到后唤醒
    if (s != null) LockSupport.unpark(s.thread);
}
```

到了这一步，发生了几件事：

- 线程锁已经释放，state 已经变为 0
- head 节点的 waitStatus 已经置为 0，head.next.waitStatus 已经唤醒

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211221210657099.png)

好嘞，现在线程B 被唤醒，那么在唤醒之前 线程B 的状态呢？

> **回顾下上面，可以发现 线程B 还在 acquireQueued 死循环中。**

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211221211321696.png)

**这时候就会成功获得锁，并且设置为头节点（作为占位空节点）。**

到这里就结束了 `lock` 、`unlock` 方法流程。

<br/>

### 与非公平锁区别

ReentrantLock 的公平锁和非公平锁在锁获取方式上存在区别。

**lock 方法，先进行 CAS 操作，成功后表示占到线程。没抢到则进入队列抢占线程**

```java
final void lock() {
    if (compareAndSetState(0, 1))
        setExclusiveOwnerThread(Thread.currentThread());
    else
        acquire(1);
}
```

tryAcquire 方法也一样，先进行 CAS，就不展示代码了。



<br/>

## <span id="CountDownLatch">CountDownLatch 共享模式</span>

> **和 ReentrantLock 不同，CountDownLatch 通过内部聚合的 Sync，实现的是 AQS 的共享模式** 

最常用见的 CountDownLatch 例子：

```java
public static void main(String[] args) throws InterruptedException {
    //计数器，判断线程是否执行结束
    CountDownLatch taskLatch = new CountDownLatch(10);
    for (int i = 0; i < 10; i++) {
        new Thread(() -> {
            try {
                Thread.sleep(new Double(Math.random() * 10000).longValue());
                taskLatch.countDown();
                System.out.println("当前计数器数量：" + taskLatch.getCount());
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }).start();
    }
    //当前线程阻塞，等待计数器置为0
    taskLatch.await();
    System.out.println("主线程等待结束：全部执行完毕");
}
```

因为 AQS 的代码差不多，共享模式就解释下关键代码。

首先是构造方法：

```java
/**
  * 构造一个以给定计数 CountDownLatch CountDownLatch。
  * @param count count -的次数 countDown()必须调用之前线程可以通过 await()
  */
public CountDownLatch(int count) {
    if (count < 0) throw new IllegalArgumentException("count < 0");
    this.sync = new Sync(count);
}

Sync(int count) {
    setState(count);
}
```

可见本例子中，构造的默认后 state 已经设置为 10。



<br/>

### <span id="主线程await">主线程 await</span>

10个任务线程进入 sleep，主线程先到达 await 方法：

```java
    /**
     * 导致当前线程等到锁存器计数到零，除非线程是interrupted 。<p>
     * 如果当前计数为零，则此方法立即返回。<p>
     * 如果当前计数大于零，则当前线程将被禁用以进行线程调度，并处于休眠状态，直至发生两件事情之一：<p>
     * 1. 由于countDown()方法的调用，计数达到零;<p>
     * 2. 一些其他线程interrupts当前线程。<p>
     *
     * 如果当前线程：<p>
     * 1. 在进入该方法时设置了中断状态;<p>
     * 2. 是interrupted等待<p>
     * 然后InterruptedException被关上，当前线程的中断状态被清除。 <p>
     *
     * @throws InterruptedException 如果当前线程在等待时中断
     */
    public void await() throws InterruptedException {
        sync.acquireSharedInterruptibly(1);
    }
```

然后这里又进到 AQS，又开始了。

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211221233439110.png)

> **与 `acquireSharedInterruptibly` 对应还有一个 `acquireShared` 方法，区别就是是否忽略中断。**

这里我们介绍 CountDownLatch 对应的方法：

```java
    /**
     * 在共享模式下尝试，如果中断则中止。
     * 通过首先检查中断状态来实现，然后至少调用一次 {@link #tryAcquireShared}，成功返回。
     * 否则线程会排队，可能会重复阻塞和解除阻塞，调用 {@link #tryAcquireShared} 直到成功或线程被中断。
     * @param arg the acquire argument.
     * @throws InterruptedException 如果线程中断，则抛出异常
     */
    public final void acquireSharedInterruptibly(int arg) throws InterruptedException {
        //如果线程中断，则抛出异常
        if (Thread.interrupted()) throw new InterruptedException();
        //尝试共享模式下获得锁，返回负数时，进入方法
        if (tryAcquireShared(arg) < 0)
            doAcquireSharedInterruptibly(arg);
    }
```



```java
    /**
     * 尝试以共享模式获取。
     * 该方法应该查询对象的状态是否允许在共享模式下获取该对象，如果是这样，就可以获取它。
     * <p>该方法总是由执行获取的线程调用。
     * 如果此方法报告失败，则获取方法可能将线程排队（如果尚未排队），直到被其他线程释放为止。
     * <p>默认实现抛出 {@link UnsupportedOperationException}.
     *
     * @param arg 获取的论据。 该值始终是传递给获取方法的值，或者是进入条件等待时保存的值。 该值否则无法解释，可以代表您喜欢的任何内容。
     * @return 失败的时候返回负值。如果在共享模式下获取成功但没有后续共享模式获取可以成功，则为零;
     * 如果以共享模式获取成功并且随后的共享模式获取可能成功，则为正值，在这种情况下，后续等待线程必须检查可用性。
     * （支持三种不同的返回值使得这种方法可以在仅获取有时只能完全执行的上下文中使用。）成功后，该对象已被获取。
     * @throws IllegalMonitorStateException 如果获取将该同步器置于非法状态。 必须以一致的方式抛出此异常，以使同步正常工作
     * @throws UnsupportedOperationException 如果不支持共享模式
     */
    protected int tryAcquireShared(int arg) {
        throw new UnsupportedOperationException();
    }
```

AQS 共享模式做的 `tryAcquireShared` 顶层设计有官方解释，然后看 CountDownLatch 重写：

```java
 // 试图在共享模式下获取对象状态
protected int tryAcquireShared(int acquires) {
    return (getState() == 0) ? 1 : -1;
}
```

如果 AQS.state 状态为 0 时，返回正值。所以这里有个小流程：

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211221235248132.png)

所以，现在流到了 doAcquireSharedInterruptibly 方法。



<br/>

### <span id="主线程阻塞等待">主线程阻塞等待</span>

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/QQ%E5%9B%BE%E7%89%8720210605155149-16401826011861.jpg)

然后就开始了找茬，和 `acquireQueued` 类似，直接看代码：

```java
private void doAcquireSharedInterruptibly(int arg) throws InterruptedException {
    final Node node = addWaiter(Node.SHARED);//队尾加入共享节点
    boolean failed = true;//是否成功标志
    try {
        for (;;) {
            //拿到共享节点的上一个节点，也就是队尾的上一个节点
            final Node p = node.predecessor();
            if (p == head) {
                //如果到head的下一个，因为head是拿到资源的线程，此时node被唤醒，很可能是head用完资源来唤醒自己的
                int r = tryAcquireShared(arg);//尝试获取资源
                if (r >= 0) {//成功
                    //将head指向自己，还有剩余资源可以再唤醒之后的线程
                    setHeadAndPropagate(node, r);
                    p.next = null; // help GC
                    failed = false;
                    return;
                }
            }
            //判断状态，寻找安全点，进入waiting状态，等着被unpark()或interrupt()
            if (shouldParkAfterFailedAcquire(p, node) && parkAndCheckInterrupt())
                throw new InterruptedException();
        }
    } finally {
        if (failed)
            cancelAcquire(node);
    }
}
```

> **区别就是： 只有阻塞队列中的第一个节点（除了 head 占位节点），才会去试图获取锁。**

直接看图吧：

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211222224927763.png)



<br/>

### <span id="countDown释放锁">countDown 释放锁</span>

任务线程执行完毕减计数：

```java
    /**
     * 减少锁存器的计数，如果计数达到零，释放所有等待的线程。
     * 如果当前计数大于零，则它将递减。 如果新计数为零，则所有等待的线程都将被重新启用以进行线程调度。
     * <p>如果当前计数等于零，那么没有任何反应。
     */
    public void countDown() {
        sync.releaseShared(1);
    }  
    /**
     * 共享模式运行. 如果 {@link #tryReleaseShared} 返回 true，则通过解除阻塞一个或多个线程来实现。
     * @param arg 释放参数。arg会被传到{@link #tryReleaseShared}，但是这个方法是抽象方法，可能代表任何东西
     * @return 从 {@link #tryReleaseShared} 返回的值
     */
    public final boolean releaseShared(int arg) {
        if (tryReleaseShared(arg)) {//尝试释放锁
            doReleaseShared();//执行释放锁
            return true;
        }
        return false;
    }
```

`tryReleaseShared` 方法代码和流程如图：

```java
// 试图设置状态来反映共享模式下的一个释放
protected boolean tryReleaseShared(int releases) {
    // Decrement count; signal when transition to zero
    // 无限循环
    for (;;) {
        // 获取状态
        int c = getState();
        // 没有被线程占有
        if (c == 0)
            return false;
        // 下一个状态
        int nextc = c-1;
        // CAS操作：比较并且设置成功
        if (compareAndSetState(c, nextc))
            return nextc == 0;
    }
}
```

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211222224841063.png)

后面都差不多，不贴代码了，图也懒的画了，最后唤醒和独占模式一个样。





<br/>

## <span id="参考文章">参考文章</span>

- [JUC锁: 锁核心类AQS详解 | Java 全栈知识体系 (pdai.tech)](https://www.pdai.tech/md/java/thread/java-thread-x-lock-AbstractQueuedSynchronizer.html)
- [尚硅谷Java大厂面试题第3季，跳槽必刷题目+必扫技术盲点（周阳主讲）_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1Hy4y1B78T?p=16)
- [[死磕 Java 并发\] --- J.U.C之AQS：AQS简介 - Java 技术驿站 (cmsblogs.com)](https://www.cmsblogs.com/article/1391297814356692992)
- [透彻分析AQS源码，差点被按在地上摩擦_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1Zz4y197iF?from=search&seid=2258786188377475040&spm_id_from=333.337.0.0)
- [Java并发之AQS详解 - waterystone - 博客园 (cnblogs.com)](https://www.cnblogs.com/waterystone/p/4920797.html)
- [AQS的原理浅析 | 并发编程网 – ifeve.com](http://ifeve.com/java-special-troops-aqs/)
- [从ReentrantLock的实现看AQS的原理及应用 - 美团技术团队 (meituan.com)](https://tech.meituan.com/2019/12/05/aqs-theory-and-apply.html)
- [AQS之独占模式和共享模式_开发笔记的博客-CSDN博客_共享模式和独占模式](https://blog.csdn.net/weixin_43823391/article/details/114259447)
