<script setup lang="ts">
import { $t } from '@/constants/i18n'
import { useHandleSignInCallback } from '@logto/vue'

const { isLoading } = useHandleSignInCallback(() => {
  const href = sessionStorage.getItem('redirect')
  // 完成时跳转至根路由
  location.href = href || '/'
})
</script>

<template>
  <!-- 当登录认证尚未完成时 -->
  <p v-if="isLoading">{{ $t('redirectLoading') }}</p>
</template>
