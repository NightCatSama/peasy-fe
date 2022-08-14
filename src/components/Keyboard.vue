<script setup lang="ts">
import { ShortcutMap } from '@/constants/shortcut'

interface IKeyboardProps {
  show: boolean
}

const { show } = defineProps<IKeyboardProps>()
</script>

<template>
  <div class="keyboard-list" v-show="show">
    <div
      class="keyboard-item"
      v-for="(map, key) in ShortcutMap"
      :key="key"
    >
      <div>{{ map.title }}：</div>
      <div class="keyboard-item-value">{{ map.value }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.keyboard-list {
  position: absolute;
  bottom: 12px;
  left: 16px;
  font-size: 12px;
  z-index: 0;
  user-select: none;
  pointer-events: none;
  z-index: 0;
  color: rgba($grey, 60%);
  .keyboard-item {
    width: 300px;
    margin-top: 4px;
    display: flex;

    &-value {
      display: inline-flex;
      text-align: right;
      font-weight: bold;
    }
  }
}
</style>
