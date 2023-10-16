import{_ as n,o as s,c as a,f as t}from"./app-bff54864.js";const p={},o=t(`<div class="catalog"><ul><li><a href="#t0">概述</a></li><li><a href="#t1">isTerminated 方式</a></li><li><a href="#t2">getCompletedTaskCount</a></li><li><a href="#t3">CountDownLatch 计数器</a></li><li><a href="#t4">维护一个公共计数</a></li><li><a href="#t5">Future 判断任务执行状态</a></li><li><a href="#t6">参考文章</a></li></ul></div><h2 id="概述" tabindex="-1"><a class="header-anchor" href="#概述" aria-hidden="true">#</a> <span id="t0">概述</span></h2><p>最近写小玩具的时候用到了 <code>CountDownLatch</code> 计数器，然后顺便想了想判断线程池全部结束有多少种方法。</p><p>在网上搜了下，可能有些没找到，但是我找到的有（所有方法都是在 <strong>ThreadPoolExecutor</strong> 线程池方法下测试的）：</p><ul><li><strong>isTerminated()</strong> 判断方式，在执行 shutdown() ，关闭线程池后，判断是否所有任务已经完成。</li><li>ThreadPoolExecutor 的 <strong>getCompletedTaskCount()</strong> 方法，判断完成任务数和全部任务数是否相等。</li><li><strong>CountDownLatch</strong> 计数器，使用闭锁计数来判断是否全部完成。</li><li><strong>手动维护一个公共计数</strong> ，原理和闭锁类似，就是更加灵活。</li><li>使用 submit 向线程池提交任务，<strong>Future</strong> 判断任务执行状态。</li></ul><p>好嘞，现在开始一个一个介绍优缺点和简要原理；</p><p>先创建一个 <strong>static</strong> 线程池，后面好几个例子就不一一创建了，全部用这个就行了：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>    <span class="token doc-comment comment">/**
     * 创建一个最大线程数是20的线程池
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">ThreadPoolExecutor</span> pool <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ThreadPoolExecutor</span><span class="token punctuation">(</span>
                                            <span class="token number">10</span><span class="token punctuation">,</span> <span class="token number">20</span><span class="token punctuation">,</span> <span class="token number">0L</span><span class="token punctuation">,</span>
                                            <span class="token class-name">TimeUnit</span><span class="token punctuation">.</span><span class="token constant">MILLISECONDS</span><span class="token punctuation">,</span>
                                            <span class="token keyword">new</span> <span class="token class-name">LinkedBlockingQueue</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后再准备一个通用的睡眠方法：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>    <span class="token doc-comment comment">/**
     * 线程执行方法，随机等待0到10秒
     */</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">sleepMtehod</span><span class="token punctuation">(</span><span class="token keyword">int</span> index<span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">try</span> <span class="token punctuation">{</span>
            <span class="token keyword">long</span> sleepTime <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Double</span><span class="token punctuation">(</span><span class="token class-name">Math</span><span class="token punctuation">.</span><span class="token function">random</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">*</span> <span class="token number">10000</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">longValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span>sleepTime<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;当前线程执行结束: &quot;</span> <span class="token operator">+</span> index<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个方法就是为了测试的时候区分线程执行完毕的下顺序而已。</p><p>好嘞，准备完毕，现在开始。</p><br><h2 id="isterminated-方式" tabindex="-1"><a class="header-anchor" href="#isterminated-方式" aria-hidden="true">#</a> <span id="t1">isTerminated 方式</span></h2><p>首先贴上测试代码：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>   <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">shutdownTest</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">30</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">int</span> index <span class="token operator">=</span> i<span class="token punctuation">;</span>
            pool<span class="token punctuation">.</span><span class="token function">execute</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-&gt;</span> <span class="token function">sleepMtehod</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        pool<span class="token punctuation">.</span><span class="token function">shutdown</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token operator">!</span>pool<span class="token punctuation">.</span><span class="token function">isTerminated</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
            <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;还没停止。。。&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;全部执行完毕&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这一种方式就是在主线程中进行循环判断，全部任务是否已经完成。</p><p>这里有两个主要方法：</p><ol><li><p><strong>shutdown() ：启动有序关闭，其中先前提交的任务将被执行，但不会接受任何新任务。如果已经关闭，调用没有额外的作用。</strong></p></li><li><p><strong>isTerminated() ：如果所有任务在关闭后完成，则返回true。请注意， isTerminated 从不是 true，除非 shutdown 或 shutdownNow 先被执行。</strong></p></li></ol><p>通俗点讲，就是在执行全部任务后，对线程池进行 shutdown() 有序关闭，然后循环判断 isTerminated() ，线程池是否全部完成。</p><p><strong>优点</strong> ：操作简单，代码更加简单。</p><p><strong>缺点</strong> ：需要关闭线程池。一般我在代码中都是将线程池注入到 Spring 容器，然后各个组件中统一用同一个，当然不能关闭。</p><p>类似方法扩展：</p><ul><li><p>shutdownNow() ：尝试停止所有主动执行的任务，停止等待任务的处理，并返回正在等待执行的任务列表。 从此方法返回时，这些任务将从任务队列中删除。通过 Thread.interrupt() 取消任务。</p></li><li><p>isShutdown() ： 如果线程池已关闭，则返回 true 。</p></li><li><p>isTerminating() ：如果在 shutdown() 或 shutdownNow() 之后终止 ，但尚未完全终止，则返回true。</p></li><li><p>waitTermination(long timeout, TimeUnit unit) ：当前线程阻塞，直到等所有已提交的任务（包括正在跑的和队列中等待的）执行完，或者等超时时间到，或者线程被中断抛出异常；全部执行完返回true，超时返回false。 <strong>也可以用这个方法代替 isTerminated() 进行判断</strong> 。</p></li></ul><br><h2 id="getcompletedtaskcount" tabindex="-1"><a class="header-anchor" href="#getcompletedtaskcount" aria-hidden="true">#</a> <span id="t2">getCompletedTaskCount</span></h2><p>还是一样，贴上代码：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">taskCountTest</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">30</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">int</span> index <span class="token operator">=</span> i<span class="token punctuation">;</span>
            pool<span class="token punctuation">.</span><span class="token function">execute</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-&gt;</span> <span class="token function">sleepMtehod</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token comment">//当线程池完成的线程数等于线程池中的总线程数</span>
        <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token punctuation">(</span>pool<span class="token punctuation">.</span><span class="token function">getTaskCount</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> pool<span class="token punctuation">.</span><span class="token function">getCompletedTaskCount</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;任务总数:&quot;</span> <span class="token operator">+</span> pool<span class="token punctuation">.</span><span class="token function">getTaskCount</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">&quot;； 已经完成任务数:&quot;</span> <span class="token operator">+</span> pool<span class="token punctuation">.</span><span class="token function">getCompletedTaskCount</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;还没停止。。。&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;全部执行完毕&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>还是一样在主线程循环判断，主要就两个方法：</p><ol><li><strong>getTaskCount() ：返回计划执行的任务总数。由于任务和线程的状态可能在计算过程中动态变化，因此返回的值只是一个近似值。</strong></li><li><strong>getCompletedTaskCount() ：返回完成执行的任务的大致总数。因为任务和线程的状态可能在计算过程中动态地改变，所以返回的值只是一个近似值，但是在连续的调用中并不会减少。</strong></li></ol><p>这个好理解，总任务数等于已完成任务数，就表示全部执行完毕。</p><p><strong>优点</strong> ：完全使用了 ThreadPoolExecutor 提供的方法，并且不必关闭线程池，避免了创建和销毁带来的损耗。</p><p><strong>缺点</strong> ：上面的解释也看到了，使用这种判断存在很大的限制条件；必须确定，在循环判断过程中，没有新的任务产生。差不多意思就是，这个线程池只能在这条线程中使用。</p><p>其他 ：</p><ul><li>最后扯两句，因为我用 main 方法运行的，跑完后 main 没有结束，是因为非守护线程如果不终止，程序是不会结束的。</li><li>而线程池 Worker 线程里写了一个死循环，而且被设置成了非守护线程。</li></ul><br><h2 id="countdownlatch-计数器" tabindex="-1"><a class="header-anchor" href="#countdownlatch-计数器" aria-hidden="true">#</a> <span id="t3">CountDownLatch 计数器</span></h2><p>这种方法是我比较常用的方法，先看代码：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>   <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">countDownLatchTest</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
        <span class="token comment">//计数器，判断线程是否执行结束</span>
        <span class="token class-name">CountDownLatch</span> taskLatch <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">CountDownLatch</span><span class="token punctuation">(</span><span class="token number">30</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">30</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">int</span> index <span class="token operator">=</span> i<span class="token punctuation">;</span>
            pool<span class="token punctuation">.</span><span class="token function">execute</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-&gt;</span> <span class="token punctuation">{</span>
                <span class="token function">sleepMtehod</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">;</span>
                taskLatch<span class="token punctuation">.</span><span class="token function">countDown</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;当前计数器数量：&quot;</span> <span class="token operator">+</span> taskLatch<span class="token punctuation">.</span><span class="token function">getCount</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token comment">//当前线程阻塞，等待计数器置为0</span>
        taskLatch<span class="token punctuation">.</span><span class="token function">await</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;全部执行完毕&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这种方法，呃，应该是看起来比较高级的，我也不知道别的大佬怎么写的，反正我就用这个。</p><p>这个方法需要介绍下这个工具类 <strong>CountDownLatch</strong> 。先把这种方式的优缺点写了，后面再详细介绍这个类。</p><p><strong>优点</strong> ：代码优雅，不需要对线程池进行操作，将线程池作为 Bean 的情况下有很好的使用场景。</p><p><strong>缺点</strong> ：需要提前知道线程数量；性能确实，呃呃呃呃呃，差了点。哦对了，<strong>还需要在线程代码块内加上异常判断，否则在 countDown 之前发生异常而没有处理，就会导致主线程永远阻塞在 await。</strong></p><br><p><strong>CountDownLatch 概述</strong></p><p>CountDownLatch 是 JDK 提供的一个同步工具，它可以让一个或多个线程等待，一直等到其他线程中执行完成一组操作。</p><p>常用的方法有 countDown 方法和 await 方法，CountDownLatch 在初始化时，需要指定用给定一个整数作为计数器。</p><p>当调用 countDown 方法时，计数器会被减1；当调用 await 方法时，如果计数器大于0时，线程会被阻塞，一直到计数器被 countDown 方法减到0时，线程才会继续执行。</p><p>计数器是无法重置的，当计数器被减到0时，调用 await 方法都会直接返回。</p><br><h2 id="维护一个公共计数" tabindex="-1"><a class="header-anchor" href="#维护一个公共计数" aria-hidden="true">#</a> <span id="t4">维护一个公共计数</span></h2><p>这种方式其实和 CountDownLatch 原理类似。</p><p>先维护一个静态变量</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">int</span> taskNum <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>然后在线程任务结束时，进行静态变量操作：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>   <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">staticCountTest</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
        <span class="token class-name">Lock</span> lock <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ReentrantLock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">30</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">int</span> index <span class="token operator">=</span> i<span class="token punctuation">;</span>
            pool<span class="token punctuation">.</span><span class="token function">execute</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-&gt;</span> <span class="token punctuation">{</span>
                <span class="token function">sleepMtehod</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">;</span>
                lock<span class="token punctuation">.</span><span class="token function">lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                taskNum<span class="token operator">++</span><span class="token punctuation">;</span>
                lock<span class="token punctuation">.</span><span class="token function">unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">while</span><span class="token punctuation">(</span>taskNum <span class="token operator">&lt;</span> <span class="token number">30</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;还没停止。。。当前完成任务数:&quot;</span> <span class="token operator">+</span> taskNum<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;全部执行完毕&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其实就是加锁计数，循环判断。</p><p><strong>优点</strong> ：手动维护方式更加灵活，对于一些特殊场景可以手动处理。</p><p><strong>缺点</strong> ：和 CountDownLatch 相比，一样需要知道线程数目，但是代码实现比较麻烦，相对于灵活这一个优势，貌似投入产出并不对等。</p><br><h2 id="future-判断任务执行状态" tabindex="-1"><a class="header-anchor" href="#future-判断任务执行状态" aria-hidden="true">#</a> <span id="t5">Future 判断任务执行状态</span></h2><p>Future 是用来装载线程结果的，不过，用这个来进行判断写代码总感觉怪怪的。</p><p>因为 Future 只能装载一条线程的返回结果，多条线程总不能用 List 在接收 Future 。</p><p>这里就开一个线程做个演示：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">futureTest</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
        <span class="token class-name">Future</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">&gt;</span></span> future <span class="token operator">=</span> pool<span class="token punctuation">.</span><span class="token function">submit</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-&gt;</span> <span class="token function">sleepMtehod</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token operator">!</span>future<span class="token punctuation">.</span><span class="token function">isDone</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
            <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">500</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;还没停止。。。&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;全部执行完毕&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这种方式就不写优缺点了，因为 Future 的主要使用场景并不是用于判断任务执行状态。</p><br><h2 id="参考文章" tabindex="-1"><a class="header-anchor" href="#参考文章" aria-hidden="true">#</a> <span id="t6">参考文章</span></h2><p><a href="https://blog.csdn.net/u011635492/article/details/80313658" target="_blank">https://blog.csdn.net/u011635492/article/details/80313658</a></p><p><a href="https://www.jianshu.com/p/58bfd7f04bb5" target="_blank">https://www.jianshu.com/p/58bfd7f04bb5</a></p><p><a href="https://blog.csdn.net/zzzgd_666/article/details/103009910" target="_blank">https://blog.csdn.net/zzzgd_666/article/details/103009910</a></p><p><a href="https://blog.csdn.net/heihaozi/article/details/105738230" target="_blank">https://blog.csdn.net/heihaozi/article/details/105738230</a></p><p><a href="https://blog.csdn.net/qq_38875300/article/details/82744768" target="_blank">https://blog.csdn.net/qq_38875300/article/details/82744768</a></p>`,73),e=[o];function c(l,u){return s(),a("div",null,e)}const k=n(p,[["render",c],["__file","JudgeThreadPoolDone.html.vue"]]);export{k as default};