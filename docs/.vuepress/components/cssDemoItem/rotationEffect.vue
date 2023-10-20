<template>
    <div class="cssDemoItem" style="height: 400px;">
        <div class="container">
            <div class="loading"></div>
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
    name: "rotationEffect",
    data() {
        return {
            componentName: 'rotationEffect',
            sourceFileUrl: '',
            copyright: 'https://codepen.io/alphardex/full/OJPvMGx'
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
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px;
    background: black;
}

.loading {
    position: relative;
    width: 8em;
    height: 8em;
    background: black;
    border-radius: 50%;
    box-shadow: inset 0.5em -0.5em crimson;
    animation: spin 2s linear infinite;

    &::before {
        filter: blur(5px);
    }

    &::after {
        filter: blur(10px);
    }
}

.loading::before,
.loading::after {
    position: absolute;
    content: "";
    width: 100%;
    height: 100%;
    background: inherit;
    border-radius: inherit;
    box-shadow: inherit;
}

@keyframes spin {
    to {
        transform: rotate(1turn);
    }
}
</style>
  