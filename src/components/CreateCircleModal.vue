<template>
  <NModal
    v-model:show="showModal"
    :mask-closable="false"
    preset="card"
    :style="{ width: '800px' }"
    title="✨新建兴趣圈"
    :bordered="false"
    size="huge"
    class="create-circle-modal"
  >
    <NScrollbar>
      <NForm
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="top"
        require-mark-placement="right"
        class="scroll-bar"
        size="large"
      >
        <!-- 基本信息 -->
        <NFormItem label="圈子名称" path="name">
          <NInput
            v-model:value="formData.name"
            placeholder="请输入兴趣圈名称"
            maxlength="50"
            show-count
            @input="handleNameInput"
          />
        </NFormItem>

        <NFormItem label="唯一标识" path="slug">
          <NInput
            v-model:value="formData.slug"
            placeholder="留空自动生成，或手动输入（仅限小写字母、数字、连字符）"
            maxlength="60"
          />
        </NFormItem>

        <NFormItem label="简介描述" path="description">
          <NInput
            v-model:value="formData.description"
            type="textarea"
            placeholder="简单介绍一下这个兴趣圈..."
            :autosize="{ minRows: 4, maxRows: 6 }"
            maxlength="2000"
            show-count
          />
        </NFormItem>

        <NDivider />

        <!-- 图片上传 -->
        <NFormItem label="圈子头像" path="avatar_url">
          <NUpload
            :max="1"
            :file-list="avatarFileList"
            @update:file-list="handleAvatarChange"
            :custom-request="handleUploadAvatar"
            list-type="image-card"
            accept="image/*"
          >
            点击上传
          </NUpload>
          <template #feedback>
            <NText depth="3" style="font-size: 12px">建议尺寸 200x200px</NText>
          </template>
        </NFormItem>

        <NFormItem label="背景封面" path="cover_url">
          <NUpload
            :max="1"
            :file-list="coverFileList"
            @update:file-list="handleCoverChange"
            :custom-request="handleUploadCover"
            list-type="image-card"
            accept="image/*"
          >
            点击上传
          </NUpload>
          <template #feedback>
            <NText depth="3" style="font-size: 12px">建议尺寸 1200x300px</NText>
          </template>
        </NFormItem>

        <NDivider />

        <!-- 圈内规则 -->
        <NFormItem label="圈内规则" path="rule">
          <NInput
            v-model:value="formData.rule"
            type="textarea"
            placeholder="请输入圈子内的行为规范..."
            :autosize="{ minRows: 5, maxRows: 8 }"
            maxlength="2000"
            show-count
          />
        </NFormItem>

        <NDivider />

        <!-- 分类与权限 -->
        <NFormItem label="圈子分类" path="category_id">
          <NSelect
            v-model:value="formData.category_id"
            :options="categoryOptions"
            :loading="loadingCategories"
            placeholder="请选择分类"
            filterable
          />
        </NFormItem>

        <NFormItem label="加入方式" path="join_type">
          <NRadioGroup v-model:value="formData.join_type" name="join_type">
            <NSpace vertical :size="12">
              <NRadio :value="0">
                <NText strong>直接加入</NText>
                <NText depth="3" style="margin-left: 8px">任何人都可以直接加入</NText>
              </NRadio>
              <NRadio :value="1">
                <NText strong>需要审核</NText>
                <NText depth="3" style="margin-left: 8px">申请需要管理员审核</NText>
              </NRadio>
              <NRadio :value="2">
                <NText strong>私密圈子</NText>
                <NText depth="3" style="margin-left: 8px">仅限邀请加入</NText>
              </NRadio>
            </NSpace>
          </NRadioGroup>
        </NFormItem>
      </NForm>
    </NScrollbar>

    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton size="large" @click="handleCancel">取消</NButton>
        <NButton type="primary" size="large" :loading="loading" @click="handleSubmit">
          创建兴趣圈
        </NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {
  NModal,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NSpace,
  NUpload,
  NRadioGroup,
  NRadio,
  NSelect,
  NScrollbar,
  NDivider,
  NText,
  useMessage
} from 'naive-ui'
import { getCategories, createCircle } from '@/api/circle'
import { uploadImage } from '@/api/user'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:show', 'success'])

const message = useMessage()
const formRef = ref(null)
const loading = ref(false)
const showModal = computed({
  get: () => props.show,
  set: (val) => emit('update:show', val)
})

