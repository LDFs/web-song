import 'element-plus/dist/index.css'
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { AVPlugin } from "vue-audio-visual";

const app = createApp(App)

app.use(router).use(store).use(AVPlugin)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.mount('#app')
