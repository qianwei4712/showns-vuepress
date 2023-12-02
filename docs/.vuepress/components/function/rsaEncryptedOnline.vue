<template>
    <div class="rsaEncryptedOnline">
        <div style="margin-bottom: 5px;">
            <el-button type="success" @click="encryption">公钥加密</el-button>
            <el-button type="danger" @click="decrypt">私钥解密</el-button>
        </div>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-input v-model="miyao" :rows="7" type="textarea" resize="none" placeholder="密钥位置（加密填公钥、解密填私钥）"
                    style="margin-bottom: 12px;" />
                <el-input v-model="yuanliao" :rows="10" type="textarea" resize="none" placeholder="原料位置（加密填原文、解密填密文）" />
            </el-col>
            <el-col :span="12">
                <el-input v-model="jieguo" :rows="18" type="textarea" resize="none" placeholder="结果位置（加密出现密文、解密出现原文）" />
            </el-col>
        </el-row>
    </div>
</template>
  
<script>
import { ElMessage } from 'element-plus'
import JSEncrypt from 'jsencrypt';

export default {
    name: "rsaEncryptedOnline",
    data() {
        return {
            miyao: '',
            yuanliao: '',
            jieguo: '',
        }
    },
    methods: {
        encryption() {
            const encryptor = new JSEncrypt();
            encryptor.setPublicKey(this.miyao);
            this.jieguo = encryptor.encrypt(this.yuanliao);
            ElMessage({
                message: '加密成功！',
                grouping: true,
                type: 'success',
            })
        },
        decrypt() {
            const decryptor = new JSEncrypt();
            decryptor.setPrivateKey(this.miyao);
            this.jieguo = decryptor.decrypt(this.yuanliao);
            ElMessage({
                message: '解密成功！',
                grouping: true,
                type: 'success',
            })
        },
    }
}
</script>
  
<style>
.rsaEncryptedOnline textarea::-webkit-scrollbar {
    display: none;
}
</style>
  