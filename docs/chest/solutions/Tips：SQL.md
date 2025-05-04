#### UPDATE WHERE SELECT
根据 Select 作为条件，进行 Update。
```sql
UPDATE wms_reserve_train AS opt
INNER JOIN ( 
  SELECT wo.id AS id 
  FROM wms_order wo 
  LEFT JOIN wms_order_detail wod ON wod.order_id = wo.id 
  WHERE wod.plate_no = '浙B6W5E2' 
  ) AS alias 
SET opt.order_num = 1 
WHERE
	opt.id = alias.id;
```
<span style="color:red;">使用 `UPDATE WHERE IN SELECT` 会存在锁死情况。</span>

#### CASE 条件判断
```sql
UPDATE wms_order_detail
SET delivery_status = #{status} ,
    actual_delivery_date = now(),
    is_finish = (
                SELECT CASE #{status}
                WHEN '10' THEN 1 ELSE 0 END
                from DUAL
                )
where id = #{id}
```

#### mybatis 循环数组
```sql
UPDATE wms_order_detail
SET plate_no = #{plateNo}
    ,deliver_date = #{deliverDate}
    ,deliver_remarks = #{deliverRemarks}
where id in
    <foreach collection='detailIdArray' item='item' separator=',' open="(" close=")">
        #{item}
    </foreach>
```

#### 副表详情条数统计
```sql
UPDATE wms_order opt
SET opt.sku_num = (
    SELECT hp.counts
    FROM
        ( SELECT order_id, count(*) counts
          FROM wms_order_detail wod
          WHERE wod.del_flag = 0
          GROUP BY wod.order_id
        ) hp
    WHERE opt.id = hp.order_id
)
WHERE opt.id = #{id}
```

#### IF 条件判断
```sql
SELECT
  r.id AS id,
  IF(( r.weight / r.volume > 250 ), 'H', 'L' ) AS isLightOrHeavy 
FROM
  wms_reserve_train r 
```

#### SELECT 字段 "," 分割 IN 查询
```sql
select * from sys_dept
where find_in_set(#{deptId}, ancestors)
```

#### 多对多正则匹配
```sql
select * from fin_pay_bill 
where CONCAT(",", belong_dept_id, ",") REGEXP ',115,|,117,'
```
<span style="color:red;font-weight:bold">含义是：拿 `,115,` 和  `,117,` 匹配对应字段，只要一个满足。</span>
