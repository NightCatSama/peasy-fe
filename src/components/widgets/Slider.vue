<script setup lang="ts">
import VueSlider from 'vue-slider-component'

interface ISliderProps extends Partial<InstanceType<typeof VueSlider>> {
}

const props = defineProps<ISliderProps>()

</script>

<template>
  <VueSlider
    tooltip="none"
    v-bind="props"
  />
</template>

<style lang="scss">
$themeColor: $theme;
@import 'vue-slider-component/lib/theme/default.scss';
</style>
