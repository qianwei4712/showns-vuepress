<template>
  <div class="appreciateCode">
    <div class="appreciate">
      <el-popover popper-class="apperciate-popper" placement="left">
        <template #reference>
          <div class="container">
            <div class="bubble"></div>
          </div>
        </template>
        <template #default>
          <div style="border-radius: 50%">
            <el-avatar :size="150" :src="src" />
          </div>
        </template>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { withBase } from '@vuepress/client'

export default {
  name: "AppreciateCode",
  data() {
    return {
      src: withBase('/img/appreciate.jpg'),
    }
  },
  created() {
  },
  methods: {
  },
}
</script>
<style lang="scss">
.apperciate-popper {
  padding: none !important;
  border: none !important;
  box-shadow: none !important;
  --el-popover-bg-color: none !important;
  margin-bottom: 150px;
  margin-right: 25px;
}

.apperciate-popper.el-popper.is-light {
  background: none
}
</style>
<style scoped>
.container {
  position: absolute;
  bottom: 50px;
  right: 50px;
  width: 80px;
  height: 80px;
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
</style>
