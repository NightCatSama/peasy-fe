<script setup lang="ts">
import { lang } from '@/constants/i18n';
import Icon from './Icon.vue'

interface ITipProps {
  type: 'warning'
  block?: boolean
  message: string
  messageEn?: string
}

const { type, message, messageEn, block } = defineProps<ITipProps>()

const iconMap = {
  warning: 'warning',
} as any

const showMsg = $computed(() => lang === 'en' && messageEn || message)
</script>

<template>
  <div :class="['tip', `tip-${type}`, { block }]">
    <Icon class="tip-icon" :name="iconMap[type]" :size="14"></Icon>
    <div class="tip-msg" v-html="showMsg"></div>
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

  &.block {
    width: 100%;
  }

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
