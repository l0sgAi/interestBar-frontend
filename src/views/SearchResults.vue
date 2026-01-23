<template>
  <div class="search-page">
    <!-- 顶栏 -->
    <AppHeader />

    <!-- 侧边栏 -->
    <SideNav />

    <!-- 主内容区域 -->
    <div class="main-content">
      <div class="search-container">
          <div class="search-info">
            <h2 class="search-title">搜索结果</h2>
            <p class="search-keyword">关键词: {{ keyword }}</p>
          </div>
          <NDivider/>

        <!-- 搜索类型 Tabs -->
        <NTabs animated v-model:value="activeTab" @update:value="handleTabChange">
          <NTabPane name="post" tab="帖子">
            <div class="tab-placeholder">
              <NIcon size="48" :color="'rgba(255,255,255,0.3)'">
                <FileTextIcon />
              </NIcon>
              <p>帖子搜索功能开发中...</p>
            </div>
          </NTabPane>
          <NTabPane name="circle" tab="兴趣圈">
            <CircleList
              :circles="circles"
              :loading="loading"
              :has-more="hasMore"
              @load-more="loadMore"
            />
          </NTabPane>
          <NTabPane name="user" tab="用户">
            <div class="tab-placeholder">
              <NIcon size="48" :color="'rgba(255,255,255,0.3)'">
                <UserIcon />
              </NIcon>
              <p>用户搜索功能开发中...</p>
            </div>
          </NTabPane>
        </NTabs>
      </div>
    </div>

    <!-- 右侧信息栏 -->
    <RightSidebar />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NTabs,NDivider, NTabPane, NIcon, useMessage } from 'naive-ui'
import { FileText as FileTextIcon, User as UserIcon } from '@vicons/tabler'
import AppHeader from '@/components/AppHeader.vue'
import SideNav from '@/components/SideNav.vue'
import RightSidebar from '@/components/RightSidebar.vue'
import CircleList from '@/components/CircleList.vue'
import { searchCircles } from '@/api/circle'
import { auth } from '@/utils/auth'

const route = useRoute()
const router = useRouter()
const message = useMessage()

// 搜索关键词
const keyword = ref('')

// 当前激活的 tab
const activeTab = ref('circle')

// 兴趣圈列表数据
const circles = ref([])
const loading = ref(false)
const hasMore = ref(false)
const searchAfter = ref(null)
const pageSize = 20

// 初始化
onMounted(() => {
  // 检查登录状态
  if (!auth.isAuthenticated()) {
    message.warning('请先登录')
    router.push('/')
    return
  }

  // 获取搜索关键词
  keyword.value = route.query.q || ''
  if (!keyword.value) {
    message.warning('请输入搜索关键词')
    router.push('/home')
    return
  }

  // 执行搜索
  searchCirclesData()
})

// 监听路由变化
watch(() => route.query.q, (newKeyword) => {
  if (newKeyword && newKeyword !== keyword.value) {
    keyword.value = newKeyword
    resetSearch()
    searchCirclesData()
  }
})

// 切换 tab
const handleTabChange = (value) => {
  activeTab.value = value
  // 目前只有兴趣圈搜索，其他 tab 显示占位符
}

// 重置搜索状态
const resetSearch = () => {
  circles.value = []
  searchAfter.value = null
  hasMore.value = false
}

// 搜索兴趣圈数据
const searchCirclesData = async () => {
  if (loading.value) return

  loading.value = true
  try {
    const params = {
      keyword: keyword.value,
      size: pageSize
    }

    if (searchAfter.value) {
      params.search_after = JSON.stringify(searchAfter.value)
    }

    const response = await searchCircles(params)

    if (response.code === 200 && response.data) {
      const newCircles = response.data.circles || []

      if (searchAfter.value) {
        // 加载更多，追加数据
        circles.value = [...circles.value, ...newCircles]
      } else {
        // 首次加载或新搜索
        circles.value = newCircles
      }

      // 更新 search_after
      if (response.data.search_after) {
        try {
          searchAfter.value = JSON.parse(response.data.search_after)
          hasMore.value = true
        } catch (e) {
          console.error('解析 search_after 失败:', e)
          hasMore.value = false
        }
      } else {
        hasMore.value = false
      }
    } else {
      message.error(response.message || '搜索失败')
    }
  } catch (error) {
    console.error('搜索兴趣圈失败:', error)
    message.error('搜索失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 加载更多
const loadMore = () => {
  if (!loading.value && hasMore.value) {
    searchCirclesData()
  }
}
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  position: relative;
}

.main-content {
  margin-left: 260px;
  margin-right: 384px;
  margin-top: 64px;
  padding: 24px;
  min-height: calc(100vh - 64px);
  transition: margin-left 0.3s ease, margin-right 0.3s ease;
}

.search-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

.search-header {
  margin-bottom: 24px;
  padding: 20px 24px;
  background: rgba(30, 30, 46, 0.6);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.search-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-title {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ec4899 0%, #a855f7 25%, #3b82f6 50%, #06b6d4 75%, #22c55e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
}

.search-keyword {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
  margin: 0;
}

.tab-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 1rem;
}

.tab-placeholder p {
  margin-top: 16px;
}

/* 响应式 */
@media (max-width: 1200px) {
  .main-content {
    margin-right: 24px;
  }
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    margin-right: 0;
    padding: 16px;
  }

  .search-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}

/* NaiveUI 组件样式覆盖 */
:deep(.n-tabs) {
  --n-color-segment: rgba(255, 255, 255, 0.05) !important;
}

:deep(.n-tab-pane) {
  padding: 16px 0 0 0 !important;
}
</style>
