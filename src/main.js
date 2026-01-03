import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)

app.use(router)

// 在挂载前检查是否有重定向路径（GitHub Pages SPA fallback）
const redirectPath = sessionStorage.getItem('spa-redirect')

// 等待路由准备好后再处理重定向
router.isReady().then(() => {
  if (redirectPath) {
    // 清除存储的重定向路径
    sessionStorage.removeItem('spa-redirect')

    // 跳转到原始路径
    router.replace(redirectPath)
  }
})

app.mount('#app')
