<template>
  <NConfigProvider :theme="darkTheme" :theme-overrides="themeOverrides">
    <div class="user-profile-page">
      <!-- 顶栏 -->
      <AppHeader />

      <!-- 侧边栏 -->
      <SideNav />

      <!-- 主内容区域 -->
      <div class="main-content">
        <div class="profile-container">
          <!-- 用户信息卡片 -->
          <NCard class="profile-card" :bordered="false">
            <!-- 头部背景 -->
            <div class="profile-header">
              <div class="header-background"></div>
              <div class="profile-avatar-section">
                <div class="avatar-wrapper">
                  <NAvatar
                    :size="120"
                    :src="userInfo.avatar_url || undefined"
                    round
                    class="profile-avatar"
                  >
                    {{ userInfo.username?.charAt(0) || 'U' }}
                  </NAvatar>
                  <NBadge :value="getStatusBadge(userInfo.status)" type="success" />
                </div>
                <div class="profile-basic-info">
                  <h1 class="username">{{ userInfo.username || '未设置' }}</h1>
                  <p class="user-email">{{ userInfo.email || '未设置' }}</p>
                </div>
              </div>
            </div>

            <!-- 用户详细信息 -->
            <div class="profile-details">
              <NDivider />

              <div class="details-section">
                <h3 class="section-title">
                  <NIcon class="title-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </NIcon>
                  基本信息
                </h3>

                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">用户ID</span>
                    <span class="info-value">{{ userInfo.id || '-' }}</span>
                  </div>

                  <div class="info-item">
                    <span class="info-label">用户名</span>
                    <span class="info-value">{{ userInfo.username || '-' }}</span>
                  </div>

                  <div class="info-item">
                    <span class="info-label">邮箱</span>
                    <span class="info-value">{{ userInfo.email || '-' }}</span>
                  </div>

                  <div class="info-item">
                    <span class="info-label">手机号</span>
                    <span class="info-value">{{ userInfo.phone || '未绑定' }}</span>
                  </div>

                  <div class="info-item">
                    <span class="info-label">性别</span>
                    <span class="info-value">{{ getGenderText(userInfo.gender) }}</span>
                  </div>

                  <div class="info-item">
                    <span class="info-label">生日</span>
                    <span class="info-value">{{ formatDate(userInfo.birthdate) }}</span>
                  </div>

                  <div class="info-item">
                    <span class="info-label">角色</span>
                    <NTag :type="getRoleType(userInfo.role)" size="small" round>
                      {{ getRoleText(userInfo.role) }}
                    </NTag>
                  </div>

                  <div class="info-item">
                    <span class="info-label">状态</span>
                    <NTag :type="userInfo.status === 1 ? 'success' : 'error'" size="small" round>
                      {{ userInfo.status === 1 ? '正常' : '禁用' }}
                    </NTag>
                  </div>
                </div>
              </div>

              <!-- 账号绑定 -->
              <NDivider />

              <div class="details-section">
                <h3 class="section-title">
                  <NIcon class="title-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                    </svg>
                  </NIcon>
                  账号绑定
                </h3>

                <div class="binding-list">
                  <div class="binding-item">
                    <div class="binding-icon github">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </div>
                    <div class="binding-info">
                      <span class="binding-name">GitHub</span>
                      <span class="binding-status" :class="{ bound: !!userInfo.github_id }">
                        {{ userInfo.github_id ? '已绑定' : '未绑定' }}
                      </span>
                    </div>
                  </div>

                  <div class="binding-item">
                    <div class="binding-icon google">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    </div>
                    <div class="binding-info">
                      <span class="binding-name">Google</span>
                      <span class="binding-status" :class="{ bound: !!userInfo.google_id }">
                        {{ userInfo.google_id ? '已绑定' : '未绑定' }}
                      </span>
                    </div>
                  </div>

                  <div class="binding-item">
                    <div class="binding-icon x">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </div>
                    <div class="binding-info">
                      <span class="binding-name">X (Twitter)</span>
                      <span class="binding-status" :class="{ bound: !!userInfo.x_id }">
                        {{ userInfo.x_id ? '已绑定' : '未绑定' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 时间信息 -->
              <NDivider />

              <div class="details-section">
                <h3 class="section-title">
                  <NIcon class="title-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </NIcon>
                  时间信息
                </h3>

                <div class="info-grid">
                  <div class="info-item">
                    <span class="info-label">注册时间</span>
                    <span class="info-value">{{ formatDateTime(userInfo.create_time) }}</span>
                  </div>

                  <div class="info-item">
                    <span class="info-label">更新时间</span>
                    <span class="info-value">{{ formatDateTime(userInfo.update_time) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </NCard>

          <!-- 功能提示 -->
          <NCard class="features-card" :bordered="false">
            <div class="features-content">
              <NAlert type="info" :bordered="false">
                <template #header>
                  <div class="alert-title">
                    <NIcon>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                    </NIcon>
                    功能开发中
                  </div>
                </template>
                个人信息修改功能正在开发中，敬请期待！
              </NAlert>
            </div>
          </NCard>
        </div>
      </div>
    </div>
  </NConfigProvider>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  NConfigProvider,
  NCard,
  NAvatar,
  NBadge,
  NDivider,
  NIcon,
  NTag,
  NAlert,
  darkTheme,
  useMessage
} from 'naive-ui'
import AppHeader from '@/components/AppHeader.vue'
import SideNav from '@/components/SideNav.vue'
import { auth } from '@/utils/auth'
import request from '@/utils/request'

const router = useRouter()
const message = useMessage()

// NaiveUI 深色主题覆盖
const themeOverrides = {
  common: {
    primaryColor: '#ec4899',
    primaryColorHover: '#f472b6',
    primaryColorPressed: '#db2777',
    textColor1: 'rgba(255, 255, 255, 0.95)',
    textColor2: 'rgba(255, 255, 255, 0.8)',
    textColor3: 'rgba(255, 255, 255, 0.6)',
    textColor4: 'rgba(255, 255, 255, 0.4)'
  },
  Card: {
    color: 'rgba(255, 255, 255, 0.03)',
    colorModal: 'rgba(255, 255, 255, 0.03)',
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  Divider: {
    textColor: 'rgba(255, 255, 255, 0.3)'
  },
  Tag: {
    color: 'rgba(255, 255, 255, 0.1)',
    textColor: 'rgba(255, 255, 255, 0.8)'
  },
  Alert: {
    color: 'rgba(102, 126, 234, 0.1)',
    textColor: 'rgba(255, 255, 255, 0.8)',
    borderColor: 'rgba(102, 126, 234, 0.2)'
  }
}

// 用户信息
const userInfo = ref({
  id: null,
  username: '',
  email: '',
  phone: '',
  google_id: '',
  x_id: '',
  github_id: '',
  avatar_url: '',
  gender: 0,
  birthdate: null,
  status: 1,
  role: 0,
  create_time: null,
  update_time: null
})

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const response = await request.get('/user/get')
    if (response.data) {
      userInfo.value = response.data
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    message.error('获取用户信息失败')
  }
}

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '未设置'
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN')
}

// 格式化日期时间
const formatDateTime = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN')
}

// 获取性别文本
const getGenderText = (gender) => {
  const genderMap = {
    0: '未设置',
    1: '男',
    2: '女',
    3: '其他'
  }
  return genderMap[gender] || '未设置'
}

// 获取角色文本
const getRoleText = (role) => {
  const roleMap = {
    0: '普通用户',
    1: '管理员',
    2: '超级管理员'
  }
  return roleMap[role] || '普通用户'
}

// 获取角色标签类型
const getRoleType = (role) => {
  const typeMap = {
    0: 'default',
    1: 'warning',
    2: 'error'
  }
  return typeMap[role] || 'default'
}

// 获取状态徽章
const getStatusBadge = (status) => {
  return status === 1 ? '' : 'disabled'
}

onMounted(() => {
  // 检查登录状态
  if (!auth.isAuthenticated()) {
    message.warning('请先登录')
    router.push('/')
    return
  }

  // 获取用户信息
  fetchUserInfo()
})
</script>

<style scoped>
.user-profile-page {
  min-height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%);
}

