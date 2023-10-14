<template><div><div class="catalog">
<ul>
<li><a href="#t1">Object 基础方法</a>
<ul>
<li><a href="#t11">registerNatives</a></li>
<li><a href="#t12">hashCode</a>
<ul>
<li><a href="#t121">hashCode 的作用</a></li>
<li><a href="#t122">hashCode()重写</a></li>
</ul>
</li>
<li><a href="#t13">equals</a>
<ul>
<li><a href="#t131">equals()重写</a></li>
</ul>
</li>
<li><a href="#t14">toString</a></li>
<li><a href="#t15">clone</a></li>
<li><a href="#t16">finalize</a></li>
</ul>
</li>
<li><a href="#t2">枚举</a>
<ul>
<li><a href="#t21">用 enum 代替 static final 常量</a></li>
<li><a href="#t22">使用 EnumMap</a></li>
</ul>
</li>
<li><a href="#t3">参考文章</a></li>
</ul>
</div>
<h2 id="object-基础方法" tabindex="-1"><a class="header-anchor" href="#object-基础方法" aria-hidden="true">#</a> <span id="t1">Object 基础方法</span></h2>
<p><strong>Object</strong> 共有 12 个自带方法，<strong>notify、wait</strong> 类线程方法将会在线程相关章节涉及，<strong>getClass</strong> 在反射章节讲。</p>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">native</span> <span class="token keyword">void</span> <span class="token function">registerNatives</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">public</span> <span class="token keyword">native</span> <span class="token keyword">int</span> <span class="token function">hashCode</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">equals</span><span class="token punctuation">(</span><span class="token class-name">Object</span> obj<span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token keyword">this</span> <span class="token operator">==</span> obj<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>
<span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token keyword">return</span> <span class="token function">getClass</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"@"</span> <span class="token operator">+</span> <span class="token class-name">Integer</span><span class="token punctuation">.</span><span class="token function">toHexString</span><span class="token punctuation">(</span><span class="token function">hashCode</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>
<span class="token keyword">protected</span> <span class="token keyword">native</span> <span class="token class-name">Object</span> <span class="token function">clone</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">CloneNotSupportedException</span><span class="token punctuation">;</span>
<span class="token keyword">protected</span> <span class="token keyword">void</span> <span class="token function">finalize</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Throwable</span> <span class="token punctuation">{</span> <span class="token punctuation">}</span>
<span class="token comment">/////////////////////////////////////////////////////////////</span>
<span class="token keyword">public</span> <span class="token keyword">final</span> <span class="token keyword">native</span> <span class="token class-name">Class</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">></span></span> <span class="token function">getClass</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">public</span> <span class="token keyword">final</span> <span class="token keyword">native</span> <span class="token keyword">void</span> <span class="token function">notify</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">public</span> <span class="token keyword">final</span> <span class="token keyword">native</span> <span class="token keyword">void</span> <span class="token function">notifyAll</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">public</span> <span class="token keyword">final</span> <span class="token keyword">native</span> <span class="token keyword">void</span> <span class="token function">wait</span><span class="token punctuation">(</span><span class="token keyword">long</span> timeout<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">InterruptedException</span><span class="token punctuation">;</span>
<span class="token keyword">public</span> <span class="token keyword">final</span> <span class="token keyword">void</span> <span class="token function">wait</span><span class="token punctuation">(</span><span class="token keyword">long</span> timeout<span class="token punctuation">,</span> <span class="token keyword">int</span> nanos<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">InterruptedException</span><span class="token punctuation">{</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">}</span>
<span class="token keyword">public</span> <span class="token keyword">final</span> <span class="token keyword">void</span> <span class="token function">wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">InterruptedException</span> <span class="token punctuation">{</span> <span class="token function">wait</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><br>
<h3 id="registernatives" tabindex="-1"><a class="header-anchor" href="#registernatives" aria-hidden="true">#</a> <span id="t11">registerNatives</span></h3>
<p>这是一个 <code v-pre>private static native</code> 方法，这里有个 <strong>native</strong> 关键字，忽然一脸懵逼，百度了下，顺便贴一下这个关键字的作用，开发中可以忽略。</p>
<blockquote>
<p>Java 有两种方法：Java 方法和本地方法。</p>
<p>Java 方法是由 Java 语言编写，编译成字节码，存储在 class 文件中。</p>
<p>本地方法是由其他语言（比如 C，C++，或者汇编）编写的，编译成和处理器相关的机器代码，本地方法保存在动态连接库中，格式是各个平台专有的。</p>
<p>运行中的 Java 程序调用本地方法时，虚拟机装载包含这个本地方法的动态库，并调用这个方法，本地方法是联系 Java 程序和底层主机操作系统的连接方法。</p>
<p>Java Native Interface (JNI) 标准就成为 java 平台的一部分，它允许 Java 代码和其他语言写的代码进行交互。</p>
<p>简单地讲，一个用 Native 关键字修饰的方法就是一个 java 调用非 java 代码的接口；</p>
</blockquote>
<p>registerNatives 本质上就是一个本地方法，但这又是一个有别于一般本地方法的本地方法，从方法名我们可以猜测该方法应该是用来注册本地方法的。上述代码的功能就是先定义了 registerNatives()方法，然后当该类被加载的时候，调用该方法完成对该类中本地方法的注册。</p>
<p>也就是说，凡是包含 registerNatives()本地方法的类，同时也包含了其他本地方法。所以，当包含 registerNatives()方法的类被加载的时候，注册的方法就是该类所包含的除了 registerNatives()方法以外的所有本地方法。</p>
<br>
<h3 id="hashcode" tabindex="-1"><a class="header-anchor" href="#hashcode" aria-hidden="true">#</a> <span id="t12">hashCode</span></h3>
<h4 id="hashcode-的作用" tabindex="-1"><a class="header-anchor" href="#hashcode-的作用" aria-hidden="true">#</a> <span id="t121">hashCode 的作用</span></h4>
<p>根据百度百科，hash 实际上是一种散列算法，是将不同的输入散列程特定长度的输出；不同的输入可能会得到相同的输出，所以不能从散列值来判断出输入值。</p>
<p><code v-pre>hashCode()</code>方法给对象返回一个 int 类型的 hash code 值。</p>
<p>在 Java 中，有一些哈希容器，比如 Hashtable,HashMap 等等。当我们调用这些容器的诸如 get(Object obj)方法时，容器的内部肯定需要判断一下当前 obj 对象在容器中是否存在，然后再进行后续的操作。一般来说，判断是够存在，肯定是要将 obj 对象和容器中的每个元素一一进行比较，要使用 equals()才是正确的。</p>
<p>但是如果哈希容器中的元素有很多的时候，使用 equals()必然会很慢。这个时候我们想到一种替代方案就是 hashCode(）：当我们调用哈希容器的 get(Object obj)方法时，它会首先利用查看当前容器中是否存在有相同哈希值的对象，如果不存在，那么直接返回 null；如果存在，再调用当前对象的 equals()方法比较一下看哈希处的对象是否和要查找的对象相同；如果不相同，那么返回 null。如果相同，则返回该哈希处的对象。</p>
<p><strong>hashCode()被设计用来使得哈希容器能高效的工作。也只有在哈希容器中，才使用 hashCode()来比较对象是否相等，但要注意这种比较是一种弱的比较，还要利用 equals()方法最终确认。</strong></p>
<p><strong>我们把 hashCode()相等看成是两个对象相等的必要非充分条件，把 equals()相等看成是两个对象相等的充要条件</strong>。</p>
<blockquote>
<p>在许多时候被认为 hash code 为内存位置，实际上，hashCode()作为一个 native 方法，它和对象地址确实有关系，实际上并不仅仅是对象地址。它代表的实际上是 hash 表中对应的位置。</p>
</blockquote>
<h4 id="hashcode-重写" tabindex="-1"><a class="header-anchor" href="#hashcode-重写" aria-hidden="true">#</a> <span id="t122">hashCode()重写</span></h4>
<p>以下约定摘自 Object 规范 JavaSE 1.6</p>
<table>
    <tr>
       <td>1.equals方法所比较的信息没有被修改，hashCode方法返回同一个整数。在同一个应用程序的多次执行过程中，hashCode每次返回的整数可以不一致。</td>
    </tr>
    <tr>
        <td> 2.如果两个对象equals方法比较相等，那么调用hashCode方法返回结果必须相等。</td>
    </tr>
    <tr>
      <td>3.如果两个对象调用equals方法不相等，调用hashCode方法返回不一定相等。但是返回不相等的整数，有可能提高散列表（hash table）的性能</td>
    </tr>
</table>
<blockquote>
<p>关于 hashCode 方法：<br>
因此，重写 equals 方法而没有重写 hashCode 方法会违反第二条规范。</p>
</blockquote>
<p>例如，测试类 PhoneNumber()</p>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">final</span> <span class="token keyword">class</span> <span class="token class-name">PhoneNumber</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token keyword">int</span> areaCode<span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token keyword">int</span> prefix<span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token keyword">int</span> lineNumber<span class="token punctuation">;</span>

    <span class="token comment">//添加构造器</span>
    <span class="token keyword">public</span> <span class="token class-name">PhoneNumber</span><span class="token punctuation">(</span><span class="token keyword">int</span> areaCode<span class="token punctuation">,</span> <span class="token keyword">int</span> prefix<span class="token punctuation">,</span> <span class="token keyword">int</span> lineNumber<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>areaCode <span class="token operator">=</span> areaCode<span class="token punctuation">;</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>prefix <span class="token operator">=</span> prefix<span class="token punctuation">;</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>lineNumber <span class="token operator">=</span> lineNumber<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">//重写equals方法</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">equals</span><span class="token punctuation">(</span><span class="token class-name">Object</span> obj<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">//判断是否为本对象的引用</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token operator">==</span>obj<span class="token punctuation">)</span> <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
        <span class="token comment">//判断是否和本对象类型相同</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token punctuation">(</span>obj <span class="token keyword">instanceof</span> <span class="token class-name">PhoneNumber</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
        <span class="token comment">//进行域对比</span>
        <span class="token class-name">PhoneNumber</span> p <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">PhoneNumber</span><span class="token punctuation">)</span> obj<span class="token punctuation">;</span>
        <span class="token keyword">return</span> p<span class="token punctuation">.</span>areaCode <span class="token operator">==</span> areaCode
              <span class="token operator">&amp;&amp;</span> p<span class="token punctuation">.</span>lineNumber <span class="token operator">==</span> lineNumber
              <span class="token operator">&amp;&amp;</span> p<span class="token punctuation">.</span>prefix <span class="token operator">==</span> prefix<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">//尚未重写hashCode方法</span>
<span class="token comment">//    @Override</span>
<span class="token comment">//    public int hashCode() {</span>
<span class="token comment">//        return super.hashCode();</span>
<span class="token comment">//    }</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>试图将这个类和 HashMap 一起使用：</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>  Map&lt;PhoneNumber,String> map = new HashMap&lt;PhoneNumber,String>();
  map.put(new PhoneNumber(100,200,300),"Shiva");
  //通过相同对象获取map.value
  map.get(new PhoneNumber(100,200,300));
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的测试中，map.get()期望获得&quot;Shiva&quot;字符串，然而实际上是 null。因为这里的 PhoneNumber 涉及到了两个对象。new PhoneNumber()产生的是一个全新的对象。两张十块钱虽然等价，但是并不认为是同一张。</p>
<p>这里贴下 HashMap.get()方法，基本就是对比散列码（哈希码），获取获取对应值。</p>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token comment">//HashMap的get()方法</span>
  <span class="token keyword">public</span> <span class="token class-name">V</span> <span class="token function">get</span><span class="token punctuation">(</span><span class="token class-name">Object</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">K</span><span class="token punctuation">,</span><span class="token class-name">V</span><span class="token punctuation">></span></span> e<span class="token punctuation">;</span>
        <span class="token keyword">return</span> <span class="token punctuation">(</span>e <span class="token operator">=</span> <span class="token function">getNode</span><span class="token punctuation">(</span><span class="token function">hash</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">,</span> key<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">?</span> <span class="token keyword">null</span> <span class="token operator">:</span> e<span class="token punctuation">.</span>value<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token comment">//get()方法中调用的hash()方法</span>
  <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">int</span> <span class="token function">hash</span><span class="token punctuation">(</span><span class="token class-name">Object</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">int</span> h<span class="token punctuation">;</span>
        <span class="token keyword">return</span> <span class="token punctuation">(</span>key <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token operator">?</span> <span class="token number">0</span> <span class="token operator">:</span> <span class="token punctuation">(</span>h <span class="token operator">=</span> key<span class="token punctuation">.</span><span class="token function">hashCode</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">^</span> <span class="token punctuation">(</span>h <span class="token operator">>>></span> <span class="token number">16</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>&gt;&gt;&gt; : 无符号右移，忽略符号位，空位都以 0 补齐</strong></p>
<p>如果重写了 PhoneNumber()的 HashCode 方法。例如：</p>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code>   <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">int</span> <span class="token function">hashCode</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
         <span class="token keyword">return</span> <span class="token number">42</span><span class="token punctuation">;</span>
     <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样，在测试代码中就能得到&quot;Shiva&quot;，而且这种写法是合法的，保证了相等对象具有相同的哈希码。但是，每个对象都具有相同的哈希码，因此，每个对象都会被映射到同一个散列桶中，是散列表退化为链表（linked list）。使得本该线性时间运行的程序变成以平方级时间运行。对大规模的散列表，会影响正常运行。</p>
<p>HashCode 的重写方式：</p>
<p>一个好的 HashCode 方法倾向于“为不同对象产生不同的哈希码”。通过以下方式，可以尽可能做到这一点：</p>
<blockquote>
<p>1.把某个非零的常数值，比如 17，保存在一个名为 result 的 int 类型的变量中</p>
</blockquote>
<blockquote>
<p>2.对于对象中的每个域 f（equals 方法中涉及到的每个域），完成以下步骤：</p>
<blockquote>
<p>a.为该域计算 int 类型的哈希码 c:</p>
<blockquote>
<p>i.如果该域是 boolean 类型，则计算（f ? 1 : 0）<br>
ii.如果该域是 byte，char，short 或者 int 类型，则计算（int）f<br>
iii.如果该域是 long 类型，则计算（int）(f ^ f &gt;&gt;&gt; 32)<br>
iv.如果该域是 float 类型，则计算 Float.floatToIntBits(f)<br>
v.如果该域是 double 类型，则计算 Double.doubleToIntBits(f),然后按照步骤 2.a.iii，为得到的 long 类型值计算散列值<br>
vi.如果该域是一个对象引用，并且该类的 equals 方法通过递归调用 equals 的方式来比较这个域，则同样为这个域递归调用 hashCode。如果这个域值为 null，则返回 0（或者为其他常数）<br>
vii.如果该域是一个数组，则将每一个元素当成单独域来处理。递归调用上面的方法<br></p>
</blockquote>
</blockquote>
</blockquote>
<blockquote>
<blockquote>
<p>b.按照下面公式，把步骤 2.a 中计算得到的哈希码 c，合并到 result 中<br>
result = 31 * result + c;</p>
</blockquote>
</blockquote>
<blockquote>
<p>3.返回 result</p>
</blockquote>
<blockquote>
<p>4.写完后，查看是否“相等的实例是否具有相同 hashCode”，并单元测试。</p>
</blockquote>
<br>
<h3 id="equals" tabindex="-1"><a class="header-anchor" href="#equals" aria-hidden="true">#</a> <span id="t13">equals</span></h3>
<p>一般的包装类型都重写了 <code v-pre>equals()</code> 方法，并不是直接对比内存地址。</p>
<ul>
<li><strong>自反性</strong>（reflexive）。对于任意不为<code v-pre>null</code>的引用值 x，<code v-pre>x.equals(x)</code>一定是<code v-pre>true</code>。</li>
<li><strong>对称性</strong>（symmetric）。对于任意不为<code v-pre>null</code>的引用值<code v-pre>x</code>和<code v-pre>y</code>，当且仅当<code v-pre>x.equals(y)</code>是<code v-pre>true</code>时，<code v-pre>y.equals(x)</code>也是<code v-pre>true</code>。</li>
<li><strong>传递性</strong>（transitive）。对于任意不为<code v-pre>null</code>的引用值<code v-pre>x</code>、<code v-pre>y</code>和<code v-pre>z</code>，如果<code v-pre>x.equals(y)</code>是<code v-pre>true</code>，同时<code v-pre>y.equals(z)</code>是<code v-pre>true</code>，那么<code v-pre>x.equals(z)</code>一定是<code v-pre>true</code>。</li>
<li><strong>一致性</strong>（consistent）。对于任意不为<code v-pre>null</code>的引用值<code v-pre>x</code>和<code v-pre>y</code>，如果用于 equals 比较的对象信息没有被修改的话，多次调用时<code v-pre>x.equals(y)</code>要么一致地返回<code v-pre>true</code>要么一致地返回<code v-pre>false</code>。</li>
<li>对于任意不为<code v-pre>null</code>的引用值<code v-pre>x</code>，<code v-pre>x.equals(null)</code>返回<code v-pre>false</code>。</li>
</ul>
<h4 id="equals-重写" tabindex="-1"><a class="header-anchor" href="#equals-重写" aria-hidden="true">#</a> <span id="t131">equals()重写</span></h4>
<table>
    <tr>
       <td> 1.使用 == 操作符检查“参数是否为对这个对象的引用”</td>
    </tr>
    <tr>
        <td> 2.使用 instanceif 操作符检查“参数是否为正确的类型”</td>
    </tr>
    <tr>
      <td> 3.对于该类中的每个“关键（significant）”域，检查参数中的域是否与该对象中对应的域相匹配</td>
    </tr>
</table>
<p>关于 equals 方法：</p>
<ul>
<li>使用 == 操作符检查“参数是否为对这个对象的引用”。如果 equals 的对象为本身的引用，那么返回肯定是 true。在方法内首先判断，可以做为一种性能优化，如果操作比较昂贵，就值得这么做。</li>
<li>使用 instanceof 操作符检查“参数是否为正确的类型”。instanceof 操作符可以判断传入参数与本身类型是否相同。也相当于是一种性能优化。其次，在有些情况下，指该类所实现得接口。例如集合接口（collection interface）得 Set，List，Map 和 Map.Entry。</li>
<li>对于该类中的每个“关键（significant）”域，检查参数中的域是否与该对象中对应的域相匹配。如果第二条中的类型是个接口，就必须通过接口方法访问参数中的域；如果是个类，就可以直接访问。</li>
</ul>
<table>
    <tr>
        <td>基本类型域</td>
        <td>除了float和double，可以直接使用==进行比较</td>
    </tr>
    <tr>
         <td>对象引用域</td>
         <td>可以调用引用对象的equal方法</td>
    </tr>
    <tr>
         <td>float域</td>
         <td>Float.compare方法</td>
    </tr>
    <tr>
         <td>double域</td>
         <td>Double.compare方法</td>
    </tr>
</table>
<blockquote>
<p>float 和 double 的比较需要经过特殊处理，存在例如 Float.NaN，-0.0f 的常量。有些对象可以包含 null，需要考虑避免空指针异常。</p>
</blockquote>
<p><strong>域的比较顺序可能会影响 equal 方法的效率，应该最先比较最有可能不同的域，或者开销最低的域。</strong></p>
<p>不要将 equals 声明中的 Object 对象替换为其他（那就不是重写方法了，而是自定义方法。）</p>
<blockquote>
<p>在自定义一个类的时候，我们必须要同时重写 equals()和 hashCode()，并且必须保证：</p>
<p>其一：如果两个对象的 equals()相等，那么他们的 hashCode()必定相等。</p>
<p>其二：如果两个对象的 hashCode()不相等，那么他们的 equals()必定不等。</p>
</blockquote>
<br>
<h3 id="tostring" tabindex="-1"><a class="header-anchor" href="#tostring" aria-hidden="true">#</a> <span id="t14">toString</span></h3>
<p>Object 默认<strong>toString</strong>方法为 16 进制 <strong>hashcode</strong> 字符串，</p>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token function">getClass</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"@"</span> <span class="token operator">+</span> <span class="token class-name">Integer</span><span class="token punctuation">.</span><span class="token function">toHexString</span><span class="token punctuation">(</span><span class="token function">hashCode</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以下摘自《effective java》:</p>
<p>toString 的通用约定要求**「建议所有的子类重写这个方法」<strong>，返回的字符串应该是</strong>「一个简洁但内容丰富的表示，对人们来说是很容易阅读的」**。</p>
<p>在静态工具类中编写 toString 方法是没有意义的。 你也不应该在大多数枚举类型中写一个 toString 方法，因为 Java 为你提供了一个非常好的方法。</p>
<p>但是，你应该在任何抽象类中定义 toString 方法，该类的子类共享一个公共字符串表示形式。 例如，大多数集合实现上的 toString 方法都是从抽象集合类继承的。</p>
<p>除非父类已经这样做了，否则在每个实例化的类中重写 Object 的 toString 实现。 它使得类更加舒适地使用和协助调试。 toString 方法应该以一种美观的格式返回对象的简明有用的描述。</p>
<br>
<h3 id="clone" tabindex="-1"><a class="header-anchor" href="#clone" aria-hidden="true">#</a> <span id="t15">clone</span></h3>
<p>clone() 方法返回与当前对象的一个副本对象，使用 clone() 方法需要实现 Cloneable 接口。</p>
<p>clone() 在 Object 中是 <strong>protected</strong> 方法，在别的类中调用需要重写。</p>
<p>在 Java 中，clone() 方法有两种不同的模式，即浅复制和深复制（也被称为浅拷贝和深拷贝）。</p>
<p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/CommonMethodAndEnum1.png" alt="CommonMethodAndEnum1"></p>
<blockquote>
<p>对于浅复制，只是对象的引用得到的复制；如果对象中存在其他对象的引用，使用浅复制后，源对象和复制后的对象中对其他对象的引用会指向同一个内存地址。如果要完全把两个对象在内存中分开，必须使用深复制。</p>
</blockquote>
<p><strong>阿里巴巴 Java 开发手册中提到，慎用自带 clone() 方法，默认是浅拷贝。所以需要用到 clone() 一定要重写。</strong></p>
<p><strong>深拷贝举例：</strong></p>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token keyword">class</span> <span class="token class-name">Stu</span> <span class="token keyword">implements</span> <span class="token class-name">Cloneable</span><span class="token punctuation">{</span>
    <span class="token class-name">String</span> name<span class="token punctuation">;</span>
    <span class="token class-name">Pen</span> pen <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Pen</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">protected</span> <span class="token class-name">Object</span> <span class="token function">clone</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">CloneNotSupportedException</span> <span class="token punctuation">{</span>
        <span class="token class-name">Stu</span> temp <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">Stu</span><span class="token punctuation">)</span> <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">clone</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        temp<span class="token punctuation">.</span>pen <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">Pen</span><span class="token punctuation">)</span> pen<span class="token punctuation">.</span><span class="token function">clone</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> temp<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
<span class="token keyword">class</span> <span class="token class-name">Pen</span> <span class="token keyword">implements</span> <span class="token class-name">Cloneable</span><span class="token punctuation">{</span>
    <span class="token class-name">String</span> name<span class="token punctuation">;</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">protected</span> <span class="token class-name">Object</span> <span class="token function">clone</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">CloneNotSupportedException</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">clone</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><br>
<h3 id="finalize" tabindex="-1"><a class="header-anchor" href="#finalize" aria-hidden="true">#</a> <span id="t16">finalize</span></h3>
<p>java 提供 finalize()方法，垃圾回收器准备释放内存的时候，会先调用 finalize()。 对于垃圾回收，需要首先了解**《JAVA 编程思想》中对 finalize 的讲解** :</p>
<ol>
<li>对象不一定会被回收。</li>
<li>垃圾回收不是析构函数。</li>
<li>垃圾回收只与内存有关。</li>
<li>垃圾回收和 finalize()都是靠不住的，只要 JVM 还没有快到耗尽内存的地步，它是不会浪费时间进行垃圾回收的。</li>
</ol>
<p>在 Java 中，由于 GC 的自动回收机制，因而并不能保证 finalize 方法会被及时地执行（垃圾对象的回收时机具有不确定性），也不能保证它们会被执行(程序由始至终都未触发垃圾回收)。</p>
<p><strong>finalize()使用时机</strong></p>
<p>finalize()方法中一般用于释放非 Java 资源（如打开的文件资源、数据库连接等），或是调用非 Java 方法（native 方法）时分配的内存（比如 C 语言的 malloc()系列函数），上面提到的 clone() 创建的。</p>
<p><strong>应该避免使用 finalize()</strong></p>
<p>GC 可以回收大部分的对象（凡是 new 出来的对象，gc 都能搞定，一般情况下我们不会用 new 以外的方式去创建对象），所以一般是不需要程序员去实现 finalize 的。</p>
<p>以下摘自《Effective Java》:</p>
<blockquote>
<p>1、终结方法（finalizer）通常是不可预测的，也是很危险的，一般情况下是不必要的。是使用终结方法会导致行为不稳定、降低性能，以及可移植性问题。所以，我们应该避免使用终结方法。</p>
<p>2、使用终结方法有一个非常严重的性能损失。在我的机器上，创建和销毁一个简单对象的时间大约为 5.6ns、增加一个终结方法使时间增加到了 2400ns。换句话说，用终结方法创建和销毁对象慢了大约 430 倍。</p>
<p>3、如果实在要实现终结方法，要记得调用 super.finalize()</p>
</blockquote>
<h2 id="枚举" tabindex="-1"><a class="header-anchor" href="#枚举" aria-hidden="true">#</a> <span id="t2">枚举</span></h2>
<p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/CommonMethodAndEnum2.png" alt="CommonMethodAndEnum2"></p>
<h3 id="用-enum-代替-static-final-常量" tabindex="-1"><a class="header-anchor" href="#用-enum-代替-static-final-常量" aria-hidden="true">#</a> <span id="t21">用 enum 代替 static final 常量</span></h3>
<p>此部分参考自《Effective Java》</p>
<p>以前我习惯用下列方法：</p>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token comment">//使用static final两个修饰符</span>
<span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">String</span> <span class="token constant">SUNDAY</span> <span class="token operator">=</span> <span class="token string">"0"</span><span class="token punctuation">;</span>
<span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">String</span> <span class="token constant">MONDAY</span> <span class="token operator">=</span> <span class="token string">"1"</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这种方式被成为枚举模式。但是这种方式在安全性和使用便捷上没有帮助。还存在其他缺陷：</p>
<p>例如要打印一组枚举常量，用 static final 修饰符定义的常量，无法直接获得，甚至我无法知道这组常量的长度。</p>
<p>平常使用中，经常用 static final 定义 String 类型，这样做可能会存在性能问题。因为它以来字符串的比较操作。更糟糕的是，这些常量是硬编码（写死）在代码中的，几乎无法更改。</p>
<p>从 Java 1.5 开始，就提出了枚举类型，解决上述问题，并提供了许多好处。</p>
<blockquote>
<p><strong>枚举类型的基本想法：通过公有的静态 final 域为每个枚举常量导出实例。枚举没有构造器，所以是真正的 final 类型。</strong></p>
</blockquote>
<p>枚举类型还允许添加任意的方法和域，并实现任意的接口。它还提供了所有 Object 方法的高级实现。枚举的每一个实例都有其方法和域。</p>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">enum</span> <span class="token class-name">Planet</span> <span class="token punctuation">{</span>
    <span class="token comment">//枚举常量括号内的参数，会传递给构造器</span>
    <span class="token function">MERCURY</span><span class="token punctuation">(</span><span class="token number">3.302e+23</span><span class="token punctuation">,</span> <span class="token number">2.439e6</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token function">EARTH</span><span class="token punctuation">(</span><span class="token number">5.975e+24</span><span class="token punctuation">,</span> <span class="token number">6.378e6</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token keyword">double</span> mass<span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token keyword">double</span> radius<span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token keyword">double</span> surfaceGravity<span class="token punctuation">;</span>

    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">double</span> <span class="token class-name">G</span> <span class="token operator">=</span> <span class="token number">6.67300E-11</span> <span class="token punctuation">;</span>

    <span class="token comment">//枚举类型构造器，构造上述类型,但是这个构造方法无法在外部用于构造实例</span>
    <span class="token class-name">Planet</span><span class="token punctuation">(</span><span class="token keyword">double</span> mass<span class="token punctuation">,</span> <span class="token keyword">double</span> radius<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>mass <span class="token operator">=</span> mass<span class="token punctuation">;</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>radius <span class="token operator">=</span> radius<span class="token punctuation">;</span>
        surfaceGravity <span class="token operator">=</span> <span class="token class-name">G</span> <span class="token operator">*</span> mass <span class="token operator">/</span> <span class="token punctuation">(</span> radius <span class="token operator">*</span> radius <span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">double</span> <span class="token function">mass</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span> <span class="token keyword">return</span> mass<span class="token punctuation">;</span><span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">double</span> <span class="token function">radius</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token keyword">return</span> radius<span class="token punctuation">;</span> <span class="token punctuation">}</span>
    <span class="token keyword">public</span> <span class="token keyword">double</span> <span class="token function">surfaceGravity</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token keyword">return</span> surfaceGravity<span class="token punctuation">;</span> <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">double</span> <span class="token function">surfaceWeight</span><span class="token punctuation">(</span><span class="token keyword">double</span> mass<span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">return</span> mass <span class="token operator">*</span> surfaceGravity<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述示例中，为了将数据和枚举常量关联起来，得声明实例域，并编写一个带有数据并将数据保存在域中的构造器。枚举天生就是不可变的，因此所有的域应该为 final 。</p>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token comment">//直接获取实例，并访问内部方法</span>
<span class="token class-name">Planet</span><span class="token punctuation">.</span><span class="token constant">EARTH</span><span class="token punctuation">.</span><span class="token function">surfaceGravity</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token comment">//用values()方法获取实例列表</span>
<span class="token class-name">Planet</span><span class="token punctuation">.</span><span class="token function">values</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最后一个值得一提的是，有时候每个枚举实例，需要有各自不同的方法，比如基本运算。若枚举对象运算有加减乘除四个实例。显然用 switch 来判断并不合适。</p>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">enum</span>  <span class="token class-name">Operation</span> <span class="token punctuation">{</span>
    <span class="token function">PLUS</span><span class="token punctuation">(</span><span class="token string">"+"</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">double</span> <span class="token function">apply</span><span class="token punctuation">(</span><span class="token keyword">double</span> x<span class="token punctuation">,</span> <span class="token keyword">double</span> y<span class="token punctuation">)</span><span class="token punctuation">{</span> <span class="token keyword">return</span> x <span class="token operator">+</span> y <span class="token punctuation">;</span> <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function">MINUS</span><span class="token punctuation">(</span><span class="token string">"-"</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token keyword">double</span> <span class="token function">apply</span><span class="token punctuation">(</span><span class="token keyword">double</span> x<span class="token punctuation">,</span> <span class="token keyword">double</span> y<span class="token punctuation">)</span><span class="token punctuation">{</span> <span class="token keyword">return</span> x <span class="token operator">-</span> y <span class="token punctuation">;</span> <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>

    <span class="token class-name">Operation</span><span class="token punctuation">(</span><span class="token class-name">String</span> symbol<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>symbol <span class="token operator">=</span> symbol<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">String</span> symbol<span class="token punctuation">;</span>
    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">getSymbol</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> symbol<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">//抽象方法，每个实例重写自己的方法</span>
    <span class="token keyword">abstract</span> <span class="token keyword">double</span> <span class="token function">apply</span><span class="token punctuation">(</span><span class="token keyword">double</span> x<span class="token punctuation">,</span> <span class="token keyword">double</span> y<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">//这里重写toString方法在遍历时有奇效。不妨试一试</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> symbol<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="使用-enummap" tabindex="-1"><a class="header-anchor" href="#使用-enummap" aria-hidden="true">#</a> <span id="t22">使用 EnumMap</span></h3>
<p>此部分引用自《On Java 8》</p>
<p>EnumMap 是一种特殊的 Map，它要求其中的键（key）必须来自一个 enum，由于 enum 本身的限制，所以 EnumMap 在内部可由数组实现。因此 EnumMap 的速度很快，我们可以放心地使用 enum 实例在 EnumMap 中进行查找操作。不过，我们只能将 enum 的实例作为键来调用 put() 可方法，其他操作与使用一般的 Map 差不多。</p>
<p>下面的例子演示了<em>命令设计模式</em>的用法。一般来说，命令模式首先需要一个只有单一方法的接口，然后从该接口实现具有各自不同的行为的多个子类。接下来，程序员就可以构造命令对象，并在需要的时候使用它们了：</p>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token comment">// enums/EnumMaps.java</span>
<span class="token comment">// Basics of EnumMaps</span>
<span class="token comment">// {java enums.EnumMaps}</span>
<span class="token keyword">package</span> <span class="token namespace">enums</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token operator">*</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token keyword">static</span> <span class="token import static"><span class="token namespace">enums<span class="token punctuation">.</span></span><span class="token class-name">AlarmPoints</span><span class="token punctuation">.</span><span class="token operator">*</span></span><span class="token punctuation">;</span>
<span class="token keyword">interface</span> <span class="token class-name">Command</span> <span class="token punctuation">{</span> <span class="token keyword">void</span> <span class="token function">action</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token punctuation">}</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">EnumMaps</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">EnumMap</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">AlarmPoints</span><span class="token punctuation">,</span><span class="token class-name">Command</span><span class="token punctuation">></span></span> em <span class="token operator">=</span>
                <span class="token keyword">new</span> <span class="token class-name">EnumMap</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token class-name">AlarmPoints</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        em<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token constant">KITCHEN</span><span class="token punctuation">,</span>
                <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-></span> <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"Kitchen fire!"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        em<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token constant">BATHROOM</span><span class="token punctuation">,</span>
                <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-></span> <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"Bathroom alert!"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span><span class="token punctuation">(</span><span class="token class-name">Map<span class="token punctuation">.</span>Entry</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">AlarmPoints</span><span class="token punctuation">,</span><span class="token class-name">Command</span><span class="token punctuation">></span></span> e<span class="token operator">:</span>
                em<span class="token punctuation">.</span><span class="token function">entrySet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">print</span><span class="token punctuation">(</span>e<span class="token punctuation">.</span><span class="token function">getKey</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">": "</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            e<span class="token punctuation">.</span><span class="token function">getValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">action</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">try</span> <span class="token punctuation">{</span> <span class="token comment">// If there's no value for a particular key:</span>
            em<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token constant">UTILITY</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">action</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">catch</span><span class="token punctuation">(</span><span class="token class-name">Exception</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"Expected: "</span> <span class="token operator">+</span> e<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输出为：</p>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token constant">BATHROOM</span><span class="token operator">:</span> <span class="token class-name">Bathroom</span> alert<span class="token operator">!</span>
<span class="token constant">KITCHEN</span><span class="token operator">:</span> <span class="token class-name">Kitchen</span> fire<span class="token operator">!</span>
<span class="token class-name">Expected</span><span class="token operator">:</span> <span class="token class-name"><span class="token namespace">java<span class="token punctuation">.</span>lang<span class="token punctuation">.</span></span>NullPointerException</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>与 EnumSet 一样，enum 实例定义时的次序决定了其在 EnumMap 中的顺序。</p>
<p>main0 方法的最后部分说明，enum 的每个实例作为一个键，总是存在的。但是，如果你没有为这个键调用 put() 方法来存人相应的值的话，其对应的值就是 null。</p>
<p>与常量相关的方法（constant-specific methods 将在下一节中介绍）相比，EnumMap 有一个优点，那 EnumMap 允许程序员改变值对象，而常量相关的方法在编译期就被固定了。稍后你会看到，在你有多种类型的 enum，而且它们之间存在互操作的情况下，我们可以用 EnumMap 实现多路分发（multiple dispatching）。</p>
<h2 id="参考文章" tabindex="-1"><a class="header-anchor" href="#参考文章" aria-hidden="true">#</a> <span id="t3">参考文章</span></h2>
<p><a href="https://www.cnblogs.com/KingIceMou/p/7239668.html" target="_blank">https://www.cnblogs.com/KingIceMou/p/7239668.html</a></p>
<p><a href="https://www.jianshu.com/p/8236d9bc2abf" target="_blank">https://www.jianshu.com/p/8236d9bc2abf</a></p>
<p><a href="https://blog.csdn.net/Saintyyu/article/details/90452826" target="_blank">https://blog.csdn.net/Saintyyu/article/details/90452826</a></p>
<p><a href="https://blog.csdn.net/dome_/article/details/92084823" target="_blank">https://blog.csdn.net/dome_/article/details/92084823</a></p>
<p><a href="https://www.cnblogs.com/Qian123/p/5703507.html#_labelTop" target="_blank">https://www.cnblogs.com/Qian123/p/5703507.html#_labelTop</a></p>
<p><a href="https://www.cnblogs.com/yibutian/p/9619696.html" target="_blank">https://www.cnblogs.com/yibutian/p/9619696.html</a></p>
<p><a href="https://www.cnblogs.com/KpGo/p/10454142.html" target="_blank">https://www.cnblogs.com/KpGo/p/10454142.html</a></p>
<p><a href="https://zhuanlan.zhihu.com/p/43001449" target="_blank">https://zhuanlan.zhihu.com/p/43001449</a></p>
<p><a href="https://jingyan.baidu.com/article/3ea51489bb18e152e71bba76.html" target="_blank">https://jingyan.baidu.com/article/3ea51489bb18e152e71bba76.html</a></p>
<p><a href="https://www.cnblogs.com/lolybj/p/9738946.html" target="_blank">https://www.cnblogs.com/lolybj/p/9738946.html</a></p>
<p><a href="https://www.iteye.com/blog/bijian1013-2288225" target="_blank">https://www.iteye.com/blog/bijian1013-2288225</a></p>
<p><a href="https://blog.csdn.net/crazylai1996/article/details/84900818" target="_blank">https://blog.csdn.net/crazylai1996/article/details/84900818</a></p>
<p><a href="https://blog.csdn.net/lixpjita39/article/details/79383957" target="_blank">https://blog.csdn.net/lixpjita39/article/details/79383957</a></p>
<p><a href="https://www.cnblogs.com/jingmoxukong/p/6098351.html" target="_blank">https://www.cnblogs.com/jingmoxukong/p/6098351.html</a></p>
</div></template>


