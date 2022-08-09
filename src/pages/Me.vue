<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia';
import { useLogto } from '@logto/vue';
import Btn from '@/components/widgets/Btn.vue';

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)

const { signOut, signIn, isAuthenticated } = useLogto();
const handleSignIn = () => signIn(import.meta.env.VITE_LOGTO_REDIRECT_URL)
const handleSignOut = () => signOut(import.meta.env.VITE_LOGTO_SIGN_OUT_URL)

</script>

<template>
  <div class="me-page">
    <div v-if="!isAuthenticated">
      未登录
      <Btn @click="handleSignIn">登录</Btn>
    </div>
    <div v-else>
      <div class="user-name">{{ userInfo?.username }}</div>
      <Btn @click="handleSignOut">退出登录</Btn>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.me-page {
  padding: 30px;

  .user-name {
    font-size: 24px;
    color: $yellow;
  }
}
</style>