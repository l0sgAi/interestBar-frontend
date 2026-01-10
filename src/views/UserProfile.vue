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
            <!-- 头部区域 -->
            <div class="profile-header">
              <div class="header-background"></div>
              <div class="profile-avatar-section">
                <div class="avatar-wrapper">
                  <NAvatar
                    :size="120"
                    :src="userInfo.avatar_url"
                    fallback-src="https://img.icons8.com/ios-glyphs/64/user-male-circle.png"
                    round
                    class="profile-avatar"/>
                </div>
                <div class="profile-basic-info">
                  <h1 class="username">{{ userInfo.username || '未设置' }}</h1>
                  <p class="user-email">{{ userInfo.email || '未设置' }}</p>
                </div>
                <!-- 编辑按钮移到头像下方 -->
                <NButton type="primary" size="medium" @click="handleEditClick" class="edit-avatar-btn">
                  <template #icon>
                    <NIcon>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </NIcon>
                  </template>
                  编辑个人信息
                </NButton>
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

                <!-- 改为文本行+标签的方式 -->
                <div class="info-list">
                  <!-- <div class="info-row">
                    <NText depth="3" class="info-label-text">用户ID</NText>
                    <NText class="info-value-text">{{ userInfo.id || '-' }}</NText>
                  </div> -->

                  <div class="info-row">
                    <NText depth="3" class="info-label-text">用户名</NText>
                    <NText class="info-value-text">{{ userInfo.username || '-' }}</NText>
                  </div>

                  <div class="info-row">
                    <NText depth="3" class="info-label-text">邮箱</NText>
                    <NText class="info-value-text">{{ userInfo.email || '-' }}</NText>
                  </div>

                  <div class="info-row">
                    <NText depth="3" class="info-label-text">手机号</NText>
                    <NText class="info-value-text">{{ userInfo.phone || '未绑定' }}</NText>
                  </div>

                  <div class="info-row">
                    <NText depth="3" class="info-label-text">性别</NText>
                    <NText class="info-value-text">{{ getGenderText(userInfo.gender) }}</NText>
                  </div>

                  <div class="info-row">
                    <NText depth="3" class="info-label-text">生日</NText>
                    <NText class="info-value-text">{{ formatDate(userInfo.birthdate) }}</NText>
                  </div>

                  <div class="info-row">
                    <NText depth="3" class="info-label-text">角色</NText>
                    <NTag :type="getRoleType(userInfo.role)" size="small" round>
                      {{ getRoleText(userInfo.role) }}
                    </NTag>
                  </div>

                  <div class="info-row">
                    <NText depth="3" class="info-label-text">状态</NText>
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

                <!-- 缩小版账号绑定列表 -->
                <div class="binding-list-compact">
                  <div class="binding-item-compact">
                    <div class="binding-icon-small github">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </div>
                    <span class="binding-name-small">GitHub</span>
                    <NTag :type="userInfo.github_id ? 'success' : 'default'" size="small" round>
                      {{ userInfo.github_id ? '已绑定' : '未绑定' }}
                    </NTag>
                  </div>

                  <div class="binding-item-compact">
                    <div class="binding-icon-small google">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    </div>
                    <span class="binding-name-small">Google</span>
                    <NTag :type="userInfo.google_id ? 'success' : 'default'" size="small" round>
                      {{ userInfo.google_id ? '已绑定' : '未绑定' }}
                    </NTag>
                  </div>

                  <div class="binding-item-compact">
                    <div class="binding-icon-small x">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </div>
                    <span class="binding-name-small">X (Twitter)</span>
                    <NTag :type="userInfo.x_id ? 'success' : 'default'" size="small" round>
                      {{ userInfo.x_id ? '已绑定' : '未绑定' }}
                    </NTag>
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

                <div class="info-list">
                  <div class="info-row">
                    <NText depth="3" class="info-label-text">注册时间</NText>
                    <NText class="info-value-text">{{ formatDateTime(userInfo.create_time) }}</NText>
                  </div>

                  <div class="info-row">
                    <NText depth="3" class="info-label-text">更新时间</NText>
                    <NText class="info-value-text">{{ formatDateTime(userInfo.update_time) }}</NText>
                  </div>
                </div>
              </div>
            </div>
          </NCard>
        </div>
      </div>

      <!-- 编辑个人信息模态框 -->
       <NModal v-model:show="showEditModal" preset="card" title="编辑个人信息" class="edit-modal" style="width: 500px;">
        <NForm ref="formRef" :model="formData" :rules="rules" label-placement="left" label-width="80">
          <!-- 用户名 -->
          <NFormItem label="用户名" path="username">
            <NInput
              v-model:value="formData.username"
              placeholder="请输入用户名（1-50字符）"
              maxlength="50"
              show-count
            />
          </NFormItem>

          <!-- 手机号 -->
          <NFormItem label="手机号" path="phone">
            <NInput
              v-model:value="formData.phone"
              placeholder="请输入手机号"
              maxlength="11"
            />
          </NFormItem>

          <!-- 性别 -->
          <NFormItem label="性别" path="gender">
            <NSelect
              v-model:value="formData.gender"
              :options="genderOptions"
              placeholder="请选择性别"
            />
          </NFormItem>

          <!-- 生日 -->
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

          <!-- 头像上传 -->
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
  NDivider,
  NIcon,
  NTag,
  NText,
  NModal,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NUpload,
  NSelect,
  NDatePicker,
  darkTheme,
  useMessage
} from 'naive-ui'
import AppHeader from '@/components/AppHeader.vue'
import SideNav from '@/components/SideNav.vue'
import { auth } from '@/utils/auth'
import request from '@/utils/request'
import { updateUserInfo, uploadImage } from '@/api/user'

