<template>
  <div class="home-page">
    <!-- 动态背景 -->
    <AnimatedBackground />

    <NCard class="home-container" :bordered="false">
      <div class="home-content">
        <div class="header">
          <h1 class="title">欢迎来到趣吧 Quba</h1>
          <p class="subtitle">连接多元兴趣，发现无限可能</p>
        </div>

        <NDivider />

        <div class="user-info">
          <div class="avatar">{{ userInitial }}</div>
          <div class="info">
            <p class="label">登录状态</p>
            <p class="status">已登录</p>
          </div>
        </div>

        <NDivider />

        <div class="token-debug">
          <h3>Token 信息</h3>
          <p><strong>Token:</strong> {{ maskedToken }}</p>
          <p><strong>状态:</strong> <NTag type="success" size="small">有效</NTag></p>
        </div>

        <div class="actions">
          <NButton type="error" @click="handleLogout">
            退出登录
          </NButton>
        </div>
      </div>
    </NCard>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { NCard, NButton, NDivider, NTag, useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
import AnimatedBackground from '@/components/AnimatedBackground.vue'
import { auth } from '@/utils/auth'
import request from '@/utils/request'

const router = useRouter()
const message = useMessage()

const token = ref('')

const userInitial = computed(() => {
  return 'U'
})

const maskedToken = computed(() => {
  if (!token.value) return '未获取'
  return token.value.substring(0, 20) + '...' + token.value.substring(token.value.length - 10)
})

onMounted(() => {
  // 检查登录状态
  if (!auth.isAuthenticated()) {
    message.warning('请先登录')
    router.push('/')
    return
  }

  // 获取 token
  token.value = auth.getToken() || ''
})

const handleLogout = async () => {
  try {
    // 调用后端登出接口
    await request.post('/auth/logout')

    // 清除本地 token
    auth.clearToken()
    message.success('已退出登录')
    router.push('/')
  } catch (error) {
    // 即使接口调用失败，也清除本地 token
    auth.clearToken()
    message.warning('退出登录')
    router.push('/')
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 20px;
}

.home-container {
  position: relative;
  z-index: 1;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 24px;
  box-shadow: var(--shadow-md);
  width: 100%;
  max-width: 600px;
  padding: 40px;
}

.home-content {
  animation: fadeIn 0.5s ease;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar {
  width: 60px;
  height: 60px;
  background: var(--primary-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
}

.info {
  flex: 1;
}

.label {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-bottom: 4px;
}

.status {
  color: var(--text-primary);
  font-size: 1.125rem;
  font-weight: 600;
}

.token-debug {
  margin: 20px 0;
}

.token-debug h3 {
  color: var(--text-primary);
  font-size: 1rem;
  margin-bottom: 16px;
}

.token-debug p {
  color: var(--text-secondary);
  margin-bottom: 8px;
  font-size: 0.875rem;
}

.actions {
  margin-top: 24px;
  text-align: center;
}

:deep(.n-card) {
  background: transparent !important;
}

:deep(.n-divider) {
  border-color: var(--glass-border) !important;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
