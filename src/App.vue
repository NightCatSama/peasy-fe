<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { $t } from './constants/i18n';
import { pinia } from './stores';
import { useUserStore } from './stores/user'
import { AlertError } from './utils/alert';
import { logtoMeApi, persistToken } from './utils/mande'

let isReady = $ref(false)

onBeforeMount(async () => {
  // 先获取 token
  const { userInfo } = await persistToken()
  isReady = true

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
@import '@/styles/draggable.scss';
@import '@/styles/page.scss';
@import '@/styles/animation.scss';
@import '@/styles/tooltip.scss';
@import '@/styles/moveable.scss';

#app {
  font-family: $font-family;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
