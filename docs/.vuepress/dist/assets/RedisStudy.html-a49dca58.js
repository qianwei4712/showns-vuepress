import{_ as p,r as l,o as i,c as o,b as n,d as s,a as e,f as t}from"./app-c1e62972.js";const c={},u=t('<div class="catalog"><ul><li><a href="#%E5%BC%80%E5%9C%BA%E5%BA%9F%E8%AF%9D">开场废话</a></li><li><a href="#%E5%9F%BA%E7%A1%80%E7%9F%A5%E8%AF%86">Redis 基础知识</a></li><li><a href="#%E5%B8%B8%E8%A7%81%E9%85%8D%E7%BD%AE">Redis 常见配置</a></li><li><a href="#%E5%BA%94%E7%94%A8%E6%A1%88%E4%BE%8B">Redis 应用案例</a><ul><li><a href="#%E6%B6%88%E6%81%AF%E9%98%9F%E5%88%97">消息队列</a></li><li><a href="#%E8%AE%A1%E6%95%B0%E5%99%A8%E5%BA%94%E7%94%A8">计数器应用</a></li><li><a href="#%E6%8E%92%E5%BA%8F%E9%98%9F%E5%88%97">排序队列</a></li></ul></li><li><a href="#%E5%B8%B8%E8%A7%81%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88">常见解决方案</a><ul><li><a href="#%E6%95%B0%E6%8D%AE%E6%8C%81%E4%B9%85%E5%8C%96">数据持久化</a></li><li><a href="#%E5%88%86%E5%B8%83%E5%BC%8F%E9%94%81">基于Redis的分布式锁</a></li><li><a href="#%E5%B8%B8%E8%A7%81%E5%91%BD%E4%BB%A4%E6%A3%80%E7%B4%A2%E8%A1%A8">常见命令检索表</a></li></ul></li><li><a href="#te">参考文章</a></li></ul></div><h2 id="开场废话" tabindex="-1"><a class="header-anchor" href="#开场废话" aria-hidden="true">#</a> <span id="开场废话">开场废话</span></h2><p><code>2022.08.12</code></p><p>Redis 这个系列学习，我打算通过场景案例来写这一篇，说不定以后会遇到特定场景来找解决方案。</p><p>所以这一篇应该不会有什么技术深度。</p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/7084eeab8b7c203d4b0ae905323415bd.jpg" style="zoom:50%;">',6),r={href:"http://redis.cn/",target:"_blank",rel:"noopener noreferrer"},d={href:"https://gitee.com/learning-use-cases/demo4j-of-first/tree/master/redis-unit",target:"_blank",rel:"noopener noreferrer"},k=t('<br><h2 id="redis-基础知识" tabindex="-1"><a class="header-anchor" href="#redis-基础知识" aria-hidden="true">#</a> <span id="基础知识">Redis 基础知识</span></h2><h3 id="数据结构" tabindex="-1"><a class="header-anchor" href="#数据结构" aria-hidden="true">#</a> 数据结构</h3>',3),m={href:"http://redis.cn/topics/data-types-intro.html#strings",target:"_blank",rel:"noopener noreferrer"},v=t('<ul><li>二进制安全的字符串</li><li>Lists: 按插入顺序排序的字符串元素的集合。他们基本上就是<em>链表（linked lists）</em>。</li><li>Sets: 不重复且无序的字符串元素的集合。</li><li>Sorted sets,类似Sets,但是每个字符串元素都关联到一个叫<em>score</em>浮动数值（floating number value）。里面的元素总是通过score进行着排序，所以不同的是，它是可以检索的一系列元素。（例如你可能会问：给我前面10个或者后面10个元素）。</li><li>Hashes,由field和关联的value组成的map。field和value都是字符串的。这和Ruby、Python的hashes很像。</li><li>Bit arrays (或者说 simply bitmaps): 通过特殊的命令，你可以将 String 值当作一系列 bits 处理：可以设置和清除单独的 bits，数出所有设为 1 的 bits 的数量，找到最前的被设为 1 或 0 的 bit，等等。</li><li>HyperLogLogs: 这是被用于估计一个 set 中元素数量的概率性的数据结构。别害怕，它比看起来的样子要简单…参见本教程的 HyperLogLog 部分</li></ul><br><h3 id="使用注意" tabindex="-1"><a class="header-anchor" href="#使用注意" aria-hidden="true">#</a> 使用注意</h3><ul><li><p>键值不要太长：不仅因为消耗内存，而且在数据中查找这类键值的计算成本很高</p></li><li><p>为防止在分布式系统中，key被覆盖的情况：</p></li></ul><blockquote><p><strong>Key 的设置方式： 业务名+对象名+id+属性</strong></p></blockquote><br><h3 id="连接工具类" tabindex="-1"><a class="header-anchor" href="#连接工具类" aria-hidden="true">#</a> 连接工具类</h3><p>在 Java 中常见的 Redis 连接工具就两种，RedisTemplate 和 jedis；</p><ul><li>jedis 是 Redis 官方推荐的工具；而 RedisTemplate 是 SpringDataRedis 对 JedisApi 的封装；</li><li>原生jedis 效率优于 redisTemplate，速度差不多在3倍；但是 RedisTemplate 在 Spring 中配置简单易用；</li><li><strong>性能要求不高的情况下，推荐 RedisTemplate</strong>，现在的小应用都是 SpringBoot 开发，使用方便兼容好。</li></ul>',9),b={href:"https://www.cnblogs.com/z-sir/p/13664221.html",target:"_blank",rel:"noopener noreferrer"},g=t(`<br><h2 id="redis-常见配置" tabindex="-1"><a class="header-anchor" href="#redis-常见配置" aria-hidden="true">#</a> <span id="常见配置">Redis 常见配置</span></h2><div class="language-properties line-numbers-mode" data-ext="properties"><pre class="language-properties"><code><span class="token comment">#是否在后台执行，yes：后台运行；no：不是后台运行</span>
<span class="token key attr-name"> daemonize</span> <span class="token value attr-value">yes</span>
  
<span class="token comment"> #是否开启保护模式，默认开启。要是配置里没有指定bind和密码。开启该参数后，redis只会本地进行访问，拒绝外部访问。</span>
<span class="token key attr-name"> protected-mode</span> <span class="token value attr-value">yes</span>
  
<span class="token comment"> #redis的进程文件</span>
<span class="token key attr-name"> pidfile</span> <span class="token value attr-value">/var/run/redis/redis-server.pid</span>
  
<span class="token comment"> #redis监听的端口号。</span>
<span class="token key attr-name"> port</span> <span class="token value attr-value">6379</span>
  
<span class="token comment"> #此参数确定了TCP连接中已完成队列(完成三次握手之后)的长度， 当然此值必须不大于Linux系统定义的/proc/sys/net/core/somaxconn值，默认是511，而Linux的默认参数值是128。当系统并发量大并且客户端速度缓慢的时候，可以将这二个参数一起参考设定。该内核参数默认值一般是128，对于负载很大的服务程序来说大大的不够。一般会将它修改为2048或者更大。在/etc/sysctl.conf中添加:net.core.somaxconn = 2048，然后在终端中执行sysctl -p。</span>
<span class="token key attr-name"> tcp-backlog</span> <span class="token value attr-value">511</span>
  
<span class="token comment"> #指定 redis 只接收来自于该 IP 地址的请求，如果不进行设置，那么将处理所有请求</span>
<span class="token comment"> #bind 127.0.0.1</span>
<span class="token key attr-name"> bind</span> <span class="token value attr-value">0.0.0.0</span>
  
<span class="token comment"> #配置unix socket来让redis支持监听本地连接。</span>
<span class="token comment"> # unixsocket /var/run/redis/redis.sock</span>
  
<span class="token comment"> #配置unix socket使用文件的权限</span>
<span class="token comment"> # unixsocketperm 700</span>
  
<span class="token comment"> # 此参数为设置客户端空闲超过timeout，服务端会断开连接，为0则服务端不会主动断开连接，不能小于0。</span>
<span class="token key attr-name"> timeout</span> <span class="token value attr-value">0</span>
  
<span class="token comment"> #tcp keepalive参数。如果设置不为0，就使用配置tcp的SO_KEEPALIVE值，使用keepalive有两个好处:检测挂掉的对端。降低中间设备出问题而导致网络看似连接却已经与对端端口的问题。在Linux内核中，设置了keepalive，redis会定时给对端发送ack。检测到对端关闭需要两倍的设置值。</span>
<span class="token key attr-name"> tcp-keepalive</span> <span class="token value attr-value">0</span>
  
<span class="token comment"> #指定了服务端日志的级别。级别包括：debug（很多信息，方便开发、测试），verbose（许多有用的信息，但是没有debug级别信息多），notice（适当的日志级别，适合生产环境），warn（只有非常重要的信息）</span>
<span class="token key attr-name"> loglevel</span> <span class="token value attr-value">notice</span>
  
<span class="token comment"> #指定了记录日志的文件。空字符串的话，日志会打印到标准输出设备。后台运行的redis标准输出是/dev/null。</span>
<span class="token key attr-name"> logfile</span> <span class="token value attr-value">/var/log/redis/redis-server.log</span>
  
<span class="token comment"> #是否打开记录syslog功能</span>
<span class="token comment"> # syslog-enabled no</span>
  
<span class="token comment"> #syslog的标识符。</span>
<span class="token comment"> # syslog-ident redis</span>
  
<span class="token comment"> #日志的来源、设备</span>
<span class="token comment"> # syslog-facility local0</span>
  
<span class="token comment"> #数据库的数量，默认使用的数据库是DB 0。可以通过SELECT命令选择一个db</span>
<span class="token key attr-name"> databases</span> <span class="token value attr-value">16</span>
  
<span class="token comment"> # redis是基于内存的数据库，可以通过设置该值定期写入磁盘。</span>
<span class="token comment"> # 注释掉“save”这一行配置项就可以让保存数据库功能失效</span>
<span class="token comment"> # 900秒（15分钟）内至少1个key值改变（则进行数据库保存--持久化） </span>
<span class="token comment"> # 300秒（5分钟）内至少10个key值改变（则进行数据库保存--持久化） </span>
<span class="token comment"> # 60秒（1分钟）内至少10000个key值改变（则进行数据库保存--持久化）</span>
<span class="token key attr-name"> save</span> <span class="token value attr-value">900 1</span>
<span class="token key attr-name"> save</span> <span class="token value attr-value">300 10</span>
<span class="token key attr-name"> save</span> <span class="token value attr-value">60 10000</span>
  
<span class="token comment"> #当RDB持久化出现错误后，是否依然进行继续进行工作，yes：不能进行工作，no：可以继续进行工作，可以通过info中的rdb_last_bgsave_status了解RDB持久化是否有错误</span>
<span class="token key attr-name"> stop-writes-on-bgsave-error</span> <span class="token value attr-value">yes</span>
  
<span class="token comment"> #使用压缩rdb文件，rdb文件压缩使用LZF压缩算法，yes：压缩，但是需要一些cpu的消耗。no：不压缩，需要更多的磁盘空间</span>
<span class="token key attr-name"> rdbcompression</span> <span class="token value attr-value">yes</span>
  
<span class="token comment"> #是否校验rdb文件。从rdb格式的第五个版本开始，在rdb文件的末尾会带上CRC64的校验和。这跟有利于文件的容错性，但是在保存rdb文件的时候，会有大概10%的性能损耗，所以如果你追求高性能，可以关闭该配置。</span>
<span class="token key attr-name"> rdbchecksum</span> <span class="token value attr-value">yes</span>
  
<span class="token comment"> #rdb文件的名称</span>
<span class="token key attr-name"> dbfilename</span> <span class="token value attr-value">dump.rdb</span>
  
<span class="token comment"> #数据目录，数据库的写入会在这个目录。rdb、aof文件也会写在这个目录</span>
<span class="token key attr-name"> dir</span> <span class="token value attr-value">/var/lib/redis</span>
  
  
<span class="token comment"> ############### 主从复制 ###############</span>
  
<span class="token comment"> #复制选项，slave复制对应的master。</span>
<span class="token comment"> # slaveof &lt;masterip&gt; &lt;masterport&gt;</span>
  
<span class="token comment"> #如果master设置了requirepass，那么slave要连上master，需要有master的密码才行。masterauth就是用来配置master的密码，这样可以在连上master后进行认证。</span>
<span class="token comment"> # masterauth &lt;master-password&gt;</span>
  
<span class="token comment"> #当从库同主机失去连接或者复制正在进行，从机库有两种运行方式：1) 如果slave-serve-stale-data设置为yes(默认设置)，从库会继续响应客户端的请求。2) 如果slave-serve-stale-data设置为no，除去INFO和SLAVOF命令之外的任何请求都会返回一个错误”SYNC with master in progress”。</span>
<span class="token key attr-name"> slave-serve-stale-data</span> <span class="token value attr-value">yes</span>
  
<span class="token comment"> #作为从服务器，默认情况下是只读的（yes），可以修改成NO，用于写（不建议）。</span>
<span class="token key attr-name"> slave-read-only</span> <span class="token value attr-value">yes</span>
  
<span class="token comment"> #是否使用socket方式复制数据。目前redis复制提供两种方式，disk和socket。如果新的slave连上来或者重连的slave无法部分同步，就会执行全量同步，master会生成rdb文件。有2种方式：disk方式是master创建一个新的进程把rdb文件保存到磁盘，再把磁盘上的rdb文件传递给slave。socket是master创建一个新的进程，直接把rdb文件以socket的方式发给slave。disk方式的时候，当一个rdb保存的过程中，多个slave都能共享这个rdb文件。socket的方式就的一个个slave顺序复制。在磁盘速度缓慢，网速快的情况下推荐用socket方式。</span>
<span class="token key attr-name"> repl-diskless-sync</span> <span class="token value attr-value">no</span>
  
<span class="token comment"> #diskless复制的延迟时间，防止设置为0。一旦复制开始，节点不会再接收新slave的复制请求直到下一个rdb传输。所以最好等待一段时间，等更多的slave连上来。</span>
<span class="token key attr-name"> repl-diskless-sync-delay</span> <span class="token value attr-value">5</span>
  
<span class="token comment"> #slave根据指定的时间间隔向服务器发送ping请求。时间间隔可以通过 repl_ping_slave_period 来设置，默认10秒。</span>
<span class="token comment"> # repl-ping-slave-period 10</span>
  
<span class="token comment"> #复制连接超时时间。master和slave都有超时时间的设置。master检测到slave上次发送的时间超过repl-timeout，即认为slave离线，清除该slave信息。slave检测到上次和master交互的时间超过repl-timeout，则认为master离线。需要注意的是repl-timeout需要设置一个比repl-ping-slave-period更大的值，不然会经常检测到超时。</span>
<span class="token comment"> # repl-timeout 60</span>
  
<span class="token comment"> #是否禁止复制tcp链接的tcp nodelay参数，可传递yes或者no。默认是no，即使用tcp nodelay。如果master设置了yes来禁止tcp nodelay设置，在把数据复制给slave的时候，会减少包的数量和更小的网络带宽。但是这也可能带来数据的延迟。默认我们推荐更小的延迟，但是在数据量传输很大的场景下，建议选择yes。</span>
<span class="token key attr-name"> repl-disable-tcp-nodelay</span> <span class="token value attr-value">no</span>
  
<span class="token comment"> #复制缓冲区大小，这是一个环形复制缓冲区，用来保存最新复制的命令。这样在slave离线的时候，不需要完全复制master的数据，如果可以执行部分同步，只需要把缓冲区的部分数据复制给slave，就能恢复正常复制状态。缓冲区的大小越大，slave离线的时间可以更长，复制缓冲区只有在有slave连接的时候才分配内存。没有slave的一段时间，内存会被释放出来，默认1m。</span>
<span class="token comment"> # repl-backlog-size 5mb</span>
  
<span class="token comment"> #master没有slave一段时间会释放复制缓冲区的内存，repl-backlog-ttl用来设置该时间长度。单位为秒。</span>
<span class="token comment"> # repl-backlog-ttl 3600</span>
  
<span class="token comment"> #当master不可用，Sentinel会根据slave的优先级选举一个master。最低的优先级的slave，当选master。而配置成0，永远不会被选举。</span>
<span class="token key attr-name"> slave-priority</span> <span class="token value attr-value">100</span>
  
<span class="token comment"> #redis提供了可以让master停止写入的方式，如果配置了min-slaves-to-write，健康的slave的个数小于N，mater就禁止写入。master最少得有多少个健康的slave存活才能执行写命令。这个配置虽然不能保证N个slave都一定能接收到master的写操作，但是能避免没有足够健康的slave的时候，master不能写入来避免数据丢失。设置为0是关闭该功能。</span>
<span class="token comment"> # min-slaves-to-write 3</span>
  
<span class="token comment"> #延迟小于min-slaves-max-lag秒的slave才认为是健康的slave。</span>
<span class="token comment"> # min-slaves-max-lag 10</span>
  
<span class="token comment"> # 设置1或另一个设置为0禁用这个特性。</span>
<span class="token comment"> # Setting one or the other to 0 disables the feature.</span>
<span class="token comment"> # By default min-slaves-to-write is set to 0 (feature disabled) and</span>
<span class="token comment"> # min-slaves-max-lag is set to 10.</span>
  
  
<span class="token comment"> ############### 安全相关 ###############</span>
  
<span class="token comment"> #requirepass配置可以让用户使用AUTH命令来认证密码，才能使用其他命令。这让redis可以使用在不受信任的网络中。为了保持向后的兼容性，可以注释该命令，因为大部分用户也不需要认证。使用requirepass的时候需要注意，因为redis太快了，每秒可以认证15w次密码，简单的密码很容易被攻破，所以最好使用一个更复杂的密码。注意只有密码没有用户名。</span>
<span class="token comment"> # requirepass foobared</span>
  
<span class="token comment"> #把危险的命令给修改成其他名称。比如CONFIG命令可以重命名为一个很难被猜到的命令，这样用户不能使用，而内部工具还能接着使用。</span>
<span class="token comment"> # rename-command CONFIG b840fc02d524045429941cc15f59e41cb7be6c52</span>
  
<span class="token comment"> #设置成一个空的值，可以禁止一个命令</span>
<span class="token comment"> # rename-command CONFIG &quot;&quot;</span>
  
  
<span class="token comment"> ############### 进程限制相关 ###############</span>
  
<span class="token comment"> # 设置能连上redis的最大客户端连接数量。默认是10000个客户端连接。由于redis不区分连接是客户端连接还是内部打开文件或者和slave连接等，所以maxclients最小建议设置到32。如果超过了maxclients，redis会给新的连接发送’max number of clients reached’，并关闭连接。</span>
<span class="token comment"> # maxclients 10000</span>
  
<span class="token comment"> #redis配置的最大内存容量。当内存满了，需要配合maxmemory-policy策略进行处理。注意slave的输出缓冲区是不计算在maxmemory内的。所以为了防止主机内存使用完，建议设置的maxmemory需要更小一些。</span>
<span class="token comment"> # maxmemory &lt;bytes&gt;</span>
  
<span class="token comment"> #内存容量超过maxmemory后的处理策略。</span>
<span class="token comment"> #volatile-lru：利用LRU算法移除设置过过期时间的key。</span>
<span class="token comment"> #volatile-random：随机移除设置过过期时间的key。</span>
<span class="token comment"> #volatile-ttl：移除即将过期的key，根据最近过期时间来删除（辅以TTL）</span>
<span class="token comment"> #allkeys-lru：利用LRU算法移除任何key。</span>
<span class="token comment"> #allkeys-random：随机移除任何key。</span>
<span class="token comment"> #noeviction：不移除任何key，只是返回一个写错误。</span>
<span class="token comment"> #上面的这些驱逐策略，如果redis没有合适的key驱逐，对于写命令，还是会返回错误。redis将不再接收写请求，只接收get请求。写命令包括：set setnx setex append incr decr rpush lpush rpushx lpushx linsert lset rpoplpush sadd sinter sinterstore sunion sunionstore sdiff sdiffstore zadd zincrby zunionstore zinterstore hset hsetnx hmset hincrby incrby decrby getset mset msetnx exec sort。</span>
<span class="token comment"> # maxmemory-policy noeviction</span>
  
<span class="token comment"> #lru检测的样本数。使用lru或者ttl淘汰算法，从需要淘汰的列表中随机选择sample个key，选出闲置时间最长的key移除。</span>
<span class="token comment"> # maxmemory-samples 5</span>
  
  
<span class="token comment"> ############### APPEND ONLY 持久化方式 ###############</span>
  
<span class="token comment"> #默认redis使用的是rdb方式持久化，这种方式在许多应用中已经足够用了。但是redis如果中途宕机，会导致可能有几分钟的数据丢失，根据save来策略进行持久化，Append Only File是另一种持久化方式，可以提供更好的持久化特性。Redis会把每次写入的数据在接收后都写入 appendonly.aof 文件，每次启动时Redis都会先把这个文件的数据读入内存里，先忽略RDB文件。</span>
<span class="token key attr-name"> appendonly</span> <span class="token value attr-value">no</span>
  
<span class="token comment"> #aof文件名</span>
<span class="token key attr-name"> appendfilename</span> <span class="token value attr-value">&quot;appendonly.aof&quot;</span>
  
<span class="token comment"> #aof持久化策略的配置</span>
<span class="token comment"> #no表示不执行fsync，由操作系统保证数据同步到磁盘，速度最快。</span>
<span class="token comment"> #always表示每次写入都执行fsync，以保证数据同步到磁盘。</span>
<span class="token comment"> #everysec表示每秒执行一次fsync，可能会导致丢失这1s数据。</span>
<span class="token key attr-name"> appendfsync</span> <span class="token value attr-value">everysec</span>
  
<span class="token comment"> # 在aof重写或者写入rdb文件的时候，会执行大量IO，此时对于everysec和always的aof模式来说，执行fsync会造成阻塞过长时间，no-appendfsync-on-rewrite字段设置为默认设置为no。如果对延迟要求很高的应用，这个字段可以设置为yes，否则还是设置为no，这样对持久化特性来说这是更安全的选择。设置为yes表示rewrite期间对新写操作不fsync,暂时存在内存中,等rewrite完成后再写入，默认为no，建议yes。Linux的默认fsync策略是30秒。可能丢失30秒数据。</span>
<span class="token key attr-name"> no-appendfsync-on-rewrite</span> <span class="token value attr-value">no</span>
  
<span class="token comment"> #aof自动重写配置。当目前aof文件大小超过上一次重写的aof文件大小的百分之多少进行重写，即当aof文件增长到一定大小的时候Redis能够调用bgrewriteaof对日志文件进行重写。当前AOF文件大小是上次日志重写得到AOF文件大小的二倍（设置为100）时，自动启动新的日志重写过程。</span>
<span class="token key attr-name"> auto-aof-rewrite-percentage</span> <span class="token value attr-value">100</span>
<span class="token comment"> #设置允许重写的最小aof文件大小，避免了达到约定百分比但尺寸仍然很小的情况还要重写</span>
<span class="token key attr-name"> auto-aof-rewrite-min-size</span> <span class="token value attr-value">64mb</span>
  
<span class="token comment"> #aof文件可能在尾部是不完整的，当redis启动的时候，aof文件的数据被载入内存。重启可能发生在redis所在的主机操作系统宕机后，尤其在ext4文件系统没有加上data=ordered选项（redis宕机或者异常终止不会造成尾部不完整现象。）出现这种现象，可以选择让redis退出，或者导入尽可能多的数据。如果选择的是yes，当截断的aof文件被导入的时候，会自动发布一个log给客户端然后load。如果是no，用户必须手动redis-check-aof修复AOF文件才可以。</span>
<span class="token key attr-name"> aof-load-truncated</span> <span class="token value attr-value">yes</span>
  
  
<span class="token comment"> ############### LUA SCRIPTING ###############</span>
  
<span class="token comment"> # 如果达到最大时间限制（毫秒），redis会记个log，然后返回error。当一个脚本超过了最大时限。只有SCRIPT KILL和SHUTDOWN NOSAVE可以用。第一个可以杀没有调write命令的东西。要是已经调用了write，只能用第二个命令杀。</span>
<span class="token key attr-name"> lua-time-limit</span> <span class="token value attr-value">5000</span>
  
  
<span class="token comment"> ############### 集群相关 ###############</span>
  
<span class="token comment"> #集群开关，默认是不开启集群模式。</span>
<span class="token comment"> # cluster-enabled yes</span>
  
<span class="token comment"> #集群配置文件的名称，每个节点都有一个集群相关的配置文件，持久化保存集群的信息。这个文件并不需要手动配置，这个配置文件有Redis生成并更新，每个Redis集群节点需要一个单独的配置文件，请确保与实例运行的系统中配置文件名称不冲突</span>
<span class="token comment"> # cluster-config-file nodes-6379.conf</span>
  
<span class="token comment"> #节点互连超时的阀值。集群节点超时毫秒数</span>
<span class="token comment"> # cluster-node-timeout 15000</span>
  
<span class="token comment"> #在进行故障转移的时候，全部slave都会请求申请为master，但是有些slave可能与master断开连接一段时间了，导致数据过于陈旧，这样的slave不应该被提升为master。该参数就是用来判断slave节点与master断线的时间是否过长。判断方法是：</span>
<span class="token comment"> #比较slave断开连接的时间和(node-timeout * slave-validity-factor) + repl-ping-slave-period</span>
<span class="token comment"> #如果节点超时时间为三十秒, 并且slave-validity-factor为10,假设默认的repl-ping-slave-period是10秒，即如果超过310秒slave将不会尝试进行故障转移 </span>
<span class="token comment"> # cluster-slave-validity-factor 10</span>
  
<span class="token comment"> #master的slave数量大于该值，slave才能迁移到其他孤立master上，如这个参数若被设为2，那么只有当一个主节点拥有2 个可工作的从节点时，它的一个从节点会尝试迁移。</span>
<span class="token comment"> # cluster-migration-barrier 1</span>
  
<span class="token comment"> #默认情况下，集群全部的slot有节点负责，集群状态才为ok，才能提供服务。设置为no，可以在slot没有全部分配的时候提供服务。不建议打开该配置，这样会造成分区的时候，小分区的master一直在接受写请求，而造成很长时间数据不一致。</span>
<span class="token comment"> # cluster-require-full-coverage yes</span>
  
  
<span class="token comment"> ############### SLOW LOG 慢查询日志 ###############</span>
  
<span class="token comment"> ###slog log是用来记录redis运行中执行比较慢的命令耗时。当命令的执行超过了指定时间，就记录在slow log中，slog log保存在内存中，所以没有IO操作。</span>
<span class="token comment"> #执行时间比slowlog-log-slower-than大的请求记录到slowlog里面，单位是微秒，所以1000000就是1秒。注意，负数时间会禁用慢查询日志，而0则会强制记录所有命令。</span>
<span class="token key attr-name"> slowlog-log-slower-than</span> <span class="token value attr-value">10000</span>
  
<span class="token comment"> #慢查询日志长度。当一个新的命令被写进日志的时候，最老的那个记录会被删掉。这个长度没有限制。只要有足够的内存就行。你可以通过 SLOWLOG RESET 来释放内存。</span>
<span class="token key attr-name"> slowlog-max-len</span> <span class="token value attr-value">128</span>
  
<span class="token comment"> ############### 延迟监控 ###############</span>
<span class="token comment"> #延迟监控功能是用来监控redis中执行比较缓慢的一些操作，用LATENCY打印redis实例在跑命令时的耗时图表。只记录大于等于下边设置的值的操作。0的话，就是关闭监视。默认延迟监控功能是关闭的，如果你需要打开，也可以通过CONFIG SET命令动态设置。</span>
<span class="token key attr-name"> latency-monitor-threshold</span> <span class="token value attr-value">0</span>
  
<span class="token comment"> ############### EVENT NOTIFICATION 订阅通知 ###############</span>
<span class="token comment"> #键空间通知使得客户端可以通过订阅频道或模式，来接收那些以某种方式改动了 Redis 数据集的事件。因为开启键空间通知功能需要消耗一些 CPU ，所以在默认配置下，该功能处于关闭状态。</span>
<span class="token comment"> #notify-keyspace-events 的参数可以是以下字符的任意组合，它指定了服务器该发送哪些类型的通知：</span>
<span class="token comment"> ##K 键空间通知，所有通知以 __keyspace@__ 为前缀</span>
<span class="token comment"> ##E 键事件通知，所有通知以 __keyevent@__ 为前缀</span>
<span class="token comment"> ##g DEL 、 EXPIRE 、 RENAME 等类型无关的通用命令的通知</span>
<span class="token comment"> ##$ 字符串命令的通知</span>
<span class="token comment"> ##l 列表命令的通知</span>
<span class="token comment"> ##s 集合命令的通知</span>
<span class="token comment"> ##h 哈希命令的通知</span>
<span class="token comment"> ##z 有序集合命令的通知</span>
<span class="token comment"> ##x 过期事件：每当有过期键被删除时发送</span>
<span class="token comment"> ##e 驱逐(evict)事件：每当有键因为 maxmemory 政策而被删除时发送</span>
<span class="token comment"> ##A 参数 g$lshzxe 的别名</span>
<span class="token comment"> #输入的参数中至少要有一个 K 或者 E，否则的话，不管其余的参数是什么，都不会有任何 通知被分发。详细使用可以参考http://redis.io/topics/notifications</span>
<span class="token key attr-name"> notify-keyspace-events</span> <span class="token value attr-value">&quot;&quot;</span>
  
<span class="token comment"> ############### ADVANCED CONFIG 高级配置 ###############</span>
<span class="token comment"> #数据量小于等于hash-max-ziplist-entries的用ziplist，大于hash-max-ziplist-entries用hash</span>
<span class="token key attr-name"> hash-max-ziplist-entries</span> <span class="token value attr-value">512</span>
<span class="token comment"> #value大小小于等于hash-max-ziplist-value的用ziplist，大于hash-max-ziplist-value用hash。</span>
<span class="token key attr-name"> hash-max-ziplist-value</span> <span class="token value attr-value">64</span>
  
<span class="token comment"> #数据量小于等于list-max-ziplist-entries用ziplist，大于list-max-ziplist-entries用list。</span>
<span class="token key attr-name"> list-max-ziplist-entries</span> <span class="token value attr-value">512</span>
<span class="token comment"> #value大小小于等于list-max-ziplist-value的用ziplist，大于list-max-ziplist-value用list。</span>
<span class="token key attr-name"> list-max-ziplist-value</span> <span class="token value attr-value">64</span>
  
<span class="token comment"> #数据量小于等于set-max-intset-entries用iniset，大于set-max-intset-entries用set。</span>
<span class="token key attr-name"> set-max-intset-entries</span> <span class="token value attr-value">512</span>
  
<span class="token comment"> #数据量小于等于zset-max-ziplist-entries用ziplist，大于zset-max-ziplist-entries用zset。</span>
<span class="token key attr-name"> zset-max-ziplist-entries</span> <span class="token value attr-value">128</span>
<span class="token comment"> #value大小小于等于zset-max-ziplist-value用ziplist，大于zset-max-ziplist-value用zset。</span>
<span class="token key attr-name"> zset-max-ziplist-value</span> <span class="token value attr-value">64</span>
  
<span class="token comment"> #value大小小于等于hll-sparse-max-bytes使用稀疏数据结构（sparse），大于hll-sparse-max-bytes使用稠密的数据结构（dense）。一个比16000大的value是几乎没用的，建议的value大概为3000。如果对CPU要求不高，对空间要求较高的，建议设置到10000左右。</span>
<span class="token key attr-name"> hll-sparse-max-bytes</span> <span class="token value attr-value">3000</span>
  
<span class="token comment"> #Redis将在每100毫秒时使用1毫秒的CPU时间来对redis的hash表进行重新hash，可以降低内存的使用。当你的使用场景中，有非常严格的实时性需要，不能够接受Redis时不时的对请求有2毫秒的延迟的话，把这项配置为no。如果没有这么严格的实时性要求，可以设置为yes，以便能够尽可能快的释放内存。</span>
<span class="token key attr-name"> activerehashing</span> <span class="token value attr-value">yes</span>
  
<span class="token comment"> ##对客户端输出缓冲进行限制可以强迫那些不从服务器读取数据的客户端断开连接，用来强制关闭传输缓慢的客户端。</span>
<span class="token comment"> #对于normal client，第一个0表示取消hard limit，第二个0和第三个0表示取消soft limit，normal client默认取消限制，因为如果没有寻问，他们是不会接收数据的。</span>
<span class="token key attr-name"> client-output-buffer-limit</span> <span class="token value attr-value">normal 0 0 0</span>
<span class="token comment"> #对于slave client和MONITER client，如果client-output-buffer一旦超过256mb，又或者超过64mb持续60秒，那么服务器就会立即断开客户端连接。</span>
<span class="token key attr-name"> client-output-buffer-limit</span> <span class="token value attr-value">slave 256mb 64mb 60</span>
<span class="token comment"> #对于pubsub client，如果client-output-buffer一旦超过32mb，又或者超过8mb持续60秒，那么服务器就会立即断开客户端连接。</span>
<span class="token key attr-name"> client-output-buffer-limit</span> <span class="token value attr-value">pubsub 32mb 8mb 60</span>
  
<span class="token comment"> #redis执行任务的频率为1s除以hz。</span>
<span class="token key attr-name"> hz</span> <span class="token value attr-value">10</span>
  
<span class="token comment"> #在aof重写的时候，如果打开了aof-rewrite-incremental-fsync开关，系统会每32MB执行一次fsync。这对于把文件写入磁盘是有帮助的，可以避免过大的延迟峰值。</span>
<span class="token key attr-name"> aof-rewrite-incremental-fsync</span> <span class="token value attr-value">yes</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><br><h2 id="redis-应用案例" tabindex="-1"><a class="header-anchor" href="#redis-应用案例" aria-hidden="true">#</a> <span id="应用案例">Redis 应用案例</span></h2><h3 id="消息队列" tabindex="-1"><a class="header-anchor" href="#消息队列" aria-hidden="true">#</a> <span id="消息队列">消息队列</span></h3><p>学redis之前，确实没想过还能用来做消息队列的。</p><p>想了下，感觉还是蛮实用的，在一些不值得上 MQ 的小系统里面，用 Redis 也是个不错的方式。</p><ul><li>sorted-set 就不写了，没什么特别的优点；</li><li>zadd 也能实现延时队列，不过需要轮询监听，没有阻塞式的消费方法，还是算了。</li></ul><h4 id="list-结构" tabindex="-1"><a class="header-anchor" href="#list-结构" aria-hidden="true">#</a> List 结构</h4><p><strong>Redis 的 List 其实是一个双向链表，可以用来实现双向队列；支持多个生产者、多个消费者</strong></p><blockquote><p><span style="color:red;"><strong>基于 LPUSH（左侧入队） + RPOP（右侧出队）实现；将出队轮询，进一步优化使用 BRPOP（阻塞式获取消息）优化</strong></span></p></blockquote><p><strong>方案缺点：</strong></p><ul><li>无法避免消息丢失：例如消费者拿到消息还没有消费就宕机了，ACK 实现比较麻烦</li><li>只能支持单个消费、不支持广播</li><li>BRPOP 在阻塞过程中会占用连接，长时间没有消息，redis 会断开连接节省资源，没有重连的话就功能失效了</li></ul><hr><p>代码实现：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token comment">//左侧消息入队</span>
<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">leftPush</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token class-name">MessageBO</span> message<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    redisTemplate<span class="token punctuation">.</span><span class="token function">opsForList</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">leftPush</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> message<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
<span class="token comment">//右侧消息出队；</span>
<span class="token keyword">public</span> <span class="token class-name">MessageBO</span> <span class="token function">rightPop</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token class-name">MessageBO</span><span class="token punctuation">)</span> redisTemplate<span class="token punctuation">.</span><span class="token function">opsForList</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">rightPop</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">,</span> <span class="token class-name">TimeUnit</span><span class="token punctuation">.</span><span class="token constant">MINUTES</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的出队列是最基础的出队，还需要考虑两个问题：</p><ul><li><strong>最长阻塞时间为5分钟，到达时间或者获取到消息，就会立刻结束监听</strong></li><li><strong>所以在redis关闭连接、或者消息返回后，要重新开启监听</strong></li></ul><p>所以可以定义一个队列消费者：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Slf4j</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">MessageListConsumer</span> <span class="token keyword">implements</span> <span class="token class-name">Runnable</span> <span class="token punctuation">{</span>

    <span class="token keyword">private</span> <span class="token class-name">RedisTemplate</span> redisTemplate<span class="token punctuation">;</span>

    <span class="token keyword">public</span> <span class="token class-name">MessageListConsumer</span><span class="token punctuation">(</span><span class="token class-name">RedisTemplate</span> redisTemplate<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>redisTemplate <span class="token operator">=</span> redisTemplate<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 右侧消息出队；
     * 1.最长阻塞时间为5分钟，到达时间或者获取到消息，就会立刻结束监听
     * 2.所以在redis关闭连接、或者消息返回后，要重新开启监听
     */</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">try</span> <span class="token punctuation">{</span>
                <span class="token comment">//方法返回后，监听就结束了，所以加了个死循环，反正这边也是单线程阻塞监听</span>
                <span class="token class-name">MessageBO</span> messageBO <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">MessageBO</span><span class="token punctuation">)</span> redisTemplate<span class="token punctuation">.</span><span class="token function">opsForList</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">rightPop</span><span class="token punctuation">(</span><span class="token string">&quot;message:list-mq&quot;</span><span class="token punctuation">,</span> <span class="token number">5</span><span class="token punctuation">,</span> <span class="token class-name">TimeUnit</span><span class="token punctuation">.</span><span class="token constant">MINUTES</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token function">handle</span><span class="token punctuation">(</span>messageBO<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">Exception</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;监听出错，一般是超时，断开连接了&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 获得消息后的处理操作</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">handle</span><span class="token punctuation">(</span><span class="token class-name">MessageBO</span> messageBO<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>messageBO <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;阻塞监听队列消息超时了&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">return</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;获得队列消息：{}&quot;</span><span class="token punctuation">,</span> messageBO<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">//TODO 这边可以加入处理出错，然后怎么重新入队，或者加个死信队列</span>
    <span class="token punctuation">}</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>测试代码省略。。。</p><br><h4 id="发布订阅" tabindex="-1"><a class="header-anchor" href="#发布订阅" aria-hidden="true">#</a> 发布订阅</h4><p>常见模型，不多讲了。<strong>消费者可以订阅一个或者多个channel、一个消息可以发布到多个消费者、消息即时发送，消息不用等待消费者读取</strong></p><p>适合用在消息送达要求不高的场景、例如通知公告、群聊。</p><p><strong>方案缺点：</strong></p><ul><li>消息一旦发布，不能接收。换句话就是发布时若客户端不在线，则消息丢失，不能寻回</li><li>消费端若出现阻塞积压，会强制断开连接，导致消息丢失。</li></ul><hr><p>代码实现：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Slf4j</span>
<span class="token annotation punctuation">@RequiredArgsConstructor</span>
<span class="token annotation punctuation">@Configuration</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">MessageSubConfig</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">MessageListener</span> messageListener<span class="token punctuation">;</span>
    <span class="token annotation punctuation">@Bean</span>
    <span class="token class-name">RedisMessageListenerContainer</span> <span class="token function">redisContainer</span><span class="token punctuation">(</span><span class="token class-name">RedisConnectionFactory</span> connectionFactory<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">RedisMessageListenerContainer</span> container <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">RedisMessageListenerContainer</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        container<span class="token punctuation">.</span><span class="token function">setConnectionFactory</span><span class="token punctuation">(</span>connectionFactory<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Topic</span><span class="token punctuation">&gt;</span></span> list <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ArrayList</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        list<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">PatternTopic</span><span class="token punctuation">(</span><span class="token string">&quot;message:pubsub&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        list<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">PatternTopic</span><span class="token punctuation">(</span><span class="token string">&quot;message:pubsub-2&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        container<span class="token punctuation">.</span><span class="token function">addMessageListener</span><span class="token punctuation">(</span>messageListener<span class="token punctuation">,</span> list<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> container<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Component</span>
<span class="token annotation punctuation">@Slf4j</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">MessageSubHandler</span> <span class="token keyword">implements</span> <span class="token class-name">MessageListener</span> <span class="token punctuation">{</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">onMessage</span><span class="token punctuation">(</span><span class="token class-name">Message</span> message<span class="token punctuation">,</span> <span class="token keyword">byte</span><span class="token punctuation">[</span><span class="token punctuation">]</span> pattern<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span>message<span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>然后测试类只需要发送就好了。。。</p><br><h4 id="stream" tabindex="-1"><a class="header-anchor" href="#stream" aria-hidden="true">#</a> stream</h4><p>Stream是支持多播、可持久化、主从复制的消息队列。</p><p>Redis Stream 有一个消息链表，将所有加入的消息都串起来，每个消息都有一个唯一的 ID 和对应的内容。每个 Stream 都有唯一的名称，它就是 Redis 的 key；</p><p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/format,png.png" alt=""></p><p>参考下图，带上持久化 和 ACK，该有的都有了。</p><p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/8c6ded5f367a429c8455d8b1a9b3d94a.png" alt=""></p><p>这个方案没有什么缺点，毕竟是参考 kafka 专门设计。。</p><hr><p>代码实现：</p><p>自动创建 stream 分组：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Slf4j</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">EventStreamUtils</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">createConsumerGroup</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span> <span class="token class-name">String</span> group<span class="token punctuation">,</span> <span class="token class-name">RedisTemplate</span> redisTemplate<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">try</span> <span class="token punctuation">{</span>
            redisTemplate<span class="token punctuation">.</span><span class="token function">opsForStream</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">createGroup</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> group<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">RedisSystemException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">Throwable</span> cause <span class="token operator">=</span> e<span class="token punctuation">.</span><span class="token function">getRootCause</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>cause <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> <span class="token class-name">RedisBusyException</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>cause<span class="token punctuation">.</span><span class="token function">getClass</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;STREAM - Redis group already exists, skipping Redis group creation: {}&quot;</span><span class="token punctuation">,</span> group<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
                <span class="token keyword">throw</span> e<span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>开启监听：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Configuration</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">MessageStreamConfig</span> <span class="token punctuation">{</span>

    <span class="token annotation punctuation">@Autowired</span>
    <span class="token keyword">private</span> <span class="token class-name">MessageStreamListener</span> streamListener<span class="token punctuation">;</span>
    <span class="token annotation punctuation">@Autowired</span>
    <span class="token keyword">private</span> <span class="token class-name">RedisTemplate</span> redisTemplate<span class="token punctuation">;</span>

    <span class="token annotation punctuation">@Bean</span>
    <span class="token keyword">public</span> <span class="token class-name">Subscription</span> <span class="token function">subscription</span><span class="token punctuation">(</span><span class="token class-name">RedisConnectionFactory</span> factory<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">EventStreamUtils</span><span class="token punctuation">.</span><span class="token function">createConsumerGroup</span><span class="token punctuation">(</span><span class="token string">&quot;mystream&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;mygroup&quot;</span><span class="token punctuation">,</span> redisTemplate<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">StreamMessageListenerContainer<span class="token punctuation">.</span>StreamMessageListenerContainerOptions</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">MapRecord</span><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span></span> options <span class="token operator">=</span> <span class="token class-name">StreamMessageListenerContainer
                <span class="token punctuation">.</span>StreamMessageListenerContainerOptions</span>
                <span class="token punctuation">.</span><span class="token function">builder</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">pollTimeout</span><span class="token punctuation">(</span><span class="token class-name">Duration</span><span class="token punctuation">.</span><span class="token function">ofSeconds</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
                <span class="token punctuation">.</span><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">StreamMessageListenerContainer</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">MapRecord</span><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span></span> listenerContainer <span class="token operator">=</span> <span class="token class-name">StreamMessageListenerContainer</span><span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span>factory<span class="token punctuation">,</span> options<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Subscription</span> subscription <span class="token operator">=</span> listenerContainer<span class="token punctuation">.</span><span class="token function">receiveAutoAck</span><span class="token punctuation">(</span><span class="token class-name">Consumer</span><span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span><span class="token string">&quot;mygroup&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;huhailong&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
                <span class="token class-name">StreamOffset</span><span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token string">&quot;mystream&quot;</span><span class="token punctuation">,</span> <span class="token class-name">ReadOffset</span><span class="token punctuation">.</span><span class="token function">lastConsumed</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span> streamListener<span class="token punctuation">)</span><span class="token punctuation">;</span>
        listenerContainer<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> subscription<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>消息接收处理：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Slf4j</span>
<span class="token annotation punctuation">@Component</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">MessageStreamListener</span> <span class="token keyword">implements</span> <span class="token class-name">StreamListener</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">MapRecord</span><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span></span> <span class="token punctuation">{</span>
    <span class="token annotation punctuation">@Autowired</span>
    <span class="token keyword">private</span> <span class="token class-name">RedisTemplate</span> redisTemplate<span class="token punctuation">;</span>
    <span class="token comment">//只会接收到新消息，就算历史的消息没有删除，也不会接收</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">onMessage</span><span class="token punctuation">(</span><span class="token class-name">MapRecord</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> message<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;接受到来自redis的消息&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;message id &quot;</span> <span class="token operator">+</span> message<span class="token punctuation">.</span><span class="token function">getId</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;stream &quot;</span> <span class="token operator">+</span> message<span class="token punctuation">.</span><span class="token function">getStream</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;body &quot;</span> <span class="token operator">+</span> message<span class="token punctuation">.</span><span class="token function">getValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">//根据id,删除stream里的消息</span>
        redisTemplate<span class="token punctuation">.</span><span class="token function">opsForStream</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">delete</span><span class="token punctuation">(</span><span class="token string">&quot;mystream&quot;</span><span class="token punctuation">,</span> message<span class="token punctuation">.</span><span class="token function">getId</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>发送消息测试：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Test</span>
<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">streamPublish</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">InterruptedException</span> <span class="token punctuation">{</span>
    <span class="token class-name">MessageBO</span> message <span class="token operator">=</span> <span class="token class-name">MessageBO</span><span class="token punctuation">.</span><span class="token function">builder</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">time</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">type</span><span class="token punctuation">(</span><span class="token string">&quot;Test&quot;</span><span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">data</span><span class="token punctuation">(</span><span class="token string">&quot;111&quot;</span><span class="token punctuation">)</span>
        <span class="token punctuation">.</span><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">Object</span><span class="token punctuation">&gt;</span></span> map <span class="token operator">=</span> <span class="token class-name">JSONObject</span><span class="token punctuation">.</span><span class="token function">parseObject</span><span class="token punctuation">(</span><span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">toJSONString</span><span class="token punctuation">(</span>message<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    redisTemplate<span class="token punctuation">.</span><span class="token function">opsForStream</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span><span class="token string">&quot;mystream&quot;</span><span class="token punctuation">,</span> map<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">2000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><br><h3 id="计数器应用" tabindex="-1"><a class="header-anchor" href="#计数器应用" aria-hidden="true">#</a> <span id="计数器应用">计数器应用</span></h3><p>计数器应用可能不太广泛，重要的计数肯定是在数据库里的，比如：预售数量、订餐数量。</p><p>不是特别重要的技术才可能在redis内，例如：人流量、点击量。</p>`,55),h={href:"https://www.gxlcms.com/mysql-317790.html",target:"_blank",rel:"noopener noreferrer"},y=t(`<p>代码实现：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token class-name">Long</span> count <span class="token operator">=</span> redisTemplate<span class="token punctuation">.</span><span class="token function">opsForValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">increment</span><span class="token punctuation">(</span><span class="token string">&quot;count&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><br><h3 id="排序队列" tabindex="-1"><a class="header-anchor" href="#排序队列" aria-hidden="true">#</a> <span id="排序队列">排序队列</span></h3><p>也没什么特别的，知道有这么个玩意儿，有需要自己扩展就好了：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Test</span>
<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">sortQueue</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
    <span class="token class-name">String</span> key <span class="token operator">=</span> <span class="token string">&quot;sortQueue&quot;</span><span class="token punctuation">;</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">10</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        redisTemplate<span class="token punctuation">.</span><span class="token function">opsForZSet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> i<span class="token punctuation">,</span> <span class="token class-name">Math</span><span class="token punctuation">.</span><span class="token function">random</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">*</span> <span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token class-name">Set</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Character</span><span class="token punctuation">&gt;</span></span> set <span class="token operator">=</span> redisTemplate<span class="token punctuation">.</span><span class="token function">opsForZSet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">range</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>set<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/image-20220817225407728.png" alt=""></p><br><h2 id="常见解决方案" tabindex="-1"><a class="header-anchor" href="#常见解决方案" aria-hidden="true">#</a> <span id="常见解决方案">常见解决方案</span></h2><h3 id="数据持久化" tabindex="-1"><a class="header-anchor" href="#数据持久化" aria-hidden="true">#</a> <span id="数据持久化">数据持久化</span></h3><p>这部分直接看大佬们：</p>`,11),f={href:"https://www.cnblogs.com/ciel717/p/16466230.html",target:"_blank",rel:"noopener noreferrer"},w={href:"https://www.bilibili.com/video/BV1sV4y147Jz/?spm_id_from=333.788&vd_source=e768d8ae5d35e9620400ecb1e8983682",target:"_blank",rel:"noopener noreferrer"},_={href:"https://www.bilibili.com/video/BV1U34y1j7Gr?vd_source=e768d8ae5d35e9620400ecb1e8983682",target:"_blank",rel:"noopener noreferrer"},S=t(`<hr><p><strong>RDB 方式：</strong></p><p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/4ee3203524c53279a9d9855ea6b797c6-16608311291795.png" alt=""></p><p><strong>AOF 方式：</strong></p><p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/a2bd9ae133cad87898c6494410ecd9f0.png" alt=""></p><p>我就总结一些自己用的配置和命令，使用 <code>RDB(Redis DataBase) 内存快照</code>、<code>AOF(Append Only File) 增量日志</code> 的混合模式：</p><div class="language-properties line-numbers-mode" data-ext="properties"><pre class="language-properties"><code><span class="token comment"># 核心配置规则、可以混合使用</span>
<span class="token comment"># 300秒（5分钟）内至少10个key值改变（则进行数据库保存--持久化） </span>
<span class="token comment"># 60秒（1分钟）内至少10000个key值改变（则进行数据库保存--持久化）</span>
<span class="token key attr-name">save</span> <span class="token value attr-value">300 10</span>
<span class="token key attr-name">save</span> <span class="token value attr-value">60 10000</span>

<span class="token comment">#数据目录，数据库的写入会在这个目录。rdb、aof文件也会写在这个目录</span>
<span class="token key attr-name">dir</span> <span class="token value attr-value">/usr/local/redis/var</span>

<span class="token comment">#指定本地数据库文件名，一般采用默认的 dump.rdb</span>
<span class="token key attr-name">dbfilename</span> <span class="token value attr-value">dump.rdb</span>


<span class="token comment"> # 开启 aof，aof默认不开启</span>
<span class="token key attr-name"> appendonly</span> <span class="token value attr-value">no</span>
  
<span class="token comment"> #aof文件名</span>
<span class="token key attr-name"> appendfilename</span> <span class="token value attr-value">&quot;appendonly.aof&quot;</span>
  
<span class="token comment"> #aof持久化策略的配置</span>
<span class="token comment"> #no表示不执行fsync，由操作系统保证数据同步到磁盘，速度最快（不推荐）。</span>
<span class="token comment"> #always表示每次写入都执行fsync，以保证数据同步到磁盘（消耗太高）。</span>
<span class="token comment"> #everysec表示每秒执行一次fsync，可能会导致丢失这1s数据（默认策略）。</span>
<span class="token key attr-name"> appendfsync</span> <span class="token value attr-value">everysec</span>
  
<span class="token comment"> #在aof重写或者写入rdb文件的时候，会执行大量IO，此时对于everysec和always的aof模式来说，执行fsync会造成阻塞过长时间，no-appendfsync-on-rewrite字段设置为默认设置为no。</span>
<span class="token comment"> #如果对延迟要求很高的应用，这个字段可以设置为yes，否则还是设置为no，这样对持久化特性来说这是更安全的选择。设置为yes表示rewrite期间对新写操作不fsync,暂时存在内存中,等rewrite完成后再写入，默认为no，建议yes。Linux的默认fsync策略是30秒。可能丢失30秒数据。</span>
<span class="token key attr-name"> no-appendfsync-on-rewrite</span> <span class="token value attr-value">no</span>
 
<span class="token comment"> # 开启混合模式</span>
<span class="token key attr-name"> aof-use-rdb-preamble</span> <span class="token value attr-value">yes</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p><strong>正常情况下，只开启 RDM 就够用了；</strong></p></blockquote><br><h3 id="基于redis的分布式锁" tabindex="-1"><a class="header-anchor" href="#基于redis的分布式锁" aria-hidden="true">#</a> <span id="分布式锁">基于Redis的分布式锁</span></h3><p>这里写两种方案：</p><ul><li><strong>基于 setnx 实现</strong>：实现简单，全手写，不引入其他依赖；但是在存在缺陷</li><li><strong>基于 redisson 实现</strong>：成熟框架，该有的都有，完美工具</li></ul><h4 id="基于-setnx-实现" tabindex="-1"><a class="header-anchor" href="#基于-setnx-实现" aria-hidden="true">#</a> 基于 setnx 实现</h4><p>这个方案在思路上相对简单, 只需要一个redis就可以实现。总体架构如下:</p><p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/image-20220819232911917.png" alt=""></p><p>代码的实现逻辑如下:</p><p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/image-20220820140420432.png" alt=""></p><p><strong>获得锁的线程在执行过程中出现异常（服务宕机、阻塞、抛出异常），那么没用调用删除锁命令，会导致其他永远线程无法获得锁。</strong></p><blockquote><p>给这个 redis 锁加一个过期时间，确保其他服务线程正常使用</p></blockquote><p><strong>setnx 和 expire 是两个命令，不是原子操作；可能导致 setnx 还没设置过期就挂掉</strong></p><blockquote><p>spring中用 <code>setIfAbsent(key, value, timeout, timeUnit)</code> ，这个方法是原子性的；</p><p>底层用的是 <code>set key value [EX seconds] [PX milliseconds] [NX|XX]</code></p></blockquote><p><strong>如果线程A获得锁，设置锁过期30秒，但是在30内还没执行完；这个时候B线程获得了新锁，35秒时候A线程执行完毕，把B线程的锁删了，引发连锁反应</strong></p><blockquote><p>所以在删除 key 之前，需要先 <code>get + 判断是不是同一把锁 + del</code> 操作;</p><p>但是这系列操作不是原子操作，无法在 java 中完成；网上说可以通过 LUA 脚本完成</p></blockquote><hr><p>代码实现，以下是基于我对这个方案的理解，<strong>手写的，没用测试过，只是个小demo</strong></p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Slf4j</span>
<span class="token annotation punctuation">@Service</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">SetnxService</span> <span class="token punctuation">{</span>

    <span class="token annotation punctuation">@Value</span><span class="token punctuation">(</span><span class="token string">&quot;\${applicationName}&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> applicationName<span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">String</span> <span class="token constant">LOCK_DEDUCTION</span> <span class="token operator">=</span> <span class="token string">&quot;LOCK.DEDUCTION&quot;</span><span class="token punctuation">;</span>

    <span class="token annotation punctuation">@Autowired</span>
    <span class="token keyword">private</span> <span class="token class-name">RedisTemplate</span> redisTemplate<span class="token punctuation">;</span>

    <span class="token comment">//模拟扣费业务</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">deduction</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">String</span> lockValue <span class="token operator">=</span> applicationName <span class="token operator">+</span> <span class="token string">&quot;:&quot;</span> <span class="token operator">+</span> <span class="token constant">UUID</span><span class="token punctuation">.</span><span class="token function">randomUUID</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">try</span> <span class="token punctuation">{</span>
            <span class="token comment">//试图获取锁，并且设置30秒的锁过期时间</span>
            <span class="token class-name">Boolean</span> lock <span class="token operator">=</span> redisTemplate<span class="token punctuation">.</span><span class="token function">opsForValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">setIfAbsent</span><span class="token punctuation">(</span><span class="token constant">LOCK_DEDUCTION</span><span class="token punctuation">,</span> lockValue<span class="token punctuation">,</span> <span class="token number">30</span><span class="token punctuation">,</span> <span class="token class-name">TimeUnit</span><span class="token punctuation">.</span><span class="token constant">SECONDS</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token comment">//判断是否获得锁</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>lock <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">||</span> <span class="token operator">!</span>lock<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token comment">//没获得锁，等会重新请求</span>
                <span class="token keyword">int</span> tryCount <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
                <span class="token keyword">while</span> <span class="token punctuation">(</span>tryCount <span class="token operator">&lt;</span> <span class="token number">100</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">20</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token comment">//重新获取锁，拿到了就执行业务方法，并且返回</span>
                    lock <span class="token operator">=</span> redisTemplate<span class="token punctuation">.</span><span class="token function">opsForValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">setIfAbsent</span><span class="token punctuation">(</span><span class="token constant">LOCK_DEDUCTION</span><span class="token punctuation">,</span> lockValue<span class="token punctuation">,</span> <span class="token number">30</span><span class="token punctuation">,</span> <span class="token class-name">TimeUnit</span><span class="token punctuation">.</span><span class="token constant">SECONDS</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token keyword">if</span> <span class="token punctuation">(</span>lock <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> lock<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                        log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;执行业务代码......&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                        <span class="token keyword">return</span><span class="token punctuation">;</span>
                    <span class="token punctuation">}</span>
                    tryCount<span class="token operator">++</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
                <span class="token comment">//循环了 100 次，还是没用拿到过锁，直接报错返回好了</span>
                log<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span><span class="token string">&quot;尝试超过获取锁 100 次，异常操作，得写个异常日志&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token keyword">return</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            <span class="token comment">//获得锁，执行业务代码</span>
            log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;执行业务代码......&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>
            <span class="token comment">//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!</span>
            <span class="token comment">//       注意，这个判断不是原子性的，所以在高并发情况下可能出现问题；在并发较低情况下，可以容忍的异常率场景，可以使用</span>
            <span class="token comment">//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>lockValue<span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>redisTemplate<span class="token punctuation">.</span><span class="token function">opsForValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token constant">LOCK_DEDUCTION</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token comment">//redis的锁还是当前的锁</span>
                redisTemplate<span class="token punctuation">.</span><span class="token function">delete</span><span class="token punctuation">(</span><span class="token constant">LOCK_DEDUCTION</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><br><h4 id="基于-redisson-实现" tabindex="-1"><a class="header-anchor" href="#基于-redisson-实现" aria-hidden="true">#</a> 基于 redisson 实现</h4><p><strong>redisson 自带 锁续期、看门狗、单体/集群/主从/哨兵等redis架构的适配</strong>，反正就是你想要的这里全都有。</p><p>这里要稍微介绍下的应该就是这个 看门狗机制：</p><p><img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/image-20220820213426578.png" alt=""></p><p><strong>watch dog 的自动延期机制：</strong></p><blockquote><ul><li>redisson 在获取锁之后，会维护一个看门狗线程，在每一个锁设置的过期时间的1/3处，如果线程还没执行完任务，则不断延长锁的有效期。看门狗的检查锁超时时间默认是30秒，可以通过 lockWactchdogTimeout 参数来改变。</li><li>加锁的时间默认是30秒，如果加锁的业务没有执行完，那么每隔 30 ÷ 3 = 10秒，就会进行一次续期，把锁重置成30秒，保证解锁前锁不会自动失效。</li><li>如果系统宕机、或者异常，那么作为子线程的看门狗也会中断，那么等待30秒就锁到期。</li><li><strong>这里要注意，绝对不能在这个业务执行中进入死循环，不然永久续期了都。</strong></li></ul></blockquote><p><strong>redisson分布式锁的关键点：</strong></p><blockquote><ul><li>对key不设置过期时间，由Redisson在加锁成功后给维护一个watchdog看门狗，watchdog负责定时监听并处理，在锁没有被释放且快要过期的时候自动对锁进行续期，保证解锁前锁不会自动失效</li><li>通过Lua脚本实现了加锁和解锁的原子操作</li><li>通过记录获取锁的客户端id，每次加锁时判断是否是当前客户端已经获得锁，实现了可重入锁。</li></ul></blockquote><p><strong>如何开启看门狗：</strong></p><blockquote><p>只要获得锁的时候，别给锁加过期时间，就自动开启</p></blockquote><hr><p>代码实现：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Slf4j</span>
<span class="token annotation punctuation">@Service</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">RedissonService</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">String</span> <span class="token constant">LOCK_DEDUCTION</span> <span class="token operator">=</span> <span class="token string">&quot;LOCK.DEDUCTION&quot;</span><span class="token punctuation">;</span>
    <span class="token annotation punctuation">@Autowired</span>
    <span class="token keyword">private</span> <span class="token class-name">RedissonClient</span> redissonClient<span class="token punctuation">;</span>

    <span class="token comment">//模拟扣费业务</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">deduction</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 普通的可重入锁</span>
        <span class="token class-name">RLock</span> lock <span class="token operator">=</span> redissonClient<span class="token punctuation">.</span><span class="token function">getLock</span><span class="token punctuation">(</span><span class="token constant">LOCK_DEDUCTION</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">try</span> <span class="token punctuation">{</span>
            <span class="token comment">// lock.lock()会不断重试获取锁，一直循环</span>
            <span class="token comment">// 尝试拿锁10s后停止重试,返回false</span>
            <span class="token comment">// 具有Watch Dog 自动延期机制 默认续30s</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>lock<span class="token punctuation">.</span><span class="token function">tryLock</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">,</span> <span class="token class-name">TimeUnit</span><span class="token punctuation">.</span><span class="token constant">SECONDS</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;执行业务代码......&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            <span class="token comment">// 尝试拿锁100s后停止重试,返回false；没有Watch Dog ，10s后自动释放</span>
            <span class="token comment">// lock.tryLock(100, 10, TimeUnit.SECONDS);</span>
            <span class="token comment">// 公平锁 保证 Redisson 客户端线程将以其请求的顺序获得锁</span>
            <span class="token comment">// RLock fairLock = redissonClient.getFairLock(&quot;fairLock&quot;);</span>
        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>
            <span class="token comment">//解锁</span>
            lock<span class="token punctuation">.</span><span class="token function">unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Data</span>
<span class="token annotation punctuation">@Configuration</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">RedissonConfig</span> <span class="token punctuation">{</span>

    <span class="token annotation punctuation">@Value</span><span class="token punctuation">(</span><span class="token string">&quot;\${spring.redis.host}&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> host<span class="token punctuation">;</span>
    <span class="token annotation punctuation">@Value</span><span class="token punctuation">(</span><span class="token string">&quot;\${spring.redis.port}&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> port<span class="token punctuation">;</span>
    <span class="token annotation punctuation">@Value</span><span class="token punctuation">(</span><span class="token string">&quot;\${spring.redis.password}&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> password<span class="token punctuation">;</span>

    <span class="token annotation punctuation">@Bean</span>
    <span class="token keyword">public</span> <span class="token class-name">RedissonClient</span> <span class="token function">getRedisSon</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">Config</span> config <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Config</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">String</span> address <span class="token operator">=</span> <span class="token string">&quot;redis://&quot;</span> <span class="token operator">+</span> host <span class="token operator">+</span> <span class="token string">&quot;:&quot;</span> <span class="token operator">+</span> port<span class="token punctuation">;</span>
        config<span class="token punctuation">.</span><span class="token function">useSingleServer</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">setAddress</span><span class="token punctuation">(</span>address<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">null</span> <span class="token operator">!=</span> password <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span><span class="token string">&quot;&quot;</span><span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>password<span class="token punctuation">.</span><span class="token function">trim</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            config<span class="token punctuation">.</span><span class="token function">useSingleServer</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">setPassword</span><span class="token punctuation">(</span>password<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> <span class="token class-name">Redisson</span><span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span>config<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><br><p>集群、哨兵遇到了再搞吧，也不复杂：</p><br><h3 id="常见命令检索表" tabindex="-1"><a class="header-anchor" href="#常见命令检索表" aria-hidden="true">#</a> <span id="常见命令检索表">常见命令检索表</span></h3><p>这些都是终端敲的，一般用不到太多，基本都是在代码里用，所以只写一些用得上的</p><table><thead><tr><th>命令 + 作用</th><th>命令 + 作用</th><th>命令 + 作用</th><th>命令 + 作用</th><th>命令 + 作用</th><th>命令 + 作用</th></tr></thead><tbody><tr><td>exists key；键是否存在</td><td>set key value；设置键值</td><td>del key；删除键值</td><td>expire key seconds；设置过期时间</td><td>ttl key；获得过期时间</td><td>type key；返回key的类型</td></tr><tr><td>rename oldkey newkey；重命名</td><td>getset key newValue；原子操作，设置新值，返回旧值</td><td>setnx key value；key不存在则设置</td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td></tr></tbody></table><br><h2 id="参考文章" tabindex="-1"><a class="header-anchor" href="#参考文章" aria-hidden="true">#</a> <span id="te">参考文章</span></h2>`,49),x={href:"https://www.bilibili.com/video/BV1Tf4y177L5?spm_id_from=333.999.0.0&vd_source=e768d8ae5d35e9620400ecb1e8983682",target:"_blank",rel:"noopener noreferrer"},q={href:"https://blog.csdn.net/qq_59138417/article/details/124525767",target:"_blank",rel:"noopener noreferrer"},R={href:"http://www.muzhuangnet.com/show/47024.html",target:"_blank",rel:"noopener noreferrer"},E={href:"https://blog.csdn.net/weixin_45690465/article/details/124566098",target:"_blank",rel:"noopener noreferrer"},C={href:"https://www.jianshu.com/p/d32b16f12f09",target:"_blank",rel:"noopener noreferrer"},O={href:"https://www.cnblogs.com/yaohl0911/p/14932134.html",target:"_blank",rel:"noopener noreferrer"},T={href:"https://www.jb51.net/article/230977.htm",target:"_blank",rel:"noopener noreferrer"},L={href:"https://blog.csdn.net/z2431435/article/details/124978166",target:"_blank",rel:"noopener noreferrer"},A={href:"https://zhuanlan.zhihu.com/p/440831491",target:"_blank",rel:"noopener noreferrer"},B={href:"https://blog.csdn.net/hhl18730252820/article/details/114826366",target:"_blank",rel:"noopener noreferrer"},j={href:"https://stackoverflow.com/questions/61465222/how-to-use-consumer-groups-with-spring-data-redis-for-redis-streams-keep-gettin",target:"_blank",rel:"noopener noreferrer"},z={href:"https://blog.csdn.net/nianqrzhanghw/article/details/121163780",target:"_blank",rel:"noopener noreferrer"},D={href:"https://www.cnblogs.com/ciel717/p/16466230.html",target:"_blank",rel:"noopener noreferrer"},N={href:"http://www.wjhsh.net/chuijingjing-p-12832678.html",target:"_blank",rel:"noopener noreferrer"},F={href:"https://blog.csdn.net/x275920/article/details/125409441",target:"_blank",rel:"noopener noreferrer"},I={href:"https://www.cnblogs.com/goloving/p/16026003.html",target:"_blank",rel:"noopener noreferrer"},M={href:"https://blog.csdn.net/qq_35429398/article/details/121629496",target:"_blank",rel:"noopener noreferrer"},U={href:"https://blog.csdn.net/m0_45364328/article/details/125175796",target:"_blank",rel:"noopener noreferrer"};function P(V,G){const a=l("ExternalLinkIcon");return i(),o("div",null,[u,n("ul",null,[n("li",null,[s("Redis 中文翻译网站："),n("a",r,[s("CRUG网站 (redis.cn)"),e(a)])]),n("li",null,[s("测试代码："),n("a",d,[s("redis-unit · Learning Use Cases/Demo4j of First - 码云 - 开源中国 (gitee.com)"),e(a)])])]),k,n("p",null,[s("下面的结构说明，是从翻译站抄过来的："),n("a",m,[s("REDIS data-types-intro -- Redis中文资料站 -- Redis中国用户组（CRUG）"),e(a)])]),v,n("p",null,[s("方法对比可以看看这个："),n("a",b,[s("jedis 与 RedisTemplate 操作比较 - z_先生 - 博客园 (cnblogs.com)"),e(a)])]),g,n("p",null,[s("具体可以看看别的大佬："),n("a",h,[s("Redis在计数器场景上的应用 (gxlcms.com)"),e(a)])]),y,n("ul",null,[n("li",null,[n("a",f,[s("Redis持久化 - 夏尔_717 - 博客园 (cnblogs.com)"),e(a)])]),n("li",null,[n("a",w,[s("【趣话Redis第二弹】Redis数据持久化AOF和RDB原理一次搞懂！_哔哩哔哩_bilibili"),e(a)])]),n("li",null,[n("a",_,[s("讲一下redis持久化方案(RDB,AOF,混合)_哔哩哔哩_bilibili"),e(a)])])]),S,n("ul",null,[n("li",null,[n("a",x,[s("【全套免费】GitHub 上标星60K 的Redis入门到精通全套教程，从GitHub火到了B站！让你彻底告别资源付费！！！_哔哩哔哩_bilibili"),e(a)])]),n("li",null,[n("a",q,[s("使用Java操作Redis的两种方式Jedis、RedisTemplate_扎哇太枣糕的博客-CSDN博客_java操作redis有几种方法"),e(a)])]),n("li",null,[n("a",R,[s("jedis和redistemplate区别-木庄网络博客 (muzhuangnet.com)"),e(a)])]),n("li",null,[n("a",E,[s("Redis实现消息队列_..Serendipity的博客-CSDN博客_redis消息队列"),e(a)])]),n("li",null,[n("a",C,[s("Redis实现消息队列的4种方案 - 简书 (jianshu.com)"),e(a)])]),n("li",null,[n("a",O,[s("【转载】Redis实现消息队列的4种方案 - yaohl0911 - 博客园 (cnblogs.com)"),e(a)])]),n("li",null,[n("a",T,[s("Java redisTemplate阻塞式处理消息队列_java_脚本之家 (jb51.net)"),e(a)])]),n("li",null,[n("a",L,[s("Redis消息队列——Redis Stream_努 力 小 子的博客-CSDN博客_redis stream"),e(a)])]),n("li",null,[n("a",A,[s("Java spring boot redisTemplate之Stream组件 - 知乎 (zhihu.com)"),e(a)])]),n("li",null,[n("a",B,[s("SpringBoot 中使用Redis Stream 实现消息监听_@胡海龙的博客-CSDN博客_redis消息监听器容器"),e(a)])]),n("li",null,[n("a",j,[s("java - 如何将消费者组与Spring Data Redis for Redis Streams一起使用（继续获得NOGROUP）？- 堆栈溢出 (stackoverflow.com)"),e(a)])]),n("li",null,[n("a",z,[s("Redis持久化_hi wei的博客-CSDN博客_redis持久化"),e(a)])]),n("li",null,[n("a",D,[s("Redis持久化 - 夏尔_717 - 博客园 (cnblogs.com)"),e(a)])]),n("li",null,[n("a",N,[s("Redis配置文件详解 (wjhsh.net)"),e(a)])]),n("li",null,[n("a",F,[s("什么是分布式锁？几种分布式锁分别是怎么实现的？_普通网友的博客-CSDN博客_分布式锁- "),e(a)])]),n("li",null,[n("a",I,[s("浅析redis setIfAbsent的用法及在分布式锁上的应用及同步锁的缺陷 - 古兰精 - 博客园 (cnblogs.com)"),e(a)])]),n("li",null,[n("a",M,[s("SpringBoot集成redisson_克伦留索夫的博客-CSDN博客_springboot集成redisson"),e(a)])]),n("li",null,[n("a",U,[s("Redisson的看门狗机制_JAVA_侠的博客-CSDN博客_redisson看门狗机制"),e(a)])])])])}const J=p(c,[["render",P],["__file","RedisStudy.html.vue"]]);export{J as default};
