<script setup lang="ts">
import { onBeforeMount, provide } from 'vue'
import { useRoute } from 'vue-router';
import { $t } from './constants/i18n';
import { pinia } from './stores';
import { useUserStore } from './stores/user'
import { AlertError } from './utils/alert';
import { logtoMeApi, persistToken } from './utils/mande'
import Icon from './components/widgets/Icon.vue';
import { emitter } from './utils/event';

let isReady = $ref(false)

const route = useRoute()
const userStore = useUserStore()
const { fetchUserInfo, clearUserInfo } = userStore

let showGlobalLoading = $ref(false)
let globalLoadingText = $ref('')

onBeforeMount(async () => {
  // 先获取 token
  const { token } = await persistToken()
  isReady = true

  if (['zh', 'en'].includes(route.query?.lang as string)) {
    localStorage.setItem('lang', route.query?.lang as 'zh' | 'en')
  }

  // 再获取用户信息
  if (token) {
    try {
      fetchUserInfo()
    } catch(e) {
      clearUserInfo()
    }
  }
})

pinia.use(({ store }) => {
  store.$onAction(({ onError }) => {
    onError((error: any) => {
      AlertError(error?.body?.message || error?.message || error?.msg || $t('unknownError'))
    })
  })
})

provide('globalLoading', {
  setGlobalLoading: (text: string) => {
    showGlobalLoading = true
    globalLoadingText = text
    return () => {
      showGlobalLoading = false
      globalLoadingText = ''
    }
  },
})
</script>

<template>
  <router-view v-if="isReady"></router-view>
  <div class="global-loading" v-if="showGlobalLoading">
    <Icon name="spin" :size="66" loading></Icon>
    <div class="global-loading-text">{{ globalLoadingText }}</div>
  </div>
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

<style lang="scss" scoped>
.global-loading {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  overflow: auto;
  pointer-events: none;
  z-index: $global-loading-zIndex;
  background-color: $panel-dark;
  opacity: .95;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  animation: rainbow 10s infinite alternate-reverse;

  &-text {
    margin-top: 10px;
  }
}
</style>
