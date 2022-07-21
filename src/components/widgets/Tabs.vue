<script lang="ts">
export interface ITabItem {
  key: string
  value: string
  active?: boolean
  onClick?: (active: boolean) => any
}
</script>

<script setup lang="ts">
import Icon from './Icon.vue';
interface ITabsProps {
  data: { [key: string]: string } | string[] | ITabItem[]
  modelValue?: string
  iconMap?: { [key: string]: any }
}
const { data, modelValue, iconMap } = defineProps<ITabsProps>()

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
      :class="['tab-item', { active: modelValue === item.key || item.active }]"
      @click="() => {
        $emit('update:model-value', item.key)
        item.onClick?.(!item.active)
      }"
    >
      <slot name="option" :key="item.key" :value="item.value">
        <template v-if="iconMap && iconMap[item.key]">
          <Icon :name="iconMap[item.key]" :size="16"></Icon>
        </template>
        <template v-else>{{ item.value }}</template>
      </slot>
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

    &:not(:last-child) {
      margin-right: 4px;
    }

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
