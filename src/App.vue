<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { useRoute } from 'vue-router';
import { $t } from './constants/i18n';
import { pinia } from './stores';
import { useUserStore } from './stores/user'
import { AlertError } from './utils/alert';
import { logtoMeApi, persistToken } from './utils/mande'

let isReady = $ref(false)

const route = useRoute()

onBeforeMount(async () => {
  // 先获取 token
  await persistToken()
  isReady = true

  if (['zh', 'en'].includes(route.query?.lang as string)) {
    localStorage.setItem('lang', route.query?.lang as 'zh' | 'en')
  }

  // 再获取用户信息
  useUserStore().fetchUserInfo()
})

pinia.use(({ store }) => {
  store.$onAction(({ onError }) => {
    onError((error: any) => {
      AlertError(error?.body?.message || error?.message || error?.msg || $t('unknownError'))
    })
  })
})
</script>

<template>
  <router-view v-if="isReady"></router-view>
</template>

<style lang="scss">
@import '@/styles/animation.scss';
@import '@/styles/tooltip.scss';

#app {
  font-family: $font-family;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
