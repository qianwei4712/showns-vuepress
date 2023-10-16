import ElementPlus from 'element-plus'
import { defineClientConfig } from '@vuepress/client'
import { ElButton, ElIcon, ElDialog, ElTag, ElRadio, ElInput, ElInputNumber, ElForm, ElFormItem, ElRow, ElCol, ElDivider } from "element-plus"

export default defineClientConfig({
    enhance({ app }) {
        if (!__VUEPRESS_SSR__) {
            import('element-plus/es/locale/lang/zh-cn').then(module => {
                app.use(ElementPlus, {
                    locale: module.default,
                })
            })
            import("element-plus/es/components/button/style/css");
            import("element-plus/es/components/icon/style/css");
            import("element-plus/es/components/dialog/style/css");
            import("element-plus/es/components/tag/style/css");
            import("element-plus/es/components/radio/style/css");
            import("element-plus/es/components/input/style/css");
            import("element-plus/es/components/input-number/style/css");
            import("element-plus/es/components/form/style/css");
            import("element-plus/es/components/form-item/style/css");
            import("element-plus/es/components/row/style/css");
            import("element-plus/es/components/col/style/css");
            import("element-plus/es/components/divider/style/css");

        }
        app.component('el-button', ElButton)
        app.component('el-icon', ElIcon)
        app.component('el-dialog', ElDialog)
        app.component('el-tag', ElTag)
        app.component('el-radio', ElRadio)
        app.component('el-input', ElInput)
        app.component('el-input-number', ElInputNumber)
        app.component('el-form', ElForm)
        app.component('el-form-item', ElFormItem)
        app.component('el-row', ElRow)
        app.component('el-col', ElCol)
        app.component('el-divider', ElDivider)

    }
});