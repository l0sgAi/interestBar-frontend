<template>
  <div class="circle-detail-page">
    <!-- 顶栏 -->
    <AppHeader />

    <!-- 侧边栏 -->
    <SideNav />

    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 圈子头部信息 -->
      <div class="circle-header" :style="{ backgroundImage: coverImageStyle }">
        <div class="header-overlay">
          <div class="header-content">
            <!-- 头像和名称区域 -->
            <div class="circle-avatar-wrapper">
              <img v-if="circleDetail.avatar_url" :src="circleDetail.avatar_url" class="circle-avatar" />
              <div v-else class="circle-avatar-placeholder">
                {{ circleDetail.name?.charAt(0)?.toUpperCase() || '?' }}
              </div>
              <div class="circle-info">
                <h1 class="circle-name">{{ circleDetail.name }}</h1>
                <p class="circle-slug">c/{{ circleDetail.slug || circleDetail.id }}</p>
              </div>
            </div>

            <!-- 操作按钮组 -->
            <div class="action-buttons">
              <!-- 免打扰按钮 -->
              <NButton
                v-if="circleDetail.is_joined"
                size="large"
                quaternary
                round
                @click="handleToggleDisturb"
                :type="circleDetail.member_is_disturb ? 'warning' : 'default'"
              >
                <template #icon>
                  <NIcon>
                    <BellOffIcon v-if="circleDetail.member_is_disturb" />
                    <BellIcon v-else />
                  </NIcon>
                </template>
                {{ circleDetail.member_is_disturb ? '免打扰已开启' : '免打扰' }}
              </NButton>

              <!-- 创建帖子按钮 -->
              <NButton
                v-if="circleDetail.is_joined"
                size="large"
                type="primary"
                round
                @click="handleCreatePost"
              >
                <template #icon>
                  <NIcon><EditIcon /></NIcon>
                </template>
                发帖
              </NButton>

              <!-- 加入/退出按钮 -->
              <NButton
                v-if="!circleDetail.is_joined"
                type="primary"
                size="large"
                round
                @click="handleJoinCircle"
                :loading="joinLoading"
              >
                加入圈子
              </NButton>
              <NButton
                v-else
                size="large"
                @click="handleLeaveCircle"
                round
                ghost
                :loading="joinLoading"
                @mouseenter="isButtonHovered = true"
                @mouseleave="isButtonHovered = false"
                :type="isButtonHovered ? 'error' : 'primary'"
              >
                {{ isButtonHovered ? '退出圈子' : '已加入' }}
              </NButton>

              <!-- 更多选项下拉菜单 -->
              <NDropdown :options="moreOptions" @select="handleMoreSelect">
                <NButton size="large" quaternary round>
                  <template #icon>
                    <NIcon><MoreIcon /></NIcon>
                  </template>
                </NButton>
              </NDropdown>
            </div>
          </div>
        </div>
      </div>
      <div class="mid-con">
           <!-- 内容容器：包含帖子列表和右侧信息栏 -->
      <div class="content-container">
        <!-- 帖子列表区域 -->
        <div class="posts-section">
          <NTabs v-model:value="activeTab" type="segment" animated>
            <NTabPane name="hot" tab="最热">
              <div class="posts-list">
                <div v-if="hotPosts.length === 0" class="empty-state">
                  <p>暂无热门帖子</p>
                </div>
                <div v-else>
                  <PostList :posts="hotPosts" />
                </div>
              </div>
            </NTabPane>
            <NTabPane name="new" tab="最新">
              <div class="posts-list">
                <div v-if="newPosts.length === 0" class="empty-state">
                  <p>暂无最新帖子</p>
                </div>
                <div v-else>
                  <PostList :posts="newPosts" />
                </div>
              </div>
            </NTabPane>
            <NTabPane name="top" tab="精华">
              <div class="posts-list">
                <div v-if="topPosts.length === 0" class="empty-state">
                  <p>暂无精华帖子</p>
                </div>
                <div v-else>
                  <PostList :posts="topPosts" />
                </div>
              </div>
            </NTabPane>
          </NTabs>
        </div>

        <!-- 右侧信息栏 -->
        <div class="right-sidebar-header">
          <div class="sidebar-card">
            <div class="card-header">
              <h3>关于圈子</h3>
            </div>
            <div class="card-body">
              <!-- 统计数据 -->
              <div class="circle-stats-sidebar">
                <div class="stat-item">
                  <NIcon size="20" color="rgba(255,255,255,0.6)">
                    <UserIcon />
                  </NIcon>
                  <div class="stat-content">
                    <span class="stat-value">{{ formatNumber(circleDetail.member_count) }}</span>
                    <span class="stat-label">成员</span>
                  </div>
                </div>
                <div class="stat-item">
                  <NIcon size="20" color="rgba(255,255,255,0.6)">
                    <FileTextIcon />
                  </NIcon>
                  <div class="stat-content">
                    <span class="stat-value">{{ formatNumber(circleDetail.post_count) }}</span>
                    <span class="stat-label">帖子</span>
                  </div>
                </div>
                <div class="stat-item">
                  <NIcon size="20" color="rgba(255,255,255,0.6)">
                    <FlameIcon />
                  </NIcon>
                  <div class="stat-content">
                    <span class="stat-value">{{ circleDetail.hot }}</span>
                    <span class="stat-label">热度</span>
                  </div>
                </div>
              </div>

              <div class="description-section">
                <h4 class="section-title">简介</h4>
                <p class="description">{{ circleDetail.description || '暂无描述' }}</p>
              </div>

              <div v-if="circleDetail.rule" class="rules-section">
                <h4 class="section-title">圈子规则</h4>
                <p class="rules">{{ circleDetail.rule }}</p>
              </div>

              <div class="circle-info">
                <div class="info-row">
                  <span class="label">创建时间</span>
                  <span class="value">{{ formatDate(circleDetail.create_time) }}</span>
                </div>
                <!-- <div class="info-row">
                  <span class="label">分类</span>
                  <span class="value">{{ categoryName || '未分类' }}</span>
                </div> -->
                <div class="info-row">
                  <span class="label">加入方式</span>
                  <span class="value">{{ getJoinTypeText(circleDetail.join_type) }}</span>
                </div>
              </div>

              <div v-if="circleDetail.is_joined" class="member-info">
                <h4 class="section-title">你的成员信息</h4>
                <div class="info-row">
                  <span class="label">角色</span>
                  <NTag :type="getRoleInfo(circleDetail.member_role).type" size="large">
                    {{ getRoleInfo(circleDetail.member_role).text }}
                  </NTag>
                </div>
                <div class="info-row">
                  <span class="label">状态</span>
                  <NTag :type="getMemberStatusInfo(circleDetail.member_status).type" size="large">
                    {{ getMemberStatusInfo(circleDetail.member_status).text }}
                  </NTag>
                </div>
                <div v-if="circleDetail.member_is_top" class="info-row">
                  <span class="label">置顶显示</span>
                  <span class="value">是</span>
                </div>
                <div v-if="circleDetail.member_is_disturb" class="info-row">
                  <span class="label">消息免打扰</span>
                  <span class="value">已开启</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NTabs, NTabPane, NButton, NIcon, NDropdown, NTag, useMessage } from 'naive-ui'
