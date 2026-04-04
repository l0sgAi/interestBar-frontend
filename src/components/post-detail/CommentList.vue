<template>
  <NCard :bordered="false" class="comment-list-card">
    <div class="comment-list-header">
      <span class="comment-section-title">评论 ({{ comments.length }})</span>
      <div class="comment-sort">
        <NButton text size="small" :type="sort === 'newest' ? 'primary' : 'default'" @click="$emit('update:sort', 'newest')">最新</NButton>
        <NDivider vertical />
        <NButton text size="small" :type="sort === 'hottest' ? 'primary' : 'default'" @click="$emit('update:sort', 'hottest')">最热</NButton>
      </div>
    </div>

    <div class="comment-list">
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
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
            <NButton text size="small" class="comment-action-btn" @click="$emit('reply', comment)">
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

      <NEmpty v-if="!comments.length" description="暂无评论，快来发表第一条评论吧" />
    </div>
  </NCard>
</template>

<script setup>
import { NCard, NAvatar, NButton, NDivider, NIcon, NEmpty } from 'naive-ui'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'

defineProps({
  comments: {
    type: Array,
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

defineEmits(['update:sort', 'reply'])
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

:deep(.md-editor-dark) {
  --md-bk-color: rgb(24, 24, 28);
  --md-scrollbar-bg-color: rgb(24, 24, 28);
}

:deep(.md-editor-dark .md-editor-preview) {
  --md-theme-bg-color: rgb(24, 24, 28);
}
</style>
