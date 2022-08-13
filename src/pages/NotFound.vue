<script setup lang="ts">
import Btn from '@/components/widgets/Btn.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleGotoHome = () => {
  router.replace({
    name: 'home',
  })
}
</script>

<template>
  <div class="not-found-page">
    <div class="text">Page Not Found</div>
    <Btn @click="handleGotoHome">Back to Home</Btn>
  </div>
</template>

<style lang="scss" scoped>
.not-found-page {
  background: #e9e9e9;
  width: 100%;
  height: 100vh;
  font-family: $font-family;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .text {
    font-size: 30px;
    margin-bottom: 12px;
  }
}
</style>
