#### 一行删除数组指定元素
```javascript
//传入对应元素
listStepData.splice(object, 1)

//根据对象中的某个值，进行删除；
//过滤后获得一个新数组
const newArr = arr.filter(item => item.id!== 3);
```

#### 复制文本到剪贴板
```
copy(data) {
  const textarea = document.createElement('textarea')
  textarea.value = data
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
  this.$modal.msgSuccess('抖音openId已复制！')
}
```
