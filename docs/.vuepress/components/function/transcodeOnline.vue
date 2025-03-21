<template>
    <div class="transcodeOnline">
        <div>
            <el-tabs v-model="currentMode" type="card">
                <el-tab-pane label="Base64" name="Base64"></el-tab-pane>
                <el-tab-pane label="URLEncode" name="URLEncode"></el-tab-pane>
            </el-tabs>

            <div class="main-function-container">
                <div style="width: 40%;">
                    <el-input v-model="original" type="textarea" :autosize="{ minRows: 12, maxRows: 12 }"
                        placeholder="未编码内容"></el-input>
                </div>
                <div class="button-container">
                    <div>
                        <el-button type="primary" @click="encode">
                            编码 (Encode)
                            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="20px">
                                <path fill="currentColor"
                                    d="M754.752 480H160a32 32 0 1 0 0 64h594.752L521.344 777.344a32 32 0 0 0 45.312 45.312l288-288a32 32 0 0 0 0-45.312l-288-288a32 32 0 1 0-45.312 45.312L754.752 480z">
                                </path>
                            </svg>
                        </el-button>
                    </div>
                    <div>
                        <el-button type="warning" @click="decode">
                            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="20px">
                                <path fill="currentColor" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z">
                                </path>
                                <path fill="currentColor"
                                    d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z">
                                </path>
                            </svg>
                            解码 (Decode)
                        </el-button>
                    </div>
                </div>
                <div style="width: 40%;">
                    <el-input v-model="ciphertext" type="textarea" :autosize="{ minRows: 12, maxRows: 12 }"
                        placeholder="编码后内容"></el-input>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import { ElMessage } from 'element-plus'

export default {
    name: "transcodeOnline",
    data() {
        return {
            currentMode: 'Base64',
            original: '',
            ciphertext: ''
        }
    },
    methods: {
        encode() {
            if (!this.original || (this.original = this.original.trim()) === '') {
                ElMessage({ message: '请输入原文内容', type: 'error' })
                return false
            }
            if ('Base64' == this.currentMode) {
                this.ciphertext = btoa(this.original)
            }
            if ('URLEncode' == this.currentMode) {
                this.ciphertext = encodeURIComponent(this.original)
            }
        },
        decode() {
            if (!this.ciphertext || (this.ciphertext = this.ciphertext.trim()) === '') {
                ElMessage({ message: '请输入需要解码的内容', type: 'error' })
                return false
            }
            if ('Base64' == this.currentMode) {
                this.original = atob(this.ciphertext)
            }
            if ('URLEncode' == this.currentMode) {
                this.original = decodeURIComponent(this.ciphertext)
            }
        },
    }
}
</script>

<style scoped>
.main-function-container {
    display: flex;
    justify-content: space-around;
}

.button-container {
    display: flex;
    flex-direction: column;
    padding-top: 50px;
}

.button-container button {
    margin: 15px 0;
}
</style>