<template>
  <NConfigProvider :theme="darkTheme" :theme-overrides="themeOverrides">
    <div class="user-profile-page">
      <!-- 顶栏 -->
      <AppHeader />

      <!-- 侧边栏 -->
      <SideNav />

      <!-- 主内容区域 -->
      <div class="main-content">
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

            <!-- 我的帖子 Tab -->
            <NTabPane name="posts">
              <template #tab>
                <NSpace align="center" :size="6">
                  <span>我的帖子</span>
                  <NTag size="small" :bordered="false" round>{{ mockData.posts.length }}</NTag>
                </NSpace>
              </template>
              <MyPosts
                :posts="mockData.posts"
                @edit="handlePostEdit"
                @delete="handlePostDelete"/>
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

            <!-- 我的收藏 Tab -->
            <NTabPane name="favorites">
              <template #tab>
                <NSpace align="center" :size="6">
                  <span>我的收藏</span>
                  <NTag size="small" :bordered="false" round>{{ mockData.favorites.length }}</NTag>
                </NSpace>
              </template>
              <MyFavorites
                :favorites="mockData.favorites"
                @remove="handleFavoriteRemove"
                @click="handleFavoriteClick"/>
            </NTabPane>

            <!-- 浏览历史 Tab -->
            <NTabPane name="history">
              <template #tab>
                <NSpace align="center" :size="6">
                  <span>浏览历史</span>
                  <NTag size="small" :bordered="false" round>{{ mockData.history.length }}</NTag>
                </NSpace>
              </template>
              <BrowseHistory
                :history="mockData.history"
                @clear="handleHistoryClear"
                @click="handleHistoryClick"/>
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
              <NButton type="primary" size="small" @click="handleEditClick" style="width: 100%; margin-top: 12px;">
                <template #icon>
                  <NIcon :size="14">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </NIcon>
                </template>
                编辑资料
              </NButton>
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

      <!-- 编辑个人信息模态框 -->
      <NModal v-model:show="showEditModal" preset="card" title="编辑个人信息" class="edit-modal" style="width: 500px;">
        <NForm ref="formRef" :model="formData" :rules="rules" label-placement="left" label-width="80">
          <NFormItem label="用户名" path="username">
            <NInput
              v-model:value="formData.username"
              placeholder="请输入用户名（1-50字符）"
              maxlength="50"
              show-count
            />
          </NFormItem>

          <NFormItem label="手机号" path="phone">
            <NInput
              v-model:value="formData.phone"
              placeholder="请输入手机号"
              maxlength="11"
            />
          </NFormItem>

          <NFormItem label="性别" path="gender">
            <NSelect
              v-model:value="formData.gender"
              :options="genderOptions"
              placeholder="请选择性别"
            />
          </NFormItem>

          <NFormItem label="生日" path="birthdate">
            <NDatePicker
              v-model:value="formData.birthdate"
              type="date"
              placeholder="请选择生日"
              :is-date-disabled="(timestamp) => timestamp > Date.now()"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              style="width: 100%;"
            />
          </NFormItem>

          <NFormItem label="头像">
            <NUpload
              :max="1"
              :default-file-list="avatarFileList"
              list-type="image-card"
              :custom-request="handleAvatarUpload"
              @before-upload="beforeAvatarUpload"
              @update:file-list="handleFileListChange"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
            >
              <div style="text-align: center;">
                <div>点击上传头像</div>
              </div>
            </NUpload>
          </NFormItem>
        </NForm>

        <div style="font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 4px;">
          头像支持 JPG、JPEG、PNG、GIF、WebP、SVG 格式,文件大小 ≤ 10MB
        </div>

        <template #footer>
          <div class="modal-footer">
            <NButton @click="showEditModal = false">取消</NButton>
            <NButton type="primary" @click="handleUpdateInfo" :loading="updating">
              保存修改
            </NButton>
          </div>
        </template>
      </NModal>
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
  NIcon,
  NModal,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NUpload,
  NSelect,
  NDatePicker,
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
import MyFavorites from '@/components/user-profile/MyFavorites.vue'
import BrowseHistory from '@/components/user-profile/BrowseHistory.vue'
import { auth } from '@/utils/auth'
import request from '@/utils/request'
import { updateUserInfo, uploadImage } from '@/api/user'

