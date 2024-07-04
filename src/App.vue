<script setup lang="ts">
import { onBeforeMount, provide } from 'vue'
import { useRoute } from 'vue-router';
import { $t } from './constants/i18n';
import { pinia } from './stores';
import { useUserStore } from './stores/user'
import { AlertError } from './utils/alert';
import { logtoMeApi, persistToken } from './utils/mande'
import Icon from './components/widgets/Icon.vue';
import { onMounted } from 'vue';

let isReady = $ref(false)

const route = useRoute()
const userStore = useUserStore()
const { setAccessToken, fetchUserInfo, clearUserInfo } = userStore

let showGlobalLoading = $ref(false)
let globalLoadingText = $ref('')

onBeforeMount(async () => {
  if (/windows|win32/i.test(navigator.userAgent)) {
    document.body.classList.add('windows')
  }

  // 先获取 token
  const token = persistToken()

  isReady = true

  if (['zh', 'en'].includes(route.query?.lang as string)) {
    localStorage.setItem('lang', route.query?.lang as 'zh' | 'en')
  }

  // 再获取用户信息
  if (token) {
    try {
      setAccessToken(token)
      fetchUserInfo()
    } catch(e) {
      clearUserInfo()
    }
  }
})

onMounted(() => {
  window.addEventListener('storage', async (e) => {
    if (e.key === 'access_token') {
      const token = persistToken()
      if (token) {
        setAccessToken(token)
        fetchUserInfo()
      }
    }
  })
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

<style lang="scss">
.windows {
  // 滚动条的宽度
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    background-color: $tr;
  }
  // 滚动条的滑块
  ::-webkit-scrollbar-thumb {
    background-color: rgba($white, 30%);
    border-radius: 3px;
  }
  // 滚动条
  ::-webkit-scrollbar {
    width:8px;
    height:8px;
    background-color: $tr;
  }
  ::-webkit-scrollbar-button, ::-webkit-scrollbar-track-piece, ::-webkit-scrollbar-track, ::-webkit-scrollbar-corner {
    background-color: $tr;
  }
}
</style>
