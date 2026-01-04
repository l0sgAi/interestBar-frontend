<template>
  <NCard class="post-card" :bordered="false">
    <!-- 帖子头部 -->
    <div class="post-header">
      <!-- 兴趣圈信息 -->
      <div class="circle-info">
        <NAvatar
          round
          :size="32"
          :style="{ background: circleColor }"
        >
          {{ circleName.charAt(0) }}
        </NAvatar>
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
        type="default"
        size="medium"
        @click="handleShare"
      >
        <template #icon>
          <NIcon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </NIcon>
        </template>
        {{ shareCount }}
      </NButton>
    </div>
  </NCard>
</template>

<script setup>
import { ref } from 'vue'
import { NCard, NAvatar, NButton, NIcon, NImage, NTime, useMessage } from 'naive-ui'

const props = defineProps({
  postId: {
    type: String,
    required: true
  },
  circleName: {
    type: String,
    required: true
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
  shareCount: {
    type: Number,
    default: 0
  }
})

const message = useMessage()
const isLiked = ref(false)

const handleLike = () => {
  isLiked.value = !isLiked.value
  message.info(isLiked.value ? '已点赞' : '已取消点赞')
  console.log('Like post:', props.postId)
}

const handleComment = () => {
  message.info('评论功能开发中...')
  console.log('Comment post:', props.postId)
}

const handleShare = () => {
  message.info('转发功能开发中...')
  console.log('Share post:', props.postId)
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
  gap: 6px;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  flex-shrink: 0;
}

.circle-name {
  font-size: 0.75rem;
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

/* 响应式 */
@media (max-width: 768px) {
  .post-image {
    aspect-ratio: 4 / 3;
  }
}
</style>
