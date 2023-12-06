<template>
    <div class="timestampConversion">
        <el-row>
            <el-col :span="2">
                <el-switch v-model="mode" class="ml-2" inline-prompt
                    style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-text="毫秒" inactive-text="秒"
                    @change="changeSwitch" />
            </el-col>
            <el-col :span="10">
                <div style="vertical-align: middle;line-height: 28px;">
                    当前时间戳：<span style="font-size: 18px;font-weight: bold;cursor: pointer;"
                        @click="copy(this.currentTimestamp)">
                        {{ currentTimestamp }}</span>
                    <svg t="1698212495344" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="5245" width="30" height="30"
                        style="vertical-align: middle;cursor: pointer;margin-left: 15px;"
                        @click="copy(this.currentTimestamp)">
                        <path
                            d="M626.432 934.1952H223.8464c-73.5232 0-133.12-59.5968-133.12-133.12V398.4896c0-73.5232 59.5968-133.12 133.12-133.12h402.5856c73.5232 0 133.12 59.5968 133.12 133.12v402.5856c0 73.5232-59.5968 133.12-133.12 133.12z"
                            fill="#4BE2AC" p-id="5246"></path>
                        <path
                            d="M806.144 754.4832H403.6096c-73.5232 0-133.12-59.5968-133.12-133.12V218.7776c0-73.5232 59.5968-133.12 133.12-133.12h402.5856c73.5232 0 133.12 59.5968 133.12 133.12v402.5856c-0.0512 73.5232-59.648 133.12-133.1712 133.12z"
                            fill="#4BE2AC" p-id="5247"></path>
                        <path
                            d="M623.5136 265.3696H270.4896v353.0752c0 75.1104 60.928 136.0384 136.0384 136.0384h353.0752V401.408c-0.0512-75.1104-60.928-136.0384-136.0896-136.0384z"
                            fill="#06CC76" p-id="5248"></path>
                    </svg>
                </div>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <div>
            <div class="trans-title">
                日期（北京）→ 时间戳：
            </div>
            <div style="display: flex;">
                <div>
                    <el-date-picker v-model="transTimestamp" type="datetime" placeholder="请选择" @change="transDateTimeChange"
                        popper-class="timestampConversion-table" />
                </div>
                <div v-if="transTimestampResult != null" style="line-height: 32px;margin-left: 25px;">
                    <span style="font-size: 18px;font-weight: bold;cursor: pointer;"
                        @click="copy(this.transTimestampResult)">
                        {{ transTimestampResult }}</span>
                    <svg t="1698212495344" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="5245" width="25" height="25"
                        style="vertical-align: middle;cursor: pointer;margin-left: 15px;"
                        @click="copy(this.transTimestampResult)">
                        <path
                            d="M626.432 934.1952H223.8464c-73.5232 0-133.12-59.5968-133.12-133.12V398.4896c0-73.5232 59.5968-133.12 133.12-133.12h402.5856c73.5232 0 133.12 59.5968 133.12 133.12v402.5856c0 73.5232-59.5968 133.12-133.12 133.12z"
                            fill="#4BE2AC" p-id="5246"></path>
                        <path
                            d="M806.144 754.4832H403.6096c-73.5232 0-133.12-59.5968-133.12-133.12V218.7776c0-73.5232 59.5968-133.12 133.12-133.12h402.5856c73.5232 0 133.12 59.5968 133.12 133.12v402.5856c-0.0512 73.5232-59.648 133.12-133.1712 133.12z"
                            fill="#4BE2AC" p-id="5247"></path>
                        <path
                            d="M623.5136 265.3696H270.4896v353.0752c0 75.1104 60.928 136.0384 136.0384 136.0384h353.0752V401.408c-0.0512-75.1104-60.928-136.0384-136.0896-136.0384z"
                            fill="#06CC76" p-id="5248"></path>
                    </svg>
                </div>
            </div>
        </div>
        <el-divider></el-divider>
        <div>
            <div class="trans-title">
                时间戳 → 日期（北京）：
            </div>
            <div style="display: flex;">
                <div>
                    <el-input v-model="timesTransDateTime" style="width: 220px;"
                        @change="timesTransDateTimeChange"></el-input>
                </div>
                <div v-if="timesTransDateTimeResult != null" style="line-height: 32px;margin-left: 25px;">
                    <span style="font-size: 18px;font-weight: bold;cursor: pointer;"
                        @click="copy(this.timesTransDateTimeResult)">
                        {{ timesTransDateTimeResult }}</span>
                    <svg t="1698212495344" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="5245" width="25" height="25"
                        style="vertical-align: middle;cursor: pointer;margin-left: 15px;"
                        @click="copy(this.timesTransDateTimeResult)">
                        <path
                            d="M626.432 934.1952H223.8464c-73.5232 0-133.12-59.5968-133.12-133.12V398.4896c0-73.5232 59.5968-133.12 133.12-133.12h402.5856c73.5232 0 133.12 59.5968 133.12 133.12v402.5856c0 73.5232-59.5968 133.12-133.12 133.12z"
                            fill="#4BE2AC" p-id="5246"></path>
                        <path
                            d="M806.144 754.4832H403.6096c-73.5232 0-133.12-59.5968-133.12-133.12V218.7776c0-73.5232 59.5968-133.12 133.12-133.12h402.5856c73.5232 0 133.12 59.5968 133.12 133.12v402.5856c-0.0512 73.5232-59.648 133.12-133.1712 133.12z"
                            fill="#4BE2AC" p-id="5247"></path>
                        <path
                            d="M623.5136 265.3696H270.4896v353.0752c0 75.1104 60.928 136.0384 136.0384 136.0384h353.0752V401.408c-0.0512-75.1104-60.928-136.0384-136.0896-136.0384z"
                            fill="#06CC76" p-id="5248"></path>
                    </svg>
                </div>
            </div>
        </div>

    </div>
