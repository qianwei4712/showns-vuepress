<template>
    <div class="rsaKeyPairGen">
        <div style="margin-bottom: 5px;">
            <el-button type="success" @click="generator" :disabled="repeatClick">创建密钥对</el-button>
        </div>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-input v-model="publicKey" :rows="10" type="textarea" resize="none" placeholder="公钥位置" />
                <div>
                    <p>使用 jsrsasign 生成长度为 2048 的 RSA 算法密钥对；代码如下：</p>
                    <p>KEYUTIL.getPEM(keyPair.prvKeyObj, 'PKCS1PRV')</p>
                    <p>KEYUTIL.getPEM(keyPair.pubKeyObj, 'PKCS8PUB')</p>
                </div>
            </el-col>
            <el-col :span="12">
                <el-input v-model="privateKey" :rows="18" type="textarea" resize="none" placeholder="私钥位置" />
            </el-col>
        </el-row>
    </div>
</template>
  
<script>
import { ElMessage } from 'element-plus'
import { KEYUTIL } from 'jsrsasign';

export default {
    name: "rsaKeyPairGen",
    data() {
        return {
            privateKey: '',
            publicKey: '',
            repeatClick: false
        }
    },
    methods: {
        generator() {
            this.repeatClick = true;
            const keyPair = KEYUTIL.generateKeypair('RSA', 2048);
            this.privateKey = KEYUTIL.getPEM(keyPair.prvKeyObj, 'PKCS1PRV');
            this.publicKey = KEYUTIL.getPEM(keyPair.pubKeyObj, 'PKCS8PUB');
            ElMessage({
                message: '密钥对创建成功！',
                grouping: true,
                type: 'success',
            })
            this.repeatClick = false;
        }
    }
}
</script>
  
<style>
.rsaKeyPairGen textarea::-webkit-scrollbar {
    display: none;
}
</style>
  