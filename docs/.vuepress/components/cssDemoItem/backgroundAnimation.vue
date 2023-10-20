<template>
    <div class="cssDemoItem" style="height: 600px;">
        <div class="container">
            <div class="text">渐变背景动画</div>
        </div>
        <div class="copyright">
            <div>
                <a :href="sourceFileUrl" target="_blank" class="cssClickMe" style="color: red;">👉👉点我->看代码🤠</a>
            </div>
            <div>
                <a :href="copyright" target="_blank">版权：© {{ copyright }}</a>
            </div>
        </div>
    </div>
</template>
  
<script>
export default {
    name: "backgroundAnimation",
    data() {
        return {
            componentName: 'backgroundAnimation',
            sourceFileUrl: '',
            copyright: 'https://gitee.com/wyanhui02/html_css_demo'
        }
    },
    created() {
        this.sourceFileUrl = "https://gitee.com/qianwei4712/showns-vuepress/tree/master/docs/.vuepress/components/cssDemoItem/" + this.componentName + ".vue";
    },
    methods: {
    },
}
</script>
  
<style lang="scss" scoped>
.container {
    /* 初始化 取消内外边距 */
    margin: 0;
    padding: 0;
    /* 100%窗口高度 */
    height: 600px;
    /* 弹性布局 水平垂直居中 */
    display: flex;
    justify-content: center;
    align-items: center;
    /* 渐变背景 */
    background: linear-gradient(125deg, #2c3e50, #27ae60, #2980b9, #e74c3c, #8e44ad);
    /* 指定背景图像的大小 */
    background-size: 500%;
    /* 执行动画：动画名 时长 线性的 无限次播放 */
    animation: bgAnimation 15s linear infinite;
}

.text {
    color: #fff;
    font-size: 30px;
    /* 字间距 */
    letter-spacing: 15px;
}

/* 定义动画 */
@keyframes bgAnimation {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}
</style>
  