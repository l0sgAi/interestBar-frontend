<template>
  <div class="app-header">
    <div class="header-left">
      <div class="logo" @click="goHome">趣吧 Quba</div>
    </div>

    <div class="header-center">
      <!-- 搜索栏 -->
      <div class="search-box">
        <span class="search-icon" @click="handleSearch" style="cursor: pointer;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </span>
        <input
          type="text"
          class="search-input"
          placeholder="搜索兴趣圈、帖子..."
          v-model="searchKeyword"
          @keyup.enter="handleSearch"
        />
      </div>
    </div>

    <div class="header-right">
      <!-- 消息中心铃铛 -->
      <div class="notification-wrapper">
        <!-- 发帖按钮 -->
      <NButton 
      size="large" 
      quaternary
      class="notification-btn" 
      @click="handleCreatePost">
            <NIcon size="20">
            <AddIcon />
            </NIcon>
        <div style="margin-left: 5px;">发帖</div>
      </NButton>
      
        <NButton
          quaternary
          circle
          size="large"
          class="notification-btn"
          @click="handleNotification"
        >
          <NIcon size="20">
            <Bell />
            </NIcon>
        </NButton>
        <NBadge :value="notificationCount" :max="99" class="notification-badge" />
      </div>

      <!-- 用户信息下拉菜单 -->
      <NDropdown :options="userMenuOptions" @select="handleMenuSelect">
        <div class="user-info-trigger">
          <NAvatar
            round
            :size="40"
            :src="userAvatarUrl"
            class="user-avatar"/>
          <span class="username">{{ username }}</span>
          <span class="dropdown-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </div>
      </NDropdown>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, h, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NButton, NIcon, NDropdown, NAvatar, NBadge, useMessage, useDialog } from 'naive-ui'
import { auth } from '@/utils/auth'
import { AddCircleOutlineFilled as AddIcon } from '@vicons/material'
import { Bell } from '@vicons/tabler'
import request from '@/utils/request'

const router = useRouter()
const route = useRoute()
const message = useMessage()
const dialog = useDialog()

// 用户信息
const username = ref('User')
const userAvatarUrl = ref('')
const notificationCount = ref(0)

// 搜索关键词
const searchKeyword = ref('')

// 用户头像首字母
const userInitial = computed(() => {
  return username.value ? username.value.charAt(0).toUpperCase() : 'U'
})

// 获取用户信息
const fetchUserInfo = async () => {
    const response = await request.get('/user/get')
    if (response.data) {
      const userData = response.data
      username.value = userData.username || 'User'
      userAvatarUrl.value = userData.avatar_url || ''
    }
}

// 组件挂载时获取用户信息和同步搜索关键词
onMounted(() => {
  if (auth.isAuthenticated()) {
    fetchUserInfo()
  }
  // 同步搜索框内容与当前路由
  if (route.name === 'search' && route.query.q) {
    searchKeyword.value = route.query.q
  }
})

// 监听路由变化，同步搜索框内容
watch(() => route.query.q, (newQ) => {
  if (route.name === 'search' && newQ) {
    searchKeyword.value = newQ
  }
})

// 用户下拉菜单选项
const userMenuOptions = [
  {
    label: '个人中心',
    key: 'profile',
    icon: () => h('svg', {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      style: { width: '16px', height: '16px' }
    }, [
      h('path', { d: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' }),
      h('circle', { cx: '12', cy: '7', r: '4' })
    ])
  },
  {
    type: 'divider',
    key: 'd1'
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: () => h('svg', {
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      style: { width: '16px', height: '16px' }
    }, [
      h('path', { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' }),
      h('polyline', { points: '16 17 21 12 16 7' }),
      h('line', { x1: '21', y1: '12', x2: '9', y2: '12' })
    ])
  }
]

// 处理菜单选择
const handleMenuSelect = (key) => {
  switch (key) {
    case 'profile':
      handleProfile()
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 个人中心
const handleProfile = () => {
  router.push('/profile')
}

// 退出登录
const handleLogout = () => {
  dialog.warning({
    title: '退出登录',
    content: '确定要退出登录吗?',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
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
  })
}

// 发帖
const handleCreatePost = () => {
  router.push('/create-post')
}

// 消息中心
const handleNotification = () => {
  message.info('消息中心功能开发中...')
  // TODO: 打开消息中心
}

// 返回主页
const goHome = () => {
  router.push('/home')
}

// 搜索
const handleSearch = () => {
  const keyword = searchKeyword.value.trim()
  if (keyword) {
    // 如果已经在搜索页面且搜索相同关键词，需要强制刷新
    if (route.name === 'search' && route.query.q === keyword) {
      // 使用时间戳确保路由变化触发重新搜索
      router.replace({
        path: '/search',
        query: { q: keyword, t: Date.now() }
      })
    } else {
      router.push({
        path: '/search',
        query: { q: keyword }
      })
    }
  }
}
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: rgba(16, 16, 28, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ec4899 0%, #a855f7 25%, #3b82f6 50%, #06b6d4 75%, #22c55e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  cursor: pointer;
  user-select: none;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 0 20px;
}

/* 搜索栏 */
.search-box {
  position: relative;
  width: 100%;
  max-width: 500px;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 8px 16px;
  transition: all 0.3s ease;
}

.search-box:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(236, 72, 153, 0.3);
}

.search-box:focus-within {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(236, 72, 153, 0.5);
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
}

.search-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  color: rgba(255, 255, 255, 0.5);
  margin-right: 10px;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  padding: 0;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* 消息中心 */
.notification-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.notification-btn {
  color: rgba(255, 255, 255, 0.85);
  transition: all 0.3s ease;
}

.notification-btn:hover {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1) !important;
  border-radius: 32px;
}

.notification-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  pointer-events: none;
}

.bell-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

/* 用户信息 */
.user-info-trigger {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px 6px 6px;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.05);
}

.user-info-trigger:hover {
  background: rgba(255, 255, 255, 0.1);
}

.user-avatar {
  background: linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #3b82f6 100%);
  color: white;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(236, 72, 153, 0.3);
}

.username {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  font-weight: 500;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-icon {
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.6);
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.user-info-trigger:hover .dropdown-icon {
  transform: rotate(180deg);
}

/* NaiveUI 组件样式覆盖 */
:deep(.n-button) {
  --n-color: transparent !important;
  --n-color-hover: rgba(102, 126, 234, 0.1) !important;
  --n-color-pressed: rgba(102, 126, 234, 0.15) !important;
  --n-border: none !important;
}

:deep(.n-dropdown-menu) {
  background: rgba(30, 30, 46, 0.95) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

:deep(.n-dropdown-option) {
  color: rgba(255, 255, 255, 0.85) !important;
}

:deep(.n-dropdown-option:hover) {
  background: rgba(102, 126, 234, 0.15) !important;
}

:deep(.n-dropdown-option .n-dropdown-option-body__prefix) {
  color: rgba(255, 255, 255, 0.6);
}

:deep(.n-dropdown-divider) {
  background: rgba(255, 255, 255, 0.1) !important;
}

:deep(.n-badge) {
  --n-color: #f56c6c !important;
}
</style>
