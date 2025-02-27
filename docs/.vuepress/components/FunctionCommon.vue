<template>
  <div class="functionCommon">
    <div class="read-only func-item">
      <el-tag v-for="(single, index) in allFunc" :key="index" size="large" :effect="randomEffect(index)"
        :type="randomType(index)" @click="experience(single)">
        {{ single.title }}
      </el-tag>
    </div>
    <el-dialog :title="dialog.title" v-model="dialog.open" top="6vh" :width="dialog.width" append-to-body>
      <component :is="dialog.currentView"></component>
    </el-dialog>
  </div>
</template>

<script>
import coordinateTrans from "./function/coordinateTrans.vue";
import imageCompressor from './function/imageCompressor.vue';
import coordinatePick from './function/coordinatePick.vue';
import amountInWords from './function/amountInWords.vue';
import complexPwdGenerator from './function/complexPwdGenerator.vue'
import qrcodeGeneration from './function/qrcodeGeneration.vue'
import transcodeOnline from './function/transcodeOnline.vue'
import rsaKeyPairGen from "./function/rsaKeyPairGen.vue";
import rsaEncryptedOnline from "./function/rsaEncryptedOnline.vue";
import timestampConversion from "./function/timestampConversion.vue";


export default {
  name: "FunctionCommon",
  data() {
    return {
      types: ["", "success", "info", "warning", "danger"],
      effects: ["dark", "light", "plain"],
      dialog: {
        title: "", //弹窗标题
        open: false,
        currentView: null, //弹窗内组件
      },
      allFunc: [
        { title: "经纬度坐标系转换", width: "1200px", view: coordinateTrans },
        { title: "高德地图经纬度拾取", width: "1600px", view: coordinatePick },
        { title: "图片压缩", width: "600px", view: imageCompressor },
        { title: "金额转大写", width: "600px", view: amountInWords },
        { title: "复杂密码生成器", width: "800px", view: complexPwdGenerator },
        { title: "二维码生成", width: "1000px", view: qrcodeGeneration },
        { title: "编码转换", width: "1000px", view: transcodeOnline },
        { title: "RSA密钥对生成", width: "1200px", view: rsaKeyPairGen },
        { title: "RSA加密/解密在线", width: "1200px", view: rsaEncryptedOnline },
        { title: "时间戳转换", width: "800px", view: timestampConversion },

      ],
    };
  },
  methods: {
    experience(obj) {
      this.dialog.title = obj.title;
      this.dialog.width = obj.width;
      this.dialog.open = true;
      this.dialog.currentView = obj.view;
    },
    randomType(index) {
      return this.types[index % 4];
    },
    randomEffect(index) {
      return this.effects[index % 3];
    },
  },
};
</script>

<style scoped>
.functionCommon {
  margin: 25px 0;
}

.func-item {
  padding: 0 15px;
}

.func-item span:hover {
  -webkit-transform: translateY(-3px);
  -ms-transform: translateY(-3px);
  transform: translateY(-3px);
  -webkit-box-shadow: 0 0 6px #999;
  box-shadow: 0 0 6px #999;
  -webkit-transition: all .2s ease-out;
  transition: all .2s ease-out;
}

.func-item span {
  cursor: pointer;
  margin: 5px 20px 5px 0;
}
</style>