.main-content {
  margin-left: 260px;
  margin-top: 64px;
  padding: 24px;
  min-height: calc(100vh - 64px);
}

.profile-container {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: fadeIn 0.5s ease;
}

/* 用户信息卡片 */
.profile-card {
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(20px);
}

/* 头部背景 */
.profile-header {
  position: relative;
  margin-bottom: 20px;
}

.header-background {
  position: absolute;
  top: -60px;
  left: -24px;
  right: -24px;
  height: 200px;
  background: linear-gradient(135deg,
    rgba(236, 72, 153, 0.3) 0%,
    rgba(168, 85, 247, 0.3) 50%,
    rgba(59, 130, 246, 0.3) 100%);
  border-radius: 16px 16px 0 0;
  z-index: 0;
}

/* 头像区域 */
.profile-avatar-section {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 0 20px;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
}

.profile-avatar {
  background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%);
  border: 4px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(236, 72, 153, 0.3);
}

.profile-basic-info {
  margin-top: 16px;
  text-align: center;
}

.username {
  font-size: 1.8rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.user-email {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

/* 详细信息区域 */
.profile-details {
  padding: 0 20px;
}

.details-section {
  margin-bottom: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 20px;
}

.title-icon {
  color: #ec4899;
}

/* 信息网格 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.3s ease;
}

.info-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.info-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
}

.info-value {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
}

/* 账号绑定 */
.binding-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.binding-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: all 0.3s ease;
}

.binding-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.binding-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.binding-icon svg {
  width: 28px;
  height: 28px;
}

.binding-icon.github {
  background: rgba(255, 255, 255, 0.05);
}

.binding-icon.google {
  background: rgba(255, 255, 255, 0.05);
}

.binding-icon.x {
  background: rgba(255, 255, 255, 0.05);
}

.binding-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.binding-name {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.binding-status {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.4);
  padding: 4px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
}

.binding-status.bound {
  color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
}

/* 功能卡片 */
.features-card {
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}

.features-content {
  display: flex;
  align-items: center;
}

.alert-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  font-weight: 600;
}

/* 深度样式覆盖 */
:deep(.n-card__content) {
  padding: 24px !important;
}

:deep(.n-divider) {
  border-color: rgba(255, 255, 255, 0.1) !important;
}

:deep(.n-badge) {
  position: absolute;
  bottom: 5px;
  right: 5px;
}

:deep(.n-alert) {
  background: rgba(102, 126, 234, 0.1) !important;
  border: 1px solid rgba(102, 126, 234, 0.2) !important;
}

:deep(.n-alert__header) {
  color: rgba(255, 255, 255, 0.9) !important;
}

:deep(.n-alert__body) {
  color: rgba(255, 255, 255, 0.7) !important;
}

/* 动画 */
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

/* 响应式 */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 16px;
  }

  .profile-container {
    max-width: 100%;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .username {
    font-size: 1.5rem;
  }

  .binding-item {
    padding: 12px;
  }

  .binding-icon {
    width: 40px;
    height: 40px;
  }

  .binding-icon svg {
    width: 24px;
    height: 24px;
  }
}
</style>
