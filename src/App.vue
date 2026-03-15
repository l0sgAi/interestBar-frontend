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
import { computed } from 'vue'
import { darkTheme, zhCN, enUS } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { NConfigProvider, NGlobalStyle, NMessageProvider, NDialogProvider } from 'naive-ui'

const { locale } = useI18n()

// Naive UI 组件国际化
const naiveUILocale = computed(() => locale.value === 'zh-CN' ? zhCN : enUS)
</script>

<style>
/* 全局样式已在 assets/main.css 中定义 */
</style>
