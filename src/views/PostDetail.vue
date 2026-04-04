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
        <!-- 左侧内容列 -->
        <div class="post-main-column">
        <!-- 主帖子卡片 -->
        <NCard :bordered="false" class="post-card">
          <!-- 帖子头部信息 -->
          <div class="post-header">
            <!-- 置顶、精华、状态标签 -->
            <div class="post-badges">
              <NTag v-if="post.is_pinned" type="warning" size="small" round>{{ t('post.badges.pinned') }}</NTag>
              <NTag v-if="post.is_essence" type="success" size="small" round>{{ t('post.badges.essence') }}</NTag>
              <NTag v-if="post.is_lock" type="error" size="small" round>{{ t('post.badges.locked') }}</NTag>

            </div>

            <!-- 标题 -->
            <h1 class="post-title">{{ post.title }}</h1>
            <!-- 状态标签 -->
            <NTag
                v-if="post.status !== 1"
                :type="getStatusTagType(post.status)"
                size="large"
                round
              >
                {{ getStatusText(post.status) }}
              </NTag>

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
                  :src="post.author_avatar || '/default-avatar.png'"
                />
                <div class="author-text">
                  <div class="author-name">{{ post.author_name || t('user.anonymous') }}</div>
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

          <!-- 帖子正文（Markdown渲染） -->
          <div class="post-content">
            <MdPreview
              :model-value="post.content"
              :language="language"
              theme="dark"
              preview-theme="default"
            />
          </div>

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
              {{ post.is_liked ? t('post.actions.liked') : t('post.actions.like') }}
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
           <!-- 发评论 -->
          <NCard :bordered="false" class="comment-editor-card">
            <div class="comment-editor-header">
              <span class="comment-section-title">发表评论</span>
            </div>
            <div class="comment-editor-wrapper">
              <MdEditor
                v-model="commentContent"
                :language="language"
                :preview="false"
                :toolbars="commentToolbars"
                theme="dark"
                placeholder="写下你的评论...（支持图文、表情）"
                :max-length="2000"
                :footers="[]"
                :style="{ height: '25dvh' }"
                @onUploadImg="handleCommentUploadImg"
              />
              <div class="comment-editor-footer">
                <NButton
                  type="primary"
                  size="medium"
                  round
                  :disabled="!commentContent.trim()"
                  @click="handleSubmitComment"
                >
                  发表评论
                </NButton>
              </div>
            </div>
          </NCard>

          <!-- 评论列表 -->
          <NCard :bordered="false" class="comment-list-card">
            <div class="comment-list-header">
              <span class="comment-section-title">评论 ({{ mockComments.length }})</span>
              <div class="comment-sort">
                <NButton text size="small" :type="commentSort === 'newest' ? 'primary' : 'default'" @click="commentSort = 'newest'">最新</NButton>
                <NDivider vertical />
                <NButton text size="small" :type="commentSort === 'hottest' ? 'primary' : 'default'" @click="commentSort = 'hottest'">最热</NButton>
              </div>
            </div>

            <div class="comment-list">
              <div v-for="comment in mockComments" :key="comment.id" class="comment-item">
                <div class="comment-avatar">
                  <NAvatar round :size="36" :src="comment.avatar || '/default-avatar.png'" />
                </div>
                <div class="comment-body">
                  <div class="comment-author-row">
                    <span class="comment-author">{{ comment.author }}</span>
                    <span class="comment-time">{{ comment.time }}</span>
                  </div>
                  <div class="comment-content">
                    <MdPreview
                      :model-value="comment.content"
                      :language="language"
                      theme="dark"
                      preview-theme="default"
                    />
                  </div>
                  <div class="comment-actions">
                    <NButton text size="small" class="comment-action-btn">
                      <template #icon>
                        <NIcon size="16">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
                        </NIcon>
                      </template>
                      {{ comment.likes }}
                    </NButton>
                    <NButton text size="small" class="comment-action-btn" @click="handleReplyComment(comment)">
                      <template #icon>
                        <NIcon size="16">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                          </svg>
                        </NIcon>
                      </template>
                      回复
                    </NButton>
                  </div>

                  <!-- 子评论 -->
                  <div v-if="comment.replies && comment.replies.length" class="comment-replies">
                    <div v-for="reply in comment.replies" :key="reply.id" class="comment-item reply-item">
                      <div class="comment-avatar">
                        <NAvatar round :size="28" :src="reply.avatar || '/default-avatar.png'" />
                      </div>
                      <div class="comment-body">
                        <div class="comment-author-row">
                          <span class="comment-author">{{ reply.author }}</span>
                          <template v-if="reply.reply_to">
                            <span class="reply-arrow">回复</span>
                            <span class="comment-author reply-to-name">@{{ reply.reply_to }}</span>
                          </template>
                          <span class="comment-time">{{ reply.time }}</span>
                        </div>
                        <div class="comment-content">
                          <MdPreview
                            :model-value="reply.content"
                            :language="language"
                            theme="dark"
                            preview-theme="default"
                          />
                        </div>
                        <div class="comment-actions">
                          <NButton text size="small" class="comment-action-btn">
                            <template #icon>
                              <NIcon size="16">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                              </NIcon>
                            </template>
                            {{ reply.likes }}
                          </NButton>
                          <NButton text size="small" class="comment-action-btn">
                            <template #icon>
                              <NIcon size="16">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                                </svg>
                              </NIcon>
                            </template>
                            回复
                          </NButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <NEmpty v-if="!mockComments.length" description="暂无评论，快来发表第一条评论吧" />
            </div>
          </NCard>
        </NCard>
        </div><!-- /.post-main-column -->

        <!-- 右侧圈子信息卡片 -->
        <div class="right-sidebar">
          <CircleInfoCard
            v-if="post && post.circle_id"
            :circleId="post.circle_id"
          />
        </div>
      </div>

      <NEmpty v-else :description="t('post.postNotFound')" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
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
import { useI18n } from 'vue-i18n'
import { MdPreview, MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import 'md-editor-v3/lib/style.css'
import AppHeader from '@/components/AppHeader.vue'
import SideNav from '@/components/SideNav.vue'
import CircleInfoCard from '@/components/CircleInfoCard.vue'
import { getPostDetail } from '@/api/post'
import { getCircleDetail } from '@/api/circle'
import { useFormatTime } from '@/utils/i18n'

const route = useRoute()
const router = useRouter()
const message = useMessage()
const { t } = useI18n()
const { formatTime } = useFormatTime()

// 注入圈子搜索状态设置方法
const setCircleSearch = inject('setCircleSearch', () => {})

const loading = ref(true)
const post = ref(null)
const language = ref('zh-CN')

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    0: t('post.status.draft'),
    1: t('post.status.normal'),
    2: t('post.status.reviewing'),
    3: t('post.status.rejected'),
    4: t('post.status.blocked')
  }
  return statusMap[status] || t('post.status.normal')
}

