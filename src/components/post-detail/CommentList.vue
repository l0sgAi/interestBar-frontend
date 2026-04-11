<template>
  <NCard :bordered="false" class="comment-list-card">
    <div class="comment-list-header">
      <span class="comment-section-title">评论 ({{ totalCount }})</span>
      <div class="comment-sort">
        <NButton text size="small" :type="sort === 'newest' ? 'primary' : 'default'" @click="$emit('update:sort', 'newest')">最新</NButton>
        <NDivider vertical />
        <NButton text size="small" :type="sort === 'hottest' ? 'primary' : 'default'" @click="$emit('update:sort', 'hottest')">最热</NButton>
      </div>
    </div>

    <div class="comment-list">
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="comment-avatar">
          <NAvatar round :size="36" :src="comment.author_avatar || undefined">
          <div v-if="comment.author_avatar===undefined">{{ comment.author_name.charAt(0) }}</div>
          </NAvatar>
        </div>
        <div class="comment-body">
          <div class="comment-author-row">
            <span class="comment-author">{{ comment.author_name }}</span>
            <span class="comment-time">{{ formatRelativeTime(comment.create_time) }}</span>
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
              {{ comment.like_count }}
            </NButton>
            <NButton text size="small" class="comment-action-btn" @click="openReply(comment)">
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

          <!-- 内联回复编辑器 -->
          <CommentReplyEditor
            v-if="activeReplyId === comment.id"
            :post-id="Number(postId)"
            :root-id="0"
            :reply-to-id="comment.id"
            :reply-to-name="comment.author_name"
            :language="language"
            @submit="handleReplySubmit(comment)"
            @cancel="activeReplyId = null"
          />

          <!-- 点击查看回复 -->
          <div
            v-if="comment.reply_count > 0 && !expandedReplies[comment.id]"
            class="load-replies-btn"
            @click="loadReplies(comment)"
          >
            <NSpin v-if="loadingReplies[comment.id]" :size="14" />
            <span v-else>点击查看 {{ comment.reply_count }} 条回复</span>
          </div>

          <!-- 子评论 -->
          <div v-if="expandedReplies[comment.id]" class="comment-replies">
            <div v-for="reply in expandedReplies[comment.id]" :key="reply.id" class="comment-item reply-item">
              <div class="comment-avatar">
                <NAvatar round :size="28" :src="reply.author_avatar || undefined">
                  <div v-if="reply.author_avatar===undefined">{{ reply.author_name.charAt(0) }}</div>
                </NAvatar>
              </div>
              <div class="comment-body">
                <div class="comment-author-row">
                  <span class="comment-author">{{ reply.author_name }}</span>
                  <template v-if="reply.reply_to_name">
                    <span class="reply-arrow">回复</span>
                    <span class="comment-author reply-to-name">@{{ reply.reply_to_name }}</span>
                  </template>
                  <span class="comment-time">{{ formatRelativeTime(reply.create_time) }}</span>
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
                    {{ reply.like_count }}
                  </NButton>
                  <NButton text size="small" class="comment-action-btn" @click="openReply(reply, comment)">
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

                <!-- 内联回复编辑器（回复子评论） -->
                <CommentReplyEditor
                  v-if="activeReplyId === reply.id"
                  :post-id="Number(postId)"
                  :root-id="comment.id"
                  :reply-to-id="reply.id"
                  :reply-to-name="reply.author_name"
                  :language="language"
                  @submit="handleReplySubmit(comment)"
                  @cancel="activeReplyId = null"
                />
              </div>
            </div>
            <!-- 收起回复 -->
            <div class="collapse-replies-btn" @click="collapseReplies(comment.id)">
              收起回复
            </div>
          </div>
        </div>
      </div>

      <!-- 无限滚动触发器 -->
      <div v-if="hasMore && !loading" class="load-more-trigger" ref="loadMoreTrigger"></div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <NSpin size="medium" />
      </div>

      <!-- 没有更多 -->
      <div v-if="!hasMore && comments.length > 0" class="no-more">
        <p>没有更多评论了</p>
      </div>

      <NEmpty v-if="!loading && comments.length === 0 && initialized" description="暂无评论，快来发表第一条评论吧" />
    </div>
  </NCard>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { NCard, NAvatar, NButton, NDivider, NIcon, NEmpty, NSpin } from 'naive-ui'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import { getCommentList, getCommentReplies } from '@/api/comment'
import CommentReplyEditor from './CommentReplyEditor.vue'

const props = defineProps({
  postId: {
    type: [Number, String],
    required: true
  },
  sort: {
    type: String,
    default: 'newest'
  },
  language: {
    type: String,
    default: 'zh-CN'
  }
})

const emit = defineEmits(['update:sort'])

// 数据状态
const comments = ref([])
const totalCount = ref(0)
const loading = ref(false)
const hasMore = ref(false)
const nextCursor = ref('')
const initialized = ref(false)

// 回复展开状态
const expandedReplies = ref({})
const loadingReplies = ref({})

// 内联回复编辑器
const activeReplyId = ref(null)

const openReply = (comment) => {
  activeReplyId.value = activeReplyId.value === comment.id ? null : comment.id
}

