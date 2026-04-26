<template>
  <NCard class="post-card" :bordered="false" @click="handleClick">
    <!-- 帖子头部 -->
    <div class="post-header">
      <div class="circle-info">
        <NAvatar
          round
          :size="48"
          :src="circleAvatar"
        >
          <div v-if="circleAvatar===undefined || circleAvatar===''">{{ circleName.charAt(0) }}</div>
        </NAvatar>
        <span class="circle-name">{{ circleName }}</span>
      </div>
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
      <p v-if="content" class="post-text">{{ content }}</p>
    </div>

    <!-- 搜索结果：封面图（标题下方） -->
    <div v-if="coverImage" class="post-cover">
      <img :src="coverImage" :alt="title" class="post-cover__img" />
    </div>

    <!-- 非搜索结果：图片轮播 -->
    <ImageCarousel v-else-if="images && images.length > 0" :images="images" :parent-width="900" />

    <!-- 搜索结果：统计信息（仅展示） -->
    <div class="post-stats">
      <div class="stat-item">
        <NIcon class="stat-icon" size="18">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        </NIcon>
        <span>{{ formatNumber(viewCount, STATS_COUNT_CAP) }}</span>
      </div>
      <div class="stat-item">
        <NIcon class="stat-icon" size="18">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
        </NIcon>
        <span>{{ formatNumber(commentCount, STATS_COUNT_CAP) }}</span>
      </div>
      <div class="stat-item">
          <NIcon class="stat-icon" size="18">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </NIcon>
        <span>{{ formatNumber(likeCount, STATS_COUNT_CAP) }}</span>
      </div>
      <div class="stat-item">
        <NIcon class="stat-icon" size="18">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
        </NIcon>
        <span>{{ formatNumber(collectCount, STATS_COUNT_CAP) }}</span>
      </div>
    </div>
  </NCard>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NCard, NAvatar, NButton, NIcon, NTime, useMessage } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { toggleLike } from '@/api/like'
import { useDebounceFn } from '@/utils/throttle'
import ImageCarousel from '@/components/post-detail/ImageCarousel.vue'
import { useFormatNumber } from '@/utils/i18n'

const router = useRouter()
const { t } = useI18n()
const { formatNumber } = useFormatNumber()

const STATS_COUNT_CAP = 100_000_000

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
    default: ''
  },
  coverImage: {
    type: String,
    default: ''
  },
  images: {
    type: Array,
    default: () => []
  },
  postTime: {
    type: [Date, String, Number],
    required: true
  },
  viewCount: {
    type: Number,
    default: 0
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

const debouncedPostCardLike = useDebounceFn(async () => {
  try {
    const res = await toggleLike({ type: 'post', target_id: Number(props.postId) })
    if (res.data) {
      const serverLiked = res.data.is_liked
      if (isLiked.value !== serverLiked) {
        isLiked.value = serverLiked
      }
    }
  } catch {
    isLiked.value = !isLiked.value
  }
}, 600)

const handleLike = () => {
  isLiked.value = !isLiked.value
  debouncedPostCardLike()
}

const handleComment = () => {
  message.info(t('common.featureInDevelopment'))
}

const handleCollect = () => {
  isCollected.value = !isCollected.value
  message.info(isCollected.value ? t('post.actions.favorite') : t('common.cancel'))
}

const handleClick = () => {
  router.push(`/post/${props.postId}`)
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
  cursor: pointer;
}

/* 帖子头部 */
.post-header {
  display: flex;
  padding: 8px;
  align-items: center;
  gap: 12px;
}

.circle-info {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 4px 10px;
  flex-shrink: 0;
}

.circle-info :deep(.n-avatar) {
  color: white;
  font-weight: 700;
  font-size: 1.5rem;
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
  margin-left: 16px;
  line-height: 1.4;
}

.post-text {
  font-size: 0.95rem;
  margin-left: 16px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

/* 搜索结果封面图（标题下方） */
.post-cover {
  margin-left: 1dvw;
  height: 18dvh;
  width: 24dvw;
  margin-bottom: 12px;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
}

.post-cover__img { 
  height: 18dvh;
  width: 24dvw;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.post-card:hover .post-cover__img {
  transform: scale(1.02);
}

/* 搜索结果：统计信息 */
.post-stats {
  display: flex;
  gap: 24px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.stat-icon {
  color: rgba(255, 255, 255, 0.5);
}

/* 非搜索结果：操作按钮栏 */
.post-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

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

  .post-stats {
    flex-wrap: wrap;
    gap: 16px;
  }
}
</style>
