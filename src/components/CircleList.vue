<template>
  <div class="circle-list" ref="listContainer">
    <!-- 空状态 -->
    <div v-if="!loading && circles.length === 0" class="empty-state">
      <NIcon size="64" :color="'rgba(255,255,255,0.2)'">
        <SearchIcon />
      </NIcon>
      <p class="empty-text">没有找到相关兴趣圈</p>
      <p class="empty-hint">换个关键词试试吧</p>
    </div>

    <!-- 兴趣圈列表 -->
    <div v-else class="circles">
      <div
        v-for="circle in circles"
        :key="circle.id"
        class="circle-item"
        @click="handleCircleClick(circle)"
      >
        <div class="circle-avatar">
          <NAvatar
            round
            :size="56"
            :src="circle.avatar_url"
          >
            <div v-if="circle.avatar_url===undefined">{{ circle.name.charAt(0) }}</div>
          </NAvatar>
        </div>
        <div class="circle-info">
          <h3 class="circle-name">{{ circle.name }}</h3>
          <p class="circle-desc">{{ circle.description || '暂无描述' }}</p>
          <div class="circle-stats">
            <span class="stat-item">
              <NIcon size="14">
                <UserIcon />
              </NIcon>
              {{ formatNumber(circle.member_count) }} 成员
            </span>
            <span class="stat-item">
              <NIcon size="14">
                <FileTextIcon />
              </NIcon>
              {{ formatNumber(circle.post_count) }} 帖子
            </span>
            <span class="stat-item hot" v-if="circle.hot > 0">
              <NIcon size="14">
                <FireIcon />
              </NIcon>
              热度 {{ circle.hot }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载更多 -->
    <div v-if="hasMore && !loading" class="load-more-trigger" ref="loadMoreTrigger"></div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <NSpin size="medium" />
      <p class="loading-text">加载中...</p>
    </div>

    <!-- 没有更多 -->
    <div v-if="!hasMore && circles.length > 0" class="no-more">
      <p>没有更多了</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { NAvatar, NButton, NIcon, NSpin, useMessage } from 'naive-ui'
import { Search as SearchIcon, User as UserIcon, FileText as FileTextIcon, Flame as FireIcon } from '@vicons/tabler'

const props = defineProps({
  circles: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  hasMore: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['load-more'])

const router = useRouter()
const message = useMessage()

const listContainer = ref(null)
const loadMoreTrigger = ref(null)
const observer = ref(null)

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

// 点击兴趣圈
const handleCircleClick = (circle) => {
  router.push(`/circle/${circle.id}`)
}

// 加入兴趣圈
const handleJoin = (circle) => {
  message.info(`加入 ${circle.name} 功能开发中...`)
}

// 设置 Intersection Observer 实现无限滚动
const setupObserver = () => {
  if (!loadMoreTrigger.value) return

  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && props.hasMore && !props.loading) {
          emit('load-more')
        }
      })
    },
    {
      root: listContainer.value,
      rootMargin: '100px',
      threshold: 0.1
    }
  )

  observer.value.observe(loadMoreTrigger.value)
}

// 清理 Observer
const cleanupObserver = () => {
  if (observer.value && loadMoreTrigger.value) {
    observer.value.unobserve(loadMoreTrigger.value)
    observer.value.disconnect()
    observer.value = null
  }
}

onMounted(() => {
  setupObserver()
})

onUnmounted(() => {
  cleanupObserver()
})

// 监听 circles 变化，重新设置 observer
watch(() => props.circles, () => {
  if (loadMoreTrigger.value && !observer.value) {
    setupObserver()
  }
})
</script>

<style scoped>
.circle-list {
  width: 100%;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: rgba(255, 255, 255, 0.4);
}

.empty-text {
  margin-top: 16px;
  font-size: 1.1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
}

.empty-hint {
  margin-top: 8px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.4);
}

/* 兴趣圈列表 */
.circles {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
}

.circle-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: rgba(30, 30, 46, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.circle-item:hover {
  background: rgba(40, 40, 60, 0.8);
  border-color: rgba(236, 72, 153, 0.3);
  transform: translateX(4px);
  box-shadow: 0 4px 20px rgba(236, 72, 153, 0.15);
}

.circle-avatar {
  flex-shrink: 0;
}

.circle-avatar :deep(.n-avatar) {
  background: linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #3b82f6 100%);
  color: white;
  font-weight: 700;
  font-size: 1.5rem;
  box-shadow: 0 4px 16px rgba(236, 72, 153, 0.4);
}

.circle-info {
  flex: 1;
  min-width: 0;
}

.circle-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.circle-desc {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.circle-stats {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.stat-item.hot {
  color: #f97316;
}

.circle-action {
  flex-shrink: 0;
}

/* 触发器 */
.load-more-trigger {
  height: 1px;
  margin-top: 20px;
}

/* 加载状态 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.5);
}

.loading-text {
  margin-top: 12px;
  font-size: 0.9rem;
}

/* 没有更多 */
.no-more {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.85rem;
}

.no-more::before,
.no-more::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0 20px;
}

/* 响应式 */
@media (max-width: 768px) {
  .circle-item {
    padding: 14px 16px;
    gap: 12px;
  }

  .circle-avatar :deep(.n-avatar) {
    width: 48px !important;
    height: 48px !important;
    font-size: 1.2rem;
  }

  .circle-name {
    font-size: 1rem;
  }

  .circle-desc {
    font-size: 0.8rem;
  }

  .circle-stats {
    gap: 12px;
  }

  .circle-action :deep(.n-button) {
    padding: 0 16px !important;
  }
}
</style>
