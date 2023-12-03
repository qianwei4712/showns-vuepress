<template>
  <div class="studyPlan" style="margin-top: 25px;">
    😀😁😂😃😄😅😆😉😊😋😎😍😘😗😙😚😇😐😑😶😏😣😥😮😯😪😫😴😌😛😜😝😒😓😔😕😲😷😖😞😟😤😢😭😦😧😨😬😰😱😳😵😡😠😈👿👹👺💀☠👻👽

    <br>
    <h3>2023（私活干多了，没时间写）</h3>
    <el-checkbox :border="true" checked="checked" disabled>Auto.JS</el-checkbox>
    <el-checkbox :border="true" checked="checked" disabled>VuePress2</el-checkbox>

    <br>
    <h3>2022</h3>
    <el-checkbox :border="true" checked="checked" disabled>mysql</el-checkbox>
    <el-checkbox :border="true" checked="checked" disabled>读写分离</el-checkbox>
    <el-checkbox :border="true" checked="checked" disabled>activiti</el-checkbox>
    <el-checkbox :border="true" checked="checked" disabled>Vue.js</el-checkbox>
    <el-checkbox :border="true" checked="checked" disabled>Java IO</el-checkbox>
    <el-checkbox :border="true" checked="checked" disabled>Netty</el-checkbox>
    <el-checkbox :border="true" checked="checked" disabled>RPC</el-checkbox>
    <el-checkbox :border="true" checked="checked" disabled>redis 全套</el-checkbox>
    <el-checkbox :border="true" checked="checked" disabled>分布式锁</el-checkbox>
    <el-checkbox :border="true" checked="checked" disabled>Spring 原理</el-checkbox>
    <el-checkbox :border="true" checked="checked" disabled>分库分表</el-checkbox>

    <br>
    <h3>2021</h3>
    <el-checkbox :border="true" checked="checked" disabled>docker</el-checkbox>
    <el-checkbox :border="true" checked="checked" disabled>jenkins</el-checkbox>
    <el-checkbox :border="true" checked="checked" disabled>gitlab</el-checkbox>
    <el-checkbox :border="true" checked="checked" disabled>RabbitMQ</el-checkbox>
    <el-checkbox :border="true" checked="checked" disabled>docker compose</el-checkbox>
    <el-checkbox :border="true" checked="checked" disabled>注入攻击详解</el-checkbox>
    <el-checkbox :border="true" checked="checked" disabled>scheduler quartz</el-checkbox>
    <el-checkbox :border="true" checked="checked" disabled>Eureka</el-checkbox>
    <el-checkbox :border="true" checked="checked" disabled>Ribbon</el-checkbox>
    <el-checkbox :border="true" checked="checked" disabled>OpenFeign</el-checkbox>
    <el-checkbox :border="true" checked="checked" disabled>Hystrix</el-checkbox>
    <el-checkbox :border="true" checked="checked" disabled>JWT</el-checkbox>
    <el-checkbox :border="true" checked="checked" disabled>gateway</el-checkbox>
    <el-checkbox :border="true" checked="checked" disabled>JUC锁: AQS</el-checkbox>

  </div>
</template>

<script>

export default {
  name: "StudyPlan",
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
.el-checkbox {
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 8px;
}

h3 {
  margin-bottom: 10px !important;
}
</style>
