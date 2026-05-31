import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './styles/tokens.css'
import './styles/element-dark.css'
import App from './App.vue'

// 挂载前同步写入主题属性，避免页面闪烁
const saved = localStorage.getItem('vstat-theme') || 'light'
document.documentElement.setAttribute('data-theme', saved)

const app = createApp(App)
app.use(ElementPlus)
app.mount('#app')
