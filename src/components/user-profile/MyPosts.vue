<template>
  <div class="my-posts-tab">
    <div class="tab-header">
      <h2 class="tab-title">我的帖子</h2>
      <NInput
        v-model:value="searchKey"
        placeholder="搜索帖子..."
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
      <div class="posts-list">
        <div v-if="filteredPosts.length === 0" class="empty-state">
          <NIcon size="64" :depth="3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
            </svg>
          </NIcon>
          <p class="empty-text">暂无帖子</p>
          <p class="empty-hint">发布你的第一个帖子吧！</p>
        </div>
        <div v-else class="post-cards">
          <NCard
            v-for="post in filteredPosts"
            :key="post.id"
            class="post-card"
            :bordered="false"
            hoverable>
            <div class="post-header">
              <div class="post-author">
                <NAvatar
                  :size="40"
                  :src="post.authorAvatar"
                  round/>
                <div class="author-info">
                  <span class="author-name">{{ post.authorName }}</span>
                  <span class="post-time">{{ post.time }}</span>
                </div>
              </div>
              <NDropdown :options="getPostMenuOptions()" @select="(key) => handleAction(key, post)">
                <NButton quaternary circle size="small">
                  <template #icon>
                    <NIcon>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="19" cy="12" r="1"></circle>
                        <circle cx="5" cy="12" r="1"></circle>
                      </svg>
                    </NIcon>
                  </template>
                </NButton>
              </NDropdown>
            </div>
            <h3 class="post-title">{{ post.title }}</h3>
            <p class="post-content">{{ post.content }}</p>
            <div v-if="post.images && post.images.length" class="post-images">
              <img
                v-for="(img, idx) in post.images.slice(0, 3)"
                :key="idx"
                :src="img"
                alt="post image"/>
            </div>
            <div class="post-footer">
              <div class="post-tags">
                <NTag v-for="tag in post.tags" :key="tag" size="tiny" round>
                  {{ tag }}
                </NTag>
              </div>
              <div class="post-stats">
                <span class="stat">
                  <NIcon>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </NIcon>
                  {{ post.comments }}
                </span>
                <span class="stat">
                  <NIcon>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </NIcon>
                  {{ post.likes }}
                </span>
                <span class="stat">
                  <NIcon>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </NIcon>
                  {{ post.views }}
                </span>
              </div>
            </div>
          </NCard>
        </div>
      </div>
    </NSpin>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { NCard, NAvatar, NIcon, NTag, NInput, NButton, NSpin, NDropdown, useMessage } from 'naive-ui'

const message = useMessage()

const props = defineProps({
  posts: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['edit', 'delete'])

const searchKey = ref('')
const loading = ref(false)

const filteredPosts = computed(() => {
  if (!searchKey.value) return props.posts
  return props.posts.filter(post =>
    post.title.toLowerCase().includes(searchKey.value.toLowerCase()) ||
    post.content.toLowerCase().includes(searchKey.value.toLowerCase())
  )
})

const getPostMenuOptions = () => {
  return [
    { label: '编辑', key: 'edit' },
    { label: '删除', key: 'delete' }
  ]
}

const handleAction = (key, post) => {
  switch (key) {
    case 'edit':
      message.info(`编辑帖子: ${post.title}`)
      emit('edit', post)
      break
    case 'delete':
      message.warning(`删除帖子: ${post.title}`)
      emit('delete', post)
      break
  }
}
</script>

<style scoped>
.my-posts-tab {
  padding: 8px 0;
}

.tab-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.tab-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-right: 3dvw;
  color: rgba(255, 255, 255, 0.95);
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.post-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.post-card {
  background: rgba(255, 255, 255, 0.02) !important;
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
  transition: all 0.3s ease;
}

.post-card:hover {
  background: rgba(255, 255, 255, 0.04) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
  transform: translateY(-2px);
}

.post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.author-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.post-time {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.post-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  margin: 0 0 8px 0;
}

.post-content {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-images {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
  margin-bottom: 12px;
  border-radius: 8px;
  overflow: hidden;
}

.post-images img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.post-images img:hover {
  transform: scale(1.05);
}

.post-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.post-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.post-stats {
  display: flex;
  gap: 16px;
}

.post-stats .stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
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
