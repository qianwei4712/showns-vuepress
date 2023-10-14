## 前言

*2022.01.03，MySQL 汇总优化前置章节*

> 使用 **EXPLAIN** 关键字可以模拟优化器执行 SQL 查询语句，从而知道 MySQL 是如何处理你的 SQL 语句的，从而分析性能瓶颈。

它的作用如下：

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/image-20220103224348730.png)

官方文档连接如下：

- **EXPLAIN 格式在线文档：** https://dev.mysql.com/doc/refman/8.0/en/explain-output.html

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/1641203466485-200f4879-96d3-4afb-80c1-ebe4e750c24e.png)





<br/>

## 执行计划字段

使用以下 SQL 作为例子：

```sql
EXPLAIN SELECT DISTINCT
	opt.order_bill_no 
FROM
	wms_order_detail opt
	LEFT JOIN wms_order wo ON wo.id = opt.order_id 
	AND wo.del_flag = 0
	LEFT JOIN wms_entry_detail wed ON opt.id = wed.order_detail_id 
	AND wed.del_flag = 0 
WHERE
	opt.del_flag = 0 
	AND opt.deliver_box_num != wed.sign_box_num 
	AND ( wo.order_status = '40' OR wo.order_status = '50')
```

执行结果先给个截图：

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/1641210500055-3a53225c-0f37-4680-b465-a8f1e4313376.png)

各字段说明、以及关注点如下：

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/20210108%20MySQL%20%E4%BC%98%E5%8C%96%E6%80%BB%E7%BB%93.png)



<br/>

### extra 说明

extra 主要类型及说明如下：

![](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/images/20210108%20MySQL%20%E4%BC%98%E5%8C%96%E6%80%BB%E7%BB%93-16416314296521.png)



<br/>

## 参考文章

1. [SQL执行计划_Jay的博客-CSDN博客_sql执行计划](https://blog.csdn.net/qq_44836294/article/details/107620909)
2. [explain执行计划详解_eagle89的专栏-CSDN博客_explain执行计划](https://blog.csdn.net/eagle89/article/details/80433723)
3. [Explain中的filtered列_weixin_34050389的博客-CSDN博客](https://blog.csdn.net/weixin_34050389/article/details/92054757)

