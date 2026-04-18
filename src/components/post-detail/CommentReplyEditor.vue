<template>
  <div class="reply-editor">
    <MdEditor
      v-model="content"
      :language="language"
      :preview="false"
      :toolbars="toolbars"
      theme="dark"
      :placeholder="replyToName ? `@${t('comment.reply.placeholder', { name: replyToName })}` : t('comment.editor.placeholder')"
      :max-length="2000"
      :footers="[]"
      :style="{ height: '17dvh' }"
      @onUploadImg="handleUploadImg"
    />
    <div class="reply-editor-footer">
      <NButton size="small" quaternary @click="$emit('cancel')">{{ t('common.cancel') }}</NButton>
      <NButton
        type="primary"
        size="small"
        round
        :disabled="!content.trim()"
        :loading="submitting"
        @click="handleSubmit"
      >
        {{ t('comment.actions.reply') }}
      </NButton>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { NButton, useMessage } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { createComment } from '@/api/comment'
import { getUserInfo } from '@/api/auth'

const props = defineProps({
  postId: {
    type: Number,
    required: true
  },
  rootId: {
    type: Number,
    default: 0
  },
  replyToId: {
    type: Number,
    required: true
  },
  replyToName: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'zh-CN'
  }
})

const emit = defineEmits(['submit', 'cancel'])

const { t } = useI18n()
const message = useMessage()
const content = ref('')
const submitting = ref(false)

const toolbars = [
  'bold',
  'italic',
  '_',
  'image',
  '-',
  'preview'
]

const handleSubmit = async () => {
  if (!content.value.trim() || submitting.value) return
  submitting.value = true
  try {
    const res = await createComment({
      post_id: props.postId,
      root_id: props.rootId || props.replyToId,
      reply_to_id: props.replyToId,
      content: content.value
    })
    message.success(t('comment.reply.success'))

    // 获取当前用户信息
    let userData = {}
    try {
      const userRes = await getUserInfo()
      if (userRes.data) {
        userData = userRes.data
      }
    } catch (err) {
      console.error('获取用户信息失败:', err)
    }

    // 构建新回复数据
    // 如果 res.data 是对象则使用它，如果是数字（ID）则创建新对象
    const newReply = typeof res.data === 'object' && res.data !== null
      ? { ...res.data }
      : { id: res.data }

    // 使用本地获取的用户信息填充回复数据
    newReply.author_name = userData.name || newReply.author_name || ''
    newReply.author_id = userData.id || newReply.author_id
    newReply.author_avatar = userData.avatar_url || newReply.author_avatar || null
    newReply.content = newReply.content || content.value
    newReply.like_count = newReply.like_count || 0
    newReply.reply_to_name = newReply.reply_to_name || props.replyToName || null
    newReply.create_time = newReply.create_time || new Date().toISOString()

    content.value = ''
    // 返回新创建的回复数据
    emit('submit', newReply)
  } catch (err) {
    message.error(err.message || t('comment.reply.failed'))
  } finally {
    submitting.value = false
  }
}

const handleUploadImg = async (files, callback) => {
  // TODO: 对接图片上传API
  const urls = await Promise.all(
    files.map(() => Promise.resolve('https://via.placeholder.com/300'))
  )
  callback(urls)
}
</script>

<style scoped>
.reply-editor {
  margin-top: 10px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.reply-editor :deep(.md-editor) {
  border: none !important;
  border-radius: 0 !important;
}

.reply-editor :deep(.md-editor-toolbar-wrapper) {
  border-radius: 0;
}

.reply-editor :deep(.md-editor-content) {
  border-bottom: none !important;
}

.reply-editor-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: rgb(24, 24, 28);
}

:deep(.md-editor-dark) {
  --md-bk-color: rgb(24, 24, 28);
  --md-scrollbar-bg-color: rgb(24, 24, 28);
}
</style>
