<template>
  <NConfigProvider :theme="darkTheme">
    <NGlobalStyle />
    <NMessageProvider>
      <NDialogProvider>
        <router-view />
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script setup>
import { darkTheme } from 'naive-ui'
import { NConfigProvider, NGlobalStyle, NMessageProvider, NDialogProvider } from 'naive-ui'
</script>

<style>
/* 全局样式已在 assets/main.css 中定义 */
</style>
