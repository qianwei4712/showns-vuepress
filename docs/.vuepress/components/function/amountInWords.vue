<template>
    <div class="amountInWords">
        <el-row :gutter="15">
            <el-col :span="6">
                <div style="line-height: 40px;font-size: 18px;">
                    人民币金额:
                </div>
            </el-col>
            <el-col :span="18">
                <el-input-number v-model="amount" :min="0.00" :max="999999999" :step="1" :precision="2" size="large"
                    @change="amountChange" style="width:  60%;" />
            </el-col>
        </el-row>
        <div style="margin-top: 10px;"></div>
        <el-row :gutter="15">
            <el-col :span="6">
                <div style="line-height: 60px;font-size: 18px;">
                    大写:
                </div>
            </el-col>
            <el-col :span="14">
                <div style="display: flex;justify-content: space-between;">
                    <div
                        style="line-height: 60px;font-size: 26px;font-weight: bold;font-family: cursive;color: rgb(0, 184, 0);">
                        {{ chineseAmount }}
                    </div>
                </div>
            </el-col>
            <el-col :span="4">
                <div style="line-height: 60px;vertical-align: middle;cursor: pointer;" @click="copy(this.chineseAmount)">
                    <svg t="1698212495344" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="5245" width="45" height="45"
                        style="vertical-align: middle;">
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
    </div>
</template>
  
<script>
import { ElMessage } from 'element-plus'

export default {
    name: "amountInWords",
    data() {
        return {
            amount: 0,
            chineseAmount: '零元'
        }
    },
    methods: {
        amountChange(data) {
            this.chineseAmount = this.transform(data)

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
                message: '金额大写已经复制！',
                grouping: true,
                type: 'success',
            })
        },
        transform(money) {
            //  将数字金额转换为大写金额
            var cnNums = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); //汉字的数字
            var cnIntRadice = new Array("", "拾", "佰", "仟"); //基本单位
            var cnIntUnits = new Array("", "万", "亿", "兆"); //对应整数部分扩展单位
            var cnDecUnits = new Array("角", "分", "毫", "厘"); //对应小数部分单位
            var cnInteger = "整"; //整数金额时后面跟的字符
            var cnIntLast = "元"; //整数完以后的单位
            //最大处理的数字
            var maxNum = 999999999999999.9999;
            var integerNum; //金额整数部分
            var decimalNum; //金额小数部分
            //输出的中文金额字符串
            var chineseStr = "";
            var parts; //分离金额后用的数组，预定义
            if (money == "") {
                return "";
            }
            money = parseFloat(money);
            if (money >= maxNum) {
                //超出最大处理数字
                return "超出最大处理数字";
            }
            if (money == 0) {
                chineseStr = cnNums[0] + cnIntLast + cnInteger;
                return chineseStr;
            }

            //四舍五入保留两位小数,转换为字符串
            money = Math.round(money * 100).toString();
            integerNum = money.substr(0, money.length - 2);
            decimalNum = money.substr(money.length - 2);

            //获取整型部分转换
            if (parseInt(integerNum, 10) > 0) {
                var zeroCount = 0;
                var IntLen = integerNum.length;
                for (var i = 0; i < IntLen; i++) {
                    var n = integerNum.substr(i, 1);
                    var p = IntLen - i - 1;
                    var q = p / 4;
                    var m = p % 4;
                    if (n == "0") {
                        zeroCount++;
                    } else {
                        if (zeroCount > 0) {
                            chineseStr += cnNums[0];
                        }
                        //归零
                        zeroCount = 0;
                        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
                    }
                    if (m == 0 && zeroCount < 4) {
                        chineseStr += cnIntUnits[q];
                    }
                }
                chineseStr += cnIntLast;
            }
            //小数部分
            if (decimalNum != "") {
                var decLen = decimalNum.length;
                for (var i = 0; i < decLen; i++) {
                    var n = decimalNum.substr(i, 1);
                    if (n != "0") {
                        chineseStr += cnNums[Number(n)] + cnDecUnits[i];
                    }
                }
            }
            if (chineseStr == "") {
                chineseStr += cnNums[0] + cnIntLast + cnInteger;
            } else if (decimalNum == "" || /^0*$/.test(decimalNum)) {
                chineseStr += cnInteger;
            }
            return chineseStr;
        }
    }
}
</script>
  
<style scoped></style>
  