const router = useRouter()
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
  posts: [
    {
      id: 1,
      title: '分享一个超实用的Vue3组合式API使用技巧',
      content: '最近在项目中使用Vue3的组合式API，发现了一些很有用的技巧，比如利用computed来实现复杂的响应式逻辑...',
      authorName: '张三',
      authorAvatar: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
      time: '2小时前',
      images: ['https://picsum.photos/400/300?random=1', 'https://picsum.photos/400/300?random=2'],
      tags: ['Vue3', '前端开发'],
      comments: 24,
      likes: 156,
      views: 1234
    },
    {
      id: 2,
      title: 'TypeScript进阶：类型体操实战',
      content: '本文将介绍TypeScript中的高级类型特性，通过实际案例来演示如何使用条件类型、映射类型等...',
      authorName: '李四',
      authorAvatar: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
      time: '1天前',
      images: [],
      tags: ['TypeScript', '教程'],
      comments: 18,
      likes: 89,
      views: 567
    },
    {
      id: 3,
      title: '2024年前端技术栈选型建议',
      content: '随着前端技术的不断发展，选择合适的技术栈变得越来越重要。本文将分享一些关于技术栈选型的思考...',
      authorName: '王五',
      authorAvatar: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
      time: '3天前',
      images: ['https://picsum.photos/400/300?random=3'],
      tags: ['前端', '技术选型'],
      comments: 32,
      likes: 234,
      views: 1890
    }
  ],
  groups: [
    {
      id: 1,
      name: 'Vue.js爱好者',
      description: 'Vue.js技术交流与学习社区',
      avatar: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
      coverGradient: 'linear-gradient(135deg, rgba(66, 184, 131, 0.3) 0%, rgba(66, 184, 131, 0.1) 100%)',
      members: 1234,
      posts: 5678,
      role: 'admin'
    },
    {
      id: 2,
      name: '前端性能优化',
      description: '专注于前端性能优化的技术讨论',
      avatar: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
      coverGradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.3) 0%, rgba(236, 72, 153, 0.1) 100%)',
      members: 892,
      posts: 2341,
      role: 'member'
    },
    {
      id: 3,
      name: 'Node.js实战',
      description: 'Node.js后端开发经验分享',
      avatar: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
      coverGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.1) 100%)',
      members: 567,
      posts: 1234,
      role: 'member'
    }
  ],
  favorites: [
    {
      id: 1,
      type: 'post',
      title: '深入理解React Hooks原理',
      description: '全面解析React Hooks的实现机制和使用技巧',
      time: '2024-01-10'
    },
    {
      id: 2,
      type: 'group',
      title: 'JavaScript高级编程',
      description: '深入学习JavaScript核心概念和高级特性',
      time: '2024-01-09'
    },
    {
      id: 3,
      type: 'post',
      title: 'Webpack配置完全指南',
      description: '从零开始学习Webpack的配置和优化',
      time: '2024-01-08'
    }
  ],
  history: [
    { id: 1, type: 'post', title: 'Vue3 Composition API 最佳实践', time: '今天 14:30', date: '今天' },
    { id: 2, type: 'group', title: 'React技术社区', time: '今天 11:20', date: '今天' },
    { id: 3, type: 'post', title: 'Node.js性能优化实战', time: '今天 09:15', date: '今天' },
    { id: 4, type: 'post', title: 'TypeScript高级类型技巧', time: '昨天 16:45', date: '昨天' },
    { id: 5, type: 'group', title: '前端架构师联盟', time: '昨天 14:20', date: '昨天' },
    { id: 6, type: 'post', title: '微前端架构设计方案', time: '3天前 10:30', date: '3天前' }
  ]
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

// 编辑模态框相关
const showEditModal = ref(false)
const updating = ref(false)
const avatarFileList = ref([])

// 性别选项
const genderOptions = [
  { label: '未设置', value: 0 },
  { label: '男', value: 1 },
  { label: '女', value: 2 },
  { label: '其他', value: 3 }
]

// 表单数据
const formData = ref({
  username: '',
  phone: '',
  gender: 0,
  birthdate: null,
  avatar_url: ''
})

// 表单验证规则
const rules = {
  username: {
    required: false,
    trigger: ['blur', 'input'],
    validator: (_rule, value) => {
      if (!value) return true
      if (value.length < 1 || value.length > 50) {
        return new Error('用户名长度为1-50个字符')
      }
      return true
    }
  },
  phone: {
    required: false,
    trigger: ['blur', 'input'],
    validator: (_rule, value) => {
      if (!value) return true
      const phoneReg = /^1[3-9]\d{9}$/
      if (!phoneReg.test(value)) {
        return new Error('请输入正确的手机号')
      }
      return true
    }
  }
}

// 上传前校验
const beforeAvatarUpload = (data) => {
  const file = data.file
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  const isValidType = allowedTypes.includes(file.type)

  if (!isValidType) {
    message.error('只支持 JPG、JPEG、PNG、GIF、WebP、SVG 格式的图片')
    return false
  }

  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    message.error('图片大小不能超过10MB')
    return false
  }

  return true
}

