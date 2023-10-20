<template>
  <div class="milestone" style="margin-top: 25px;">
    <div style="max-width: 600px;width: 95%;">
      <el-timeline>
        <el-timeline-item timestamp="2023/10/25" type="primary" hollow="true" placement="top">
          <el-card>
            觉得原有站点的缺陷比较多，改用 Vuepress2 重新开发：<a href="https://gitee.com/qianwei4712/showns-vuepress" target="_blank"
              class="origin">Gitee仓库地址</a>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="2020/01/01 至 2022/11/25" color="#0bbd87" placement="top">
          <el-card>
            陆续记录学习内容超200篇, 记录一些解决方案和学习计划, 并作为个人工具站使用
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="2019/12/28" color="#e20000" placement="top">
          <el-card>
            遵循 <span style="color: red;font-weight: bold">Apache LICENSE 2.0</span> 协议，源码开放，<a
              href="https://gitee.com/qianwei4712/showns" target="_blank" class="origin">旧版本：Gitee仓库地址</a>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="2019/11/14" placement="top">
          <el-card>
            初步完成静态页面，部署上线，开始逐步添加文章
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="2019/11/6" placement="top">
          <el-card>
            工作需要, 开始学习Vue.js, 收到 <span style="color: red;font-weight: bold;">@pdai</span> 大佬启发, 照虎画猫也建了一个站点
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
    <div class="copy-font">
      人生没有白走的路
    </div>
  </div>
</template>

<script>

export default {
  name: "Milestone",
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
  },
}
</script>

<style scoped>
.copy-font {
  padding-top: 20px;
  font-family: cursive;
  text-indent: 2em;
  font-weight: bolder;
  font-size: 21px;
}
</style>
