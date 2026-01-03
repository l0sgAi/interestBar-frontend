<template>
  <div class="success-page">
    <!-- 动态背景 -->
    <AnimatedBackground />

    <NCard class="success-container" :bordered="false">
      <div class="success-view">
        <div class="avatar-placeholder">{{ userInitial }}</div>
        <h2 class="welcome-title">欢迎回来!</h2>
        <p class="user-email">{{ userEmail }}</p>

        <div class="token-section">
          <div class="token-label">Token Debug:</div>
          <NScrollbar style="max-height: 100px">
            <div class="token-box">{{ token }}</div>
          </NScrollbar>
        </div>

        <NButton
          type="primary"
          size="large"
          class="enter-btn"
          @click="handleEnterCommunity"
        >
          进入社区
        </NButton>
      </div>
    </NCard>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { NCard, NButton, NScrollbar, useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import AnimatedBackground from '@/components/AnimatedBackground.vue'
import { auth } from '@/utils/auth'

const router = useRouter()
const message = useMessage()

const token = ref('')
const userEmail = ref('')

const userInitial = computed(() => {
  return userEmail.value ? userEmail.value.charAt(0).toUpperCase() : '✓'
})

onMounted(() => {
  // 从 URL 参数获取 token 和 email
  const urlParams = new URLSearchParams(window.location.search)
  token.value = urlParams.get('token') || ''
  const expire = urlParams.get('expire') || ''
  userEmail.value = urlParams.get('email') || 'user@example.com'

  // 如果有 token，保存到本地存储
  if (token.value) {
    // 使用 auth 工具保存 token 和过期时间
    auth.setToken(token.value, expire)

    // 清除 URL 中的参数，保持地址栏干净
    window.history.replaceState({}, document.title, window.location.pathname)

    message.success('登录成功！')
    console.log('登录成功，Token已保存:', {
      token: token.value.substring(0, 20) + '...',
      expire: expire + '秒'
    })
  } else {
    // 如果没有 token，重定向回登录页
    message.warning('未检测到登录信息，正在跳转到登录页...')
    setTimeout(() => {
      router.push('/')
    }, 2000)
  }
})

const handleEnterCommunity = () => {
  // 跳转到系统主页
  router.push('/home')
}
</script>

<style scoped>
.success-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.success-container {
  position: relative;
  z-index: 1;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  box-shadow: var(--shadow-md);
  width: 100%;
  max-width: 480px;
  padding: 40px 32px;
  text-align: center;
}

.success-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 0.5s ease;
}

.avatar-placeholder {
  width: 90px;
  height: 90px;
  background: var(--primary-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 24px;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  border: 3px solid var(--glass-border);
}

.welcome-title {
  color: var(--text-primary);
  margin-bottom: 12px;
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.user-email {
  color: var(--text-secondary);
  margin-bottom: 24px;
  font-size: 0.95rem;
}

.token-section {
  width: 100%;
  text-align: left;
  margin-bottom: 28px;
}

.token-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 600;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.token-box {
  background: var(--bg-secondary);
  border: 1px solid var(--glass-border);
  padding: 16px;
  border-radius: 12px;
  word-break: break-all;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-align: left;
  line-height: 1.6;
  transition: all 0.3s ease;
}

.token-box:hover {
  border-color: var(--accent-color);
  box-shadow: 0 2px 12px rgba(102, 126, 234, 0.2);
}

.enter-btn {
  width: 100%;
  height: 52px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  background: var(--primary-gradient);
  border: none;
  color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-sm);
}

.enter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
}

.enter-btn:active {
  transform: translateY(0);
}

/* NaiveUI 组件样式覆盖 */
:deep(.n-card) {
  background: transparent !important;
}

:deep(.n-scrollbar) {
  background: var(--bg-secondary) !important;
  border-radius: 12px;
  border: 1px solid var(--glass-border);
}

:deep(.n-scrollbar-container) {
  padding: 4px;
}

:deep(.n-scrollbar-rail) {
  background: var(--bg-tertiary) !important;
}

:deep(.n-scrollbar-handle) {
  background: var(--accent-color) !important;
}
</style>
