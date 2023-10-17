<template>
  <div class="imageCompressor">
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
        <div>
          锁定比例：
          <el-switch v-model="lockRatio" active-color="#13ce66" inactive-color="#ff4949">
          </el-switch>
        </div>
        <div style="display: flex">
          <div>质量：
            <el-input-number v-model="desire.quality" size="small" :min="0.01" :step="0.01" :max="1"></el-input-number>
          </div>
          <div>宽度：
            <el-input placeholder="" v-model="desire.width" @blur="calcImgSize" size="small">
              <template #append>px</template>
            </el-input>
          </div>
          <div>高度：
            <el-input placeholder="" v-model="desire.height" :disabled="this.lockRatio" size="small">
              <template #append>px</template>
            </el-input>
          </div>
        </div>
      </el-col>
    </el-row>
    <div style="height: 25px"></div>
    <div style="text-align: right">
      <el-button type="success" @click="startCompressor">压缩并下载</el-button>
    </div>
  </div>
</template>

<script>
import ImageCompressor from 'js-image-compressor'
import { saveAs } from 'file-saver';

export default {
  name: "imageCompressor",
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
      desire: {
        quality: 0.5, //质量
        width: 500, //宽度
        height: 500//高度
      }
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
        that.desire.width = image.width
        that.desire.height = image.height
      };
      that.imageUrl = URL.createObjectURL(currentFile.raw);
      this.$refs.upload.clearFiles(); // 清空文件
    },
    calcImgSize() {
      //如果当前锁定没开，那就不算了
      if (!this.lockRatio) {
        return
      }
      const that = this
      that.desire.height = Math.round(that.desire.width / that.original.width * that.original.height)
    },
    startCompressor() {
      //压缩图片，然后直接下载
      this.compressionImage(this.currentOriginalFile.raw).then(resp => {
        saveAs(resp, this.currentOriginalFile.name);
      })
    },
    compressionImage(file) {
      const that = this
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line no-new
        new ImageCompressor({
          file: file,
          mimeType: 'image/jpeg',
          quality: that.desire.quality,
          width: that.desire.width,
          height: that.desire.height,
          redressOrientation: false,
          // 压缩前回调
          beforeCompress: function (result) {
            console.log('压缩之前图片尺寸大小: ', result.size)
            console.log('mime 类型: ', result.type)
          },
          success: function (result) {
            console.log('压缩之后图片尺寸大小: ', result.size)
            console.log('mime 类型: ', result.type)
            console.log('实际压缩率： ', ((file.size - result.size) / file.size * 100).toFixed(2) + '%')
            resolve(result)
          },
          error(e) {
            reject(e)
          }
        })
      })
    }

  }
}
</script>

<style scoped>
.avatar-uploader {
  width: 100%;
}

.imageCompressor .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100%;
}

.imageCompressor .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.imageCompressor .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 30px;
  height: 30px;
  line-height: 178px;
  text-align: center;
}

.imageCompressor .avatar {
  width: 178px;
  height: 178px;
  display: block;
  margin: auto;
}
</style>