import AppHeader from '@/components/AppHeader.vue'
import SideNav from '@/components/SideNav.vue'
import PostList from '@/components/PostList.vue'
import { getCircleDetail, joinCircle, leaveCircle } from '@/api/circle'
import { Bell as BellIcon, BellOff as BellOffIcon, Edit as EditIcon, DotsVertical as MoreIcon } from '@vicons/tabler'
import { User as UserIcon, FileText as FileTextIcon, Flame as FlameIcon } from '@vicons/tabler'

const route = useRoute()
const router = useRouter()
const message = useMessage()

// 更多选项下拉菜单
const moreOptions = computed(() => {
  const options = [
    {
      label: '分享圈子',
      key: 'share'
    },
    {
      label: '举报',
      key: 'report'
    }
  ]

  return options
})

// 圈子详情数据
const circleDetail = ref({
  id: 0,
  name: '',
  slug: '',
  avatar_url: '',
  cover_url: '',
  description: '',
  rule: '',
  creator_id: 0,
  category_id: 0,
  hot: 0,
  member_count: 0,
  post_count: 0,
  join_type: 0,
  status: 0,
  create_time: new Date(),
  update_time: new Date(),
  is_joined: false,
  member_role: 0,
  member_status: 0,
  member_mute_end_time: null,
  member_is_top: 0,
  member_is_disturb: 0
})

