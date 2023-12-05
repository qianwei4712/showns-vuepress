import ElementPlus from 'element-plus'
import { defineClientConfig } from '@vuepress/client'
import './styles/palette.scss';

export default defineClientConfig({
    enhance({ app, router, siteData }) {
        app.use(ElementPlus)
    },
    setup() {
    },
    rootComponents: [],
});