<template>
  <div class="cssDemos">
    <div class="flow-container" id="flow-container">
      <div class="flow-item" v-for="item in demoImgArray" :key="item.index" @click="experience(item)">
        <img :alt="item.title" :href="item.href" :src="item.img" class="flow-img" />
      </div>
    </div>

    <el-dialog :title="dialog.title" class="cssDemoDetails" v-model="dialog.open" top="6vh" :width="dialog.width"
      append-to-body>
      <component :is="dialog.currentView"></component>
    </el-dialog>
  </div>
</template>

<script>
import { withBase } from '@vuepress/client'
import Masonry from 'masonry-layout';
let masonry;

import rotationEffect from './cssDemoItem/rotationEffect.vue'
import clickBubble from './cssDemoItem/clickBubble.vue'
import carouselMenu from './cssDemoItem/carouselMenu.vue'
import backgroundAnimation from './cssDemoItem/backgroundAnimation.vue'
import hoverFlip from './cssDemoItem/hoverFlip.vue'
import telescoping from './cssDemoItem/telescoping.vue'
import glowingBubbles from './cssDemoItem/glowingBubbles.vue'
import verticalScroll from './cssDemoItem/verticalScroll.vue'

export default {
  name: "CssDemos",
  data() {
    return {
      demoImgArray: [
        { title: '旋转特效', img: withBase('/css/rotationEffect.gif'), width: "1200px", view: rotationEffect },
        { title: '按钮气泡', img: withBase('/css/clickBubble.gif'), width: "800px", view: clickBubble },
        { title: '旋转菜单', img: withBase('/css/carouselMenu.gif'), width: "1200px", view: carouselMenu },
        { title: '伸缩搜索框', img: withBase('/css/telescoping.gif'), width: "600px", view: telescoping },
        { title: '渐变背景动画', img: withBase('/css/backgroundAnimation.gif'), width: "1200px", view: backgroundAnimation },
        { title: '发光泡泡特效', img: withBase('/css/glowingBubbles.gif'), width: "1200px", view: glowingBubbles },
        { title: '悬停翻转', img: withBase('/css/hoverFlip.gif'), width: "1200px", view: hoverFlip },
        { title: '纵向标签滚动', img: withBase('/css/verticalScroll.gif'), width: "800px", view: verticalScroll },

      ],
      dialog: {
        title: "", //弹窗标题
        open: false,
        currentView: null, //弹窗内组件
      },
    }
  },
  created() {
    setTimeout(() => {
      masonry = new Masonry('.flow-container', {
        //将以此选择器对应的元素作为瀑布流内容元素
        itemSelector: '.flow-item',
        //将以此选择器对应的元素宽度作为瀑布流的列宽
        columnWidth: '.flow-container .flow-item',
        //支持百分比宽度
        percentPosition: true,
        //间距
        gutter: 50,
      });
    }, 500);
  },
  methods: {
    experience(obj) {
      this.dialog.title = obj.title;
      this.dialog.width = obj.width;
      this.dialog.open = true;
      this.dialog.currentView = obj.view;
    }
  },
}
</script>

<style scoped>
.cssDemos {
  margin: 15px;
}

.flow-item {
  cursor: pointer !important;
}

.flow-container img {
  max-width: 250px;
  border-radius: 15px;
  margin: 10px 0;
  pointer-events: none;
}
</style>
