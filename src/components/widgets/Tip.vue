<script setup lang="ts">
import Icon from './Icon.vue'

interface ITipProps {
  type: 'warning'
  message: string
}

const { type, message } = defineProps<ITipProps>()

const iconMap = {
  warning: 'warning',
} as any
</script>

<template>
  <div :class="['tip', `tip-${type}`]">
    <Icon class="tip-icon" :name="iconMap[type]" :size="14"></Icon>
    <div class="tip-msg" v-html="message"></div>
  </div>
</template>

<style lang="scss" scoped>
.tip {
  padding: 6px 8px;
  border-radius: $normal-radius;
  font-size: 12px;
  background: $bg-default;
  display: flex;
  align-items: flex-start;

  &-icon {
    color: lighten($theme, 20%);
    flex-shrink: 0;
    margin-right: 6px;
  }

  &-msg {
    flex: 1;
    padding: 2px 0 0;
    color: darken($color, 40%);
    white-space: wrap;
    line-height: 1.6;
  }

  :deep(a) {
    color: lighten($theme, 25%);
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
