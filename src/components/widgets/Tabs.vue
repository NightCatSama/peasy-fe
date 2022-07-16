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
      :class="['tab-item', { active: activeKey === key }]"
      v-for="(value, key) in data"
      :key="key"
      @click="$emit('change', key)"
    >{{ value }}</div>
  </div>
</template>

<style lang="scss" scoped>
.tabs {
  flex: 1;
  display: flex;
  height: 36px;
  padding: 4px;
  border-radius: $normal-radius;
  border: 1px solid rgba($panel-light, .5);

  .tab-item {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    user-select: none;

    &:hover {
      color: $theme;
    }

    &.active {
      color: $color;
      background: $panel-light-gradient;
      border-radius: $inner-radius;
    }
  }
}
</style>
