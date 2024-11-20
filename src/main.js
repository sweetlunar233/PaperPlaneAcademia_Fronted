import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 引入 ElementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import VueCookies from 'vue-cookies'

const app = createApp(App)

app.use(router).use(ElementPlus,{locale: zhCn})

app.mount('#app')

app.config.globalProperties.$cookies = VueCookies
VueCookies.config("1d");