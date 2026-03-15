<template>
  <NConfigProvider :theme="darkTheme" :locale="naiveUILocale">
    <NGlobalStyle />
    <NMessageProvider>
      <NDialogProvider>
        <router-view />
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup>
import { computed, ref, provide, readonly } from 'vue'
import { darkTheme, zhCN, enUS } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { NConfigProvider, NGlobalStyle, NMessageProvider, NDialogProvider } from 'naive-ui'

const { locale } = useI18n()

// 圈子搜索状态
const circleSearchState = ref({
  id: null,
  name: '',
  avatarUrl: ''
})

// 设置圈子搜索状态
const setCircleSearch = (circle) => {
  circleSearchState.value = {
    id: circle.id,
    name: circle.name,
    avatarUrl: circle.avatar_url || ''
  }
}

// 清除圈子搜索状态
const clearCircleSearch = () => {
  circleSearchState.value = {
    id: null,
    name: '',
    avatarUrl: ''
  }
}

// 提供圈子搜索状态和方法
provide('circleSearchState', readonly(circleSearchState))
provide('setCircleSearch', setCircleSearch)
provide('clearCircleSearch', clearCircleSearch)

// Naive UI 组件国际化
const naiveUILocale = computed(() => locale.value === 'zh-CN' ? zhCN : enUS)
</script>

<style>
/* 全局样式已在 assets/main.css 中定义 */
</style>
