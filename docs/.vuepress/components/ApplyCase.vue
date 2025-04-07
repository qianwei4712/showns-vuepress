<template>
  <div class="applyCase">
    🩹🐻‍❄️🩲✨💌🕳️💣🛀🛌🧱🌡️🎊🎉🎈🧧💎🖨️⚙️💥🙊🐱🦊🐺🦄🐴🐽🐸🐊🐢🐍🐳🐡🦈🐛🌸🌳🌍🌐☀☁🌧️🌈🌊💧🩸👒👑👓🧳🧖🎅👰‍🤵‍👨‍🙋👵🧠🦷👂👀👅👄💪🤲
    <br>
    <div class="margin-top">
      <el-tag v-for="(item, index) in items" size="large" :key="item.label" :effect="randomEffect(index)"
              :type="randomType(index)" @click="openTab(item)">
        {{ item.label }}
      </el-tag>
    </div>

  </div>
</template>

<script>
import {withBase} from '@vuepress/client'

export default {
  name: "ApplyCase",
  data() {
    return {
      types: ["", "success", "info", "warning", "danger"],
      effects: ["", "dark", "light", "plain"],
      items: [
        {label: '修改内容前后变动日志', target: 'self'},
        {label: '重复读取 request 流数据', target: 'self'},
        {label: 'jenkins 常用 shell 命令', target: 'self'},
        {
          label: 'SQL优化总结',
          target: 'yuque',
          href: 'https://www.yuque.com/shiva/ypnk5i/lvsbpw'
        },
        {label: '拦截重复请求', target: 'self'},
        {
          label: 'CentOS硬盘挂载',
          target: 'yuque',
          href: 'https://www.yuque.com/shiva/bvds0d/llbgot'
        },
        {label: '线上服务CPU跑满', target: 'self'},
        {
          label: 'Vue.js 学习随笔',
          target: 'yuque',
          href: "https://www.yuque.com/shiva/fgnv9d/wetses"
        },
        {
          label: 'Netty 权威指南',
          target: 'yuque',
          href: "https://www.yuque.com/shiva/lct37n"
        },
        {label: '发布订阅机制', target: 'self'},
        {
          label: '数据库文档导出',
          target: 'yuque',
          href: "https://www.yuque.com/shiva/bvds0d/nw61t1"
        },
        {label: '图片拼接合成', target: 'self'},
        {
          label: 'POI海量数据导出',
          target: 'yuque',
          href: "https://www.yuque.com/shiva/bvds0d/wbsirl"
        },
        {label: 'Json数据脱敏', target: 'self'},
        {label: '异步文件导出搭配 Redis', target: 'self'},
        {
          label: 'word文件读写、模板',
          target: 'yuque',
          href: "https://www.yuque.com/shiva/bvds0d/sowqsakgcbdp11hg"
        },
        {
          label: '悬浮功能按钮',
          target: 'yuque',
          href: "https://www.yuque.com/shiva/bvds0d/bxe0x4e2vw4g9iex"
        },
        {label: 'python使用selenium自动化', target: 'self'},
        {label: 'SSE流式输出', target: 'self'},
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
    },
    randomType(index) {
      return this.types[index % 5];
    },
    randomEffect(index) {
      return this.effects[index % 4];
    },
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
