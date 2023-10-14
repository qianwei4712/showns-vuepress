<template><div><div class="catalog">
<ul>
<li><a href="#t0">JVM 介绍</a></li>
<li><a href="#t1">Java 字节码文件</a>
<ul>
<li><a href="#t11">字节码文件结构</a></li>
<li><a href="#t12">反编译字节码文件</a></li>
</ul>
</li>
<li><a href="#te">参考文章</a></li>
</ul>
</div>
<h2 id="jvm-介绍" tabindex="-1"><a class="header-anchor" href="#jvm-介绍" aria-hidden="true">#</a> <span id="t0">JVM 介绍</span></h2>
<p>众所周知，Java 是运行在 Java 虚拟机上的，.<code v-pre>java</code> 文件只有编译成为 <code v-pre>.class</code> 文件才能在虚拟机上运行。那么这个虚拟机又是什么？</p>
<blockquote>
<p><strong><font color="red">在 CPU 层面，计算机是由一个个指令汇聚而成的，虚拟机就是将识别字节码文件，并将其转换为指令运行。</font></strong></p>
</blockquote>
<p>Oracle 发布了一般又一般的 Java 和 JVM 规范，虚拟机就是遵循这个规范运行。</p>
<p>规范的话全英文的，我是看不懂，有兴趣自己取：<a href="https://docs.oracle.com/javase/specs/index.html" target="_blank">https://docs.oracle.com/javase/specs/index.html</a></p>
<blockquote>
<p><strong>既然 JVM 存在公开规范，那就说明，它不单单只支持 JAVA，并且，JVM 也不是唯一的。</strong></p>
</blockquote>
<p>我们平时认识最多的，应该是 HotSpot ，这是最广泛的 Java 虚拟机。比如查看 java 版本就能发现它</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">java</span> version <span class="token string">"11.0.8"</span> <span class="token number">2020</span>-07-14 LTS
Java<span class="token punctuation">(</span>TM<span class="token punctuation">)</span> SE Runtime Environment <span class="token number">18.9</span> <span class="token punctuation">(</span>build <span class="token number">11.0</span>.8+10-LTS<span class="token punctuation">)</span>
Java HotSpot<span class="token punctuation">(</span>TM<span class="token punctuation">)</span> <span class="token number">64</span>-Bit Server VM <span class="token number">18.9</span> <span class="token punctuation">(</span>build <span class="token number">11.0</span>.8+10-LTS, mixed mode<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>不同的代码在编译器下可以编译成相同的字节码，字节码也可以在不同的 JVM 上运行。</p>
<p>虚拟机的区别不会详细研究，都是遵循 JVM 规范，也没有多大区别，并且我们也不会去更改。</p>
<br>
<p>然后就是另一个角度，不同代码可以在同一个 JVM 上运行，如下图：</p>
<p><img src="http://shiva.oss-cn-hangzhou.aliyuncs.com/data/java/JVM、字节码、编译器的关系.png" alt="JVM、字节码、编译器的关系.png"></p>
<p>虚拟机不关心代码，只要编译成的字节码符合规范，它就能运行。</p>
<br>
<h2 id="java-字节码文件" tabindex="-1"><a class="header-anchor" href="#java-字节码文件" aria-hidden="true">#</a> <span id="t1">Java 字节码文件</span></h2>
<p>对 Java 而言，获得 <code v-pre>.class</code> 字节码文件需要通过 <code v-pre>javac</code> 编译器，因为在执行的时候，存在对字节码的第二次编译，所以 <code v-pre>javac</code> 编译器也成为前端编译。</p>
<p>先从 <code v-pre>Hello World</code> 开始。。</p>
<div class="language-java line-numbers-mode" data-ext="java"><pre v-pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">JvmTest1</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"Hello World!"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这么一段代码，编译后的 class 文件打开后这样的：</p>
<div class="language-pseudocode line-numbers-mode" data-ext="pseudocode"><pre v-pre class="language-pseudocode"><code>cafe babe 0000 0034 0022 0a00 0600 1409
0015 0016 0800 170a 0018 0019 0700 1a07
001b 0100 063c 696e 6974 3e01 0003 2829
5601 0004 436f 6465 0100 0f4c 696e 654e
756d 6265 7254 6162 6c65 0100 124c 6f63
616c 5661 7269 6162 6c65 5461 626c 6501
0004 7468 6973 0100 0e4c 6a76 6d2f 4a76
6d54 6573 7431 3b01 0004 6d61 696e 0100
1628 5b4c 6a61 7661 2f6c 616e 672f 5374
7269 6e67 3b29 5601 0004 6172 6773 0100
135b 4c6a 6176 612f 6c61 6e67 2f53 7472
696e 673b 0100 0a53 6f75 7263 6546 696c
6501 000d 4a76 6d54 6573 7431 2e6a 6176
610c 0007 0008 0700 1c0c 001d 001e 0100
0c48 656c 6c6f 2057 6f72 6c64 2107 001f
0c00 2000 2101 000c 6a76 6d2f 4a76 6d54
6573 7431 0100 106a 6176 612f 6c61 6e67
2f4f 626a 6563 7401 0010 6a61 7661 2f6c
616e 672f 5379 7374 656d 0100 036f 7574
0100 154c 6a61 7661 2f69 6f2f 5072 696e
7453 7472 6561 6d3b 0100 136a 6176 612f
696f 2f50 7269 6e74 5374 7265 616d 0100
0770 7269 6e74 6c6e 0100 1528 4c6a 6176
612f 6c61 6e67 2f53 7472 696e 673b 2956
0021 0005 0006 0000 0000 0002 0001 0007
0008 0001 0009 0000 002f 0001 0001 0000
0005 2ab7 0001 b100 0000 0200 0a00 0000
0600 0100 0000 0600 0b00 0000 0c00 0100
0000 0500 0c00 0d00 0000 0900 0e00 0f00
0100 0900 0000 3700 0200 0100 0000 09b2
0002 1203 b600 04b1 0000 0002 000a 0000
000a 0002 0000 0009 0008 000a 000b 0000
000c 0001 0000 0009 0010 0011 0000 0001
0012 0000 0002 0013
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><br>
<h3 id="字节码文件结构" tabindex="-1"><a class="header-anchor" href="#字节码文件结构" aria-hidden="true">#</a> <span id="t11">字节码文件结构</span></h3>
<blockquote>
<p>字节码文件结构是一组以 8 位字节为基础的二进制流，各数据项目严格按照顺序紧凑地排列在 Class 文件之中，中间没有添加任何分隔符。</p>
<p>在字节码结构中，有两种最基本的数据类型来表示字节码文件格式，分别是：无符号数和表。</p>
</blockquote>
<p>太复杂的东西我也没看懂，这里都是简单来说，大多数内容也就复制下。。。。</p>
<p>我们先来看一张表：</p>
<table>
<thead>
<tr>
<th style="text-align:left">类型</th>
<th>名称</th>
<th>说明</th>
<th>长度</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left">u4</td>
<td>magic</td>
<td>魔数，识别 Class 文件格式</td>
<td>4 个字节</td>
</tr>
<tr>
<td style="text-align:left">u2</td>
<td>minor_version</td>
<td>副版本号</td>
<td>2 个字节</td>
</tr>
<tr>
<td style="text-align:left">u2</td>
<td>major_version</td>
<td>主版本号</td>
<td>2 个字节</td>
</tr>
<tr>
<td style="text-align:left">u2</td>
<td>constant_pool_count</td>
<td>常量池计算器</td>
<td>2 个字节</td>
</tr>
<tr>
<td style="text-align:left">cp_info</td>
<td>constant_pool</td>
<td>常量池</td>
<td>n 个字节</td>
</tr>
<tr>
<td style="text-align:left">u2</td>
<td>access_flags</td>
<td>访问标志</td>
<td>2 个字节</td>
</tr>
<tr>
<td style="text-align:left">u2</td>
<td>this_class</td>
<td>类索引</td>
<td>2 个字节</td>
</tr>
<tr>
<td style="text-align:left">u2</td>
<td>super_class</td>
<td>父类索引</td>
<td>2 个字节</td>
</tr>
<tr>
<td style="text-align:left">u2</td>
<td>interfaces_count</td>
<td>接口计数器</td>
<td>2 个字节</td>
</tr>
<tr>
<td style="text-align:left">u2</td>
<td>interfaces</td>
<td>接口索引集合</td>
<td>2 个字节</td>
</tr>
<tr>
<td style="text-align:left">u2</td>
<td>fields_count</td>
<td>字段个数</td>
<td>2 个字节</td>
</tr>
<tr>
<td style="text-align:left">field_info</td>
<td>fields</td>
<td>字段集合</td>
<td>n 个字节</td>
</tr>
<tr>
<td style="text-align:left">u2</td>
<td>methods_count</td>
<td>方法计数器</td>
<td>2 个字节</td>
</tr>
<tr>
<td style="text-align:left">method_info</td>
<td>methods</td>
<td>方法集合</td>
<td>n 个字节</td>
</tr>
<tr>
<td style="text-align:left">u2</td>
<td>attributes_count</td>
<td>附加属性计数器</td>
<td>2 个字节</td>
</tr>
<tr>
<td style="text-align:left">attribute_info</td>
<td>attributes</td>
<td>附加属性集合</td>
<td>n 个字节</td>
</tr>
</tbody>
</table>
<p>这是一张 Java 字节码总的结构表，我们按照上面的顺序逐一进行解读就可以了。</p>
<p>详细的就算了，看看主要结构，从大佬那扒来的图：</p>
<p><img src="https://img-blog.csdnimg.cn/20200922191856568.png" alt="java-jvm-class-2"></p>
<br>
<h3 id="反编译字节码文件" tabindex="-1"><a class="header-anchor" href="#反编译字节码文件" aria-hidden="true">#</a> <span id="t12">反编译字节码文件</span></h3>
<blockquote>
<p>使用到 java 内置的一个反编译工具 javap 可以反编译字节码文件, 用法: <code v-pre>javap -v &lt;classes&gt; </code></p>
</blockquote>
<p>比如我执行后输出：</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>Classfile /E:/HolyShit/test-demos/java-new/target/classes/jvm/JvmTest1.class
  Last modified <span class="token number">2020</span>年9月22日<span class="token punctuation">;</span> size <span class="token number">536</span> bytes
  MD5 checksum 95b43cc3e4240d26e3803d3a64eda12b
  Compiled from <span class="token string">"JvmTest1.java"</span>
public class jvm.JvmTest1
  minor version: <span class="token number">0</span>
  major version: <span class="token number">52</span>
  flags: <span class="token punctuation">(</span>0x0021<span class="token punctuation">)</span> ACC_PUBLIC, ACC_SUPER
  this_class: <span class="token comment">#5                          // jvm/JvmTest1</span>
  super_class: <span class="token comment">#6                         // java/lang/Object</span>
  interfaces: <span class="token number">0</span>, fields: <span class="token number">0</span>, methods: <span class="token number">2</span>, attributes: <span class="token number">1</span>
Constant pool:
   <span class="token comment">#1 = Methodref          #6.#20         // java/lang/Object."&lt;init>":()V</span>
   <span class="token comment">#2 = Fieldref           #21.#22        // java/lang/System.out:Ljava/io/PrintStream;</span>
   <span class="token comment">#3 = String             #23            // Hello World!</span>
   <span class="token comment">#4 = Methodref          #24.#25        // java/io/PrintStream.println:(Ljava/lang/String;)V</span>
   <span class="token comment">#5 = Class              #26            // jvm/JvmTest1</span>
   <span class="token comment">#6 = Class              #27            // java/lang/Object</span>
   <span class="token comment">#7 = Utf8               &lt;init></span>
   <span class="token comment">#8 = Utf8               ()V</span>
   <span class="token comment">#9 = Utf8               Code</span>
  <span class="token comment">#10 = Utf8               LineNumberTable</span>
  <span class="token comment">#11 = Utf8               LocalVariableTable</span>
  <span class="token comment">#12 = Utf8               this</span>
  <span class="token comment">#13 = Utf8               Ljvm/JvmTest1;</span>
  <span class="token comment">#14 = Utf8               main</span>
  <span class="token comment">#15 = Utf8               ([Ljava/lang/String;)V</span>
  <span class="token comment">#16 = Utf8               args</span>
  <span class="token comment">#17 = Utf8               [Ljava/lang/String;</span>
  <span class="token comment">#18 = Utf8               SourceFile</span>
  <span class="token comment">#19 = Utf8               JvmTest1.java</span>
  <span class="token comment">#20 = NameAndType        #7:#8          // "&lt;init>":()V</span>
  <span class="token comment">#21 = Class              #28            // java/lang/System</span>
  <span class="token comment">#22 = NameAndType        #29:#30        // out:Ljava/io/PrintStream;</span>
  <span class="token comment">#23 = Utf8               Hello World!</span>
  <span class="token comment">#24 = Class              #31            // java/io/PrintStream</span>
  <span class="token comment">#25 = NameAndType        #32:#33        // println:(Ljava/lang/String;)V</span>
  <span class="token comment">#26 = Utf8               jvm/JvmTest1</span>
  <span class="token comment">#27 = Utf8               java/lang/Object</span>
  <span class="token comment">#28 = Utf8               java/lang/System</span>
  <span class="token comment">#29 = Utf8               out</span>
  <span class="token comment">#30 = Utf8               Ljava/io/PrintStream;</span>
  <span class="token comment">#31 = Utf8               java/io/PrintStream</span>
  <span class="token comment">#32 = Utf8               println</span>
  <span class="token comment">#33 = Utf8               (Ljava/lang/String;)V</span>
<span class="token punctuation">{</span>
  public jvm.JvmTest1<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    descriptor: <span class="token punctuation">(</span><span class="token punctuation">)</span>V
    flags: <span class="token punctuation">(</span>0x0001<span class="token punctuation">)</span> ACC_PUBLIC
    Code:
      <span class="token assign-left variable">stack</span><span class="token operator">=</span><span class="token number">1</span>, <span class="token assign-left variable">locals</span><span class="token operator">=</span><span class="token number">1</span>, <span class="token assign-left variable">args_size</span><span class="token operator">=</span><span class="token number">1</span>
         <span class="token number">0</span>: aload_0
         <span class="token number">1</span>: invokespecial <span class="token comment">#1                  // Method java/lang/Object."&lt;init>":()V</span>
         <span class="token number">4</span>: <span class="token builtin class-name">return</span>
      LineNumberTable:
        line <span class="token number">6</span>: <span class="token number">0</span>
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            <span class="token number">0</span>       <span class="token number">5</span>     <span class="token number">0</span>  this   Ljvm/JvmTest1<span class="token punctuation">;</span>

  public static void main<span class="token punctuation">(</span>java.lang.String<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    descriptor: <span class="token punctuation">(</span><span class="token punctuation">[</span>Ljava/lang/String<span class="token punctuation">;</span><span class="token punctuation">)</span>V
    flags: <span class="token punctuation">(</span>0x0009<span class="token punctuation">)</span> ACC_PUBLIC, ACC_STATIC
    Code:
      <span class="token assign-left variable">stack</span><span class="token operator">=</span><span class="token number">2</span>, <span class="token assign-left variable">locals</span><span class="token operator">=</span><span class="token number">1</span>, <span class="token assign-left variable">args_size</span><span class="token operator">=</span><span class="token number">1</span>
         <span class="token number">0</span>: getstatic     <span class="token comment">#2    // Field java/lang/System.out:Ljava/io/PrintStream;</span>
         <span class="token number">3</span>: ldc           <span class="token comment">#3    // String Hello World!</span>
         <span class="token number">5</span>: invokevirtual <span class="token comment">#4    // Method java/io/PrintStream.println:(Ljava/lang/String;)V</span>
         <span class="token number">8</span>: <span class="token builtin class-name">return</span>
      LineNumberTable:
        line <span class="token number">8</span>: <span class="token number">0</span>
        line <span class="token number">9</span>: <span class="token number">8</span>
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            <span class="token number">0</span>       <span class="token number">9</span>     <span class="token number">0</span>  args   <span class="token punctuation">[</span>Ljava/lang/String<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
SourceFile: <span class="token string">"JvmTest1.java"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>看看就好了，太多知识性内容我也写不完。。。凑个字数</p>
<br>
<h2 id="参考文章" tabindex="-1"><a class="header-anchor" href="#参考文章" aria-hidden="true">#</a> <span id="te">参考文章</span></h2>
<p><a href="https://www.cnblogs.com/chanshuyi/p/jvm_serial_02_the_history_of_jvm.html
" target="_blank">https://www.cnblogs.com/chanshuyi/p/jvm_serial_02_the_history_of_jvm.html
</a></p>
<p><a href="https://www.pdai.tech/md/java/jvm/java-jvm-class.html
" target="_blank">https://www.pdai.tech/md/java/jvm/java-jvm-class.html
</a></p>
<p><a href="https://www.cnblogs.com/chanshuyi/p/jvm_serial_05_jvm_bytecode_analysis.html
" target="_blank">https://www.cnblogs.com/chanshuyi/p/jvm_serial_05_jvm_bytecode_analysis.html
</a></p>
<p><a href="https://blog.csdn.net/u011810352/article/details/80316870
" target="_blank">https://blog.csdn.net/u011810352/article/details/80316870
</a></p>
<p><a href="https://blog.csdn.net/weelyy/article/details/78969412
" target="_blank">https://blog.csdn.net/weelyy/article/details/78969412
</a></p>
<p><a href="https://www.jianshu.com/p/e713defb5afc
" target="_blank">https://www.jianshu.com/p/e713defb5afc
</a></p>
<p><a href="https://www.cnblogs.com/fx-blog/p/11982275.html
" target="_blank">https://www.cnblogs.com/fx-blog/p/11982275.html
</a></p>
</div></template>


