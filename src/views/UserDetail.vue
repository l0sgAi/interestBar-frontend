<template>
  <NConfigProvider :theme="darkTheme" :theme-overrides="themeOverrides">
    <div class="user-detail-page">
      <!-- 顶栏 -->
      <AppHeader />

      <!-- 侧边栏 -->
      <SideNav @collapsed="offset = 64" @expanded="offset = 260" />

      <!-- 主内容区域 -->
      <div class="main-content" :style="{ 'margin-left': `${offset}px`, width: `calc(100% - ${offset}px)` }">
        <!-- 左侧内容区域 -->
        <div class="content-area">
          <!-- 标签页内容 -->
          <NCard class="tabs-card" :bordered="false">
          <NTabs
            v-model:value="activeTab"
            type="line"
            animated
            size="large"
            class="profile-tabs">

            <!-- 帖子 Tab -->
            <NTabPane name="posts">
              <template #tab>
                <NSpace align="center" :size="6">
                  <span>帖子</span>
                  <NTag size="small" :bordered="false" round>{{ mockData.posts.length }}</NTag>
                </NSpace>
              </template>
              <MyPosts
                :posts="mockData.posts"
                readonly/>
            </NTabPane>

            <!-- 加入的兴趣圈 Tab -->
            <NTabPane name="groups">
              <template #tab>
                <NSpace align="center" :size="6">
                  <span>兴趣圈</span>
                  <NTag size="small" :bordered="false" round>{{ mockData.groups.length }}</NTag>
                </NSpace>
              </template>
              <MyGroups :groups="mockData.groups" @click="handleGroupClick"/>
            </NTabPane>
          </NTabs>
        </NCard>
        </div>

        <!-- 右侧用户信息栏 -->
        <div class="sidebar-area">
          <NCard class="profile-sidebar-card" :bordered="false">
            <!-- 用户头像和名称 -->
            <div class="sidebar-header">
              <NAvatar
                :size="72"
                :src="userInfo.avatar_url"
                fallback-src="https://img.icons8.com/ios-glyphs/64/user-male-circle.png"
                round
                class="sidebar-avatar"/>
              <h2 class="sidebar-username">{{ userInfo.username || '未设置' }}</h2>
            </div>

            <!-- 用户基本信息 -->
            <div class="sidebar-section">
              <NText depth="3" style="font-size: 12px; margin-bottom: 8px; display: block;">基本信息</NText>
              <div class="info-list">
                <div class="info-row">
                  <NText depth="3" style="font-size: 13px; margin-right: 1dvw;">邮箱</NText>
                  <NText style="font-size: 13px;">{{ userInfo.email || '未设置' }}</NText>
                </div>
                <div class="info-row">
                  <NText depth="3" style="font-size: 13px; margin-right: 1dvw;">手机号</NText>
                  <NText style="font-size: 13px;">{{ userInfo.phone || '未绑定' }}</NText>
                </div>
                <div class="info-row">
                  <NText depth="3" style="font-size: 13px; margin-right: 1dvw;">性别</NText>
                  <NTag :type="getGenderType(userInfo.gender)" size="small" round>
                    {{ getGenderText(userInfo.gender) }}
                  </NTag>
                </div>
                <div class="info-row">
                  <NText depth="3" style="font-size: 13px; margin-right: 1dvw;">生日</NText>
                  <NText style="font-size: 13px;">{{ formatDate(userInfo.birthdate) }}</NText>
                </div>
                <div class="info-row">
                  <NText depth="3" style="font-size: 13px; margin-right: 1dvw;">角色</NText>
                  <NTag :type="getRoleType(userInfo.role)" size="small" round>
                    {{ getRoleText(userInfo.role) }}
                  </NTag>
                </div>
                <div class="info-row">
                  <NText depth="3" style="font-size: 13px; margin-right: 1dvw;">状态</NText>
                  <NTag :type="userInfo.status === 1 ? 'success' : 'error'" size="small" round>
                    {{ userInfo.status === 1 ? '正常' : '禁用' }}
                  </NTag>
                </div>
              </div>
            </div>

            <!-- 账号绑定 -->
            <div class="sidebar-section">
              <NText depth="3" style="font-size: 12px; margin-bottom: 8px; display: block;">账号绑定</NText>
              <div class="binding-list">
                <div class="binding-row" :class="{ bound: userInfo.github_id }">
                  <div class="binding-left">
                    <NIcon :size="18" :color="userInfo.github_id ? '#42b883' : '#666'">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </NIcon>
                    <NText :depth="userInfo.github_id ? undefined : 3" style="font-size: 13px; margin-left: 8px;">GitHub</NText>
                  </div>
                  <NTag :type="userInfo.github_id ? 'success' : 'default'" size="small" round>
                    {{ userInfo.github_id ? '已绑定' : '未绑定' }}
                  </NTag>
                </div>

                <div class="binding-row" :class="{ bound: userInfo.google_id }">
                  <div class="binding-left">
                    <NIcon :size="18" :color="userInfo.google_id ? '#4285f4' : '#666'">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285f4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34a853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fbbc05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#ea4335"/>
                      </svg>
                    </NIcon>
                    <NText :depth="userInfo.google_id ? undefined : 3" style="font-size: 13px; margin-left: 8px;">Google</NText>
                  </div>
                  <NTag :type="userInfo.google_id ? 'success' : 'default'" size="small" round>
                    {{ userInfo.google_id ? '已绑定' : '未绑定' }}
                  </NTag>
                </div>

                <div class="binding-row" :class="{ bound: userInfo.x_id }">
                  <div class="binding-left">
                    <NIcon :size="18" :color="userInfo.x_id ? '#fff' : '#666'">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </NIcon>
                    <NText :depth="userInfo.x_id ? undefined : 3" style="font-size: 13px; margin-left: 8px;">X (Twitter)</NText>
                  </div>
                  <NTag :type="userInfo.x_id ? 'success' : 'default'" size="small" round>
                    {{ userInfo.x_id ? '已绑定' : '未绑定' }}
                  </NTag>
                </div>
              </div>
            </div>
          </NCard>
        </div>
      </div>
    </div>
  </NConfigProvider>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  NConfigProvider,
  NCard,
  NAvatar,
  NIcon,
  NTabs,
  NTabPane,
  NSpace,
  NTag,
  NText,
  darkTheme,
  useMessage
} from 'naive-ui'
import AppHeader from '@/components/AppHeader.vue'
import SideNav from '@/components/SideNav.vue'
import MyPosts from '@/components/user-profile/MyPosts.vue'
import MyGroups from '@/components/user-profile/MyGroups.vue'
import { auth } from '@/utils/auth'
import { getUserDetail } from '@/api/user'

