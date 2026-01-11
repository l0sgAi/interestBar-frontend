<template>
  <div class="my-favorites-tab">
    <div class="tab-header">
      <h2 class="tab-title">我的收藏</h2>
      <NInput
        v-model:value="searchKey"
        placeholder="搜索收藏..."
        clearable
        style="width: 280px;">
        <template #prefix>
          <NIcon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </NIcon>
        </template>
      </NInput>
    </div>

    <NSpin :show="loading">
      <div class="favorites-list">
        <div v-if="filteredFavorites.length === 0" class="empty-state">
          <NIcon size="64" :depth="3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </NIcon>
          <p class="empty-text">暂无收藏</p>
          <p class="empty-hint">收藏你喜欢的内容吧！</p>
        </div>
        <NCard
          v-for="item in filteredFavorites"
          :key="item.id"
          class="favorite-card"
          :bordered="false"
          hoverable>
          <div class="favorite-content">
            <div class="favorite-icon">
              <NIcon size="32" :color="item.type === 'post' ? '#ec4899' : '#a855f7'">
                <svg v-if="item.type === 'post'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </NIcon>
            </div>
            <div class="favorite-info">
              <h4 class="favorite-title">{{ item.title }}</h4>
              <p class="favorite-description">{{ item.description }}</p>
              <div class="favorite-meta">
                <span class="favorite-type">
                  <NTag :type="item.type === 'post' ? 'primary' : 'info'" size="tiny">
                    {{ item.type === 'post' ? '帖子' : '兴趣圈' }}
                  </NTag>
                </span>
                <span class="favorite-time">{{ item.time }}</span>
              </div>
            </div>
            <NButton
              text
              type="error"
              size="small"
              @click="handleRemove(item)">
              <template #icon>
                <NIcon>
                  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </NIcon>
              </template>
            </NButton>
          </div>
        </NCard>
      </div>
    </NSpin>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { NCard, NIcon, NTag, NInput, NButton, NSpin, useMessage } from 'naive-ui'

const message = useMessage()

const props = defineProps({
  favorites: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['remove', 'click'])

const searchKey = ref('')
const loading = ref(false)

const filteredFavorites = computed(() => {
  if (!searchKey.value) return props.favorites
  return props.favorites.filter(fav =>
    fav.title.toLowerCase().includes(searchKey.value.toLowerCase()) ||
    fav.description.toLowerCase().includes(searchKey.value.toLowerCase())
  )
})

const handleRemove = (item) => {
  message.info(`移除收藏: ${item.title}`)
  emit('remove', item)
}

const handleClick = (item) => {
  emit('click', item)
}
</script>

<style scoped>
.my-favorites-tab {
  padding: 8px 0;
}

.tab-header {
  display: flex;
  align-items: center;
  /* justify-content: space-between; */
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
  margin-right: 3dvw;
}

.tab-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-right: 3dvw;
  color: rgba(255, 255, 255, 0.95);
}

.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.favorite-card {
  background: rgba(255, 255, 255, 0.02) !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  transition: all 0.3s ease;
  cursor: pointer;
}

.favorite-card:hover {
  background: rgba(255, 255, 255, 0.04) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
}

.favorite-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.favorite-icon {
  flex-shrink: 0;
}

.favorite-info {
  flex: 1;
  min-width: 0;
}

.favorite-title {
  font-size: 1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  margin: 0 0 4px 0;
}

.favorite-description {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 8px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.favorite-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.favorite-time {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-text {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 16px 0 4px 0;
}

.empty-hint {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .tab-header {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
