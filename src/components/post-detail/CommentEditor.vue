<template>
  <NCard :bordered="false" class="comment-editor-card">
    <div class="comment-editor-header">
      <span class="comment-section-title">{{ t('comment.editor.title') }}</span>
    </div>
    <div class="comment-editor-wrapper">
      <MdEditor
        v-model="content"
        :language="language"
        :preview="false"
        :toolbars="toolbars"
        theme="dark"
        :placeholder="t('comment.editor.placeholder')"
        :max-length="2000"
        :footers="[]"
        :style="{ height: '25dvh' }"
        @onUploadImg="handleUploadImg"
      />
      <div class="comment-editor-footer">
        <NButton
          type="primary"
          size="medium"
          round
          :disabled="!content.trim()"
          :loading="submitting"
          @click="handleSubmit"
        >
          {{ t('comment.editor.submit') }}
        </NButton>
      </div>
    </div>
  </NCard>
</template>

<script setup>
import { ref, watch } from 'vue'
import { NCard, NButton, useMessage } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { createComment } from '@/api/comment'

const props = defineProps({
  postId: {
    type: Number,
    required: true
  },
  language: {
    type: String,
    default: 'zh-CN'
  },
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'submit', 'uploadImg'])

const { t } = useI18n()
const message = useMessage()
const content = ref(props.modelValue)
const submitting = ref(false)

watch(() => props.modelValue, (val) => {
  content.value = val
})

watch(content, (val) => {
  emit('update:modelValue', val)
})

const toolbars = [
  'bold',
  'italic',
  '-',
  'quote',
  'unorderedList',
  'orderedList',
  '-',
  'codeRow',
  'link',
  'image',
  'emoji',
  '-',
  'preview',
  'previewOnly'
]

const handleSubmit = async () => {
  if (!content.value.trim() || submitting.value) return
  submitting.value = true
  try {
    await createComment({ post_id: props.postId, content: content.value })
    message.success(t('comment.editor.success'))
    emit('submit', content.value)
    content.value = ''
  } catch (err) {
    message.error(err.message || t('comment.editor.failed'))
  } finally {
    submitting.value = false
  }
}

const handleUploadImg = async (files, callback) => {
  emit('uploadImg', files, callback)
}
</script>

<style scoped>
.comment-editor-card {
  border-radius: 16px !important;
}

.comment-section-title {
  font-size: 18px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.comment-editor-header {
  margin-bottom: 12px;
}

.comment-editor-wrapper {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.comment-editor-wrapper :deep(.md-editor) {
  border: none !important;
  border-radius: 0 !important;
}

.comment-editor-wrapper :deep(.md-editor-toolbar-wrapper) {
  border-radius: 0;
}

.comment-editor-wrapper :deep(.md-editor-content) {
  border-bottom: none !important;
}

.comment-editor-footer {
  display: flex;
  justify-content: flex-end;
  padding: 10px 16px;
  background: rgb(24, 24, 28);
}

:deep(.md-editor-dark) {
  --md-bk-color: rgb(24, 24, 28);
  --md-scrollbar-bg-color: rgb(24, 24, 28);
}
</style>
