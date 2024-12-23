import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 引入 ElementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import VueCookies from 'vue-cookies'


const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }//图标

// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//     app.component(key, component)
// }

app.use(router).use(ElementPlus,{locale: zhCn}).use(VueCookies);

app.mount('#app')

app.config.globalProperties.$cookies = VueCookies
VueCookies.config("1d");