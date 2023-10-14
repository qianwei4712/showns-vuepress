<template><div><div class="catalog">
<ul>
<li><a href="#t0">本文概述</a></li>
<li><a href="#t1">volatile 的特性</a>
<ul>
<li><a href="#t11">保证可见性</a></li>
<li><a href="#t12">不保证原子性</a></li>
<li><a href="#t13">禁止指令重排</a></li>
</ul>
</li>
<li><a href="#t2">volatile 的实现原理</a>
<ul>
<li><a href="#t21">内存屏障</a></li>
<li><a href="#t22">可见性实现</a></li>
<li><a href="#t23">有序性实现</a></li>
</ul>
</li>
<li><a href="#t3">应用场景</a>
<ul>
<li><a href="#t31">状态标志</a></li>
<li><a href="#t32">一次性安全发布</a></li>
<li><a href="#t33">双重检查</a></li>
<li><a href="#t34">独立观察</a></li>
</ul>
</li>
<li><a href="#te">参考文章</a></li>
</ul>
</div>
<h2 id="本文概述" tabindex="-1"><a class="header-anchor" href="#本文概述" aria-hidden="true">#</a> <span id="t0">本文概述</span></h2>
<p>volatile 关键字对增删改查程序员应该是比较陌生的。（反正我前几年是一次没用过）</p>
<p>暴露了我菜鸡的水准。。。</p>
<p><img src="http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/unc/012C53FF8A00764006B0E19AA03D853B.png" alt=""></p>
<p>volatile 是 JVM 提供的一种轻量级的同步机制。</p>
<p>Java 语言包含两种内在的同步机制：</p>
<ul>
<li>同步 synchronized，通常称为重量级锁，不过随着JVM优化，现在也不是特别重。</li>
<li>轻量级 volatile ，因为它不会引起线程上下文的切换和调度。</li>
</ul>
<p>但是 volatile 变量的同步性较差（有时它更简单并且开销更低），而且其使用也更容易出错。</p>
<br/>
<h2 id="volatile-的特性" tabindex="-1"><a class="header-anchor" href="#volatile-的特性" aria-hidden="true">#</a> <span id="t1">volatile 的特性</span></h2>
<blockquote>
<p>volatile 有三个特性：<code v-pre>保证可见性</code> 、<code v-pre>不保证原子性</code> 、<code v-pre>禁止指令重排</code> 。</p>
</blockquote>
<p>在介绍三个特性之前，我们需要先补充一些预备知识。</p>
<p>先简单介绍作用，后面再深入理解实现机制。</p>
<p>看完以下博客，可以很好理解什么是 可见性、原子性、有序性。</p>
<ul>
<li>
<p><a href="https://blog.csdn.net/qq_33565047/article/details/103184562" target="_blank">Java 线程 - 并发理论基础(一)_会划水的鱼儿的博客</a></p>
</li>
<li>
<p><a href="https://blog.csdn.net/m0_46144826/article/details/106972153" target="_blank">Java 并发理论基础 - 看完虽然不会写代码，吹吹牛逼绝对没问题</a></p>
</li>
</ul>
<p>还有就是 JVM 内存模型：</p>
<ul>
<li><a href="https://blog.csdn.net/m0_46144826/article/details/109220250" target="_blank">JVM 运行时数据区 - 多图预警、万字内存模型解读</a></li>
</ul>
<p>（夹在私活，虽然有大佬的写的更好，但是肯定要先推自己的。。。）</p>
<p><img src="http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/unc/SXDAVSYTF8]SA8VLBO.jpg" alt=""></p>
<p>在 JVM 设计规范中存在线程共享内存，以及线程独有内存。</p>
<p>详细的不说了，看上面的博客，直接说结论：</p>
<ol>
<li><strong>线程解锁前，必须把共享变量的值刷新回主内存（堆）</strong></li>
<li><strong>线程加锁前，必须读取共享变量的值，复制到线程独占的工作内存（虚拟机栈）中</strong></li>
<li><strong>必须是同一把锁</strong></li>
</ol>
<br/>
<h3 id="保证可见性" tabindex="-1"><a class="header-anchor" href="#保证可见性" aria-hidden="true">#</a> <span id="t11">保证可见性</span></h3>
<blockquote>
<p><strong>可见性主要指一个线程修改了共享变量值，其他线程需要立刻看到修改后的值。</strong></p>
</blockquote>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">VolatileTest</span> <span class="token punctuation">{</span>

    <span class="token keyword">int</span> number <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
        <span class="token class-name">VolatileTest</span> test <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">VolatileTest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-></span> <span class="token punctuation">{</span>
            <span class="token keyword">while</span> <span class="token punctuation">(</span>test<span class="token punctuation">.</span>number <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
            <span class="token punctuation">}</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"子线程结束，number: "</span> <span class="token operator">+</span> test<span class="token punctuation">.</span>number<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">2000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        test<span class="token punctuation">.</span>number <span class="token operator">=</span> <span class="token number">666</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"main 线程结束，number: "</span> <span class="token operator">+</span> test<span class="token punctuation">.</span>number<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输出结果，子线程一直在循环体中，没有跳出。</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>main 线程结束，number: 666
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>但是如果，在加上 volatile 修饰：</p>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token keyword">volatile</span> <span class="token keyword">int</span> number <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>则输出结果为：</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>main 线程结束，number: 666
子线程结束，number: 666
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><br/>
<h3 id="不保证原子性" tabindex="-1"><a class="header-anchor" href="#不保证原子性" aria-hidden="true">#</a> <span id="t12">不保证原子性</span></h3>
<blockquote>
<p>一个操作或者多个操作，要么全部执行成功，要么全部执行失败。满足原子性的操作，中途不可被中断。</p>
</blockquote>
<p>那么具体到 volatile 上，就相当于：<strong>两个线程可以同时修改同一个值。</strong></p>
<p>这显然是不允许的吧。。。。</p>
<h4 id="i-的原子性" tabindex="-1"><a class="header-anchor" href="#i-的原子性" aria-hidden="true">#</a> i++ 的原子性</h4>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">VolatileTest</span> <span class="token punctuation">{</span>

    <span class="token keyword">volatile</span> <span class="token keyword">int</span> number <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">addI</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        number<span class="token operator">++</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
        <span class="token class-name">VolatileTest</span> test <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">VolatileTest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> n <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> n <span class="token operator">&lt;</span> <span class="token number">1000</span><span class="token punctuation">;</span> n<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-></span> <span class="token punctuation">{</span>
                <span class="token keyword">try</span> <span class="token punctuation">{</span>
                    <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
                test<span class="token punctuation">.</span><span class="token function">addI</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">10000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>test<span class="token punctuation">.</span>number<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>运行输出：</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>992
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>在上面的例子中，如果 volatile 可以保证操作的原子性，那么结果应该是 1000。</p>
<p><code v-pre>number++</code> 这行代码，其实由三步构成：</p>
<ol>
<li><strong>读取 number 的值</strong></li>
<li><strong>number 的副本 +1</strong></li>
<li><strong>将 number  写回到堆内存中</strong></li>
</ol>
<p>可以对应下 add 方法中 number++ 的汇编指令：</p>
<div class="language-assembly line-numbers-mode" data-ext="assembly"><pre v-pre class="language-assembly"><code> 0 aload_0
 1 dup
 2 getfield #2 &lt;tools/thread/VolatileTest.number&gt;
 5 iconst_1
 6 iadd
 7 putfield #2 &lt;tools/thread/VolatileTest.number&gt;
10 return
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>volatile 是无法保证这三个操作是具有原子性的， <strong>我们可以通过 <code v-pre>AtomicInteger</code> 或者 <code v-pre>Synchronized</code> 来保证 +1 操作的原子性。</strong></p>
<p>注：上面几段代码中多处执行了 Thread.sleep() 方法，目的是为了增加并发问题的产生几率，无其他作用。</p>
<p><img src="http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/TIM图片20200603100858.jpg" alt=""></p>
<br/>
<h3 id="禁止指令重排" tabindex="-1"><a class="header-anchor" href="#禁止指令重排" aria-hidden="true">#</a> <span id="t13">禁止指令重排</span></h3>
<blockquote>
<p>程序执行的顺序按照代码的先后顺序执行。禁止指令重排，便可保证有序性。</p>
</blockquote>
<p>这个例子比较难举，在基础知识引用博客中有举例：</p>
<ul>
<li><a href="https://blog.csdn.net/qq_33565047/article/details/103184562" target="_blank">Java 线程 - 并发理论基础(一)_会划水的鱼儿的博客</a></li>
</ul>
<p>一般重排序可以分为如下三种：</p>
<ul>
<li>编译器优化的重排序。编译器在不改变单线程程序语义的前提下，可以重新安排语句的执行顺序;</li>
<li>指令级并行的重排序。现代处理器采用了指令级并行技术来将多条指令重叠执行。如果不存在数据依赖性，处理器可以改变语句对应机器指令的执行顺序;</li>
<li>内存系统的重排序。由于处理器使用缓存和读/写缓冲区，这使得加载和存储操作看上去可能是在乱序执行的。</li>
</ul>
<h4 id="as-if-serial" tabindex="-1"><a class="header-anchor" href="#as-if-serial" aria-hidden="true">#</a> as-if-serial</h4>
<blockquote>
<p>不管怎么重排序，单线程程序的执行结果不能被改变。</p>
<p>编译器、runtime和处理器都必须遵守as-if-serial语义</p>
</blockquote>
<p>所以编译器和处理器不会对存在<code v-pre>数据依赖关系</code>的操作做重排序，因为这种重排序会改变执行结果。</p>
<p>但是，如果操作之间不存在数据依赖关系，这些操作就可能被编译器和处理器重排序。</p>
<br/>
<h2 id="volatile-的实现原理" tabindex="-1"><a class="header-anchor" href="#volatile-的实现原理" aria-hidden="true">#</a> <span id="t2">volatile 的实现原理</span></h2>
<h3 id="内存屏障" tabindex="-1"><a class="header-anchor" href="#内存屏障" aria-hidden="true">#</a> <span id="t21">内存屏障</span></h3>
<p>内存屏障（Memory Barrier，或叫做内存栅栏，Memory Fence）是一种CPU指令，<strong>用于控制特定条件下的重排序和内存可见性问题。</strong></p>
<blockquote>
<p>Java 编译器也会根据内存屏障的规则禁止重排序，内存屏障可以禁止特定类型处理器的重排序，从而让程序按我们预想的流程去执行。</p>
</blockquote>
<p>内存屏障可以刷新缓存，使缓存无效，刷新硬件的写缓冲，以及停止执行管道。</p>
<p><img src="http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/QQ图片20210605155324.jpg" alt=""></p>
<p>下面是比较实用的了，内存屏障是一条这样的 <code v-pre>指令</code>：</p>
<ul>
<li>保证特定操作的执行顺序；</li>
<li>影响某些数据（或是某条指令的执行结果）的内存可见性；</li>
</ul>
<p><strong>编译器和CPU能够重排序指令，保证最终相同的结果，尝试优化性能；插入一条Memory Barrier会告诉编译器和CPU：不管什么指令都不能和这条 Memory Barrier 指令重排序。</strong></p>
<p>内存屏障类型有以下几种：</p>
<table>
<thead>
<tr>
<th>类型</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>LoadLoad屏障</td>
<td>对于这样的语句Load1; LoadLoad; Load2，在Load2及后续读取操作要读取的数据被访问前，保证Load1要读取的数据被读取完毕</td>
</tr>
<tr>
<td>StoreStore屏障</td>
<td>对于这样的语句Store1; StoreStore; Store2，在Store2及后续写入操作执行前，保证Store1的写入操作对其它处理器可见</td>
</tr>
<tr>
<td>LoadStore屏障</td>
<td>对于这样的语句Load1; LoadStore; Store2，在Store2及后续写入操作被刷出前，保证Load1要读取的数据被读取完毕</td>
</tr>
<tr>
<td>StoreLoad屏障</td>
<td>对于这样的语句Store1; StoreLoad; Load2，在Load2及后续所有读取操作执行前，保证Store1的写入对所有处理器可见。它的开销是四种屏障中最大的。在大多数处理器的实现中，这个屏障是个万能屏障，兼具其它三种内存屏障的功能</td>
</tr>
</tbody>
</table>
<br/>
<h3 id="可见性实现" tabindex="-1"><a class="header-anchor" href="#可见性实现" aria-hidden="true">#</a> <span id="t22">可见性实现</span></h3>
<p>如果一个变量是 volatile 修饰的，基于保守策略的 JMM 内存屏障插入策略：</p>
<ul>
<li>在每个volatile写操作的前面插入一个StoreStore屏障。</li>
<li>在每个volatile写操作的后面插入一个StoreLoad屏障。</li>
<li>在每个volatile读操作的后面插入一个LoadLoad屏障。</li>
<li>在每个volatile读操作的后面插入一个LoadStore屏障。</li>
</ul>
<p><img src="http://shiva.oss-cn-hangzhou.aliyuncs.com/emo/unc/QQ图片20210605151038.jpg" alt=""></p>
<p>这意味着，如果写入一个 volatile 变量，就可以保证：</p>
<ul>
<li>一个线程写入变量a后，任何线程访问该变量都会拿到最新值。</li>
<li>在写入变量a之前的写入操作，其更新的数据对于其他线程也是可见的。因为Memory Barrier会刷出cache中的所有先前的写入。</li>
</ul>
<p>扒了两张图，看看就明白了：</p>
<p><img src="http://shiva.oss-cn-hangzhou.aliyuncs.com/data/thread/volatile 写入屏障.png" alt=""></p>
<p><img src="http://shiva.oss-cn-hangzhou.aliyuncs.com/data/thread/volatile 读取屏障.png" alt=""></p>
<br/>
<h3 id="有序性实现" tabindex="-1"><a class="header-anchor" href="#有序性实现" aria-hidden="true">#</a> <span id="t23">有序性实现</span></h3>
<p>上面已经说明了，<strong>内存屏障可以控制特定条件下的重排序问题。</strong></p>
<p>为了性能优化，JMM 在不改变正确语义的前提下，会允许编译器和处理器对指令序列进行重排序。JMM 提供了内存屏障阻止这种重排序。</p>
<p>Java 编译器会在生成指令系列时在适当的位置会插入内存屏障指令来禁止特定类型的处理器重排序。</p>
<p>JMM 会针对编译器制定 volatile 重排序规则表。</p>
<table>
<thead>
<tr>
<th style="text-align:center">是否能重排序</th>
<th style="text-align:center">第二个操作</th>
<th style="text-align:center">第二个操作</th>
<th style="text-align:center">第二个操作</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:center">第一个操作</td>
<td style="text-align:center">普通读/写</td>
<td style="text-align:center">volatile 读</td>
<td style="text-align:center">volatile 写</td>
</tr>
<tr>
<td style="text-align:center">普通读/写</td>
<td style="text-align:center"></td>
<td style="text-align:center"></td>
<td style="text-align:center">NO</td>
</tr>
<tr>
<td style="text-align:center">volatile 读</td>
<td style="text-align:center">NO</td>
<td style="text-align:center">NO</td>
<td style="text-align:center">NO</td>
</tr>
<tr>
<td style="text-align:center">volatile 写</td>
<td style="text-align:center"></td>
<td style="text-align:center">NO</td>
<td style="text-align:center">NO</td>
</tr>
</tbody>
</table>
<p>&quot; NO &quot; 表示禁止重排序。</p>
<br/>
<h2 id="应用场景" tabindex="-1"><a class="header-anchor" href="#应用场景" aria-hidden="true">#</a> <span id="t3">应用场景</span></h2>
<p>使用 volatile 必须具备的条件</p>
<ul>
<li>对变量的写操作不依赖于当前值。</li>
<li>该变量没有包含在具有其他变量的不变式中。</li>
<li>只有在状态真正独立于程序内其他内容时才能使用 volatile。</li>
</ul>
<br>
<h3 id="状态标志" tabindex="-1"><a class="header-anchor" href="#状态标志" aria-hidden="true">#</a> <span id="t31">状态标志</span></h3>
<p><strong>作为多线程中的状态触发器，实现轻量级同步。</strong></p>
<p>例如：</p>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token keyword">volatile</span> <span class="token keyword">boolean</span> shutdownRequested<span class="token punctuation">;</span>
<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">shutdown</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> shutdownRequested <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>
<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">doWork</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> 
    <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token operator">!</span>shutdownRequested<span class="token punctuation">)</span> <span class="token punctuation">{</span> 
        <span class="token comment">// do stuff</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><br>
<h3 id="一次性安全发布-one-time-safe-publication" tabindex="-1"><a class="header-anchor" href="#一次性安全发布-one-time-safe-publication" aria-hidden="true">#</a> <span id="t32">一次性安全发布(one-time safe publication)</span></h3>
<p>缺乏同步会导致无法实现可见性，这使得确定何时写入对象引用而不是原始值变得更加困难。</p>
<p>在缺乏同步的情况下，可能会遇到某个对象引用的更新值(由另一个线程写入)和该对象状态的旧值同时存在。</p>
<p>这就是造成著名的双重检查锁定(double-checked-locking)问题的根源，其中对象引用在没有同步的情况下进行读操作，产生的问题是您可能会看到一个更新的引用，但是仍然会通过该引用看到不完全构造的对象。</p>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">BackgroundFloobleLoader</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">volatile</span> <span class="token class-name">Flooble</span> theFlooble<span class="token punctuation">;</span>
 
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">initInBackground</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// do lots of stuff</span>
        theFlooble <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Flooble</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// this is the only write to theFlooble</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
 
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">SomeOtherClass</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">doWork</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> 
            <span class="token comment">// do some stuff...</span>
            <span class="token comment">// use the Flooble, but only if it is ready</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>floobleLoader<span class="token punctuation">.</span>theFlooble <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> 
                <span class="token function">doSomething</span><span class="token punctuation">(</span>floobleLoader<span class="token punctuation">.</span>theFlooble<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><br>
<h3 id="独立观察-independent-observation" tabindex="-1"><a class="header-anchor" href="#独立观察-independent-observation" aria-hidden="true">#</a> <span id="t33">独立观察(independent observation)</span></h3>
<p>安全使用 volatile 的另一种简单模式是定期 发布 观察结果供程序内部使用。</p>
<p>例如，假设有一种环境传感器能够感觉环境温度。一个后台线程可能会每隔几秒读取一次该传感器，并更新包含当前文档的 volatile 变量。然后，其他线程可以读取这个变量，从而随时能够看到最新的温度值。</p>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">UserManager</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">volatile</span> <span class="token class-name">String</span> lastUser<span class="token punctuation">;</span>
 
    <span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">authenticate</span><span class="token punctuation">(</span><span class="token class-name">String</span> user<span class="token punctuation">,</span> <span class="token class-name">String</span> password<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">boolean</span> valid <span class="token operator">=</span> <span class="token function">passwordIsValid</span><span class="token punctuation">(</span>user<span class="token punctuation">,</span> password<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>valid<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">User</span> u <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">User</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            activeUsers<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>u<span class="token punctuation">)</span><span class="token punctuation">;</span>
            lastUser <span class="token operator">=</span> user<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> valid<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><br>
<h3 id="双重检查-double-checked" tabindex="-1"><a class="header-anchor" href="#双重检查-double-checked" aria-hidden="true">#</a> <span id="t34">双重检查(double-checked)</span></h3>
<p>单例模式的一种实现方式，但很多人会忽略 volatile 关键字，因为没有该关键字，程序也可以很好的运行，只不过代码的稳定性总不是 100%，说不定在未来的某个时刻，隐藏的 bug 就出来了。</p>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token keyword">class</span> <span class="token class-name">Singleton</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token keyword">volatile</span> <span class="token keyword">static</span> <span class="token class-name">Singleton</span> instance<span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token class-name">Singleton</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token punctuation">}</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Singleton</span> <span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>instance <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">syschronized</span><span class="token punctuation">(</span><span class="token class-name">Singleton</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">if</span> <span class="token punctuation">(</span>instance <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    instance <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Singleton</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> instance<span class="token punctuation">;</span>
    <span class="token punctuation">}</span> 
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><br/>
<h2 id="参考文章" tabindex="-1"><a class="header-anchor" href="#参考文章" aria-hidden="true">#</a> <span id="te">参考文章</span></h2>
<p><a href="https://www.pdai.tech/md/java/thread/java-thread-x-key-volatile.html" target="_blank">关键字: volatile详解 | Java 全栈知识体系 (pdai.tech)</a></p>
<p><a href="https://www.bilibili.com/video/BV1pJ411M7mb?p=2" target="_blank">https://www.bilibili.com/video/BV1pJ411M7mb?p=2</a></p>
<p><a href="https://blog.csdn.net/u012723673/article/details/80682208" target="_blank">Java volatile关键字最全总结：原理剖析与实例讲解(简单易懂)</a></p>
<p><a href="https://zhuanlan.zhihu.com/p/133851347" target="_blank">volatile底层原理详解 - 知乎</a></p>
<p><a href="https://www.cnblogs.com/cxy2020/p/12951333.html" target="_blank">Volatile详解，太详细了 - Code2020 - 博客园</a></p>
<p><a href="https://www.cnblogs.com/dolphin0520/p/3920373.html" target="_blank">Java并发编程：volatile关键字解析 - Matrix海子 - 博客园 </a></p>
<p><a href="https://www.cnblogs.com/zhengbin/p/5654805.html" target="_blank">Java中Volatile关键字详解 - 郑斌blog - 博客园 </a></p>
<p><a href="https://www.cnblogs.com/bmilk/p/13178009.html" target="_blank">Java多线程之volatile详解 - bmilk - 博客园</a></p>
<p><a href="https://blog.csdn.net/byhook/article/details/87971081" target="_blank">Java并发编程之happens-before和as-if-serial语义</a></p>
<p><a href="https://www.kancloud.cn/luoyoub/jvm-note/1890149" target="_blank">JMM八种操作指令 · jvm学习笔记 · 看云</a></p>
</div></template>


