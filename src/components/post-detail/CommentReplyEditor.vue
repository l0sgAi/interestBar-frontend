<template>
  <div class="reply-editor">
    <MdEditor
      v-model="content"
      :language="language"
      :preview="false"
      :toolbars="toolbars"
      theme="dark"
      :placeholder="`回复 @${replyToName}...`"
      :max-length="2000"
      :footers="[]"
      :style="{ height: '17dvh' }"
      @onUploadImg="handleUploadImg"
    />
    <div class="reply-editor-footer">
      <NButton size="small" quaternary @click="$emit('cancel')">取消</NButton>
      <NButton
        type="primary"
        size="small"
        round
        :disabled="!content.trim()"
        :loading="submitting"
        @click="handleSubmit"
      >
        回复
      </NButton>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { NButton, useMessage } from 'naive-ui'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { createComment } from '@/api/comment'

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

const message = useMessage()
const content = ref('')
const submitting = ref(false)

const toolbars = [
  'bold',
  'italic',
  '-',
  'emoji',
  'image',
  '-',
  'preview'
]

const handleSubmit = async () => {
  if (!content.value.trim() || submitting.value) return
  submitting.value = true
  try {
    await createComment({
      post_id: props.postId,
      root_id: props.rootId || props.replyToId,
      reply_to_id: props.replyToId,
      content: content.value
    })
    message.success('回复成功')
    emit('submit')
  } catch (err) {
    message.error(err.message || '回复失败')
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

.reply-editor-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: rgb(24, 24, 28);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

:deep(.md-editor-dark) {
  --md-bk-color: rgb(24, 24, 28);
  --md-scrollbar-bg-color: rgb(24, 24, 28);
}
</style>
