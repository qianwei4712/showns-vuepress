<template>
    <div class="complexPwdGenerator">
        <el-row :gutter="20">
            <el-col :span="12" style="border-right: 1px rgb(202, 202, 202) solid;">
                <div class="option-item">
                    <div class="option-label">
                        首字母大写：
                    </div>
                    <div class="option-value">
                        <el-checkbox v-model="uppercaseFirst" label="是否开启" :border="true" />
                    </div>
                </div>
                <div class="option-item">
                    <div class="option-label">
                        密码长度：
                    </div>
                    <div class="option-value">
                        <el-input-number v-model="length" :min="8" :max="32" :step="1" step-strictly />
                    </div>
                </div>
                <div class="option-item">
                    <div class="option-label">
                        特殊符号数量：
                    </div>
                    <div class="option-value">
                        <el-input-number v-model="specialCharsCount" :min="0" :max="10" :step="1" step-strictly />
                    </div>
                </div>
            </el-col>
            <el-col :span="12">
                <div style="text-align: center;">
                    <el-button type="success" @click="generator">生成密码</el-button>

                </div>
                <div style="font-size: 22px;text-align: center;padding-top: 30px;cursor: pointer;" @click="copy">
                    {{ result }}
                </div>
            </el-col>
        </el-row>

    </div>
</template>
    
<script>
import { ElMessage } from 'element-plus'

export default {
    name: "complexPwdGenerator",
    data() {
        return {
            uppercaseFirst: false,//首字母大写
            length: 10, //密码长度
            specialCharsCount: 0, //特殊符号长度
            result: ''
        }
    },
    methods: {
        generator() {
            this.result = this.generatePassword(this.uppercaseFirst, this.length, this.specialCharsCount)
        },
        copy() {
            const textarea = document.createElement('textarea')
            textarea.value = this.result
            document.body.appendChild(textarea)
            textarea.select()
            document.execCommand('copy')
            document.body.removeChild(textarea)
            //提示消息，复制成功
            ElMessage({
                message: '复杂密码已经复制！',
                grouping: true,
                type: 'success',
            })
        },
        generatePassword(uppercaseFirst, length, specialCharsCount) {
            let password = '';

            // 定义可用的字符集合
            const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
            const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const numbers = '0123456789';
            const specialChars = '!@#$%^&*()_+-={}[]|:;"<>,.?/~`';

            // 根据参数决定是否首字母大写
            if (uppercaseFirst) {
                const randomIndex = Math.floor(Math.random() * uppercaseLetters.length);
                password += uppercaseLetters[randomIndex];
            } else {
                const randomIndex = Math.floor(Math.random() * lowercaseLetters.length);
                password += lowercaseLetters[randomIndex];
            }

            // 生成剩余的密码字符
            const availableChars = lowercaseLetters + uppercaseLetters + numbers;
            const totalCharsCount = length - 1 - specialCharsCount; // 减去首字母的长度
            for (let i = 0; i < totalCharsCount; i++) {
                const randomIndex = Math.floor(Math.random() * availableChars.length);
                password += availableChars[randomIndex];
            }

            // 插入特殊符号
            for (let i = 0; i < specialCharsCount; i++) {
                const randomIndex = Math.floor(Math.random() * specialChars.length);
                //插入特殊符号，不能在0号位置
                const randomPosition = Math.floor(Math.random() * (password.length - 1)) + 1;
                password = password.charAt(0) + password.slice(1, randomPosition) + specialChars[randomIndex] + password.slice(randomPosition);
            }
            return password;
        }
    }
}
</script>
    
<style scoped>
.option-item {
    display: flex;
    justify-content: space-between;
    margin: 5px 0;
}

.option-label {
    font-size: 16px;
    line-height: 30px;
}
</style>
    