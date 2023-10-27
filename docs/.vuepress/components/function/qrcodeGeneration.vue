<template>
    <div class="qrcodeGeneration">
        <el-row :gutter="20">
            <el-col :span="16">
                <el-input v-model="textarea" :rows="8" type="textarea" resize="none" />
                <div style="margin-top: 15px;">
                    <el-radio-group v-model="codeSize" :size="small">
                        <el-radio label="1000" :border="true">1000x1000</el-radio>
                        <el-radio label="500" :border="true">500x500</el-radio>
                        <el-radio label="250" :border="true">250x250</el-radio>
                    </el-radio-group>
                </div>
                <div style="text-align: center;margin-top: 15px;">
                    <el-button type="success" @click="qrCodeGen">生成二维码</el-button>
                    <el-button type="danger" @click="downloadImg">下载图片</el-button>
                </div>
                <div style="margin-top: 15px;color: gray;">
                    <a href="https://cli.im/text" target="_blank">
                        更完善的草料二维码：https://cli.im/text
                    </a>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="genArea">
                    <div class="code-main-bor">
                        <div id="qrcode">
                            <span style="line-height: 200px;">
                                啥时候才能退休啊？
                            </span>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
  
<script>
import { ElMessage } from 'element-plus'
import QRCode from 'qrcode2'
export default {
    name: "qrcodeGeneration",
    data() {
        return {
            textarea: '',
            codeSize: "250"
        }
    },
    methods: {
        qrCodeGen() {
            if (this.textarea == null || (this.textarea = this.textarea.trim()) == '') {
                ElMessage({ message: '请输入需要生成的内容', type: 'error' })
                return false
            }
            const that = this
            this.$nextTick(() => {
                document.getElementById('qrcode').innerHTML = ''
                let qr = new QRCode('qrcode', {
                    width: that.codeSize, height: that.codeSize,
                    text: that.textarea,
                    correctLevel: 3
                })
            })
        },
        downloadImg() {
            this.saveImage()
        },
        //保存图片
        saveImage() {
            if (!this.textarea) {
                ElMessage({ message: '请先生成二维码图片', type: 'danger' })
                return;
            }
            // //找到canvas标签
            let myCanvas = document.getElementById('qrcode').getElementsByTagName('canvas');
            let img = document.getElementById('qrcode').getElementsByTagName('img')
            // // //创建一个a标签节点
            let a = document.createElement("a")
            // //设置a标签的href属性（将canvas变成png图片）
            let imgURL = myCanvas[0].toDataURL('image/jpg');
            let ua = navigator.userAgent;
            if (ua.indexOf("Trident") != -1 && ua.indexOf("Windows") != -1) { // IE内核 并且  windows系统 情况下 才执行;
                var bstr = atob(imgURL.split(',')[1])
                var n = bstr.length
                var u8arr = new Uint8Array(n)
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n)
                }
                var blob = new Blob([u8arr])
                window.navigator.msSaveOrOpenBlob(blob, '下载' + '.' + 'png')
            } else if (ua.indexOf("Firefox") > -1) { //火狐兼容下载
                let blob = this.base64ToBlob(imgURL); //new Blob([content]);
                let evt = document.createEvent("HTMLEvents");
                evt.initEvent("click", true, true);//initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
                a.download = ' ';//下载图片名称，如果填内容识别不到，下载为未知文件，所以我这里就不填为空
                a.href = URL.createObjectURL(blob);
                a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));//兼容火狐
            } else { //谷歌兼容下载
                img.src = myCanvas[0].toDataURL('image/jpg');
                // a.href = myCanvas[0].toDataURL('image/png').replace('image/png', 'image/octet-stream')
                a.href = img.src
                //设置下载文件的名字
                a.download = this.getCurrentTimeString() + '.png';
                //点击
                a.click()
            }
        },
        //base64转blob
        base64ToBlob(code) {
            let parts = code.split(';base64,');
            let contentType = parts[0].split(':')[1];
            let raw = window.atob(parts[1]);
            let rawLength = raw.length;
            let uInt8Array = new Uint8Array(rawLength);
            for (let i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i);
            }
            return new Blob([uInt8Array], { type: contentType });
        },
        getCurrentTimeString() {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            return `${year}${month}${day}${hours}${minutes}`;
        }
    }
}
</script>
  
<style lang="scss">
.qrcodeGeneration {
    #qrcode {
        min-height: 250px;

        img {
            width: 100%;
        }
    }
}
</style>
<style scoped>
.genArea {
    background-color: #ececec;
    padding: 15px;
}

.code-main-bor {
    padding: 15px 5px;
    border: 1px solid #e1e1e1;
    background-color: white;
    display: flex;
    justify-content: center;
    border-radius: 5px;
}
</style>  