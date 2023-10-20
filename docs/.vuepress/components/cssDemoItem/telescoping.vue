<template>
    <div class="cssDemoItem" style="height: 400px;">
        <div class="container">
            <div class="search-box">
                <input type="text" class="search-txt" placeholder="想搜啥?" />
                <a class="search-btn">
                    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" style="height: 20px;">
                        <path fill="currentColor"
                            d="m795.904 750.72 124.992 124.928a32 32 0 0 1-45.248 45.248L750.656 795.904a416 416 0 1 1 45.248-45.248zM480 832a352 352 0 1 0 0-704 352 352 0 0 0 0 704z">
                        </path>
                    </svg>
                    <!-- <i class="fa fa-search" aria-hidden="true"></i> -->
                </a>
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
    name: "telescoping",
    data() {
        return {
            componentName: 'telescoping',
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
    height: 400px;
    /* 渐变背景 */
    background: linear-gradient(200deg, #e3eeff, #f3e7e9);
}

.search-box {
    /* 绝对定位 水平垂直居中 */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #2f3640;
    height: 40px;
    padding: 10px;
    border-radius: 40px;
}

.search-txt {
    border: none;
    background: none;
    outline: none;
    float: left;
    padding: 0;
    color: #fff;
    font-size: 16px;
    line-height: 40px;
    height: 40px;
    width: 0;
    /* 动画过渡 */
    transition: 0.4s;
}

.search-btn {
    color: #e84118;
    float: right;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #2f3640;
    /* 弹性布局 水平垂直居中 */
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    /* 动画过渡 */
    transition: 0.4s;
}

.search-box:hover .search-txt {
    width: 200px;
    padding: 0 6px;
}

.search-box:hover .search-btn {
    background-color: #fff;
}
</style>
  