const router = useRouter()
const message = useMessage()

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
    console.log('UserProfile - 用户信息响应:', response)
    console.log('UserProfile - 用户数据:', response.data)
    if (response.data) {
      userInfo.value = response.data
      console.log('UserProfile - avatar_url:', response.data.avatar_url)
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
      if (!value) {
        return true
      }
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
      if (!value) {
        return true
      }
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

  // 检查文件类型
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  const isValidType = allowedTypes.includes(file.type)

  if (!isValidType) {
    message.error('只支持 JPG、JPEG、PNG、GIF、WebP、SVG 格式的图片')
    return false
  }

  // 检查文件大小（10MB = 10 * 1024 * 1024 bytes）
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
    // 检查是否有修改
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

    // 只添加有值的字段
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
      // 将日期格式转换为 ISO 格式
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

// 监听模态框打开，初始化表单数据
const openEditModal = () => {
  // 将生日字符串转换为时间戳（如果是 NaiveUI DatePicker 需要的格式）
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

// 修改按钮点击事件
const handleEditClick = () => {
  openEditModal()
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

/* 信息列表 - 文本行+标签方式 */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background 0.2s ease;
}

.info-row:last-child {
  border-bottom: none;
}

.info-row:hover {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
}

.info-label-text {
  font-size: 0.875rem;
  font-weight: 500;
  min-width: 80px;
}

.info-value-text {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

/* 编辑按钮 */
.edit-avatar-btn {
  margin-top: 16px;
  background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%);
  border: none;
  box-shadow: 0 4px 16px rgba(236, 72, 153, 0.3);
  transition: all 0.3s ease;
}

.edit-avatar-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(236, 72, 153, 0.4);
}

/* 缩小版账号绑定列表 */
.binding-list-compact {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.binding-item-compact {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
}

.binding-item-compact:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
}

.binding-icon-small {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.binding-icon-small svg {
  width: 18px;
  height: 18px;
}

.binding-icon-small.github {
  background: rgba(255, 255, 255, 0.05);
}

.binding-icon-small.google {
  background: rgba(255, 255, 255, 0.05);
}

.binding-icon-small.x {
  background: rgba(255, 255, 255, 0.05);
}

.binding-name-small {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  flex: 1;
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

/* 编辑模态框样式 */
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
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 16px;
  }

  .profile-container {
    max-width: 100%;
  }

  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .username {
    font-size: 1.5rem;
  }

  .binding-item-compact {
    padding: 8px 12px;
  }

  .binding-icon-small {
    width: 28px;
    height: 28px;
  }

  .binding-icon-small svg {
    width: 16px;
    height: 16px;
  }

  .binding-name-small {
    font-size: 0.8rem;
  }
}
</style>
