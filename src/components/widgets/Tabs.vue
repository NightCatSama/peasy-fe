<script lang="ts">
export interface ITabItem {
  key: string
  value: string
}
</script>

<script setup lang="ts">
interface ITabsProps {
  data: { [key: string]: string } | string[] | ITabItem[]
  activeKey: string
}
const { data, activeKey } = defineProps<ITabsProps>()

const list: ITabItem[] = $computed(() => {
  if (Array.isArray(data)) {
    return data.map((item: string | ITabItem) =>
      typeof item === 'string' ? { key: item, value: item } : item
    )
  } else {
    return Object.keys(data).map((key: string) => ({ key, value: data[key] }))
  }
})
</script>

<template>
  <div class="tabs">
    <div
      v-for="item in list"
      :key="item.key"
      :class="['tab-item', { active: activeKey === item.key }]"
      @click="$emit('change', item.key)"
    >
      <slot name="option" :key="item.key" :value="item.value">{{ item.value }}</slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tabs {
  flex: 1;
  display: flex;
  min-height: 36px;
  padding: 4px;
  border-radius: $normal-radius;
  border: 1px solid rgba($panel-light, 0.5);

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
