<template>
  <div class="applyCase">
    🩹🐻‍❄️🩲✨💌🕳️💣🛀🛌🧱🌡️🎊🎉🎈🧧💎🖨️⚙️💥🙊🐱🦊🐺🦄🐴🐽🐸🐊🐢🐍🐳🐡🦈🐛🌸🌳🌍🌐☀☁🌧️🌈🌊💧🩸👒👑👓🧳🧖🎅👰‍🤵‍👨‍🙋👵🧠🦷👂👀👅👄💪🤲
    <br>
    <div class="margin-top">
      <el-tag v-for="item in items" size="large" :key="item.label" :effect="item.effect" :color="item.color"
        :type="item.type" @click="openTab(item)">
        {{ item.label }}
      </el-tag>
    </div>

  </div>
</template>

<script>
import { withBase } from '@vuepress/client'

export default {
  name: "ApplyCase",
  data() {
    return {
      items: [
        // type: success / info / warning / danger
        // effect: dark / light / plain
        { label: '修改内容前后变动日志', type: 'success', effect: 'dark', target: 'gitee' },
        { label: '重复读取 request 流数据', type: 'danger', effect: 'light', target: 'gitee' },
        { label: 'jenkins 常用 shell 命令', type: 'warning', effect: 'dark', target: 'gitee' },
        { label: 'SQL优化总结', type: 'success', effect: 'light', target: 'yuque', href: 'https://www.yuque.com/shiva/ypnk5i/lvsbpw' },
        { label: '拦截重复请求', type: 'info', effect: 'dark', target: 'gitee' },
        { label: 'CentOS硬盘挂载', type: 'warning', effect: 'plain', target: 'yuque', href: 'https://www.yuque.com/shiva/bvds0d/llbgot' },
        { label: '线上服务CPU跑满', type: 'danger', effect: 'dark', target: 'gitee' },
        { label: 'Vue.js 学习随笔', type: 'success', effect: 'dark', target: 'yuque', href: "https://www.yuque.com/shiva/fgnv9d/wetses" },
        { label: 'Netty 权威指南', type: 'danger', effect: 'plain', target: 'yuque', href: "https://www.yuque.com/shiva/lct37n" },
        { label: '发布订阅机制', type: 'info', effect: 'light', target: 'gitee' },
        { label: '数据库文档导出', type: 'danger', effect: 'light', target: 'yuque', href: "https://www.yuque.com/shiva/bvds0d/nw61t1" },
        { label: '图片拼接合成', type: 'success', effect: 'plain', target: 'gitee' },
        { label: 'POI海量数据导出', type: 'info', effect: 'dark', target: 'yuque', href: "https://www.yuque.com/shiva/bvds0d/wbsirl" },
        { label: 'Json数据脱敏', type: 'warning', effect: 'light', target: 'gitee' },
        { label: '异步文件导出搭配 Redis', type: 'danger', effect: 'plain', target: 'gitee' },
        { label: 'word文件读写、模板', type: 'success', effect: 'dark', target: 'yuque', href: "https://www.yuque.com/shiva/bvds0d/sowqsakgcbdp11hg" },
        { label: '悬浮功能按钮', type: 'info', effect: 'light', target: 'yuque', href: "https://www.yuque.com/shiva/bvds0d/bxe0x4e2vw4g9iex" },
      ]
    }
  },
  methods: {
    openTab(item) {
      switch (item.target) {
        case 'yuque':
          window.open(item.href, '_blank');
          break;
        default:
          window.open(withBase("/chest/solutions/" + item.label + ".html"), '_blank');
          break
      }
    }
  }
}
</script>

<style scoped>
.applyCase {
  margin: 10px 0;
}

.margin-top {
  margin-top: 20px;
}

.el-tag {
  margin-left: 10px;
  margin-bottom: 5px;
  cursor: pointer;
}

.margin-top span:hover {
  -webkit-transform: translateY(-3px);
  -ms-transform: translateY(-3px);
  transform: translateY(-3px);
  -webkit-box-shadow: 0 0 6px #999;
  box-shadow: 0 0 6px #999;
  -webkit-transition: all .2s ease-out;
  transition: all .2s ease-out;
}
</style>