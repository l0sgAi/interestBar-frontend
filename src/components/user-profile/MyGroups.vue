<template>
  <div class="my-groups-tab">
    <div class="tab-header">
      <h2 class="tab-title">我的兴趣圈</h2>
      <NInput
        v-model:value="searchKey"
        placeholder="搜索兴趣圈..."
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
      <div class="groups-grid">
        <div v-if="filteredGroups.length === 0" class="empty-state">
          <NIcon size="64" :depth="3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </NIcon>
          <p class="empty-text">暂未加入任何兴趣圈</p>
          <p class="empty-hint">去发现你感兴趣的圈子吧！</p>
        </div>
        <NCard
          v-for="group in filteredGroups"
          :key="group.id"
          class="group-card"
          :bordered="false"
          hoverable>
          <div class="group-cover" :style="{ background: group.coverGradient }">
            <div class="group-avatar-wrapper">
              <NAvatar
                :size="60"
                :src="group.avatar"
                round/>
            </div>
          </div>
          <div class="group-info">
            <h3 class="group-name">{{ group.name }}</h3>
            <p class="group-description">{{ group.description }}</p>
            <div class="group-stats">
              <span class="group-stat">
                <NIcon size="14">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                  </svg>
                </NIcon>
                {{ group.members }}
              </span>
              <span class="group-stat">
                <NIcon size="14">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                  </svg>
                </NIcon>
                {{ group.posts }}
              </span>
            </div>
            <NTag :type="group.role === 'admin' ? 'warning' : 'default'" size="small" round>
              {{ group.role === 'admin' ? '管理员' : '成员' }}
            </NTag>
          </div>
        </NCard>
      </div>
    </NSpin>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { NCard, NAvatar, NIcon, NTag, NInput, NSpin } from 'naive-ui'

const props = defineProps({
  groups: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['click'])

const searchKey = ref('')
const loading = ref(false)

const filteredGroups = computed(() => {
  if (!searchKey.value) return props.groups
  return props.groups.filter(group =>
    group.name.toLowerCase().includes(searchKey.value.toLowerCase()) ||
    group.description.toLowerCase().includes(searchKey.value.toLowerCase())
  )
})

const handleClick = (group) => {
  emit('click', group)
}
</script>

<style scoped>
.my-groups-tab {
  padding: 8px 0;
}

.tab-header {
  display: flex;
  align-items: center;
  /* justify-content: space-between; */
  margin-bottom: 24px;
  flex-wrap: wrap;
  margin-right: 3dvw;
  gap: 16px;
}

.tab-title {
  font-size: 1.5rem;
  margin-right: 3dvw;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
}

.groups-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.group-card {
  background: rgba(255, 255, 255, 0.02) !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  transition: all 0.3s ease;
  overflow: hidden;
  cursor: pointer;
}

.group-card:hover {
  background: rgba(255, 255, 255, 0.04) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
  transform: translateY(-4px);
}

.group-cover {
  height: 100px;
  position: relative;
  margin: -16px -16px 0 -16px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 30px;
}

.group-avatar-wrapper {
  position: relative;
  z-index: 1;
}

.group-avatar-wrapper :deep(.n-avatar) {
  border: 4px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.group-info {
  padding: 16px 0 0 0;
  text-align: center;
}

.group-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  margin: 0 0 8px 0;
}

.group-description {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.group-stats {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 12px;
}

.group-stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  grid-column: 1 / -1;
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
  .groups-grid {
    grid-template-columns: 1fr;
  }

  .tab-header {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
