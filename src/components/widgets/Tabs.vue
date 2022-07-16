<script setup lang="ts">
interface ITabsProps {
  data: { [key: string]: string }
  activeKey: string
}
const { data, activeKey } = defineProps<ITabsProps>()
</script>

<template>
  <div class="tabs">
    <div
      class="tab-item"
      v-for="(value, key) in data"
      :key="key"
    >{{ value }}</div>
  </div>
</template>

<style lang="scss" scoped>
.tabs {
  display: flex;

  .tab-item {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
