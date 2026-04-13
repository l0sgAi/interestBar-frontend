<template>
  <div class="post-detail-page">
    <!-- 顶栏 -->
    <AppHeader />

    <!-- 侧边栏 -->
    <SideNav @collapsed="offset = 64" @expanded="offset = 260" />

    <!-- 主内容区域 -->
    <div class="main-content" :style="{ 'margin-left': `${offset}px` }">
      <div v-if="loading" class="loading-container">
        <NSpin size="large" />
      </div>

      <div v-else-if="post" class="post-detail-container">
        <!-- 左侧内容列 -->
        <div class="post-main-column">
            <PostHeaderAndContent
              :post="post"
              :language="language"
              @like="handleLike"
              @collect="handleCollect"
            >
            <CommentEditor
              :post-id="Number(route.params.id)"
              :language="language"
              @submit="handleSubmitComment"
              @upload-img="handleCommentUploadImg"
            />

            <CommentList
              ref="commentListRef"
              :post-id="Number(route.params.id)"
              v-model:sort="commentSort"
              :language="language"
            />
          </PostHeaderAndContent>
        </div>

        <!-- 右侧圈子信息卡片 -->
        <div class="right-sidebar">
          <CircleInfoCard
            v-if="post && post.circle_id"
            :circleId="post.circle_id"
          />
        </div>
      </div>

      <NEmpty v-else :description="t('post.postNotFound')" >
        <template #icon>
          <NIcon>
            <ArticleRound/>
          </NIcon>
        </template>
      </NEmpty> 
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRoute } from 'vue-router'
import { NSpin, NEmpty, useMessage, NIcon } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import AppHeader from '@/components/AppHeader.vue'
import SideNav from '@/components/SideNav.vue'
import CircleInfoCard from '@/components/CircleInfoCard.vue'
import PostHeaderAndContent from '@/components/post-detail/PostHeaderAndContent.vue'
import CommentEditor from '@/components/post-detail/CommentEditor.vue'
import CommentList from '@/components/post-detail/CommentList.vue'
import { getPostDetail } from '@/api/post'
import { getCircleDetail } from '@/api/circle'
import {ArticleRound} from '@vicons/material'

const route = useRoute()
const message = useMessage()
const { t } = useI18n()

// 注入圈子搜索状态设置方法
const setCircleSearch = inject('setCircleSearch', () => {})

const loading = ref(true)
const post = ref(null)
const language = ref('zh-CN')
const offset = ref(260);
// 加载帖子详情
const loadPostDetail = async () => {
  try {
    loading.value = true
    const postId = route.params.id
    const res = await getPostDetail(postId)

    if (res.data) {
      post.value = res.data

      // 设置圈子搜索状态
      if (post.value.circle_id) {
        try {
          const circleRes = await getCircleDetail(post.value.circle_id)
          if (circleRes.data) {
            setCircleSearch({
              id: circleRes.data.id,
              name: circleRes.data.name,
              avatar_url: circleRes.data.avatar_url
            })
          }
        } catch (error) {
          console.error('获取圈子信息失败:', error)
        }
      }
    } else {
      message.error(t('post.postNotFound'))
    }
  } catch (error) {
    console.error('加载帖子详情失败:', error)
    message.error(t('messages.getDetailFailed', { error: error.message }))
  } finally {
    loading.value = false
  }
}

// 点赞
const handleLike = () => {
  message.info(t('messages.likeFeaturePending'))
}

// 收藏
const handleCollect = () => {
  message.info(t('messages.favoriteFeaturePending'))
}

// ============ 评论区相关 ============
const commentSort = ref('hottest')
const commentListRef = ref(null)

// 提交评论（API 调用已在 CommentEditor 内部完成，此处只做后续处理）
const handleSubmitComment = () => {
  commentListRef.value?.refreshComments()
}

// 评论图片上传
const handleCommentUploadImg = async (files, callback) => {
  // TODO: 对接图片上传API
  const urls = await Promise.all(
    files.map(() => Promise.resolve('https://via.placeholder.com/300'))
  )
  callback(urls)
}

onMounted(() => {
  loadPostDetail()
})
</script>

<style scoped>
.post-detail-page {
  min-height: 100vh;
  position: relative;
}

.main-content {
  margin-top: 10dvh;
  width: auto;
  min-height: calc(100vh - 64px);
  transition: margin-left 0.3s ease, margin-right 0.3s ease;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.post-detail-container {
  display: flex;
  gap: 24px;
  width: 100%;
  align-items: flex-start;
}

.post-main-column {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 右侧悬浮栏 */
.right-sidebar {
  width: 384px;
  flex-shrink: 0;
  position: sticky;
  top: 88px;
  max-height: calc(100vh - 88px);
  overflow-y: auto;
  /* 隐藏滚动条 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.right-sidebar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

/* 响应式 */
@media (max-width: 1400px) {
  .main-content {
    margin-right: 24px;
  }

  .right-sidebar {
    width: 320px;
  }
}

@media (max-width: 1200px) {
  .right-sidebar {
    display: none;
  }

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

  .post-detail-container {
    max-width: 100%;
  }
}
</style>
