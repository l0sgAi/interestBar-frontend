<template>
  <div class="browse-history-tab">
    <div class="tab-header">
      <h2 class="tab-title">浏览历史</h2>
      <div class="header-actions">
        <NInput
          v-model:value="searchKey"
          placeholder="搜索历史..."
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
        <NButton quaternary type="error" @click="handleClear">
          <template #icon>
            <NIcon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </NIcon>
          </template>
          清空历史
        </NButton>
      </div>
    </div>

    <NSpin :show="loading">
      <div class="history-timeline">
        <div v-if="filteredHistory.length === 0" class="empty-state">
          <NIcon size="64" :depth="3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </NIcon>
          <p class="empty-text">暂无浏览历史</p>
          <p class="empty-hint">开始探索感兴趣的内容吧！</p>
        </div>
        <NTimeline v-else>
          <NTimelineItem
            v-for="group in groupedHistory"
            :key="group.date"
            :type="group.type"
            :title="group.date"
            class="history-group">
            <div class="history-items">
              <NCard
                v-for="item in group.items"
                :key="item.id"
                class="history-item"
                :bordered="false"
                hoverable
                @click="handleClick(item)">
                <div class="history-item-content">
                  <div class="history-item-icon">
                    <NIcon size="20" :color="item.type === 'post' ? '#ec4899' : '#a855f7'">
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
                  <div class="history-item-info">
                    <h5 class="history-item-title">{{ item.title }}</h5>
                    <p class="history-item-time">{{ item.time }}</p>
                  </div>
                </div>
              </NCard>
            </div>
          </NTimelineItem>
        </NTimeline>
      </div>
    </NSpin>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { NCard, NIcon, NInput, NButton, NSpin, NTimeline, NTimelineItem, useMessage } from 'naive-ui'

const message = useMessage()

const props = defineProps({
  history: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['clear', 'click'])

const searchKey = ref('')
const loading = ref(false)

const filteredHistory = computed(() => {
  if (!searchKey.value) return props.history
  return props.history.filter(item =>
    item.title.toLowerCase().includes(searchKey.value.toLowerCase())
  )
})

const groupedHistory = computed(() => {
  const groups = {}
  filteredHistory.value.forEach(item => {
    if (!groups[item.date]) {
      groups[item.date] = {
        date: item.date,
        type: item.date === '今天' ? 'success' : 'info',
        items: []
      }
    }
    groups[item.date].items.push(item)
  })
  return Object.values(groups)
})

const handleClear = () => {
  message.info('清空浏览历史')
  emit('clear')
}

const handleClick = (item) => {
  message.info(`跳转到: ${item.title}`)
  emit('click', item)
}
</script>

<style scoped>
.browse-history-tab {
  padding: 8px 0;
}

.tab-header {
  display: flex;
  align-items: center;
  /* justify-content: space-between; */
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.tab-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  margin-right: 3dvw;
}

.header-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.history-timeline {
  padding: 8px 0;
}

.history-group {
  margin-bottom: 24px;
}

.history-group :deep(.n-timeline-item-header) {
  margin-bottom: 12px;
}

.history-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 12px;
}

.history-item {
  background: rgba(255, 255, 255, 0.02) !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  cursor: pointer;
  transition: all 0.3s ease;
}

.history-item:hover {
  background: rgba(255, 255, 255, 0.04) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
}

.history-item-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.history-item-icon {
  flex-shrink: 0;
}

.history-item-info {
  flex: 1;
  min-width: 0;
}

.history-item-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-item-time {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
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

  .header-actions {
    flex-direction: column;
  }

  .history-items {
    grid-template-columns: 1fr;
  }
}
</style>