</template>
  
<script>
import { ElMessage } from 'element-plus'

export default {
    name: "timestampConversion",
    data() {
        return {
            mode: true, //true为毫秒，false为秒
            currentTimestamp: 0, //当前时间戳
            transTimestamp: new Date(),//时间格式转时间戳
            transTimestampResult: null,//事件转时间戳结果
            timesTransDateTime: null,//时间戳
            timesTransDateTimeResult: null,//时间戳转日期结果
        }
    },
    mounted() {
        const that = this
        setInterval(() => {
            that.initCurrentTimestamp()
        }, 1000)
        that.transDateTimeChange()
    },
    methods: {
        //切换开关，秒和毫秒，重新计算
        changeSwitch() {
            this.initCurrentTimestamp()
            this.transDateTimeChange()
            this.timesTransDateTimeChange()
        },
        //更新当前时间戳，模式切换秒和毫秒
        initCurrentTimestamp() {
            let time = Date.now();
            this.currentTimestamp = this.mode ? time : Math.round(time / 1000)
        },
        //日期时间换为时间戳，触发事件
        transDateTimeChange() {
            let time = this.transTimestamp.getTime();
            this.transTimestampResult = this.mode ? time : Math.round(time / 1000)
        },
        //时间戳转日期
        timesTransDateTimeChange() {
            if (this.timesTransDateTime == null) {
                return false
            }
            let time = this.mode ? (this.timesTransDateTime * 1) : Math.round(this.timesTransDateTime * 1000)
            this.timesTransDateTimeResult = this.dateFormat(time)
        },
        //时间格式化
        dateFormat(timestamp) {
            let date = new Date(timestamp);

            let year = date.getFullYear();
            let month = date.getMonth() + 1; // getMonth() 返回的月份从 0 开始
            let day = date.getDate();
            let hour = date.getHours();
            let minute = date.getMinutes();
            let second = date.getSeconds();

            // 如果月、日、小时、分钟或秒的数值小于 10，前面加 '0'，以确保它们总是两位数
            month = month < 10 ? '0' + month : month;
            day = day < 10 ? '0' + day : day;
            hour = hour < 10 ? '0' + hour : hour;
            minute = minute < 10 ? '0' + minute : minute;
            second = second < 10 ? '0' + second : second;

            return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
        },
        copy(data) {
            const textarea = document.createElement('textarea')
            textarea.value = data
            document.body.appendChild(textarea)
            textarea.select()
            document.execCommand('copy')
            document.body.removeChild(textarea)
            //提示消息，复制成功
            ElMessage({
                message: '复制成功！',
                grouping: true,
                type: 'success',
            })
        },
    }
}
</script>
  
<style scoped>
.trans-title {
    color: gray;
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 5px;
}
</style>
<style>
.timestampConversion-table table {
    display: table !important;
}
</style> 