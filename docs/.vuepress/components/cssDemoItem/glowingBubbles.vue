<template>
    <div class="cssDemoItem" style="height: 700px;">
        <div class="container">
            <div class="bubble-container">
                <div class="bubble"></div>
                <div class="shadow"></div>
            </div>
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
    name: "glowingBubbles",
    data() {
        return {
            componentName: 'glowingBubbles',
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
    /* 100%窗口高度 */
    height: 700px;
    /* 弹性布局 居中显示 */
    display: flex;
    justify-content: center;
    align-items: center;
    /* 渐变背景 */
    background: linear-gradient(150deg, #d299c2, #fef9d7);
    /* 溢出隐藏 */
    overflow: hidden;
}

.bubble-container {
    width: 200px;
    height: 200px;
    /* 相对定位 */
    position: relative;
}

/* 泡泡 */
.bubble {
    width: 100%;
    height: 100%;
    /* 径向渐变 */
    background: radial-gradient(circle at 75% 30%, #fff 5px, #ff21c0 8%, #5b5b5b 60%, #ff21c0 100%);
    border-radius: 50%;
    /* 阴影 */
    box-shadow: inset 0 0 20px #fff,
        inset 10px 0 46px #eaf5fc,
        inset 80px 0 60px #efcde6,
        inset -20px -60px 100px #f9f6de,
        inset 0 50px 140px #f9f6de,
        0 0 90px #fff;
    /* 执行动画：动画名 时长 加速后减速 无限次播放 */
    animation: bubble 4s ease-in-out infinite;
}

.shadow {
    background-color: rgba(0, 0, 0, 0.15);
    width: 150px;
    height: 40px;
    border-radius: 50%;
    /* 绝对定位 */
    position: absolute;
    left: 50%;
    margin-left: -75px;
    bottom: -100px;
    /* 一点点模糊效果 */
    filter: blur(1px);
    /* 执行动画：动画名 时长 加速后减速 无限次播放 */
    animation: shadow 4s ease-in-out infinite;
}

/* 定义动画 */
/* 泡泡浮动动画 */
@keyframes bubble {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-80px);
    }
}

/* 投影动画 */
@keyframes shadow {

    0%,
    100% {
        transform: scale(0.5);
    }

    50% {
        transform: scale(1);
    }
}
</style>
  