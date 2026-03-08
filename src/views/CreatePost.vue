<template>
  <div class="create-post-page">
    <!-- 顶栏 -->
    <AppHeader />

    <!-- 侧边栏 -->
    <SideNav />

    <!-- 主内容区域 -->
    <div class="main-content">
      <div class="create-post-container">
        <NCard title="➕ 创建帖子" :bordered="false" class="post-card">
          <NForm
            ref="formRef"
            :model="formData"
            :rules="rules"
            label-placement="top"
            require-mark-placement="right-hanging"
          >
            <!-- 圈子选择 -->
            <NFormItem label="所属圈子" path="circle_id">
              <NSelect
                v-model:value="formData.circle_id"
                :options="circleOptions"
                :loading="loadingCircles"
                filterable
                placeholder="搜索并选择圈子"
                clearable
                @search="handleSearchCircle"
                :render-label="renderCircleLabel"
                size="large"
                class="circle-select"
              />
            </NFormItem>

            <!-- 标题 -->
            <NFormItem label="标题" path="title">
              <NInput
                v-model:value="formData.title"
                placeholder="请输入帖子标题"
                maxlength="200"
                show-count
                size="large"
                class="title-input"
              />
            </NFormItem>

            <!-- 摘要 -->
            <NFormItem label="摘要（检索关键词，可选）" path="summary">
              <NInput
                v-model:value="formData.summary"
                type="textarea"
                placeholder="请输入摘要，用于检索和关键词匹配"
                maxlength="500"
                show-count
                size="large"
                class="title-input"
              />
            </NFormItem>

            <!-- 正文（Markdown编辑器） -->
            <NFormItem label="正文" path="content">
              <MdEditor
                v-model="formData.content"
                :language="language"
                :preview="true"
                :toolbars="toolbars"
                theme="dark"
                placeholder="请输入帖子正文内容（支持 Markdown 格式）"
                :max-length="50000"
                :rows="25"
                @onUploadImg="handleUploadImg"
              />
            </NFormItem>
            <div class="footer-actions">
              <NButton size="large" @click="handleCancel">取消</NButton>
              <NButton
                size="large"
                type="primary"
                :loading="submitting"
                @click="handleSubmit"
              >
                发布帖子
              </NButton>
            </div>
          </NForm>
        </NCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NButton,
  NAvatar,
  NText,
  useMessage
} from 'naive-ui'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import AppHeader from '@/components/AppHeader.vue'
import SideNav from '@/components/SideNav.vue'
import { getMyCircles, createPost } from '@/api/post'

const router = useRouter()
const message = useMessage()
const formRef = ref(null)
const submitting = ref(false)
const loadingCircles = ref(false)
const language = ref('zh-CN')
let searchTimer = null

// 表单数据
const formData = ref({
  circle_id: null,
  title: '',
  summary: '',
  content: '',
  media_extra: {}
})

// 圈子选项
const circleOptions = ref([])

// 编辑器工具栏配置
const toolbars = [
  'bold',
  'underline',
  'italic',
  '-',
  'title',
  'strikeThrough',
  'sub',
  'sup',
  'quote',
  'unorderedList',
  'orderedList',
  'task',
  '-',
  'codeRow',
  'code',
  'link',
  'image',
  'table',
  '-',
  'revoke',
  'next',
  'save',
  '=',
  'pageFullscreen',
  'fullscreen',
  'preview',
  'htmlPreview',
  'catalog'
]

// 表单验证规则
const rules = {
  circle_id: {
    required: true,
    type: 'number',
    message: '请选择所属圈子',
    trigger: ['change', 'blur']
  },
  title: {
    required: true,
    message: '请输入帖子标题',
    trigger: ['blur', 'input']
  },
  content: {
    required: true,
    message: '请输入帖子正文',
    trigger: ['blur', 'input']
  }
}

// 加载用户已加入的圈子列表
const loadCircles = async (keyword = '') => {
  try {
    loadingCircles.value = true
    const res = await getMyCircles({
      keyword,
      size: 50
    })

    if (res.data && res.data.circles) {
      circleOptions.value = res.data.circles.map(circle => ({
        label: circle.name,
        value: circle.id,
        avatar: circle.avatar_url,
        member_count: circle.member_count
      }))
    }
  } catch (error) {
    console.error('加载圈子列表失败:', error)
    message.error('加载圈子列表失败')
  } finally {
    loadingCircles.value = false
  }
}

// 搜索圈子（带防抖）
const handleSearchCircle = (keyword) => {
  // 清除之前的定时器
  if (searchTimer) {
    clearTimeout(searchTimer)
  }

  // 如果没有输入，加载所有圈子
  if (!keyword) {
    loadCircles('')
    return
  }

  // 设置新的定时器，2秒后执行搜索
  searchTimer = setTimeout(() => {
    loadCircles(keyword)
  }, 2000)
}

// 自定义圈子选项渲染
const renderCircleLabel = (option) => {
  return h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0' } }, [
    h(NAvatar, {
      size: 48,
      src: option.avatar,
      round: true
    }),
    h('div', { style: { flex: 1 } }, [
      h('div', { style: { fontWeight: 500, fontSize: '21px' } }, option.label),
      h(NText, {
        depth: 3,
        style: { fontSize: '16px' }
      }, { default: () => `${option.member_count || 0} 成员` })
    ])
  ])
}

