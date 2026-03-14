<template>
  <div class="post-detail-page">
    <!-- 顶栏 -->
    <AppHeader />

    <!-- 侧边栏 -->
    <SideNav />

    <!-- 主内容区域 -->
    <div class="main-content">
      <div v-if="loading" class="loading-container">
        <NSpin size="large" />
      </div>

      <div v-else-if="post" class="post-detail-container">
        <!-- 主帖子卡片 -->
        <NCard :bordered="false" class="post-card">
          <!-- 帖子头部信息 -->
          <div class="post-header">
            <!-- 置顶、精华标签 -->
            <div class="post-badges">
              <NTag v-if="post.is_pinned" type="warning" size="small" round>置顶</NTag>
              <NTag v-if="post.is_essence" type="success" size="small" round>精华</NTag>
              <NTag v-if="post.is_lock" type="error" size="small" round>锁定</NTag>
            </div>

            <!-- 标题 -->
            <h1 class="post-title">{{ post.title }}</h1>

            <!-- 摘要 -->
            <!--
            <div v-if="post.summary" class="post-summary">{{ post.summary }}</div>
            -->
            <!-- 作者信息 -->
            <div class="post-meta">
              <div class="author-info">
                <NAvatar
                  round
                  :size="40"
                  :src="post.user_avatar || '/default-avatar.png'"
                />
                <div class="author-text">
                  <div class="author-name">{{ post.user_name || '匿名用户' }}</div>
                  <div class="post-time">
                    {{ formatTime(post.create_time) }}
                  </div>
                </div>
              </div>

              <!-- 统计信息 -->
              <div class="post-stats">
                <div class="stat-item">
                  <NIcon class="stat-icon" size="18">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </NIcon>
                  <span>{{ post.view_count || 0 }}</span>
                </div>
                <div class="stat-item">
                  <NIcon class="stat-icon" size="18">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                  </NIcon>
                  <span>{{ post.comment_count || 0 }}</span>
                </div>
                <div class="stat-item">
                  <NIcon class="stat-icon" size="18">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </NIcon>
                  <span>{{ post.like_count || 0 }}</span>
                </div>
                <div class="stat-item">
                  <NIcon class="stat-icon" size="18">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </NIcon>
                  <span>{{ post.collect_count || 0 }}</span>
                </div>
              </div>
            </div>
          </div>

          <NDivider />

          <!-- 帖子正文（Markdown渲染） -->
          <div class="post-content">
            <MdPreview
              :model-value="post.content"
              :language="language"
              theme="dark"
              preview-theme="default"
            />
          </div>

          <NDivider />

          <!-- 底部操作栏 -->
          <div class="post-actions">
            <NButton
              size="large"
              :type="post.is_liked ? 'primary' : 'default'"
              @click="handleLike"
            >
              <template #icon>
                <NIcon size="20">
                  <svg v-if="!post.is_liked" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </NIcon>
              </template>
              {{ post.is_liked ? '已赞' : '点赞' }}
            </NButton>

            <NButton size="large" @click="handleCollect">
              <template #icon>
                <NIcon size="20">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                </NIcon>
              </template>
              收藏
            </NButton>

            <NButton size="large">
              <template #icon>
                <NIcon size="20">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                </NIcon>
              </template>
              分享
            </NButton>
          </div>
        </NCard>

        <!-- 右侧圈子信息卡片 -->
        <div class="right-sidebar">
          <CircleInfoCard
            v-if="post && post.circle_id"
            :circleId="post.circle_id"
          />
        </div>
      </div>

      <NEmpty v-else description="帖子不存在" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  NCard,
  NSpin,
  NEmpty,
  NTag,
  NAvatar,
  NButton,
  NDivider,
  NIcon,
  useMessage
} from 'naive-ui'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import AppHeader from '@/components/AppHeader.vue'
import SideNav from '@/components/SideNav.vue'
import CircleInfoCard from '@/components/CircleInfoCard.vue'
import { getPostDetail } from '@/api/post'

