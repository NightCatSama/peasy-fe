<script setup lang="ts">
import Btn from '@/components/widgets/Btn.vue'
import { useUserStore } from '@/stores/user';
import { fixApi } from '@/utils/mande';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router'

const route = useRoute()

const userStore = useUserStore()
const { isAdmin } = storeToRefs(userStore)

const handleFix = () => {
  fixApi.get(route.params.code as string)
}
</script>

<template>
  <div class="admin-page" v-if="isAdmin">
    <Btn @click="handleFix">{{ 'fix' }}</Btn>
  </div>
</template>

<style lang="scss" scoped>
.admin-page {
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
