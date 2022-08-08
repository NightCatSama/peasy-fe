<script lang="ts">
export interface ITabItem {
  key: string
  value: string
  active?: boolean
  onClick?: (active: boolean) => any
}
</script>

<script setup lang="ts">
import Icon from './Icon.vue'
interface ITabsProps {
  data: { [key: string]: string } | string[] | ITabItem[]
  modelValue?: string
  type?: 'default' | 'float'
  iconMap?: { [key: string]: any }
}
const { data, modelValue, iconMap, type = 'default' } = defineProps<ITabsProps>()

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
  <div :class="['tabs', `tabs-type-${type}`]">
    <div
      v-for="item in list"
      :key="item.key"
      :class="['tab-item', { active: modelValue === item.key || item.active }]"
      @click="
        () => {
          $emit('update:model-value', item.key)
          item.onClick?.(!item.active)
        }
      "
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
  border-radius: $normal-radius;

  &-type-default {
    border: 1px solid rgba($panel-light, 0.5);
    padding: 4px;
    min-height: 36px;

    .tab-item {
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

  &-type-float {
    background: $color;
    padding: 3px;
    min-height: 40px;

    .tab-item {
      color: $panel-content;
      border-radius: $inner-radius;

      &:hover {
        color: $theme;
      }

      &.active {
        color: $color;
        background: $panel-gradient;
        box-shadow: $float-shadow;
      }
    }
  }

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
  }
}
</style>
