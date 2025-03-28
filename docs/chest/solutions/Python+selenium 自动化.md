> Python + chromedriver + Chrome + selenium，进行web自动化操作。

**chromedriver 和 chrome 版本一定要对应**，先看看效果

![python-driver执行效果](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/python-driver%E6%89%A7%E8%A1%8C%E6%95%88%E6%9E%9C.gif)

### 文档与准备

1. [驱动下载：ChromeDriver Latest Releases Versions Downloads](https://getwebdriver.com/chromedriver)
   ，需要翻墙，驱动和对应版本的chrome都可以下载；

![image-20250329000037653](https://shiva.oss-cn-hangzhou.aliyuncs.com/picture-master/202204/image-20250329000037653.png)

2. 安装 Python；
3. pip 安装依赖：

```python
pip install selenium
```

### 基础Demo来一个

使用的是DOM节点进行调用，应该不用再解释了

```python
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
import time

# Edge的驱动，需要换方法 webdriver.Edge()
# 创建 WebDriver 对象，指明使用chrome浏览器驱动;
wd = webdriver.Chrome(service=Service("C:\\Users\\shiva\\Desktop\\chromedriver.exe"))
# 窗口最大
wd.maximize_window()
# 最长等待时间
wd.implicitly_wait(5)
# 调用WebDriver 获取当前打开的页面
wd.get("https://www.baidu.com")
# 拿到中间的主输入框，填写信息
mainInut = wd.find_element(By.CLASS_NAME, "s_ipt")
mainInut.send_keys("shiva")
# 点击百度按钮
submitBtn = wd.find_element(By.ID, "su")
submitBtn.click()
# 等待一会，防止自动结束
time.sleep(30)
```

### 常见用法记录（省的以后找）

```python
    # 找到输入框，填写账号密码
    loginInput = wd.find_elements(By.CLASS_NAME, 'el-input__inner')
    # 后续要修改，账号密码要做成动态
    loginInput[0].send_keys(mobile)
    loginInput[1].send_keys(password)
```

```python
    # 判断有没有弹窗，可以关闭
    dialogBtn = wd.find_element(By.CLASS_NAME, 'nextStepBtn')
    # 弹窗存在，那就点点掉
    if dialogBtn.is_displayed():
        dialogBtn.click()
```

```python
    # 记录几种选择器
    element = element.find_element(By.CSS_SELECTOR, 'input[value="买入"]')
    element = inputWraps[0].find_element(By.CSS_SELECTOR, 'input[type="number"]')
    element = wd.find_element(By.ID, 'middleMargin')
    element = wd.find_element(By.CSS_SELECTOR, '.el-button.el-button--default.el-button--small.el-button--primary')
	# 清空输入框
    input = wd.find_elements(By.CLASS_NAME, 'sty')
    input[0].clear()
```

### 参考内容

[原理与安装 - 白月黑羽](https://www.byhy.net/auto/selenium/01/)

[介绍 · Selenium 中文文档 · 看云](https://www.kancloud.cn/wizardforcel/selenium-doc/102082)

[Selenium 自动化环境安装_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1Z4411o7TA/?p=2&spm_id_from=pageDriver&vd_source=e768d8ae5d35e9620400ecb1e8983682)