// 获取状态标签类型
const getStatusTagType = (status) => {
  const typeMap = {
    0: 'default',
    1: 'success',
    2: 'info',
    3: 'warning',
    4: 'error'
  }
  return typeMap[status] || 'default'
}

// 加载帖子详情
const loadPostDetail = async () => {
  try {
    loading.value = true
    const postId = route.params.id
    const res = await getPostDetail(postId)

    if (res.data) {
      post.value = res.data

      // 设置圈子搜索状态
      if (post.value.circle_id) {
        try {
          const circleRes = await getCircleDetail(post.value.circle_id)
          if (circleRes.data) {
            setCircleSearch({
              id: circleRes.data.id,
              name: circleRes.data.name,
              avatar_url: circleRes.data.avatar_url
            })
          }
        } catch (error) {
          console.error('获取圈子信息失败:', error)
        }
      }
    } else {
      message.error(t('post.postNotFound'))
    }
  } catch (error) {
    console.error('加载帖子详情失败:', error)
    message.error(t('messages.getDetailFailed', { error: error.message }))
  } finally {
    loading.value = false
  }
}

// 点赞
const handleLike = () => {
  // TODO: 实现点赞功能
  message.info(t('messages.likeFeaturePending'))
}

// 收藏
const handleCollect = () => {
  // TODO: 实现收藏功能
  message.info(t('messages.favoriteFeaturePending'))
}

// ============ 评论区相关 ============
const commentContent = ref('')
const commentSort = ref('newest')

// 评论编辑器精简工具栏
const commentToolbars = [
  'bold',
  'italic',
  '-',
  'quote',
  'unorderedList',
  'orderedList',
  '-',
  'codeRow',
  'link',
  'image',
  'emoji',
  '-',
  'preview',
  'previewOnly'
]