const categoryName = ref('')
const loading = ref(false)
const joinLoading = ref(false)
const activeTab = ref('hot')
const isButtonHovered = ref(false)

// 示例帖子数据（待对接后端）
const hotPosts = ref([])
const newPosts = ref([])
const topPosts = ref([])

// 背景图样式
const coverImageStyle = computed(() => {
  if (circleDetail.value.cover_url) {
    return `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(16,16,28,1)), url(${circleDetail.value.cover_url})`
  }
  return 'linear-gradient(135deg, rgba(236,72,153,0.2) 0%, rgba(168,85,247,0.2) 25%, rgba(59,130,246,0.2) 50%, rgba(6,182,212,0.2) 75%, rgba(34,197,94,0.2) 100%)'
})

// 格式化数字
const formatNumber = (num) => {
  if (!num && num !== 0) return '0'
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '未知'
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 获取加入方式文本
const getJoinTypeText = (type) => {
  const types = {
    0: '直接加入',
    1: '需要审核',
    2: '私密圈子'
  }
  return types[type] || '未知'
}

// 获取角色文本和类型
const getRoleInfo = (role) => {
  const roles = {
    10: { text: '普通成员', type: 'default' },
    20: { text: '管理员', type: 'info' },
    30: { text: '圈主', type: 'warning' }
  }
  return roles[role] || { text: '未知', type: 'default' }
}

// 获取状态文本和类型
const getMemberStatusInfo = (status) => {
  const statuses = {
    0: { text: '正常', type: 'success' },
    1: { text: '正常', type: 'success' },
    2: { text: '已禁言', type: 'error' }
  }
  return statuses[status] || { text: '未知', type: 'default' }
}

// 获取圈子详情
const fetchCircleDetail = async () => {
  const circleId = route.params.id
  if (!circleId) {
    message.error('圈子ID不存在')
    router.push('/home')
    return
  }

  loading.value = true
  try {
    const response = await getCircleDetail(circleId)
    if (response.data) {
      circleDetail.value = response.data
      // TODO: 根据category_id获取分类名称
      // TODO: 获取帖子列表数据
    }
  } catch (error) {
    message.error('获取圈子详情失败：' + (error.message || '未知错误'))
    router.push('/home')
  } finally {
    loading.value = false
  }
}

// 加入圈子
const handleJoinCircle = async () => {
  joinLoading.value = true
  try {
    await joinCircle({ circle_id: circleDetail.value.id })
    message.success('加入成功')
    circleDetail.value.is_joined = true
    circleDetail.value.member_count += 1
  } catch (error) {
    message.error('加入失败：' + (error.message || '未知错误'))
  } finally {
    joinLoading.value = false
  }
}

// 退出圈子
const handleLeaveCircle = async () => {
  joinLoading.value = true
  isButtonHovered.value = false
  try {
    await leaveCircle({ circle_id: circleDetail.value.id })
    message.success('已退出圈子')
    circleDetail.value.is_joined = false
    circleDetail.value.member_count -= 1
  } catch (error) {
    message.error('退出失败：' + (error.message || '未知错误'))
  } finally {
    joinLoading.value = false
  }
}

// 切换免打扰
const handleToggleDisturb = async () => {
  try {
    // TODO: 调用切换免打扰接口
    circleDetail.value.member_is_disturb = !circleDetail.value.member_is_disturb
    message.success(circleDetail.value.member_is_disturb ? '已开启免打扰' : '已关闭免打扰')
  } catch (error) {
    message.error('操作失败：' + (error.message || '未知错误'))
  }
}

// 创建帖子
const handleCreatePost = () => {
  // TODO: 跳转到发帖页面，并传递圈子ID
  router.push(`/create-post?circleId=${circleDetail.value.id}`)
}

// 更多选项处理
const handleMoreSelect = (key) => {
  switch (key) {
    case 'share':
      message.info('分享功能开发中...')
      break
    case 'report':
      message.info('举报功能开发中...')
      break
  }
}

onMounted(() => {
  fetchCircleDetail()
})
</script>

<style scoped>
.circle-detail-page {
  min-height: 100vh;
  position: relative;
}

.main-content {
  margin-left: 260px;
  margin-top: 64px;
  min-height: calc(100vh - 64px);
  transition: margin-left 0.3s ease;
}

/* 圈子头部 */
.circle-header {
  position: relative;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 32px 24px;
  color: white;
}

.header-overlay {
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 0 auto;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.circle-avatar-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
}

.circle-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  object-fit: cover;
  flex-shrink: 0;
}

