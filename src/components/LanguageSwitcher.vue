<template>
  <NDropdown :options="languageOptions" @select="handleLanguageChange">
    <NButton quaternary circle size="small">
      <template #icon>
        <NIcon size="18">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </NIcon>
      </template>
    </NButton>
  </NDropdown>
</template>

<script setup>
import { computed } from 'vue'
import { NButton, NDropdown, NIcon, useMessage } from 'naive-ui'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const message = useMessage()

const languageOptions = computed(() => [
  {
    label: '简体中文',
    key: 'zh-CN',
    disabled: locale.value === 'zh-CN'
  },
  {
    label: 'English',
    key: 'en-US',
    disabled: locale.value === 'en-US'
  }
])

const handleLanguageChange = (lang) => {
  locale.value = lang
  localStorage.setItem('quba_locale', lang)
  message.success(lang === 'zh-CN' ? '已切换至中文' : 'Switched to English')
}
</script>
