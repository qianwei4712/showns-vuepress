#### List 排序
```java
source.stream().sorted(Comparator.comparing(GridPersonEduCountBO::getEducationType)).collect(Collectors.toList())
```

#### List 按条件过滤出符合条件的结果
```java
List<Role> list = roles.stream().filter(r -> !r.isAdmin()).collect(Collectors.toList())
Optional<GridPersonEduCountBO> any = source.stream().filter(item -> item.getEducationType().equals(sysDictDatum.getDictValue())).findAny();
if (!any.isPresent()) {
//TODO
}
```

#### List 获得某个字段最大值
```java
long value = countByGrid.stream().max(Comparator.comparing(CountTaskAnalyzeBO::getValue)).get().getValue();
```

#### List 按某个字段分组成 Map
```java
Map<String, List<SysDictData>> dictDataMap = dictDataMapper.selectDictDataList(dictData).stream().collect(Collectors.groupingBy(SysDictData::getDictType));
```

#### 累加某个字段数值
```java
Integer sumBoxNum = entryDetails.stream().map(EntryDetail::getAppointBoxNum).reduce(0, Integer::sum);
```

#### 如果存在可能为空的字段
```java
orderList.stream()
.map(order -> Optional.ofNullable(order.getAmount()).orElse(0L))
.reduce(0L, Long::sum);
```

#### 匹配是否包含某个元素
```java
//是否包括
findAll().stream().anyMatch(e -> e.getBillNo().equals(billNo));
//是否不包括
roleIds.stream().noneMatch(r -> r == BusConst.ROLE_INSIDE_OPERATE)
```

#### 从Object 中提取某个字段
```java
List<String> deviceCodeList = mobileClients.stream().map(MobileClient::getOriginDeviceCode).collect(Collectors.toList());
```
