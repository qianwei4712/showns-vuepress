<template>
  <div class="imageConversionIco">
    <el-row>
      <el-upload ref="upload" class="avatar-uploader" action="https://shiva.show" :show-file-list="false" :drag="true"
        :auto-upload="false" :on-change="loadJsonFromFile" :limit="1">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <svg v-else viewBox="0 0 1024 1024" class="avatar-uploader-icon" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor"
            d="M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64h352z">
          </path>
        </svg>
      </el-upload>
    </el-row>
    <div style="height: 15px"></div>
    <el-row :gutter="20">
      <el-col :span="8">
        <div>原素材：{{ original.size }} KB</div>
        <div>宽度： {{ original.width }} px</div>
        <div>高度： {{ original.height }} px</div>
      </el-col>
      <el-col :span="16">
        <div style="display: flex">
          <div>分辨率：
            <el-select v-model="selectedSizes" placeholder="请选择尺寸" style="width: 240px">
              <el-option v-for="size in standardSizes" :key="size" :label="size + 'x' + size" :value="size" />
            </el-select>
          </div>
        </div>
      </el-col>
    </el-row>
    <div style="height: 25px"></div>
    <div style="text-align: right">
      <el-button type="success" @click="startCompressorIco">转化并下载</el-button>
    </div>
  </div>
</template>

<script>
import { saveAs } from 'file-saver';

export default {
  name: "imageConversionIco",
  data() {
    return {
      imageUrl: '',
      currentOriginalFile: null,//当前图片
      lockRatio: true,
      original: {
        size: 0, //原素材大小
        width: 0, //原素材宽度
        height: 0//原素材高度
      },
      selectedSizes: 128,
      standardSizes: [16, 32, 48, 64, 128, 256]
    }
  },
  methods: {
    loadJsonFromFile(file, fileList) {
      console.log(file)
      const that = this
      that.currentOriginalFile = file
      const currentFile = file
      if (currentFile == null) {
        return false
      }
      //拿到当前的图片
      this.original.size = (currentFile.size / 1024).toFixed(2)
      //拿到宽高
      const image = new Image();
      image.src = URL.createObjectURL(currentFile.raw);
      image.onload = () => {
        that.original.width = image.width
        that.original.height = image.height
      };
      that.imageUrl = URL.createObjectURL(currentFile.raw);
      this.$refs.upload.clearFiles(); // 清空文件
    },
    async startCompressorIco() {
      if (!this.currentOriginalFile) {
        this.$message.warning('请先上传图片');
        return;
      }
      try {
        // 将图片转换为 ICO 格式
        const icoBlob = await this.convertToICO(this.currentOriginalFile.raw);
        // 下载 ICO 文件
        saveAs(icoBlob, `${this.currentOriginalFile.name.split('.')[0]}.ico`);
        this.$message.success('转换并下载成功');
      } catch (error) {
        console.error('转换失败:', error);
        this.$message.error('转换失败，请重试');
      }
    },
    async convertToICO(blob) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(blob);
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          // 设置画布大小
          const size = this.selectedSizes; // 使用第一个选中的尺寸
          canvas.width = size;
          canvas.height = size;

          // 绘制图片到画布
          ctx.drawImage(img, 0, 0, size, size);

          // 将画布内容转换为 ICO 格式
          canvas.toBlob((icoBlob) => {
            if (icoBlob) {
              resolve(icoBlob);
            } else {
              reject(new Error('无法生成 ICO 文件'));
            }
          }, 'image/x-icon');
        };
        img.onerror = (error) => {
          reject(error);
        };
      });
    },
  },
}
</script>

<style scoped>
.avatar-uploader {
  width: 100%;
}

.imageConversionIco .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100%;
}

.imageConversionIco .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.imageConversionIco .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 30px;
  height: 30px;
  line-height: 178px;
  text-align: center;
}

.imageConversionIco .avatar {
  width: 178px;
  height: 178px;
  display: block;
  margin: auto;
}
</style>
