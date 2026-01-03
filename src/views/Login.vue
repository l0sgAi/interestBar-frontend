<template>
  <div class="login-page">
    <!-- 动态背景 -->
    <AnimatedBackground />

    <NCard class="login-container" :bordered="false">
      <div class="logo-area">
        <div class="logo-text">趣吧 Quba</div>
        <p class="tagline">连接多元兴趣，发现无限可能</p>
      </div>

      <!-- 装饰性标签，体现社区氛围 -->
      <NSpace class="interest-tags" :size="[8, 8]" justify="center">
        <NTag
          v-for="tag in interestTags"
          :key="tag.name"
          :bordered="false"
          size="small"
          round
        >
          {{ tag.emoji }} {{ tag.name }}
        </NTag>
      </NSpace>

      <div class="login-section">
        <NButton
          type="primary"
          size="large"
          class="google-btn"
          @click="handleGoogleLogin"
          :loading="loading"
        >
          <template #icon>
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google Logo"
              class="google-icon"
            />
          </template>
          使用 Google 账号继续
        </NButton>
      </div>

      <p class="footer">
        登录即代表您同意
        <router-link to="/terms" class="footer-link">《用户协议》</router-link>
        与
        <router-link to="/privacy" class="footer-link">《隐私政策》</router-link>
      </p>
    </NCard>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { NCard, NButton, NSpace, NTag, useMessage } from 'naive-ui'
import AnimatedBackground from '@/components/AnimatedBackground.vue'

const message = useMessage()
const loading = ref(false)

const interestTags = [
  { name: '摄影', emoji: '📷' },
  { name: '露营', emoji: '⛺' },
  { name: '咖啡', emoji: '☕' },
  { name: '编程', emoji: '💻' },
  { name: '艺术', emoji: '🎨' },
  { name: '音乐', emoji: '🎵' },
  { name: '极限运动', emoji: '🛹' }
]

const handleGoogleLogin = () => {
  loading.value = true
  // 跳转到 Google 登录
  window.location.href = 'https://undeclared-porsha-nonformatively.ngrok-free.dev/auth/google/login'
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.login-container {
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
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.login-container:hover {
  box-shadow: var(--shadow-lg);
}

.logo-area {
  margin-bottom: 24px;
}

.logo-text {
  font-size: 2.5rem;
  font-weight: 800;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.tagline {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
  font-weight: 400;
}

.interest-tags {
  margin: 28px 0;
}

.login-section {
  margin: 32px 0;
}

.google-btn {
  width: 100%;
  height: 52px;
  border-radius: 16px;
  font-size: 16px;
  font-weight: 600;
  background-color: var(--google-btn-bg);
  color: var(--google-btn-text);
  border: 1px solid var(--google-btn-border);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-sm);
}

.google-btn:hover {
  background-color: var(--bg-tertiary);
  border-color: var(--accent-color);
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  transform: translateY(-2px);
}

.google-btn:active {
  transform: translateY(0);
}

.google-icon {
  width: 22px;
  height: 22px;
  filter: brightness(0) invert(1);
}

.footer {
  margin-top: 32px;
  font-size: 0.8rem;
  color: var(--text-tertiary);
  line-height: 1.5;
  text-align: center;
}

.footer-link {
  color: var(--accent-color);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  border-bottom: 1px dashed transparent;
}

.footer-link:hover {
  color: var(--accent-secondary);
  border-bottom-color: var(--accent-secondary);
}

/* NaiveUI 组件样式覆盖 */
:deep(.n-card) {
  background: transparent !important;
}

:deep(.n-tag) {
  background: var(--bg-tertiary) !important;
  color: var(--text-secondary) !important;
  border: 1px solid var(--glass-border) !important;
  transition: all 0.3s ease;
}

:deep(.n-tag:hover) {
  background: rgba(102, 126, 234, 0.2) !important;
  color: var(--text-primary) !important;
  border-color: var(--accent-color) !important;
  transform: translateY(-2px);
}
</style>
