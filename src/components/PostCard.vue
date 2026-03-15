<template>
  <NCard class="post-card" :bordered="false">
    <!-- 帖子头部 -->
    <div class="post-header">
      <!-- 兴趣圈信息 -->
      <div class="circle-info">
        <NAvatar
          round
          :size="48"
          :src="circleAvatar"
          :style="circleAvatar ? '' : { background: circleColor }"
        />
        <span class="circle-name">{{ circleName }}</span>
      </div>
      <!-- 用户信息 -->
      <div class="user-info">
        <div class="user-meta">
          <div class="user-name">{{ userName }}</div>
          <div class="post-time">
            <NTime :time="postTime" format="yyyy-MM-dd HH:mm" />
          </div>
        </div>
      </div>
    </div>

    <!-- 帖子内容 -->
    <div class="post-content">
      <h3 class="post-title">{{ title }}</h3>
      <p class="post-text">{{ content }}</p>
    </div>

    <!-- 帖子图片（只显示首图） -->
    <div v-if="images && images.length > 0" class="post-image-container">
      <NImage
        :src="images[0]"
        :alt="title"
        class="post-image"
        object-fit="cover"
        :fallback-src="getDefaultImage()"
      />
      <div v-if="images.length > 1" class="more-images-badge">
        +{{ images.length - 1 }}
      </div>
    </div>

    <!-- 帖子底部操作栏 -->
    <div class="post-actions">
      <NButton
        text
        :type="isLiked ? 'error' : 'default'"
        size="medium"
        @click="handleLike"
      >
        <template #icon>
          <NIcon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </NIcon>
        </template>
        {{ likeCount }}
      </NButton>

      <NButton
        text
        type="default"
        size="medium"
        @click="handleComment"
      >
        <template #icon>
          <NIcon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </NIcon>
        </template>
        {{ commentCount }}
      </NButton>

      <NButton
        text
        :type="isCollected ? 'warning' : 'default'"
        size="medium"
        @click="handleCollect"
      >
        <template #icon>
          <NIcon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </NIcon>
        </template>
        {{ collectCount }}
      </NButton>
    </div>
  </NCard>
</template>

<script setup>
import { ref } from 'vue'
import { NCard, NAvatar, NButton, NIcon, NImage, NTime, useMessage } from 'naive-ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  postId: {
    type: String,
    required: true
  },
  circleId: {
    type: Number,
    default: null
  },
  circleName: {
    type: String,
    required: true
  },
  circleAvatar: {
    type: String,
    default: ''
  },
  circleColor: {
    type: String,
    default: '#ec4899'
  },
  userName: {
    type: String,
    required: true
  },
  userColor: {
    type: String,
    default: '#a855f7'
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  images: {
    type: Array,
    default: () => []
  },
  postTime: {
    type: [Date, String, Number],
    required: true
  },
  likeCount: {
    type: Number,
    default: 0
  },
  commentCount: {
    type: Number,
    default: 0
  },
  collectCount: {
    type: Number,
    default: 0
  }
})

const message = useMessage()
const isLiked = ref(false)
const isCollected = ref(false)

const handleLike = () => {
  isLiked.value = !isLiked.value
  message.info(isLiked.value ? t('post.actions.liked') : t('common.cancel'))
  console.log('Like post:', props.postId)
}

const handleComment = () => {
  message.info(t('common.featureInDevelopment'))
  console.log('Comment post:', props.postId)
}

const handleCollect = () => {
  isCollected.value = !isCollected.value
  message.info(isCollected.value ? t('post.actions.favorite') : t('common.cancel'))
  console.log('Collect post:', props.postId)
}

const getDefaultImage = () => {
  // 返回一个默认占位图或空字符串
  return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500"%3E%3Crect width="800" height="500" fill="%23333"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23666" font-size="24"%3ENo Image%3C/text%3E%3C/svg%3E'
}
</script>

<style scoped>
.post-card {
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.03) !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  transition: all 0.3s ease;
}

.post-card:hover {
  background: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(255, 255, 255, 0.12) !important;
  transform: translateY(-2px);
}

/* 帖子头部 */
.post-header {
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}

.circle-info {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 4px 10px;
  flex-shrink: 0;
}

.circle-name {
  font-size: 18px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: flex-end;
}

.user-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: flex-start;
}

.user-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.post-time {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
}

/* 帖子内容 */
.post-content {
  margin-bottom: 16px;
}

.post-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 8px;
  line-height: 1.4;
}

.post-text {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

/* 帖子图片（只显示首图） */
.post-image-container {
  position: relative;
  width: 100%;
  margin-bottom: 16px;
  border-radius: 12px;
  overflow: hidden;
}

.post-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.post-card:hover .post-image {
  transform: scale(1.02);
}

.more-images-badge {
  position: absolute;
  bottom: 12px;
  right: 12px;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

/* 帖子操作栏 */
.post-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

/* NaiveUI 按钮样式覆盖 */
:deep(.n-button) {
  color: rgba(255, 255, 255, 0.6) !important;
}

:deep(.n-button:hover) {
  color: rgba(255, 255, 255, 0.9) !important;
  background: rgba(255, 255, 255, 0.08) !important;
}

:deep(.n-button.n-button--error-type) {
  color: #ec4899 !important;
}

:deep(.n-button.n-button--error-type:hover) {
  background: rgba(236, 72, 153, 0.15) !important;
}

:deep(.n-button.n-button--warning-type) {
  color: #f59e0b !important;
}

:deep(.n-button.n-button--warning-type:hover) {
  background: rgba(245, 158, 11, 0.15) !important;
}

/* 响应式 */
@media (max-width: 768px) {
  .post-image {
    aspect-ratio: 4 / 3;
  }
}
</style>
