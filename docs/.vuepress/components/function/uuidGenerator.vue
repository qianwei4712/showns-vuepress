<template>
    <div class="uuidGenerator">
        <div>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-checkbox v-model="config.capitalFetters" label="字母开启大写" :border="true" />
                </el-col>
                <el-col :span="8">
                    <el-checkbox v-model="config.replaceHorizontalLine" label="替换分割横杠" :border="true" />
                </el-col>
                <el-col :span="8">
                    <el-input-number v-model="config.amount" :min="1" :max="10" :step="1" :precision="0" />
                </el-col>
            </el-row>
            <div style="text-align: center;margin-top: 15px;">
                <el-button type="success" @click="generator">立即生成 UUID</el-button>
            </div>
            <el-divider></el-divider>
            <div>
                <div v-for="item in resultArray" :key="item" class="uuid-result" @click="copy(item)">
                    {{ item }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import { ElMessage } from 'element-plus'
export default {
    name: "uuidGenerator",
    data() {
        return {
            config: {//配置内容
                capitalFetters: false,//开启大写
                replaceHorizontalLine: false,//替换横杠
                amount: 5
            },
            resultArray: []
        }
    },
    methods: {
        generator() {
            this.resultArray = []
            for (let i = 0; i < this.config.amount; i++) {
                this.resultArray.push(uuidv4())
            }
            //需要替换为大写
            if (this.config.capitalFetters) {
                this.resultArray.forEach((item, index, array) => {
                    array[index] = item.toUpperCase();
                });
            }
            //替换中间的横杠
            if (this.config.replaceHorizontalLine) {
                this.resultArray.forEach((item, index, array) => {
                    array[index] = item.replace(/-/g, '')
                });
            }
        },
        copy(data) {
            const textarea = document.createElement('textarea')
            textarea.value = data
            document.body.appendChild(textarea)
            textarea.select()
            document.execCommand('copy')
            document.body.removeChild(textarea)
            ElMessage({
                message: '复制成功！',
                type: 'success',
            })

        }
    }
}
</script>

<style scoped>
.uuid-result {
    font-size: 18px;
    text-align: center;
    padding-top: 10px;
    cursor: pointer;
    color: #409EFF;
    font-family: math
}
</style>