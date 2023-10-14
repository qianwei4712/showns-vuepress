<div class="catalog">

- [MySQL 架构](#MySQL架构)
- [MySQL 系统文件](#MySQL系统文件)
  - [binlog 日志](#binlog日志)
  - [my.cnf 配置](#my.cnf配置)
- [存储引擎](#存储引擎)
- [SQL 执行与 JOIN](#SQL执行与JOIN)
- [索引讲解](#索引讲解)
- [参考文章](#参考文章)

</div>

## <span id="MySQL架构">MySQL 架构</span>



<img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20211225190105621.png" style="zoom:80%;" />



客户端连接器就是我们常见的 JDBC 等数据库连接框架。

MySQL Server 就是我们说的数据库了，它的模块和作用分别为：

| 顺序 | 组件               | 作用                                                         |
| ---- | ------------------ | ------------------------------------------------------------ |
| 1    | 连接池             | 管理、缓冲用户的连接，线程处理等需要缓存的需求，一个线程负责一个连接 |
| 2    | SQL 接口           | 接受用户的SQL命令，并且返回用户需要查询的结果；比如 DML、DDL、试图、触发器等。SQL语句在查询之前会使用查询优化器对查询进行优化 |
| 3    | 解析器             | SQL命令传递到解析器的时候会被解析器验证和解析(权限、语法结构) |
| 4    | 查询优化器         | SQL语句在查询之前会使用查询优化器对查询进行优化，MySQL 自带的查询优化 |
| 5    | 缓存               | 如果查询缓存有命中的查询结果，查询语句就可以直接去查询缓存中取数据 |
| 6    | 存储引擎           | 存储引擎说白了就是如何管理操作数据（存储数据、如何更新、查询数据等）的一种方法。因为在关系数据库中数据的存储是以表的形式存储的，所以存储引擎也可以称为表类型（即存储和操作此表的类型 |
| 7    | 系统管理和控制工具 | 系统管理和控制工具，例如备份恢复、Mysql复制、集群等          |

流程如下：

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/v2-b29359b4bc5e849601c5df10a2a8e484_720w.jpg)

再按照人话解释一遍：

1. 显示客户端发起连接，连接器用来做 `身份认证`、`线程重用`，最后 **建立连接**
2. 然后 SQL接口 拿到需要执行的语句，包括：DDL、DML等，然后 **对语句进行分析** ，简单讲也就是明确下这一句脚本有哪些关键词

> - **数据定义语言（DDL）：常用的有CREATE和DROP，用于在数据库中创建新表或删除表，以及为表加入索引等。**
> - **数据操纵语言（DML）：主要用来对数据库的数据进行一些操作，常用的就是INSERT、UPDATE、DELETE。****

3. 然后 解析器（分析器） 拿到 SQL接口分析后的内容，**再进行执行分析，明确执行哪张表、修改什么字段**
4. 如果缓存里已经有了，就直接返回；没有的话再往下执行
5. 也有可能我们写的脚本 MySQL 可以不认可，它会 **使用自己的优化器，对我们的 SQL 进行执行优化**
6. 最后执行器调用存储引擎，进行读写

<br/>



## <span id="MySQL系统文件">MySQL 系统文件</span>

MySQL 数据存储在系统文件上，是物理存储。由存储引擎完成交互，主要内容如下：

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/20211231%20MySQL%20%E5%AD%A6%E4%B9%A0%E7%9B%B8%E5%85%B3%E5%AF%BC%E5%9B%BE.png)

系统文件中，最值得关注的，应该就是 **my.cnf 配置文件** 以及 **binlog 二进制日志** 

<br/>

### <span id="binlog日志">binlog 日志</span>

binlog 就是binary log，二进制日志文件，这个文件记录了mysql所有的 DML 操作。

通过 binlog 日志我们可以做数据恢复，做主住复制和主从复制等等，对于运维或者架构人员来讲是非常重要的。

> **由于日志的记录带来的直接性能损耗就是数据库系统中最为昂贵的IO资源。**

binlog 为了运维数据安全，而牺牲了一部分性能。



#### 日志模式

**Mysql binlog日志有三种格式，分别是Statement、MiXED、ROW**

- Statement：每一条会修改数据的sql都会记录在binlog中

优点：不需要记录每一行的变化，减少了binlog日志量，节约了IO，提高性能。

缺点：由于记录的只是执行语句，为了这些语句能在slave上正确运行，因此还必须记录每条语句在执行的时候的一些相关信息，以保证所有语句能在slave得到和在master端执行时候相同的结果。

- Row:不记录sql语句上下文相关信息，仅保存哪条记录被修改

优点：rowlevel的日志内容会非常清楚的记录下每一行数据修改的细节。而且不会出现某些特定情况下的存储过程，或function，以及trigger的调用和触发无法被正确复制的问题

缺点：所有的执行的语句当记录到日志中的时候，都将以每行记录的修改来记录，这样可能会产生大量的日志内容，造成binlog日志量会很大。

- Mixedlevel: 是以上两种level的混合使用

一般的语句修改使用statment格式保存binlog，如一些函数，statement无法完成主从复制的操作，则采用row格式保存binlog,MySQL会根据执行的每一条具体的sql语句来区分对待记录的日志形式，也就是在Statement和Row之间选择一种。



#### 开启日志

在 my.cnf 配置文件中填写

```properties
# 打开binlog日志
log_bin=ON
# binlog日志的基本文件名，后面会追加标识来表示每一个文件
log_bin_basename=/var/lib/mysql/mysql-bin
# binlog日志的基本文件名，后面会追加标识来表示每一个文件
log_bin_index=/var/lib/mysql/mysql-bin.index
```

然后可以通过以下命令检查：

```properties
show master status;
```

#### 数据恢复

使用 以下命令可以查看 binlog 日志中的二进制记录：

```sql
show binlog events in 'mysql-bin.000003';
show binlog events in 'mysql-bin.000003' from 406;
```

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/1292627-20190507153243655-1493589710.png)



退出mysql ，使用 mysql 自带的 **mysqlbinlog** 工具进行恢复

```shell
//按指定时间恢复
mysqlbinlog --start-datetime="2020-04-25 18:00:00" --stop-datetime="2020-04-26 00:00:00" mysqlbinlog.000002 | mysq1 -uroot -proot
//按事件位置号恢复
mysqlbinlog --start-position=154 --stop-position=957 mysqlbinlog.000002 | mysq1 uroot -proot
```

#### 主从复制

主从复制需要的必要条件：

> **服务器操作系统版本和位数一致、数据库的版本和位数一样、同时开启binlog、配置文件中server_id在局域网内唯一**

master 数据库配置：

```properties
[mysqld]
log_bin=mysql-bin-1 #文件名mysql-bin-1
server_id=1 #服务ID，用于区分服务，范围1~2^32-1
#MySQL 磁盘写入策略以及数据安全性
#每次事务提交时MySQL都会把log buffer的数据写入log file，并且flush(刷到磁盘)中去
innodb_flush_log_at_trx_commit=1 
#当sync_binlog =N (N>0) ，MySQL 在每写 N次 二进制日志binary log时，会使用fdatasync()函数将它的写二进制日志binary log同步到磁盘中去。
sync_binlog=1
binlog-do-db=test #同步数据库
#mysql复制模式，三种：SBR（基于sql语句复制），RBR（基于行的复制），MBR（混合模式复制）
binlog_format=MIXED #混合模式复制
expire_logs_days=7 #binlog过期清理时间
max_binlog_size=20M #binlog每个日志文件大小
skip-name-resolve
datadir=/var/lib/mysql
socket=/var/lib/mysql/mysql.sock
# Disabling symbolic-links is recommended to prevent assorted security risks
symbolic-links=0
# Recommended in standard MySQL setup
sql_mode=NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES 
[mysqld_safe]
log-error=/var/log/mysqld.log
pid-file=/var/run/mysqld/mysqld.pid
```

slave 数据库配置，其他配置都一样：

```properties
[mysqld]
log_bin=mysql-bin-2 #文件名mysql-bin-2
server_id=2  #服务ID，用于区分服务，范围1~2^32-1
```

创建同步权限及赋权，在 master mysql中新建同步权限：

```sql
grant replication slave on *.* to 'root'@'B' identified by '123456';
```

完成 Master 和 Slave 链接步骤：

|                                             |                                                              |
| ------------------------------------------- | ------------------------------------------------------------ |
| 查询master状态                              | `show master status;`                                        |
| 根据master状态信息，在slave上设置master信息 | `change master to master_host='A',master_port=3306,master_user='root',master_password='123456',master_log_file='mysql-bin-2.000009',master_log_pos=120;` |
| 开始slave的同步                             | `start slave;`                                               |
| 查看slave的状态                             | `show slave status\G;`                                       |

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220101001014707.png)



#### 其他操作

- `flush logs` ：刷新日志，创建一个新的 binlog 文件
- `reset master` ：清空全部 binlog 日志文件，重新开始
- `show variables like 'expire_logs_days'` ：该参数表示binlog日志自动删除/过期的天数，默认值为0，表示不自动删除
- ` purge master logs before '2012-03-30 17:20:00';` ：删除指定日期以前的日志索引中binlog日志文件



<br/>

### <span id="my.cnf配置">my.cnf 配置</span>

my.cnf 一般在 `/etc/my.cnf` ，配置参数可以参考下面链接：

- [MySQL 配置文件 my.cnf 参数参考 · 语雀 (yuque.com)](https://www.yuque.com/shiva/bvds0d/vty11e)



<br/>

## <span id="存储引擎">存储引擎</span>

MySQL 采用了插件式存储引擎架构，将查询处理和其他的系统任务以及数据的存储提取分离，可以更好的切换不同应用场景。

全部引擎上图中已经列举，但是我们使用过的就两种： **MyISAM** 和 **InnoDB**

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220101113825342.png)

使用以下命令，可以查看当前默认的存储引擎：

```sql
show variables like '%storage_engine%'
```

然后就是这两个存储引擎的对比：

- 官方表格文档：[第 15 章 替代存储引擎 (oracle.com)](https://docs.oracle.com/cd/E17952_01/mysql-5.5-en/storage-engines.html)

| Feature                    | MyISAM | InnoDB |
| -------------------------- | ------ | ------ |
| **B 树索引**               | Yes    | Yes    |
| **备份/时间点恢复**        | Yes    | Yes    |
| **群集数据库支持**         | No     | No     |
| **聚集索引**               | No     | Yes    |
| **压缩数据**               | Yes    | Yes    |
| **数据缓存**               | No     | Yes    |
| **加密数据**               | Yes    | Yes    |
| **外键支持**               | No     | Yes    |
| **全文搜索索引**           | Yes    | Yes    |
| **地理空间数据类型支持**   | Yes    | Yes    |
| **地理空间索引支持**       | Yes    | Yes    |
| **哈希索引**               | No     | No     |
| **索引缓存**               | Yes    | Yes    |
| **锁定粒度**               | Table  | Row    |
| **断续器**                 | No     | Yes    |
| **复制支持**               | Yes    | Yes    |
| **仓储限制**               | 256TB  | 64TB   |
| **T 树索引**               | No     | No     |
| **事务**                   | No     | Yes    |
| **更新数据字典的统计信息** | Yes    | Yes    |

<br/>

对比的话就看看表好了，总结一下：

> - **MyISAM：不支持事务，只支持表锁。即使操作一条数据也会锁住整张表，不支持高并发。适合用在文章、内容存储，例如：评论表、文章表。**
> - **InnoDB：支持事务，支持行锁。用在所有需要事务的操作，高并发的表。**



<br/>

## <span id="SQL执行与JOIN">SQL 执行与 JOIN</span>

一句完整的 SQL 执行顺序如下：

```sql
(8)SELECT (9)DISTINCT  (11)<Top Num> <select list>
(1)FROM [left_table]
(3)<join_type> JOIN <right_table>
(2)ON <join_condition>
(4)WHERE <where_condition>
(5)GROUP BY <group_by_list>
(6)WITH <CUBE | RollUP>
(7)HAVING <having_condition>
(10)ORDER BY <order_by_list>
```

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220101134949740.png)



SQL Join 关系如下：[一张图看懂 SQL 的各种 JOIN 用法 | 菜鸟教程 (runoob.com)](https://www.runoob.com/w3cnote/sql-join-image-explain.html)

<img src="https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/sql-join.png" style="zoom:80%;" />



<br/>

## <span id="索引讲解">索引讲解</span>

索引相关知识图谱如下：

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/20211231%20MySQL%20%E5%AD%A6%E4%B9%A0%E7%9B%B8%E5%85%B3%E5%AF%BC%E5%9B%BE-16411277207761.png)



> **索引也很庞大，所以索引也是保存在系统文件中。**

<br/>

### 基础使用

索引基本使用语法，也就是新增、删除，语句都比较简单。

**添加索引：**

```sql
# 唯一索引创建
CREATE UNIQUE INDEX indexName ON tablename(columnname(length));
ALTER tablename ADD UNIQUE INDEX indexName ON tablename(columnname(length));
# 普通索引创建
CREATE INDEX indexName ON tablename(columnname(length));
```

**删除索引：**

```sql
DROP INDEX [indexname] ON tablename;
```

**查看索引：**

```sql
SHOW INDEX FROM tablename;
```

### BTree 原理

在开始之前，首先理解下：*磁盘中分为一个一个的磁盘块，数据则是存储在一个一个的磁盘块中。*

然后看 B+树的示意图，**每次查询一个通过一个指针查询数据块，都进一步靠近目标值**：

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/20210102%20MySQL%20%E5%8E%9F%E7%90%86%E7%9B%B8%E5%85%B3%E7%BB%98%E5%9B%BE.png)



通过示意图，我们可以得出：

> - **真实数据保存在叶子节点，非叶子节点不保存真实数据**
>
> - **B+树的高度，就是查询的次数**
>



## <span id="参考文章">参考文章</span>

1. [Mysql 架构分析 - 若水一剑 - 博客园 (cnblogs.com)](https://www.cnblogs.com/qdmpky/archive/2020/07/14/13299246.html)
2. [MySQL体系结构 - 别来无恙- - 博客园 (cnblogs.com)](https://www.cnblogs.com/yanjieli/p/9780100.html)
3. [MySQL基本架构 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/146502753)
4. [MySQL体系结构详解 (biancheng.net)](http://c.biancheng.net/view/7939.html)
5. [6.MySQL架构详解 - 简书 (jianshu.com)](https://www.jianshu.com/p/cf4e34fb999f?utm_campaign=hugo)
6. [《SQL中有关DQL、DML、DDL、DCL的概念与区别》_小贪玩-CSDN博客_dcl dql](https://blog.csdn.net/u013544734/article/details/80869135)
7. [开启MySQL的binlog日志_happyfly的博客-CSDN博客_mysql开启binlog](https://blog.csdn.net/king_kgh/article/details/74800513)
8. [MySQL 数据库之Binlog日志使用总结 - 散尽浮华 - 博客园 (cnblogs.com)](https://www.cnblogs.com/kevingrace/p/6065088.html)
9. [mysql中利用binlog日志恢复数据_songrenqing-CSDN博客_利用binlog日志恢复mysql数据](https://blog.csdn.net/songrenqing/article/details/80330592)
10. [二、binlog的主从复制_编程的小新的博客-CSDN博客_binlog主从复制](https://blog.csdn.net/ruben95001/article/details/86708382)
11. [mysql之my.cnf详解 - 百衲本 - 博客园 (cnblogs.com)](https://www.cnblogs.com/panwenbin-logs/p/8360703.html)
12. [关于sql和MySQL的语句执行顺序(必看！！！)_猪哥-CSDN博客_sql执行顺序](https://blog.csdn.net/u014044812/article/details/51004754)
13. [sql执行顺序 - qanholas - 博客园 (cnblogs.com)](https://www.cnblogs.com/qanholas/archive/2010/10/24/1859924.html)