// 上传图片（需要根据实际后端接口调整）
const handleUploadImg = async (files, callback) => {
  // TODO: 实现图片上传逻辑
  console.log('上传图片:', files)
  message.info('图片上传功能待实现')
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()

    submitting.value = true
    const res = await createPost(formData.value)

    message.success('发布成功')

    // 跳转到帖子详情页
    if (res.data) {
      const postId = res.data
      router.push({
        name: 'post-detail',
        params: { id: postId }
      })
    } else {
      message.warning('未获取到帖子ID，返回首页')
      router.push('/home')
    }
  } catch (error) {
    console.error('发布失败:', error)
    if (error.errors) {
      // 表单验证错误
      return
    }
    message.error(error.message || '发布失败，请重试')
  } finally {
    submitting.value = false
  }
}

// 取消
const handleCancel = () => {
  router.back()
}

onMounted(() => {
  loadCircles()
})
</script>

<style scoped>
.create-post-page {
  min-height: 100vh;
  position: relative;
}

.main-content {
  margin-left: 15%;
  margin-top: 64px;
  padding: 24px;
  min-height: calc(100vh - 64px);
  transition: margin-left 0.3s ease, margin-right 0.3s ease;
}

.create-post-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.post-card {
  border-radius: 16px !important;
  overflow: hidden;
}

:deep(.n-card__header) {
  padding: 24px 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.n-card__content) {
  padding: 32px;
}

:deep(.n-card__footer) {
  padding: 20px 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.n-form-item) {
  margin-bottom: 28px;
}

:deep(.n-form-item-label) {
  font-weight: 500;
  font-size: 16px;
  padding-bottom: 10px;
}

/* 圈子选择下拉框 */
.circle-select {
  max-width: 33.33%;
}

:deep(.circle-select .n-base-selection) {
  min-height: 72px !important;
}

:deep(.circle-select .n-base-selection__border),
:deep(.circle-select .n-base-selection__border--focused) {
  box-shadow: none !important;
}

:deep(.circle-select .n-base-selection-label) {
  min-height: 72px !important;
  font-size: 21px !important;
  display: flex !important;
  align-items: center !important;
}

:deep(.circle-select .n-base-selection-placeholder) {
  font-size: 21px !important;
  min-height: 72px !important;
  display: flex !important;
  align-items: center !important;
}

:deep(.circle-select .n-base-selection-input) {
  font-size: 21px !important;
}

/* 下拉列表选项样式 */
:deep(.n-virtuoso__item) {
  min-height: 64px !important;
}

:deep(.n-base-select-option__content) {
  min-height: 64px !important;
  padding: 12px 16px !important;
}

:deep(.n-input),
:deep(.n-base-selection) {
  border-radius: 12px !important;
  transition: all 0.3s ease;
}

:deep(.n-input:hover),
:deep(.n-base-selection:hover) {
  border-radius: 12px !important;
}

:deep(.n-input__input-el),
:deep(.n-input__textarea-el) {
  font-size: 21px;
}

:deep(.n-input--large .n-input__input-el),
:deep(.n-input--large .n-input__textarea-el) {
  font-size: 21px;
}

/* 标题输入框样式 */
.title-input {
  min-height: 72px;
  font-size: 21px;
}

:deep(.title-input .n-input__input-el) {
  height: 72px !important;
  line-height: 72px !important;
  font-size: 21px !important;
}

/* 摘要输入框样式 */
.summary-input :deep(.n-input__textarea-el) {
  font-size: 21px !important;
  line-height: 1.6;
}

/* Markdown 编辑器样式 */
:deep(.md-editor) {
  font-size: 21px !important;
  border-radius: 21px !important;
  overflow: hidden;
}

/* 强制覆盖所有内部文本:字体 */
:deep(.md-editor *) {
  font-family: 'Fira Code', 'Maple Mono SC NF', 'Consolas', '微软雅黑';
}

:deep(.cm-scroller *){
  font-size: 21px;
}

/* 工具栏样式 */
:deep(.md-editor-toolbar) {
  font-size: 21px !important;
  border-radius: 21px 21px 0 0 !important;
  padding: 7px !important;
}

:deep(.md-editor-toolbar-item svg) {
  width: 21px !important;
  height: 21px !important;
}

:deep(.md-editor-footer){
  height: 7% !important;
}

/* 底部按钮 */
.footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.footer-actions .n-button {
  min-width: 120px;
  border-radius: 10px;
  font-weight: 500;
}

/* 响应式 */
@media (max-width: 1400px) {
  .main-content {
    margin-right: 24px;
  }
}

@media (max-width: 1200px) {
  .main-content {
    margin-right: 24px;
    margin-left: 80px;
  }
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    margin-right: 0;
    padding: 16px;
  }

  :deep(.n-card__header),
  :deep(.n-card__content),
  :deep(.n-card__footer) {
    padding: 20px;
  }

  .create-post-container {
    max-width: 100%;
  }
}
</style>