const router = useRouter()
const offset = ref(260)
const route = useRoute()
const message = useMessage()

// 当前激活的标签页
const activeTab = ref('posts')

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

// 模拟数据
const mockData = ref({
  posts: [],
  groups: []
})

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const userId = route.params.id
    if (!userId) {
      message.error('用户ID不存在')
      router.push('/home')
      return
    }

    const response = await getUserDetail(userId)
    if (response.data) {
      userInfo.value = response.data
    } else {
      message.error('获取用户信息失败')
      router.push('/home')
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
    message.error('获取用户信息失败')
    router.push('/home')
  }
}

// 兴趣圈操作
const handleGroupClick = (group) => {
  router.push(`/circle/${group.id}`)
}

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '未设置'
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN')
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

// 获取性别标签类型
const getGenderType = (gender) => {
  const typeMap = {
    0: 'default',
    1: 'info',
    2: 'error',
    3: 'warning'
  }
  return typeMap[gender] || 'default'
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

onMounted(() => {
  if (!auth.isAuthenticated()) {
    message.warning('请先登录')
    router.push('/')
    return
  }
  fetchUserInfo()
})
</script>

<style scoped>
.user-detail-page {
  min-height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%);
}

.main-content {
  margin-top: 64px;
  padding: 24px;
  min-height: calc(100vh - 64px);
  display: flex;
  gap: 24px;
  justify-content: center;
  transition: margin-left 0.3s ease, width 0.3s ease;
}

/* 左侧内容区域 */
.content-area {
  flex: 1;
  min-width: 0;
}

/* 右侧边栏区域 */
.sidebar-area {
  width: 320px;
  flex-shrink: 0;
}

/* 右侧栏卡片 */
.profile-sidebar-card {
  position: sticky;
  top: 88px;
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(20px);
}

/* 侧边栏头部 */
.sidebar-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 20px;
}

.sidebar-avatar {
  /* background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%); */
  border: 3px solid rgba(255, 255, 255, 0.1);
  /* box-shadow: 0 8px 32px rgba(236, 72, 153, 0.3); */
  margin-bottom: 12px;
}

.sidebar-username {
  font-size: 1.25rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
  background: rgba(78, 233, 158, 0.896);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
}

/* 侧边栏区块 */
.sidebar-section {
  margin-bottom: 20px;
}

.sidebar-section:last-child {
  margin-bottom: 0;
}

/* 信息列表 */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  transition: background 0.2s;
}

.info-row:hover {
  background: rgba(255, 255, 255, 0.04);
}

/* 绑定列表 */
.binding-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.binding-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  transition: all 0.2s;
}

.binding-row:hover {
  background: rgba(255, 255, 255, 0.04);
}

.binding-row.bound {
  background: rgba(66, 184, 131, 0.05);
}

.binding-row.bound:hover {
  background: rgba(66, 184, 131, 0.08);
}

.binding-left {
  display: flex;
  align-items: center;
}

/* 标签页卡片 */
.tabs-card {
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(20px);
}

.profile-tabs {
  padding: 0 8px;
}

.profile-tabs :deep(.n-tab-pane) {
  padding: 24px 0 0 0;
}

/* 响应式 */
@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
  }

  .sidebar-area {
    width: 100%;
    order: -1;
  }

  .profile-sidebar-card {
    position: static;
  }
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 16px;
  }
}
</style>
