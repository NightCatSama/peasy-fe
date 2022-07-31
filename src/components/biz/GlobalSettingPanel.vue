<script setup lang="ts">
import { Alert } from '@/utils/alert';

interface IGlobalSettingPanelListProps {
  show: boolean
}

const { show } = defineProps<IGlobalSettingPanelListProps>()
</script>

<template>
  <div :class="['global-setting-panel', { show }]">
  </div>
</template>

<style lang="scss">
.global-setting-panel {
  position: absolute;
  left: 100%;
  bottom: 0;
  width: $global-setting-panel-width;
  min-height: 300px;
  background: $panel-gradient;
  border-radius: $normal-radius;
  z-index: $global-setting-panel-zIndex;
  transform: translate(10px, 100%);
  transition: transform .3s;
  box-shadow: $shadow;
  border: 2px solid $theme;

  &.show {
    transform: translate(10px, -10px);
  }
}
</style>
