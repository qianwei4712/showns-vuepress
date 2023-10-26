<template>
    <div class="cssDemoItem" style="height: 300px;">
        <div class="container">
            <section class="main-group">
                <div class="items-group" v-for="(item, index) in labelList" :key="item.index"
                    :style="{ '--delay': (index - 2) }">
                    <div class="items-box">
                        <div class="img">
                            <img :src="item.img">
                        </div>
                        <div class="desc">
                            <span class="name">{{ item.name }}</span>
                            <p>{{ item.desc }}</p>
                        </div>
                    </div>
                    <a class="follow-btn" href="javascript:void(0)">功能按钮</a>
                </div>
            </section>
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
import { withBase } from '@vuepress/client'

export default {
    name: "verticalScroll",
    data() {
        return {
            componentName: 'verticalScroll',
            sourceFileUrl: '',
            copyright: 'https://www.douyin.com/video/7293052808180370729',
            labelList: [
                { img: withBase('/css/avatar (1).png'), name: '飞行员', desc: '让你的梦想翱翔天际' },
                { img: withBase('/css/avatar (2).png'), name: '音乐家', desc: '用音乐点亮人们的心灵' },
                { img: withBase('/css/avatar (3).png'), name: '时尚设计', desc: '创造美丽的时尚' },
                { img: withBase('/css/avatar (4).png'), name: '画家', desc: '落榜美术生' },
                { img: withBase('/css/avatar (5).png'), name: '医生', desc: '改善人们的健康' },
                { img: withBase('/css/avatar (6).png'), name: '作家', desc: '用文字书写世界' },
            ]
        }
    },
    created() {
        this.sourceFileUrl = "https://gitee.com/qianwei4712/showns-vuepress/tree/master/docs/.vuepress/components/cssDemoItem/" + this.componentName + ".vue";
    },
    methods: {
    }
}
</script>
<style lang="scss" scoped>
.container {
    * {
        margin: 0;
        padding: 0;
        font-size: 12px;
        list-style: none;
        text-decoration: none;
    }

    .main-group {
        box-sizing: border-box;
        width: 100%;
        min-height: 60vh;
        padding: 0 5em;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        line-height: 24px;
        background: linear-gradient(to bottom, #bea2e7 0%, #86b7e7 100%);

        .items-group {
            background: #fff;
            max-width: 460px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-radius: 100px 20px 20px 100px;
            padding: 6px 20px 6px 6px;
            box-sizing: border-box;
            // 条目数要和这里的参数进行匹配，比如 24/4 = 6条。这样不会重影
            animation: animate 24s linear infinite;
            animation-delay: calc(4s * var(--delay));
            position: absolute;
            opacity: 0;

            :last-child {
                animation-delay: calc(-4s * var(--delay));
            }

            .items-box {
                display: flex;
                align-items: center;
                margin-right: 15px;
            }

            .img {
                width: 80px;
                height: 80px;

                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    box-shadow: 0 0 10px #888888;
                }
            }

            .desc {
                margin-left: 20px;
                font-size: 12px;

                .name {
                    font-size: 16px;
                    font-weight: bold;
                }
            }

            .follow-btn {
                border-radius: 16px;
                font-weight: bold;
                padding: 5px 26px;
                color: #fff;
                background: linear-gradient(to bottom, #bea2e7 0%, #86b7e7 100%);
            }

        }
    }

    @keyframes animate {
        0% {
            opacity: 0;
            transform: translateY(100%) scale(0.5);
        }

        5%,
        20% {
            opacity: 0.4;
            transform: translateY(100%) scale(0.7);
        }

        25%,
        45% {
            opacity: 1;
            z-index: 1;
            pointer-events: auto;
            transform: translateY(0%) scale(1);
        }

        45%,
        60% {
            opacity: 0.4;
            transform: translateY(-100%) scale(0.7);
        }

        65%,
        80% {
            opacity: 0;
            transform: translateY(-100%) scale(0.5);
        }

        82%,
        100% {
            opacity: 0;
            transform: translateY(-120%) scale(0.3);
        }
    }
}
</style>