.circle-avatar-placeholder {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.3);
  background: linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #3b82f6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: bold;
  backdrop-filter: blur(10px);
  flex-shrink: 0;
}

.circle-info {
  flex: 1;
  min-width: 0;
}

.circle-name {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 4px 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.circle-slug {
  font-size: 0.9rem;
  opacity: 0.8;
  margin: 0;
  font-weight: 400;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

/* 内容容器：包含帖子列表和右侧信息栏 */
.content-container {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  padding: 24px;
}

/* 帖子区域 */
.posts-section {
  width: 55dvw;
}

.posts-list {
  min-height: 200px;
}

.empty-state {
  text-align: center;
  padding: 48px 24px;
  color: rgba(255, 255, 255, 0.5);
}

.empty-state p {
  font-size: 1rem;
}

/* 右侧信息栏 - 在内容容器内 */
.right-sidebar-header {
  width: 384px;
  flex-shrink: 0;
  position: sticky;
  top: 88px;
  max-height: calc(100vh - 88px);
  overflow-y: auto;
}

.sidebar-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
}

.card-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.card-body {
  padding: 20px;
}

/* 统计数据 */
.circle-stats-sidebar {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.circle-stats-sidebar .stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.stat-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.mid-con{
  /* margin-left: 0%; */
  width: auto;
  /* max-width: 85%; */
}
.stat-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
}

.stat-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

/* 描述和规则 */
.section-title {
  margin: 0 0 8px 0;
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
}

.description-section {
  margin-bottom: 16px;
}

.description {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  overflow-wrap: break-word;
}

.rules-section {
  margin-bottom: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.rules {
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
  font-size: 0.85rem;
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  overflow-wrap: break-word;
}

.circle-info {
  margin-bottom: 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.info-row:last-child {
  border-bottom: none;
}

.info-row .label {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
}

.info-row .value {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.9rem;
  font-weight: 500;
  text-align: right;
}

.member-info {
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.member-info h4 {
  margin: 0 0 12px 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
}

/* NaiveUI 样式覆盖 */
:deep(.n-tabs) {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 8px;
}

:deep(.n-tab-pane) {
  padding: 16px 0;
}

/* 响应式 */
@media (max-width: 1400px) {
  .right-sidebar-header {
    width: 320px;
  }
}

@media (max-width: 1200px) {
  .right-sidebar-header {
    display: none;
  }
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 16px;
  }

  .content-container {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .circle-avatar-wrapper {
    width: 100%;
  }

  .action-buttons {
    width: 100%;
    flex-wrap: wrap;
  }

  .action-buttons button {
    flex: 1;
    min-width: 0;
  }

  .circle-name {
    font-size: 1.5rem;
  }

  .circle-stats-sidebar {
    gap: 12px;
  }
}
</style>
