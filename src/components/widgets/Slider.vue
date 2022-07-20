<script setup lang="ts">
import VueSlider from 'vue-slider-component'

interface ISliderProps extends Partial<InstanceType<typeof VueSlider>> {}

const props = defineProps<ISliderProps>()
</script>

<template>
  <VueSlider tooltip="none" v-bind="props" />
</template>

<style lang="scss">
$themeColor: $theme;
$dotBgColor: $theme;
$dotShadow: none;
$dotShadowFocus: $float-shadow;
@import 'vue-slider-component/lib/theme/default.scss';

.vue-slider-dot-handle {
  border: 2px solid $color;
  background: $theme-gradient;
}
</style>
