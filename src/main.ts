import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
// @ts-ignore
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller'

import App from './App.vue'
import router from './router'

import '@arco-design/web-vue/dist/arco.css'
import '@/assets/styles/main.css'

import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

import 'highlight.js/styles/github-dark.min.css'
import 'highlight.js/lib/common'
import hljsVuePlugin from '@highlightjs/vue-plugin'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ArcoVue)
app.use(ArcoVueIcon)

app.component('DynamicScroller', DynamicScroller)
app.component('DynamicScrollerItem', DynamicScrollerItem)

app.use(hljsVuePlugin)

app.mount('#app')