const handleReplySubmit = async (parentComment) => {
  activeReplyId.value = null
  // 如果回复的父评论已展开回复，重新加载
  if (expandedReplies.value[parentComment.id]) {
    expandedReplies.value[parentComment.id] = undefined
    await loadReplies(parentComment)
  } else if (parentComment.reply_count === 0) {
    // 首次回复，自动展开
    await loadReplies(parentComment)
  }
  // 刷新列表以更新 reply_count
  refreshComments()
}

// 无限滚动
const loadMoreTrigger = ref(null)
let observer = null

// 排序映射：newest → 1（时间倒序），hottest → 0（点赞倒序）
const getSortValue = () => props.sort === 'newest' ? 1 : 0

// 格式化相对时间
const formatRelativeTime = (timeStr) => {
  if (!timeStr) return ''
  const now = new Date()
  const date = new Date(timeStr.replace(/-/g, '/'))
  const diff = (now - date) / 1000

  if (diff < 60) return '刚刚'
  if (diff < 3600) return `${Math.floor(diff / 60)} 分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)} 小时前`
  if (diff < 2592000) return `${Math.floor(diff / 86400)} 天前`
  return timeStr.slice(0, 10)
}

// 加载评论列表
const loadComments = async (isRefresh = false) => {
  if (loading.value) return
  if (!isRefresh && !hasMore.value && initialized.value) return

  loading.value = true
  try {
    const params = {
      post_id: Number(props.postId),
      sort: getSortValue()
    }
    if (!isRefresh && nextCursor.value) {
      params.cursor = nextCursor.value
    }

    const res = await getCommentList(params)
    if (res.data) {
      if (isRefresh) {
        comments.value = res.data.items || []
      } else {
        comments.value.push(...(res.data.items || []))
      }
      hasMore.value = res.data.has_more
      nextCursor.value = res.data.next_cursor || ''
      totalCount.value = comments.value.length
    }
  } catch (error) {
    console.error('加载评论失败:', error)
  } finally {
    loading.value = false
    initialized.value = true
  }
}

// 加载子回复
const loadReplies = async (comment) => {
  if (loadingReplies.value[comment.id]) return
  loadingReplies.value[comment.id] = true

  try {
    const res = await getCommentReplies({ root_id: comment.id })
    if (res.data) {
      expandedReplies.value[comment.id] = res.data.items || []
    }
  } catch (error) {
    console.error('加载回复失败:', error)
  } finally {
    loadingReplies.value[comment.id] = false
  }
}

// 收起回复
const collapseReplies = (commentId) => {
  delete expandedReplies.value[commentId]
  // 触发响应式更新
  expandedReplies.value = { ...expandedReplies.value }
}

// 刷新评论（供父组件调用）
const refreshComments = () => {
  comments.value = []
  hasMore.value = false
  nextCursor.value = ''
  expandedReplies.value = {}
  loadComments(true)
}

// 监听排序变化
watch(() => props.sort, () => {
  refreshComments()
})

// 无限滚动 Observer
const setupObserver = () => {
  if (!loadMoreTrigger.value) return

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && hasMore.value && !loading.value) {
          loadComments()
        }
      })
    },
    {
      rootMargin: '100px',
      threshold: 0.1
    }
  )

  observer.observe(loadMoreTrigger.value)
}

const cleanupObserver = () => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
}

// 监听数据变化，重新设置 observer
watch(() => comments.value.length, async () => {
  if (loadMoreTrigger.value && !observer && hasMore.value) {
    await nextTick()
    setupObserver()
  }
})

onMounted(() => {
  loadComments(true)
})

onUnmounted(() => {
  cleanupObserver()
})

defineExpose({ refreshComments })
</script>

<style scoped>
.comment-list-card {
  border-radius: 16px !important;
}

.comment-section-title {
  font-size: 18px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
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

.comment-list {
  display: flex;
  flex-direction: column;
}

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

/* 查看回复按钮 */
.load-replies-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  padding: 4px 0;
  font-size: 13px;
  color: #63e2b7;
  cursor: pointer;
  user-select: none;
}

.load-replies-btn:hover {
  color: #7fe7c4;
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
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.comment-replies .comment-item:last-child {
  border-bottom: none;
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

/* 收起回复 */
.collapse-replies-btn {
  margin-top: 8px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  user-select: none;
}

.collapse-replies-btn:hover {
  color: rgba(255, 255, 255, 0.6);
}

/* 无限滚动触发器 */
.load-more-trigger {
  height: 1px;
  margin-top: 20px;
}

/* 加载状态 */
.loading-state {
  display: flex;
  justify-content: center;
  padding: 32px 0;
}

/* 没有更多 */
.no-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 0;
  color: rgba(255, 255, 255, 0.4);
  font-size: 13px;
}

.no-more::before,
.no-more::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 20px;
}

:deep(.md-editor-dark) {
  --md-bk-color: rgb(24, 24, 28);
  --md-scrollbar-bg-color: rgb(24, 24, 28);
}

:deep(.md-editor-dark .md-editor-preview) {
  --md-theme-bg-color: rgb(24, 24, 28);
}
</style>