// 处理文件列表变化
const handleFileListChange = (fileList) => {
  avatarFileList.value = fileList
}

// 处理头像上传
const handleAvatarUpload = async ({ file, onFinish, onError }) => {
  try {
    const response = await uploadImage(file.file)
    if (response.data && response.data.url) {
      formData.value.avatar_url = response.data.url
      message.success('头像上传成功')
      onFinish()
    }
  } catch (error) {
    console.error('头像上传失败:', error)
    message.error('头像上传失败')
    onError()
  }
}

// 更新用户信息
const handleUpdateInfo = async () => {
  try {
    const hasChanges =
      formData.value.username ||
      formData.value.phone ||
      formData.value.avatar_url ||
      formData.value.gender !== undefined ||
      formData.value.birthdate

    if (!hasChanges) {
      message.warning('请至少修改一项信息')
      return
    }

    updating.value = true

    const updateData = {}

    if (formData.value.username) {
      updateData.username = formData.value.username
    }
    if (formData.value.phone) {
      updateData.phone = formData.value.phone
    }
    if (formData.value.avatar_url) {
      updateData.avatar_url = formData.value.avatar_url
    }
    if (formData.value.gender !== undefined && formData.value.gender !== null) {
      updateData.gender = formData.value.gender
    }
    if (formData.value.birthdate) {
      updateData.birthdate = new Date(formData.value.birthdate).toISOString()
    }

    await updateUserInfo(updateData)
    message.success('个人信息更新成功')
    showEditModal.value = false
    avatarFileList.value = []
    await fetchUserInfo()
  } catch (error) {
    console.error('更新个人信息失败:', error)
    message.error(error.message || '更新个人信息失败')
  } finally {
    updating.value = false
  }
}

// 打开编辑模态框
const openEditModal = () => {
  let birthdateTimestamp = null
  if (userInfo.value.birthdate) {
    birthdateTimestamp = new Date(userInfo.value.birthdate).getTime()
  }

  formData.value = {
    username: userInfo.value.username || '',
    phone: userInfo.value.phone || '',
    gender: userInfo.value.gender ?? 0,
    birthdate: birthdateTimestamp,
    avatar_url: userInfo.value.avatar_url || ''
  }

  if (userInfo.value.avatar_url) {
    avatarFileList.value = [{
      id: 'avatar',
      name: 'avatar.jpg',
      status: 'finished',
      url: userInfo.value.avatar_url
    }]
  } else {
    avatarFileList.value = []
  }

  showEditModal.value = true
}

// 编辑按钮点击事件
const handleEditClick = () => {
  openEditModal()
}

// 帖子操作
const handlePostEdit = (post) => {
  message.info(`编辑帖子: ${post.title}`)
}

const handlePostDelete = (post) => {
  message.warning(`删除帖子: ${post.title}`)
}

// 兴趣圈操作
const handleGroupClick = (group) => {
  message.info(`进入兴趣圈: ${group.name}`)
}

// 收藏操作
const handleFavoriteRemove = (item) => {
  message.info(`移除收藏: ${item.title}`)
}

const handleFavoriteClick = (item) => {
  message.info(`查看收藏: ${item.title}`)
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

// 历史操作
const handleHistoryClear = () => {
  message.info('清空浏览历史')
}

const handleHistoryClick = (item) => {
  message.info(`跳转到: ${item.title}`)
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
  display: flex;
  gap: 24px;
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
  background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%);
  border: 3px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(236, 72, 153, 0.3);
  margin-bottom: 12px;
}

.sidebar-username {
  font-size: 1.25rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
  background: linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #3b82f6 100%);
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
  /* justify-content: space-between; */
  /* align-items: center; */
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

/* 编辑模态框 */
.edit-modal {
  background: black !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}

:deep(.n-card__content) {
  padding: 24px !important;
}

:deep(.n-form-item-label) {
  color: rgba(255, 255, 255, 0.8) !important;
}

:deep(.n-input__input) {
  color: rgba(255, 255, 255, 0.9) !important;
}

:deep(.n-input__border) {
  border-color: rgba(255, 255, 255, 0.2) !important;
}

:deep(.n-input:hover .n-input__border) {
  border-color: rgba(255, 255, 255, 0.3) !important;
}

:deep(.n-upload-trigger) {
  border-color: rgba(255, 255, 255, 0.2) !important;
}

:deep(.n-upload-trigger:hover) {
  border-color: #ec4899 !important;
}

:deep(.n-upload-file-list__item) {
  background: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
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
