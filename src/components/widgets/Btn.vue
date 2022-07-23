<script setup lang="ts">
import Icon from './Icon.vue'

interface IBtnProps {
  text: string
  size?: 'md' | 'sm'
  type?: 'text' | 'btn'
  color?: 'primary' | 'default'
  icon?: InstanceType<typeof Icon>['name']
  disabled?: boolean
}
const {
  text,
  size = 'md',
  type = 'btn',
  color = 'primary',
  icon,
  disabled,
} = defineProps<IBtnProps>()
</script>

<template>
  <div :class="['btn', `size-${size}`, `${color}`, `btn-type-${type}`, { disabled }]" role="button">
    <Icon v-if="icon" class="btn-icon" :name="icon" :size="12"></Icon>
    <div class="text">{{ text }}</div>
  </div>
</template>

<style lang="scss" scoped>
.btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    user-select: none;
  }

  &-icon {
    margin-right: 4px;
  }

  &-type-text {
    &.primary {
      color: $theme;

      &:not(.disabled):hover {
        opacity: 0.8;
      }
    }

    &.default {
      color: darken($color, 10%);

      &:not(.disabled):hover {
        color: $color;
      }
    }

    &.size-md {
      padding: 4px 8px;
    }

    &.size-sm {
      font-size: 12px;
      padding: 2px 4px;
    }
  }

  &-type-btn {
    &.primary {
      color: $color;
      background: $theme-gradient;

      &:not(.disabled):hover {
        opacity: 0.8;
      }
    }

    &.size-md {
      padding: 0 32px;
      border-radius: 18px;
      font-size: 14px;
      height: 36px;
      font-weight: bold;
    }
  }
}
</style>