// Mock 评论数据（后期对接API后移除）
const mockComments = ref([
  {
    id: 1,
    author: '张三',
    avatar: '',
    content: '写得非常好，学习了！🔥',
    time: '2 小时前',
    likes: 12,
    replies: [
      {
        id: 101,
        author: '李四',
        avatar: '',
        reply_to: '张三',
        content: '同感，收藏了',
        time: '1 小时前',
        likes: 3
      }
    ]
  },
  {
    id: 2,
    author: '王五',
    avatar: '',
    content: '感谢分享！\n\n```js\nconsole.log("hello")\n```\n\n代码示例很清晰。',
    time: '5 小时前',
    likes: 8,
    replies: []
  },
  {
    id: 3,
    author: '赵六',
    avatar: '',
    content: '这个功能什么时候能上线呀？期待 🎉',
    time: '1 天前',
    likes: 5,
    replies: [
      {
        id: 301,
        author: '张三',
        avatar: '',
        reply_to: '赵六',
        content: '快了快了',
        time: '22 小时前',
        likes: 1
      },
      {
        id: 302,
        author: '赵六',
        avatar: '',
        reply_to: '张三',
        content: '好的，辛苦了 👍',
        time: '20 小时前',
        likes: 2
      }
    ]
  }
])

// 提交评论
const handleSubmitComment = () => {
  if (!commentContent.value.trim()) return
  // TODO: 对接评论API
  message.success('评论发表成功（模拟）')
  commentContent.value = ''
}

// 回复评论
const handleReplyComment = (comment) => {
  // TODO: 实现回复功能，可以聚焦到编辑器并插入 @用户名
  commentContent.value = `@${comment.author} `
  window.scrollTo({ top: document.querySelector('.comment-editor-card')?.offsetTop - 80, behavior: 'smooth' })
}

// 评论图片上传
const handleCommentUploadImg = async (files, callback) => {
  // TODO: 对接图片上传API
  const urls = await Promise.all(
    files.map(() => Promise.resolve('https://via.placeholder.com/300'))
  )
  callback(urls)
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

.post-main-column {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
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

/* 评论区 */
.comment-section {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: -1px;
}

.comment-section-title {
  font-size: 18px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

/* 评论编辑器卡片 */
.comment-editor-card {
  border-radius: 16px !important;
}

.comment-editor-header {
  margin-bottom: 12px;
}


/* 评论列表卡片 */
.comment-list-card {
  border-radius: 16px !important;
}

.comment-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.comment-sort {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 评论列表 */
.comment-list {
  display: flex;
  flex-direction: column;
}

/* 单条评论 */
.comment-item {
  display: flex;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-body {
  flex: 1;
  min-width: 0;
}

.comment-author-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.comment-author {
  font-size: 15px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
}

.comment-time {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
}

.comment-content {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.6;
  word-break: break-word;
}

.comment-content :deep(.md-editor) {
  background: transparent !important;
}

.comment-content :deep(.md-editor-preview) {
  padding: 0 !important;
  font-size: 15px;
}

.comment-content :deep(.md-editor-preview-wrapper) {
  padding: 0 !important;
}

/* 评论操作栏 */
.comment-actions {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.comment-action-btn {
  color: rgba(255, 255, 255, 0.45) !important;
  font-size: 13px;
}

.comment-action-btn:hover {
  color: rgba(255, 255, 255, 0.7) !important;
}

/* 子评论区 */
.comment-replies {
  margin-top: 12px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
}

.comment-replies .comment-item {
  padding: 10px 0;
}

.reply-item .comment-author {
  font-size: 14px;
}

.reply-arrow {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.35);
}

.reply-to-name {
  color: #63e2b7;
}

/* md-editor-v3 深色主题自定义 — 偏黑底色 */
:deep(.md-editor-dark) {
  --md-bk-color: rgb(24, 24, 28);
  --md-scrollbar-bg-color: rgb(24, 24, 28);
}

:deep(.md-editor-dark .md-editor-preview) {
  --md-theme-bg-color: rgb(24, 24, 28);
  /* --md-theme-bg-color-inset: #141419;
  --md-theme-color-hover: #141419;
  --md-theme-border-color: rgba(255, 255, 255, 0.1);
  --md-theme-code-block-bg-color: #141419;
  --md-theme-table-stripe-color: #0a0a0f; */
}

/* 评论编辑器一体化容器 */
.comment-editor-wrapper {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.comment-editor-wrapper :deep(.md-editor) {
  border: none !important;
  border-radius: 0 !important;
}

.comment-editor-wrapper :deep(.md-editor-toolbar-wrapper) {
  border-radius: 0;
}

.comment-editor-footer {
  display: flex;
  justify-content: flex-end;
  padding: 10px 16px;
  background: rgb(24, 24, 28);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
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