const route = useRoute()
const router = useRouter()
const message = useMessage()

const loading = ref(true)
const post = ref(null)
const language = ref('zh-CN')

// 格式化时间
const formatTime = (time) => {
  if (!time) return ''
  const date = new Date(time)
  const now = new Date()
  const diff = now - date

  // 小于1分钟
  if (diff < 60000) {
    return '刚刚'
  }
  // 小于1小时
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)} 分钟前`
  }
  // 小于1天
  if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)} 小时前`
  }
  // 小于30天
  if (diff < 2592000000) {
    return `${Math.floor(diff / 86400000)} 天前`
  }
  // 其他情况显示完整日期
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 加载帖子详情
const loadPostDetail = async () => {
  try {
    loading.value = true
    const postId = route.params.id
    const res = await getPostDetail(postId)

    if (res.data) {
      post.value = res.data
    } else {
      message.error('帖子不存在')
    }
  } catch (error) {
    console.error('加载帖子详情失败:', error)
    message.error('加载帖子详情失败')
  } finally {
    loading.value = false
  }
}

// 点赞
const handleLike = () => {
  // TODO: 实现点赞功能
  message.info('点赞功能待实现')
}

// 收藏
const handleCollect = () => {
  // TODO: 实现收藏功能
  message.info('收藏功能待实现')
}

onMounted(() => {
  loadPostDetail()
})
</script>

<style scoped>
.post-detail-page {
  min-height: 100vh;
  position: relative;
}

.main-content {
  margin-left: 15%;
  margin-top: 64px;
  padding: 24px;
  min-height: calc(100vh - 64px);
  transition: margin-left 0.3s ease, margin-right 0.3s ease;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.post-detail-container {
  display: flex;
  gap: 24px;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  align-items: flex-start;
}

.post-card {
  flex: 1;
  min-width: 0;
  border-radius: 16px !important;
  overflow: hidden;
}

/* 右侧悬浮栏 */
.right-sidebar {
  width: 384px;
  flex-shrink: 0;
  position: sticky;
  top: 88px;
  max-height: calc(100vh - 88px);
  overflow-y: auto;
  /* 隐藏滚动条 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.right-sidebar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

:deep(.n-card__header) {
  padding: 24px 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.n-card__content) {
  padding: 32px;
}

/* 帖子头部 */
.post-header {
  margin-bottom: 24px;
}

.post-badges {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.post-title {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 16px 0;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.9);
}

.post-summary {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 20px;
  line-height: 1.6;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.author-name {
  font-size: 18px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.post-time {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
}

.post-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
}

.stat-icon {
  color: rgba(255, 255, 255, 0.5);
}

/* 分隔线 */
:deep(.n-divider) {
  margin: 24px 0;
}
 
/* 帖子正文 */
.post-content {
  margin: 14px 0;
  padding: 24px;
  border-radius: 15px;
  background: black;
}

/* Markdown 预览样式覆盖 */
:deep(.md-editor *) {
  font-family: 'Fira Code', 'Maple Mono SC NF', 'Consolas', '微软雅黑';
}

/* 底部操作栏 */
.post-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 16px 0;
}

.post-actions .n-button {
  min-width: 120px;
  border-radius: 10px;
  font-weight: 500;
}

/* 响应式 */
@media (max-width: 1400px) {
  .main-content {
    margin-right: 24px;
  }

  .right-sidebar {
    width: 320px;
  }
}

@media (max-width: 1200px) {
  .right-sidebar {
    display: none;
  }
}

@media (max-width: 1200px) {
  .main-content {
    margin-right: 24px;
    margin-left: 80px;
  }

  .post-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    margin-right: 0;
    padding: 16px;
  }

  :deep(.n-card__header),
  :deep(.n-card__content) {
    padding: 20px;
  }

  .post-detail-container {
    max-width: 100%;
  }

  .post-title {
    font-size: 24px;
  }

  .post-stats {
    flex-wrap: wrap;
    gap: 16px;
  }
}
</style>
