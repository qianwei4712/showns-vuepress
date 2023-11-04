import ElementPlus from 'element-plus'
import { defineClientConfig } from '@vuepress/client'
import {
    ElButton, ElIcon, ElDialog, ElTag, ElRadio, ElInput, ElInputNumber,
    ElForm, ElFormItem, ElRow, ElCol, ElDivider, ElUpload, ElSwitch,
    ElTimeline, ElTimelineItem, ElCard, ElCheckbox, ElAvatar, ElPopover,
    ElMessage, ElMessageBox, ElTabs
} from "element-plus"

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
            import("element-plus/es/components/upload/style/css");
            import("element-plus/es/components/switch/style/css");
            import("element-plus/es/components/timeline/style/css");
            import("element-plus/es/components/timeline-item/style/css");
            import("element-plus/es/components/card/style/css");
            import("element-plus/es/components/checkbox/style/css");
            import("element-plus/es/components/avatar/style/css");
            import("element-plus/es/components/popover/style/css");
            import("element-plus/es/components/message/style/css");
            import("element-plus/es/components/message-box/style/css");
            import("element-plus/es/components/tabs/style/css");


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
        app.component('el-upload', ElUpload)
        app.component('el-switch', ElSwitch)
        app.component('el-timeline', ElTimeline)
        app.component('el-timeline-item', ElTimelineItem)
        app.component('el-card', ElCard)
        app.component('el-checkbox', ElCheckbox)
        app.component('el-avatar', ElAvatar)
        app.component('el-popover', ElPopover)
        app.component('el-tabs', ElTabs)

    }
});