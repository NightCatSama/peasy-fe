<script setup lang="ts">
import { Alert } from '@/utils/alert';

// interface IGlobalSettingPanelListProps {
// }

// const {} = defineProps<IGlobalSettingPanelListProps>()
</script>

<template>
  <div :class="['global-setting-panel']">
  </div>
</template>

<style lang="scss">
.global-setting-panel {
  width: $global-setting-panel-width;
  min-height: 300px;
  border-radius: $normal-radius;
  z-index: $global-setting-panel-zIndex;
  background: $panel-sidebar-gradient;
  box-shadow: $shadow;
}
</style>