// 文件列表
const avatarFileList = ref([])
const coverFileList = ref([])

// 表单数据
const formData = ref({
  name: '',
  slug: '',
  avatar_url: '',
  cover_url: '',
  description: '',
  rule: '',
  category_id: null,
  join_type: 0
})

// 分类选项
const categoryOptions = ref([])
const loadingCategories = ref(false)

// 加载分类列表
const loadCategories = async () => {
  try {
    loadingCategories.value = true
    const res = await getCategories()
    if (res.code === 200 && res.data) {
      // 将分类数据转换为选项格式
      categoryOptions.value = res.data.map(cat => ({
        label: cat.name,
        value: cat.id
      }))
      console.log('分类列表加载成功:', categoryOptions.value)
    }
  } catch (error) {
    console.error('加载分类失败:', error)
    message.error('加载分类列表失败')
  } finally {
    loadingCategories.value = false
  }
}

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入圈子名称', trigger: 'blur' },
    { min: 2, max: 50, message: '名称长度应在 2-50 个字符之间', trigger: 'blur' }
  ],
  slug: [
    {
      pattern: /^[a-z0-9-]*$/,
      message: '只能包含小写字母、数字和连字符',
      trigger: 'blur'
    },
    { max: 60, message: '最多 60 个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入简介描述', trigger: 'blur' },
    { min: 10, max: 2000, message: '描述长度应在 10-2000 个字符之间', trigger: 'blur' }
  ],
  rule: [
    { required: true, message: '请输入圈内规则', trigger: 'blur' },
    { min: 10, max: 2000, message: '规则长度应在 10-2000 个字符之间', trigger: 'blur' }
  ],
  category_id: [
    { required: true, message: '请选择圈子分类', trigger: 'change', type: 'number' }
  ]
}

// 名称输入处理，自动生成 slug
const handleNameInput = () => {
  if (formData.value.name && !formData.value.slug) {
    formData.value.slug = formData.value.name
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }
}

// 处理头像上传
const handleAvatarChange = (options) => {
  avatarFileList.value = options
}

const handleUploadAvatar = async ({ file, onFinish, onError }) => {
  try {
    const res = await uploadImage(file.file)
    if (res.code === 200 && res.data) {
      formData.value.avatar_url = res.data.url
      message.success('头像上传成功')
      onFinish()
    } else {
      message.error(res.message || '头像上传失败')
      onError()
    }
  } catch (error) {
    console.error('头像上传失败:', error)
    message.error('头像上传失败，请重试')
    onError()
  }
}

// 处理封面上传
const handleCoverChange = (options) => {
  coverFileList.value = options
}

const handleUploadCover = async ({ file, onFinish, onError }) => {
  try {
    const res = await uploadImage(file.file)
    if (res.code === 200 && res.data) {
      formData.value.cover_url = res.data.url
      message.success('封面上传成功')
      onFinish()
    } else {
      message.error(res.message || '封面上传失败')
      onError()
    }
  } catch (error) {
    console.error('封面上传失败:', error)
    message.error('封面上传失败，请重试')
    onError()
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true

    // 调用创建兴趣圈接口
    const res = await createCircle(formData.value)
    console.log('创建结果:'+res)
    if (res.code === 200) {
      message.success('兴趣圈创建成功！')
      emit('success', res.data)
      handleReset()
      showModal.value = false
    } else {
      message.error(res.message || '创建失败，请重试')
    }
  } catch (error) {
    console.error('创建兴趣圈失败:', error)
    // 优先显示接口返回的错误消息
    const errorMsg = error.message || '创建失败，请检查网络连接'
    message.error(errorMsg)
  } finally {
    loading.value = false
  }
}

// 取消
const handleCancel = () => {
  showModal.value = false
  handleReset()
}

// 重置表单
const handleReset = () => {
  setTimeout(() => {
    formRef.value?.restoreValidation()
    formData.value = {
      name: '',
      slug: '',
      avatar_url: '',
      cover_url: '',
      description: '',
      rule: '',
      category_id: null,
      join_type: 0
    }
    avatarFileList.value = []
    coverFileList.value = []
  }, 200)
}

watch(showModal, (val) => {
  if (val) {
    // 弹窗打开时加载分类列表
    loadCategories()
  } else {
    handleReset()
  }
})
</script>

<style scoped>
/* 仅保留必要的自定义样式 */
.scroll-bar{
  height: 65vh;
  padding: 17px;
}
</style>
