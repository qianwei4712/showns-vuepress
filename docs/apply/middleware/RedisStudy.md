<div class="catalog">

- [开场废话](#开场废话)
- [Redis 基础知识](#基础知识)
- [Redis 常见配置](#常见配置)
- [Redis 应用案例](#应用案例)
  - [消息队列](#消息队列)
  - [计数器应用](#计数器应用)
  - [排序队列](#排序队列)
- [常见解决方案](#常见解决方案)
  - [数据持久化](#数据持久化)
  - [基于Redis的分布式锁](#分布式锁)
  - [常见命令检索表](#常见命令检索表)
- [参考文章](#te)

</div>


## <span id="开场废话">开场废话</span>

`2022.08.12`

Redis 这个系列学习，我打算通过场景案例来写这一篇，说不定以后会遇到特定场景来找解决方案。

所以这一篇应该不会有什么技术深度。

<img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/7084eeab8b7c203d4b0ae905323415bd.jpg" style="zoom: 50%;" />

- Redis 中文翻译网站：[CRUG网站 (redis.cn)](http://redis.cn/)
- 测试代码：[redis-unit · Learning Use Cases/Demo4j of First - 码云 - 开源中国 (gitee.com)](https://gitee.com/learning-use-cases/demo4j-of-first/tree/master/redis-unit)



<br/>

## <span id="基础知识">Redis 基础知识</span>

### 数据结构

下面的结构说明，是从翻译站抄过来的：[REDIS data-types-intro -- Redis中文资料站 -- Redis中国用户组（CRUG）](http://redis.cn/topics/data-types-intro.html#strings)

- 二进制安全的字符串
- Lists: 按插入顺序排序的字符串元素的集合。他们基本上就是*链表（linked lists）*。
- Sets: 不重复且无序的字符串元素的集合。
- Sorted sets,类似Sets,但是每个字符串元素都关联到一个叫*score*浮动数值（floating number value）。里面的元素总是通过score进行着排序，所以不同的是，它是可以检索的一系列元素。（例如你可能会问：给我前面10个或者后面10个元素）。
- Hashes,由field和关联的value组成的map。field和value都是字符串的。这和Ruby、Python的hashes很像。
- Bit arrays (或者说 simply bitmaps): 通过特殊的命令，你可以将 String 值当作一系列 bits 处理：可以设置和清除单独的 bits，数出所有设为 1 的 bits 的数量，找到最前的被设为 1 或 0 的 bit，等等。
- HyperLogLogs: 这是被用于估计一个 set 中元素数量的概率性的数据结构。别害怕，它比看起来的样子要简单…参见本教程的 HyperLogLog 部分

<br/>

### 使用注意

- 键值不要太长：不仅因为消耗内存，而且在数据中查找这类键值的计算成本很高

- 为防止在分布式系统中，key被覆盖的情况：

> **Key 的设置方式： 业务名+对象名+id+属性**

<br/>

### 连接工具类

在 Java 中常见的 Redis 连接工具就两种，RedisTemplate 和 jedis；

- jedis 是 Redis 官方推荐的工具；而 RedisTemplate 是 SpringDataRedis 对 JedisApi 的封装；
- 原生jedis 效率优于 redisTemplate，速度差不多在3倍；但是 RedisTemplate 在 Spring 中配置简单易用；
- **性能要求不高的情况下，推荐 RedisTemplate**，现在的小应用都是 SpringBoot 开发，使用方便兼容好。

 方法对比可以看看这个：[jedis 与 RedisTemplate 操作比较 - z_先生 - 博客园 (cnblogs.com)](https://www.cnblogs.com/z-sir/p/13664221.html)

<br/>

## <span id="常见配置">Redis 常见配置</span>

```properties
#是否在后台执行，yes：后台运行；no：不是后台运行
 daemonize yes
  
 #是否开启保护模式，默认开启。要是配置里没有指定bind和密码。开启该参数后，redis只会本地进行访问，拒绝外部访问。
 protected-mode yes
  
 #redis的进程文件
 pidfile /var/run/redis/redis-server.pid
  
 #redis监听的端口号。
 port 6379
  
 #此参数确定了TCP连接中已完成队列(完成三次握手之后)的长度， 当然此值必须不大于Linux系统定义的/proc/sys/net/core/somaxconn值，默认是511，而Linux的默认参数值是128。当系统并发量大并且客户端速度缓慢的时候，可以将这二个参数一起参考设定。该内核参数默认值一般是128，对于负载很大的服务程序来说大大的不够。一般会将它修改为2048或者更大。在/etc/sysctl.conf中添加:net.core.somaxconn = 2048，然后在终端中执行sysctl -p。
 tcp-backlog 511
  
 #指定 redis 只接收来自于该 IP 地址的请求，如果不进行设置，那么将处理所有请求
 #bind 127.0.0.1
 bind 0.0.0.0
  
 #配置unix socket来让redis支持监听本地连接。
 # unixsocket /var/run/redis/redis.sock
  
 #配置unix socket使用文件的权限
 # unixsocketperm 700
  
 # 此参数为设置客户端空闲超过timeout，服务端会断开连接，为0则服务端不会主动断开连接，不能小于0。
 timeout 0
  
 #tcp keepalive参数。如果设置不为0，就使用配置tcp的SO_KEEPALIVE值，使用keepalive有两个好处:检测挂掉的对端。降低中间设备出问题而导致网络看似连接却已经与对端端口的问题。在Linux内核中，设置了keepalive，redis会定时给对端发送ack。检测到对端关闭需要两倍的设置值。
 tcp-keepalive 0
  
 #指定了服务端日志的级别。级别包括：debug（很多信息，方便开发、测试），verbose（许多有用的信息，但是没有debug级别信息多），notice（适当的日志级别，适合生产环境），warn（只有非常重要的信息）
 loglevel notice
  
 #指定了记录日志的文件。空字符串的话，日志会打印到标准输出设备。后台运行的redis标准输出是/dev/null。
 logfile /var/log/redis/redis-server.log
  
 #是否打开记录syslog功能
 # syslog-enabled no
  
 #syslog的标识符。
 # syslog-ident redis
  
 #日志的来源、设备
 # syslog-facility local0
  
 #数据库的数量，默认使用的数据库是DB 0。可以通过SELECT命令选择一个db
 databases 16
  
 # redis是基于内存的数据库，可以通过设置该值定期写入磁盘。
 # 注释掉“save”这一行配置项就可以让保存数据库功能失效
 # 900秒（15分钟）内至少1个key值改变（则进行数据库保存--持久化） 
 # 300秒（5分钟）内至少10个key值改变（则进行数据库保存--持久化） 
 # 60秒（1分钟）内至少10000个key值改变（则进行数据库保存--持久化）
 save 900 1
 save 300 10
 save 60 10000
  
 #当RDB持久化出现错误后，是否依然进行继续进行工作，yes：不能进行工作，no：可以继续进行工作，可以通过info中的rdb_last_bgsave_status了解RDB持久化是否有错误
 stop-writes-on-bgsave-error yes
  
 #使用压缩rdb文件，rdb文件压缩使用LZF压缩算法，yes：压缩，但是需要一些cpu的消耗。no：不压缩，需要更多的磁盘空间
 rdbcompression yes
  
 #是否校验rdb文件。从rdb格式的第五个版本开始，在rdb文件的末尾会带上CRC64的校验和。这跟有利于文件的容错性，但是在保存rdb文件的时候，会有大概10%的性能损耗，所以如果你追求高性能，可以关闭该配置。
 rdbchecksum yes
  
 #rdb文件的名称
 dbfilename dump.rdb
  
 #数据目录，数据库的写入会在这个目录。rdb、aof文件也会写在这个目录
 dir /var/lib/redis
  
  
 ############### 主从复制 ###############
  
 #复制选项，slave复制对应的master。
 # slaveof <masterip> <masterport>
  
 #如果master设置了requirepass，那么slave要连上master，需要有master的密码才行。masterauth就是用来配置master的密码，这样可以在连上master后进行认证。
 # masterauth <master-password>
  
 #当从库同主机失去连接或者复制正在进行，从机库有两种运行方式：1) 如果slave-serve-stale-data设置为yes(默认设置)，从库会继续响应客户端的请求。2) 如果slave-serve-stale-data设置为no，除去INFO和SLAVOF命令之外的任何请求都会返回一个错误”SYNC with master in progress”。
 slave-serve-stale-data yes
  
 #作为从服务器，默认情况下是只读的（yes），可以修改成NO，用于写（不建议）。
 slave-read-only yes
  
 #是否使用socket方式复制数据。目前redis复制提供两种方式，disk和socket。如果新的slave连上来或者重连的slave无法部分同步，就会执行全量同步，master会生成rdb文件。有2种方式：disk方式是master创建一个新的进程把rdb文件保存到磁盘，再把磁盘上的rdb文件传递给slave。socket是master创建一个新的进程，直接把rdb文件以socket的方式发给slave。disk方式的时候，当一个rdb保存的过程中，多个slave都能共享这个rdb文件。socket的方式就的一个个slave顺序复制。在磁盘速度缓慢，网速快的情况下推荐用socket方式。
 repl-diskless-sync no
  
 #diskless复制的延迟时间，防止设置为0。一旦复制开始，节点不会再接收新slave的复制请求直到下一个rdb传输。所以最好等待一段时间，等更多的slave连上来。
 repl-diskless-sync-delay 5
  
 #slave根据指定的时间间隔向服务器发送ping请求。时间间隔可以通过 repl_ping_slave_period 来设置，默认10秒。
 # repl-ping-slave-period 10
  
 #复制连接超时时间。master和slave都有超时时间的设置。master检测到slave上次发送的时间超过repl-timeout，即认为slave离线，清除该slave信息。slave检测到上次和master交互的时间超过repl-timeout，则认为master离线。需要注意的是repl-timeout需要设置一个比repl-ping-slave-period更大的值，不然会经常检测到超时。
 # repl-timeout 60
  
 #是否禁止复制tcp链接的tcp nodelay参数，可传递yes或者no。默认是no，即使用tcp nodelay。如果master设置了yes来禁止tcp nodelay设置，在把数据复制给slave的时候，会减少包的数量和更小的网络带宽。但是这也可能带来数据的延迟。默认我们推荐更小的延迟，但是在数据量传输很大的场景下，建议选择yes。
 repl-disable-tcp-nodelay no
  
 #复制缓冲区大小，这是一个环形复制缓冲区，用来保存最新复制的命令。这样在slave离线的时候，不需要完全复制master的数据，如果可以执行部分同步，只需要把缓冲区的部分数据复制给slave，就能恢复正常复制状态。缓冲区的大小越大，slave离线的时间可以更长，复制缓冲区只有在有slave连接的时候才分配内存。没有slave的一段时间，内存会被释放出来，默认1m。
 # repl-backlog-size 5mb
  
 #master没有slave一段时间会释放复制缓冲区的内存，repl-backlog-ttl用来设置该时间长度。单位为秒。
 # repl-backlog-ttl 3600
  
 #当master不可用，Sentinel会根据slave的优先级选举一个master。最低的优先级的slave，当选master。而配置成0，永远不会被选举。
 slave-priority 100
  
 #redis提供了可以让master停止写入的方式，如果配置了min-slaves-to-write，健康的slave的个数小于N，mater就禁止写入。master最少得有多少个健康的slave存活才能执行写命令。这个配置虽然不能保证N个slave都一定能接收到master的写操作，但是能避免没有足够健康的slave的时候，master不能写入来避免数据丢失。设置为0是关闭该功能。
 # min-slaves-to-write 3
  
 #延迟小于min-slaves-max-lag秒的slave才认为是健康的slave。
 # min-slaves-max-lag 10
  
 # 设置1或另一个设置为0禁用这个特性。
 # Setting one or the other to 0 disables the feature.
 # By default min-slaves-to-write is set to 0 (feature disabled) and
 # min-slaves-max-lag is set to 10.
  
  
 ############### 安全相关 ###############
  
 #requirepass配置可以让用户使用AUTH命令来认证密码，才能使用其他命令。这让redis可以使用在不受信任的网络中。为了保持向后的兼容性，可以注释该命令，因为大部分用户也不需要认证。使用requirepass的时候需要注意，因为redis太快了，每秒可以认证15w次密码，简单的密码很容易被攻破，所以最好使用一个更复杂的密码。注意只有密码没有用户名。
 # requirepass foobared
  
 #把危险的命令给修改成其他名称。比如CONFIG命令可以重命名为一个很难被猜到的命令，这样用户不能使用，而内部工具还能接着使用。
 # rename-command CONFIG b840fc02d524045429941cc15f59e41cb7be6c52
  
 #设置成一个空的值，可以禁止一个命令
 # rename-command CONFIG ""
  
  
 ############### 进程限制相关 ###############
  
 # 设置能连上redis的最大客户端连接数量。默认是10000个客户端连接。由于redis不区分连接是客户端连接还是内部打开文件或者和slave连接等，所以maxclients最小建议设置到32。如果超过了maxclients，redis会给新的连接发送’max number of clients reached’，并关闭连接。
 # maxclients 10000
  
 #redis配置的最大内存容量。当内存满了，需要配合maxmemory-policy策略进行处理。注意slave的输出缓冲区是不计算在maxmemory内的。所以为了防止主机内存使用完，建议设置的maxmemory需要更小一些。
 # maxmemory <bytes>
  
 #内存容量超过maxmemory后的处理策略。
 #volatile-lru：利用LRU算法移除设置过过期时间的key。
 #volatile-random：随机移除设置过过期时间的key。
 #volatile-ttl：移除即将过期的key，根据最近过期时间来删除（辅以TTL）
 #allkeys-lru：利用LRU算法移除任何key。
 #allkeys-random：随机移除任何key。
 #noeviction：不移除任何key，只是返回一个写错误。
 #上面的这些驱逐策略，如果redis没有合适的key驱逐，对于写命令，还是会返回错误。redis将不再接收写请求，只接收get请求。写命令包括：set setnx setex append incr decr rpush lpush rpushx lpushx linsert lset rpoplpush sadd sinter sinterstore sunion sunionstore sdiff sdiffstore zadd zincrby zunionstore zinterstore hset hsetnx hmset hincrby incrby decrby getset mset msetnx exec sort。
 # maxmemory-policy noeviction
  
 #lru检测的样本数。使用lru或者ttl淘汰算法，从需要淘汰的列表中随机选择sample个key，选出闲置时间最长的key移除。
 # maxmemory-samples 5
  
  
 ############### APPEND ONLY 持久化方式 ###############
  
 #默认redis使用的是rdb方式持久化，这种方式在许多应用中已经足够用了。但是redis如果中途宕机，会导致可能有几分钟的数据丢失，根据save来策略进行持久化，Append Only File是另一种持久化方式，可以提供更好的持久化特性。Redis会把每次写入的数据在接收后都写入 appendonly.aof 文件，每次启动时Redis都会先把这个文件的数据读入内存里，先忽略RDB文件。
 appendonly no
  
 #aof文件名
 appendfilename "appendonly.aof"
  
 #aof持久化策略的配置
 #no表示不执行fsync，由操作系统保证数据同步到磁盘，速度最快。
 #always表示每次写入都执行fsync，以保证数据同步到磁盘。
 #everysec表示每秒执行一次fsync，可能会导致丢失这1s数据。
 appendfsync everysec
  
 # 在aof重写或者写入rdb文件的时候，会执行大量IO，此时对于everysec和always的aof模式来说，执行fsync会造成阻塞过长时间，no-appendfsync-on-rewrite字段设置为默认设置为no。如果对延迟要求很高的应用，这个字段可以设置为yes，否则还是设置为no，这样对持久化特性来说这是更安全的选择。设置为yes表示rewrite期间对新写操作不fsync,暂时存在内存中,等rewrite完成后再写入，默认为no，建议yes。Linux的默认fsync策略是30秒。可能丢失30秒数据。
 no-appendfsync-on-rewrite no
  
 #aof自动重写配置。当目前aof文件大小超过上一次重写的aof文件大小的百分之多少进行重写，即当aof文件增长到一定大小的时候Redis能够调用bgrewriteaof对日志文件进行重写。当前AOF文件大小是上次日志重写得到AOF文件大小的二倍（设置为100）时，自动启动新的日志重写过程。
 auto-aof-rewrite-percentage 100
 #设置允许重写的最小aof文件大小，避免了达到约定百分比但尺寸仍然很小的情况还要重写
 auto-aof-rewrite-min-size 64mb
  
 #aof文件可能在尾部是不完整的，当redis启动的时候，aof文件的数据被载入内存。重启可能发生在redis所在的主机操作系统宕机后，尤其在ext4文件系统没有加上data=ordered选项（redis宕机或者异常终止不会造成尾部不完整现象。）出现这种现象，可以选择让redis退出，或者导入尽可能多的数据。如果选择的是yes，当截断的aof文件被导入的时候，会自动发布一个log给客户端然后load。如果是no，用户必须手动redis-check-aof修复AOF文件才可以。
 aof-load-truncated yes
  
  
 ############### LUA SCRIPTING ###############
  
 # 如果达到最大时间限制（毫秒），redis会记个log，然后返回error。当一个脚本超过了最大时限。只有SCRIPT KILL和SHUTDOWN NOSAVE可以用。第一个可以杀没有调write命令的东西。要是已经调用了write，只能用第二个命令杀。
 lua-time-limit 5000
  
  
 ############### 集群相关 ###############
  
 #集群开关，默认是不开启集群模式。
 # cluster-enabled yes
  
 #集群配置文件的名称，每个节点都有一个集群相关的配置文件，持久化保存集群的信息。这个文件并不需要手动配置，这个配置文件有Redis生成并更新，每个Redis集群节点需要一个单独的配置文件，请确保与实例运行的系统中配置文件名称不冲突
 # cluster-config-file nodes-6379.conf
  
 #节点互连超时的阀值。集群节点超时毫秒数
 # cluster-node-timeout 15000
  
 #在进行故障转移的时候，全部slave都会请求申请为master，但是有些slave可能与master断开连接一段时间了，导致数据过于陈旧，这样的slave不应该被提升为master。该参数就是用来判断slave节点与master断线的时间是否过长。判断方法是：
 #比较slave断开连接的时间和(node-timeout * slave-validity-factor) + repl-ping-slave-period
 #如果节点超时时间为三十秒, 并且slave-validity-factor为10,假设默认的repl-ping-slave-period是10秒，即如果超过310秒slave将不会尝试进行故障转移 
 # cluster-slave-validity-factor 10
  
 #master的slave数量大于该值，slave才能迁移到其他孤立master上，如这个参数若被设为2，那么只有当一个主节点拥有2 个可工作的从节点时，它的一个从节点会尝试迁移。
 # cluster-migration-barrier 1
  
 #默认情况下，集群全部的slot有节点负责，集群状态才为ok，才能提供服务。设置为no，可以在slot没有全部分配的时候提供服务。不建议打开该配置，这样会造成分区的时候，小分区的master一直在接受写请求，而造成很长时间数据不一致。
 # cluster-require-full-coverage yes
  
  
 ############### SLOW LOG 慢查询日志 ###############
  
 ###slog log是用来记录redis运行中执行比较慢的命令耗时。当命令的执行超过了指定时间，就记录在slow log中，slog log保存在内存中，所以没有IO操作。
 #执行时间比slowlog-log-slower-than大的请求记录到slowlog里面，单位是微秒，所以1000000就是1秒。注意，负数时间会禁用慢查询日志，而0则会强制记录所有命令。
 slowlog-log-slower-than 10000
  
 #慢查询日志长度。当一个新的命令被写进日志的时候，最老的那个记录会被删掉。这个长度没有限制。只要有足够的内存就行。你可以通过 SLOWLOG RESET 来释放内存。
 slowlog-max-len 128
  
 ############### 延迟监控 ###############
 #延迟监控功能是用来监控redis中执行比较缓慢的一些操作，用LATENCY打印redis实例在跑命令时的耗时图表。只记录大于等于下边设置的值的操作。0的话，就是关闭监视。默认延迟监控功能是关闭的，如果你需要打开，也可以通过CONFIG SET命令动态设置。
 latency-monitor-threshold 0
  
 ############### EVENT NOTIFICATION 订阅通知 ###############
 #键空间通知使得客户端可以通过订阅频道或模式，来接收那些以某种方式改动了 Redis 数据集的事件。因为开启键空间通知功能需要消耗一些 CPU ，所以在默认配置下，该功能处于关闭状态。
 #notify-keyspace-events 的参数可以是以下字符的任意组合，它指定了服务器该发送哪些类型的通知：
 ##K 键空间通知，所有通知以 __keyspace@__ 为前缀
 ##E 键事件通知，所有通知以 __keyevent@__ 为前缀
 ##g DEL 、 EXPIRE 、 RENAME 等类型无关的通用命令的通知
 ##$ 字符串命令的通知
 ##l 列表命令的通知
 ##s 集合命令的通知
 ##h 哈希命令的通知
 ##z 有序集合命令的通知
 ##x 过期事件：每当有过期键被删除时发送
 ##e 驱逐(evict)事件：每当有键因为 maxmemory 政策而被删除时发送
 ##A 参数 g$lshzxe 的别名
 #输入的参数中至少要有一个 K 或者 E，否则的话，不管其余的参数是什么，都不会有任何 通知被分发。详细使用可以参考http://redis.io/topics/notifications
 notify-keyspace-events ""
  
 ############### ADVANCED CONFIG 高级配置 ###############
 #数据量小于等于hash-max-ziplist-entries的用ziplist，大于hash-max-ziplist-entries用hash
 hash-max-ziplist-entries 512
 #value大小小于等于hash-max-ziplist-value的用ziplist，大于hash-max-ziplist-value用hash。
 hash-max-ziplist-value 64
  
 #数据量小于等于list-max-ziplist-entries用ziplist，大于list-max-ziplist-entries用list。
 list-max-ziplist-entries 512
 #value大小小于等于list-max-ziplist-value的用ziplist，大于list-max-ziplist-value用list。
 list-max-ziplist-value 64
  
 #数据量小于等于set-max-intset-entries用iniset，大于set-max-intset-entries用set。
 set-max-intset-entries 512
  
 #数据量小于等于zset-max-ziplist-entries用ziplist，大于zset-max-ziplist-entries用zset。
 zset-max-ziplist-entries 128
 #value大小小于等于zset-max-ziplist-value用ziplist，大于zset-max-ziplist-value用zset。
 zset-max-ziplist-value 64
  
 #value大小小于等于hll-sparse-max-bytes使用稀疏数据结构（sparse），大于hll-sparse-max-bytes使用稠密的数据结构（dense）。一个比16000大的value是几乎没用的，建议的value大概为3000。如果对CPU要求不高，对空间要求较高的，建议设置到10000左右。
 hll-sparse-max-bytes 3000
  
 #Redis将在每100毫秒时使用1毫秒的CPU时间来对redis的hash表进行重新hash，可以降低内存的使用。当你的使用场景中，有非常严格的实时性需要，不能够接受Redis时不时的对请求有2毫秒的延迟的话，把这项配置为no。如果没有这么严格的实时性要求，可以设置为yes，以便能够尽可能快的释放内存。
 activerehashing yes
  
 ##对客户端输出缓冲进行限制可以强迫那些不从服务器读取数据的客户端断开连接，用来强制关闭传输缓慢的客户端。
 #对于normal client，第一个0表示取消hard limit，第二个0和第三个0表示取消soft limit，normal client默认取消限制，因为如果没有寻问，他们是不会接收数据的。
 client-output-buffer-limit normal 0 0 0
 #对于slave client和MONITER client，如果client-output-buffer一旦超过256mb，又或者超过64mb持续60秒，那么服务器就会立即断开客户端连接。
 client-output-buffer-limit slave 256mb 64mb 60
 #对于pubsub client，如果client-output-buffer一旦超过32mb，又或者超过8mb持续60秒，那么服务器就会立即断开客户端连接。
 client-output-buffer-limit pubsub 32mb 8mb 60
  
 #redis执行任务的频率为1s除以hz。
 hz 10
  
 #在aof重写的时候，如果打开了aof-rewrite-incremental-fsync开关，系统会每32MB执行一次fsync。这对于把文件写入磁盘是有帮助的，可以避免过大的延迟峰值。
 aof-rewrite-incremental-fsync yes
```



<br/>

## <span id="应用案例">Redis 应用案例</span>

### <span id="消息队列">消息队列</span>

学redis之前，确实没想过还能用来做消息队列的。

想了下，感觉还是蛮实用的，在一些不值得上 MQ 的小系统里面，用 Redis 也是个不错的方式。

- sorted-set 就不写了，没什么特别的优点；
- zadd 也能实现延时队列，不过需要轮询监听，没有阻塞式的消费方法，还是算了。

#### List 结构

**Redis 的 List 其实是一个双向链表，可以用来实现双向队列；支持多个生产者、多个消费者**

> <span style="color:red">**基于 LPUSH（左侧入队） + RPOP（右侧出队）实现；将出队轮询，进一步优化使用 BRPOP（阻塞式获取消息）优化**</span>

**方案缺点：**

- 无法避免消息丢失：例如消费者拿到消息还没有消费就宕机了，ACK 实现比较麻烦
- 只能支持单个消费、不支持广播
- BRPOP 在阻塞过程中会占用连接，长时间没有消息，redis 会断开连接节省资源，没有重连的话就功能失效了

---

代码实现：

```java
//左侧消息入队
public void leftPush(String key, MessageBO message) {
    redisTemplate.opsForList().leftPush(key, message);
}
//右侧消息出队；
public MessageBO rightPop(String key) {
    return (MessageBO) redisTemplate.opsForList().rightPop(key, 5, TimeUnit.MINUTES);
}
```

上面的出队列是最基础的出队，还需要考虑两个问题：

- **最长阻塞时间为5分钟，到达时间或者获取到消息，就会立刻结束监听**
- **所以在redis关闭连接、或者消息返回后，要重新开启监听**

所以可以定义一个队列消费者：

```java
@Slf4j
public class MessageListConsumer implements Runnable {

    private RedisTemplate redisTemplate;

    public MessageListConsumer(RedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /**
     * 右侧消息出队；
     * 1.最长阻塞时间为5分钟，到达时间或者获取到消息，就会立刻结束监听
     * 2.所以在redis关闭连接、或者消息返回后，要重新开启监听
     */
    @Override
    public void run() {
        while (true) {
            try {
                //方法返回后，监听就结束了，所以加了个死循环，反正这边也是单线程阻塞监听
                MessageBO messageBO = (MessageBO) redisTemplate.opsForList().rightPop("message:list-mq", 5, TimeUnit.MINUTES);
                handle(messageBO);
            } catch (Exception e) {
                log.info("监听出错，一般是超时，断开连接了");
            }
        }
    }

    // 获得消息后的处理操作
    public void handle(MessageBO messageBO) {
        if (messageBO == null) {
            log.info("阻塞监听队列消息超时了");
            return;
        }
        log.info("获得队列消息：{}", messageBO);
        //TODO 这边可以加入处理出错，然后怎么重新入队，或者加个死信队列
    }

}
```

测试代码省略。。。

<br/>

#### 发布订阅

常见模型，不多讲了。**消费者可以订阅一个或者多个channel、一个消息可以发布到多个消费者、消息即时发送，消息不用等待消费者读取**

适合用在消息送达要求不高的场景、例如通知公告、群聊。

**方案缺点：**

- 消息一旦发布，不能接收。换句话就是发布时若客户端不在线，则消息丢失，不能寻回
- 消费端若出现阻塞积压，会强制断开连接，导致消息丢失。

---

代码实现：

```java
@Slf4j
@RequiredArgsConstructor
@Configuration
public class MessageSubConfig {
    private final MessageListener messageListener;
    @Bean
    RedisMessageListenerContainer redisContainer(RedisConnectionFactory connectionFactory) {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        List<Topic> list = new ArrayList<>();
        list.add(new PatternTopic("message:pubsub"));
        list.add(new PatternTopic("message:pubsub-2"));
        container.addMessageListener(messageListener, list);
        return container;
    }
}
```

```java
@Component
@Slf4j
public class MessageSubHandler implements MessageListener {
    @Override
    public void onMessage(Message message, byte[] pattern) {
        log.info(message.toString());
    }
}
```

然后测试类只需要发送就好了。。。



<br/>

#### stream

Stream是支持多播、可持久化、主从复制的消息队列。

Redis Stream 有一个消息链表，将所有加入的消息都串起来，每个消息都有一个唯一的 ID 和对应的内容。每个 Stream 都有唯一的名称，它就是 Redis 的 key；

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/format,png.png)

参考下图，带上持久化 和 ACK，该有的都有了。

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/8c6ded5f367a429c8455d8b1a9b3d94a.png)

这个方案没有什么缺点，毕竟是参考 kafka 专门设计。。

---

代码实现：

自动创建 stream 分组：

```java
@Slf4j
public class EventStreamUtils {
    public static void createConsumerGroup(String key, String group, RedisTemplate redisTemplate) {
        try {
            redisTemplate.opsForStream().createGroup(key, group);
        } catch (RedisSystemException e) {
            Throwable cause = e.getRootCause();
            if (cause != null && RedisBusyException.class.equals(cause.getClass())) {
                log.info("STREAM - Redis group already exists, skipping Redis group creation: {}", group);
            } else {
                throw e;
            }
        }
    }
}
```

开启监听：

```java
@Configuration
public class MessageStreamConfig {

    @Autowired
    private MessageStreamListener streamListener;
    @Autowired
    private RedisTemplate redisTemplate;

    @Bean
    public Subscription subscription(RedisConnectionFactory factory) {
        EventStreamUtils.createConsumerGroup("mystream", "mygroup", redisTemplate);
        StreamMessageListenerContainer.StreamMessageListenerContainerOptions<String, MapRecord<String, String, String>> options = StreamMessageListenerContainer
                .StreamMessageListenerContainerOptions
                .builder()
                .pollTimeout(Duration.ofSeconds(1))
                .build();
        StreamMessageListenerContainer<String, MapRecord<String, String, String>> listenerContainer = StreamMessageListenerContainer.create(factory, options);
        Subscription subscription = listenerContainer.receiveAutoAck(Consumer.from("mygroup", "huhailong"),
                StreamOffset.create("mystream", ReadOffset.lastConsumed()), streamListener);
        listenerContainer.start();
        return subscription;
    }

}
```

消息接收处理：

```java
@Slf4j
@Component
public class MessageStreamListener implements StreamListener<String, MapRecord<String, String, String>> {
    @Autowired
    private RedisTemplate redisTemplate;
    //只会接收到新消息，就算历史的消息没有删除，也不会接收
    @Override
    public void onMessage(MapRecord<String, String, String> message) {
        log.info("接受到来自redis的消息");
        System.out.println("message id " + message.getId());
        System.out.println("stream " + message.getStream());
        System.out.println("body " + message.getValue());
        //根据id,删除stream里的消息
        redisTemplate.opsForStream().delete("mystream", message.getId());
    }
}
```

发送消息测试：

```java
@Test
public void streamPublish() throws InterruptedException {
    MessageBO message = MessageBO.builder()
        .time(new Date())
        .type("Test")
        .data("111")
        .build();
    Map<String, Object> map = JSONObject.parseObject(JSON.toJSONString(message));
    redisTemplate.opsForStream().add("mystream", map).getValue();
    Thread.sleep(2000);
}
```



<br/>

### <span id="计数器应用">计数器应用</span>

计数器应用可能不太广泛，重要的计数肯定是在数据库里的，比如：预售数量、订餐数量。

不是特别重要的技术才可能在redis内，例如：人流量、点击量。

具体可以看看别的大佬：[Redis在计数器场景上的应用 (gxlcms.com)](https://www.gxlcms.com/mysql-317790.html)

代码实现：

```java
Long count = redisTemplate.opsForValue().increment("count");
```

<br/>

### <span id="排序队列">排序队列</span>

也没什么特别的，知道有这么个玩意儿，有需要自己扩展就好了：

```java
@Test
public void sortQueue() throws Exception {
    String key = "sortQueue";
    for (int i = 0; i < 10; i++) {
        redisTemplate.opsForZSet().add(key, i, Math.random() * 100);
    }
    Set<Character> set = redisTemplate.opsForZSet().range(key, 0, -1);
    System.out.println(set);
}
```

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/image-20220817225407728.png)

<br/>

## <span id="常见解决方案">常见解决方案</span>

### <span id="数据持久化">数据持久化</span>

这部分直接看大佬们：

- [Redis持久化 - 夏尔_717 - 博客园 (cnblogs.com)](https://www.cnblogs.com/ciel717/p/16466230.html)
- [【趣话Redis第二弹】Redis数据持久化AOF和RDB原理一次搞懂！_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1sV4y147Jz/?spm_id_from=333.788&vd_source=e768d8ae5d35e9620400ecb1e8983682)
- [讲一下redis持久化方案(RDB,AOF,混合)_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1U34y1j7Gr?vd_source=e768d8ae5d35e9620400ecb1e8983682)

---

**RDB 方式：**

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/4ee3203524c53279a9d9855ea6b797c6-16608311291795.png)

**AOF 方式：**

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/a2bd9ae133cad87898c6494410ecd9f0.png)

我就总结一些自己用的配置和命令，使用 `RDB(Redis DataBase) 内存快照`、`AOF(Append Only File) 增量日志` 的混合模式：

```properties
# 核心配置规则、可以混合使用
# 300秒（5分钟）内至少10个key值改变（则进行数据库保存--持久化） 
# 60秒（1分钟）内至少10000个key值改变（则进行数据库保存--持久化）
save 300 10
save 60 10000

#数据目录，数据库的写入会在这个目录。rdb、aof文件也会写在这个目录
dir /usr/local/redis/var

#指定本地数据库文件名，一般采用默认的 dump.rdb
dbfilename dump.rdb


 # 开启 aof，aof默认不开启
 appendonly no
  
 #aof文件名
 appendfilename "appendonly.aof"
  
 #aof持久化策略的配置
 #no表示不执行fsync，由操作系统保证数据同步到磁盘，速度最快（不推荐）。
 #always表示每次写入都执行fsync，以保证数据同步到磁盘（消耗太高）。
 #everysec表示每秒执行一次fsync，可能会导致丢失这1s数据（默认策略）。
 appendfsync everysec
  
 #在aof重写或者写入rdb文件的时候，会执行大量IO，此时对于everysec和always的aof模式来说，执行fsync会造成阻塞过长时间，no-appendfsync-on-rewrite字段设置为默认设置为no。
 #如果对延迟要求很高的应用，这个字段可以设置为yes，否则还是设置为no，这样对持久化特性来说这是更安全的选择。设置为yes表示rewrite期间对新写操作不fsync,暂时存在内存中,等rewrite完成后再写入，默认为no，建议yes。Linux的默认fsync策略是30秒。可能丢失30秒数据。
 no-appendfsync-on-rewrite no
 
 # 开启混合模式
 aof-use-rdb-preamble yes
```

> **正常情况下，只开启 RDM 就够用了；**

<br/>

### <span id="分布式锁">基于Redis的分布式锁</span>

这里写两种方案：

- **基于 setnx 实现**：实现简单，全手写，不引入其他依赖；但是在存在缺陷
- **基于 redisson 实现**：成熟框架，该有的都有，完美工具

#### 基于 setnx 实现

这个方案在思路上相对简单, 只需要一个redis就可以实现。总体架构如下:

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/image-20220819232911917.png)

代码的实现逻辑如下:

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/image-20220820140420432.png)



**获得锁的线程在执行过程中出现异常（服务宕机、阻塞、抛出异常），那么没用调用删除锁命令，会导致其他永远线程无法获得锁。**

> 给这个 redis 锁加一个过期时间，确保其他服务线程正常使用

**setnx 和 expire 是两个命令，不是原子操作；可能导致 setnx 还没设置过期就挂掉**

> spring中用 `setIfAbsent(key, value, timeout, timeUnit)` ，这个方法是原子性的；
>
> 底层用的是 `set key value [EX seconds] [PX milliseconds] [NX|XX]`

**如果线程A获得锁，设置锁过期30秒，但是在30内还没执行完；这个时候B线程获得了新锁，35秒时候A线程执行完毕，把B线程的锁删了，引发连锁反应**

> 所以在删除 key 之前，需要先 `get + 判断是不是同一把锁 + del` 操作;
>
> 但是这系列操作不是原子操作，无法在 java 中完成；网上说可以通过 LUA 脚本完成

----

代码实现，以下是基于我对这个方案的理解，**手写的，没用测试过，只是个小demo**

```java
@Slf4j
@Service
public class SetnxService {

    @Value("${applicationName}")
    private String applicationName;
    private static final String LOCK_DEDUCTION = "LOCK.DEDUCTION";

    @Autowired
    private RedisTemplate redisTemplate;

    //模拟扣费业务
    public void deduction() {
        String lockValue = applicationName + ":" + UUID.randomUUID();
        try {
            //试图获取锁，并且设置30秒的锁过期时间
            Boolean lock = redisTemplate.opsForValue().setIfAbsent(LOCK_DEDUCTION, lockValue, 30, TimeUnit.SECONDS);
            //判断是否获得锁
            if (lock == null || !lock) {
                //没获得锁，等会重新请求
                int tryCount = 0;
                while (tryCount < 100) {
                    Thread.sleep(20);
                    //重新获取锁，拿到了就执行业务方法，并且返回
                    lock = redisTemplate.opsForValue().setIfAbsent(LOCK_DEDUCTION, lockValue, 30, TimeUnit.SECONDS);
                    if (lock != null && lock) {
                        log.info("执行业务代码......");
                        return;
                    }
                    tryCount++;
                }
                //循环了 100 次，还是没用拿到过锁，直接报错返回好了
                log.error("尝试超过获取锁 100 次，异常操作，得写个异常日志");
                return;
            }
            //获得锁，执行业务代码
            log.info("执行业务代码......");
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            //       注意，这个判断不是原子性的，所以在高并发情况下可能出现问题；在并发较低情况下，可以容忍的异常率场景，可以使用
            //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            if (lockValue.equals(redisTemplate.opsForValue().get(LOCK_DEDUCTION))) {
                //redis的锁还是当前的锁
                redisTemplate.delete(LOCK_DEDUCTION);
            }
        }
    }
}
```


<br/>


#### 基于 redisson 实现

**redisson 自带 锁续期、看门狗、单体/集群/主从/哨兵等redis架构的适配**，反正就是你想要的这里全都有。

这里要稍微介绍下的应该就是这个 看门狗机制：

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/image-20220820213426578.png)

**watch dog 的自动延期机制：**

> - redisson 在获取锁之后，会维护一个看门狗线程，在每一个锁设置的过期时间的1/3处，如果线程还没执行完任务，则不断延长锁的有效期。看门狗的检查锁超时时间默认是30秒，可以通过 lockWactchdogTimeout 参数来改变。
> - 加锁的时间默认是30秒，如果加锁的业务没有执行完，那么每隔 30 ÷ 3 = 10秒，就会进行一次续期，把锁重置成30秒，保证解锁前锁不会自动失效。
> - 如果系统宕机、或者异常，那么作为子线程的看门狗也会中断，那么等待30秒就锁到期。
> - **这里要注意，绝对不能在这个业务执行中进入死循环，不然永久续期了都。**

**redisson分布式锁的关键点：**

> - 对key不设置过期时间，由Redisson在加锁成功后给维护一个watchdog看门狗，watchdog负责定时监听并处理，在锁没有被释放且快要过期的时候自动对锁进行续期，保证解锁前锁不会自动失效
> - 通过Lua脚本实现了加锁和解锁的原子操作
> - 通过记录获取锁的客户端id，每次加锁时判断是否是当前客户端已经获得锁，实现了可重入锁。

**如何开启看门狗：**

> 只要获得锁的时候，别给锁加过期时间，就自动开启

----

代码实现：

```java
@Slf4j
@Service
public class RedissonService {
    private static final String LOCK_DEDUCTION = "LOCK.DEDUCTION";
    @Autowired
    private RedissonClient redissonClient;

    //模拟扣费业务
    public void deduction() {
        // 普通的可重入锁
        RLock lock = redissonClient.getLock(LOCK_DEDUCTION);
        try {
            // lock.lock()会不断重试获取锁，一直循环
            // 尝试拿锁10s后停止重试,返回false
            // 具有Watch Dog 自动延期机制 默认续30s
            if (lock.tryLock(10, TimeUnit.SECONDS)) {
                log.info("执行业务代码......");
            }
            // 尝试拿锁100s后停止重试,返回false；没有Watch Dog ，10s后自动释放
            // lock.tryLock(100, 10, TimeUnit.SECONDS);
            // 公平锁 保证 Redisson 客户端线程将以其请求的顺序获得锁
            // RLock fairLock = redissonClient.getFairLock("fairLock");
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            //解锁
            lock.unlock();
        }
    }
}
```

```java
@Data
@Configuration
public class RedissonConfig {

    @Value("${spring.redis.host}")
    private String host;
    @Value("${spring.redis.port}")
    private String port;
    @Value("${spring.redis.password}")
    private String password;

    @Bean
    public RedissonClient getRedisSon() {
        Config config = new Config();
        String address = "redis://" + host + ":" + port;
        config.useSingleServer().setAddress(address);
        if (null != password && !"".equals(password.trim())) {
            config.useSingleServer().setPassword(password);
        }
        return Redisson.create(config);
    }
}
```





<br/>

集群、哨兵遇到了再搞吧，也不复杂：



<br/>

### <span id="常见命令检索表">常见命令检索表</span>

这些都是终端敲的，一般用不到太多，基本都是在代码里用，所以只写一些用得上的

| 命令 + 作用                  | 命令 + 作用             | 命令 + 作用       | 命令 + 作用                      | 命令 + 作用           | 命令 + 作用             |
| ---------------------------- | ----------------------- | ----------------- | -------------------------------- | --------------------- | ----------------------- |
| exists key；键是否存在       | set key value；设置键值 | del key；删除键值 | expire key seconds；设置过期时间 | ttl key；获得过期时间 | type key；返回key的类型 |
| rename oldkey newkey；重命名 |  getset key newValue；原子操作，设置新值，返回旧值 | setnx key value；key不存在则设置 |                                  |                       |                         |
|                              |                         |                   |                                  |                       |                         |







<br/>

## <span id="te">参考文章</span>

- [【全套免费】GitHub 上标星60K 的Redis入门到精通全套教程，从GitHub火到了B站！让你彻底告别资源付费！！！_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1Tf4y177L5?spm_id_from=333.999.0.0&vd_source=e768d8ae5d35e9620400ecb1e8983682)
- [使用Java操作Redis的两种方式Jedis、RedisTemplate_扎哇太枣糕的博客-CSDN博客_java操作redis有几种方法](https://blog.csdn.net/qq_59138417/article/details/124525767)
- [jedis和redistemplate区别-木庄网络博客 (muzhuangnet.com)](http://www.muzhuangnet.com/show/47024.html)
- [Redis实现消息队列_..Serendipity的博客-CSDN博客_redis消息队列](https://blog.csdn.net/weixin_45690465/article/details/124566098)
- [Redis实现消息队列的4种方案 - 简书 (jianshu.com)](https://www.jianshu.com/p/d32b16f12f09)
- [【转载】Redis实现消息队列的4种方案 - yaohl0911 - 博客园 (cnblogs.com)](https://www.cnblogs.com/yaohl0911/p/14932134.html)
- [Java redisTemplate阻塞式处理消息队列_java_脚本之家 (jb51.net)](https://www.jb51.net/article/230977.htm)
- [Redis消息队列——Redis Stream_努 力 小 子的博客-CSDN博客_redis stream](https://blog.csdn.net/z2431435/article/details/124978166)
- [Java spring boot redisTemplate之Stream组件 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/440831491)
- [SpringBoot 中使用Redis Stream 实现消息监听_@胡海龙的博客-CSDN博客_redis消息监听器容器](https://blog.csdn.net/hhl18730252820/article/details/114826366)
- [java - 如何将消费者组与Spring Data Redis for Redis Streams一起使用（继续获得NOGROUP）？- 堆栈溢出 (stackoverflow.com)](https://stackoverflow.com/questions/61465222/how-to-use-consumer-groups-with-spring-data-redis-for-redis-streams-keep-gettin)
- [Redis持久化_hi wei的博客-CSDN博客_redis持久化](https://blog.csdn.net/nianqrzhanghw/article/details/121163780)
- [Redis持久化 - 夏尔_717 - 博客园 (cnblogs.com)](https://www.cnblogs.com/ciel717/p/16466230.html)
- [Redis配置文件详解 (wjhsh.net)](http://www.wjhsh.net/chuijingjing-p-12832678.html)
- [什么是分布式锁？几种分布式锁分别是怎么实现的？_普通网友的博客-CSDN博客_分布式锁- ](https://blog.csdn.net/x275920/article/details/125409441)
- [浅析redis setIfAbsent的用法及在分布式锁上的应用及同步锁的缺陷 - 古兰精 - 博客园 (cnblogs.com)](https://www.cnblogs.com/goloving/p/16026003.html)
- [SpringBoot集成redisson_克伦留索夫的博客-CSDN博客_springboot集成redisson](https://blog.csdn.net/qq_35429398/article/details/121629496)
- [Redisson的看门狗机制_JAVA_侠的博客-CSDN博客_redisson看门狗机制](https://blog.csdn.net/m0_45364328/article/details/125175796)












