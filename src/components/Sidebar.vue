<script setup lang="ts">
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'
import Avatar from './widgets/Avatar.vue';

const pageStore = usePageStore()
const { activeConfigData } = storeToRefs(pageStore)

</script>

<template>
  <div class="sidebar">
    <div class="logo">
      <Avatar :size="36" />
    </div>
    <div class="operator-panel">
      <div class="operator-item">
        ＋
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sidebar {
  width: 60px;
  flex-shrink: 0;
  background-color: $panel-sidebar;
  display: flex;
  flex-direction: column;
  align-items: center;

  .logo {
    height: $header-height;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
