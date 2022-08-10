<script setup lang="ts">
interface ILogoProps {
  size?: number
}

const { size } = defineProps<ILogoProps>()

</script>

<template>
  <div
    :class="['logo']"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <div class="logo-inner">
      <div class="logo-inner-inner"></div>
    </div>
  </div>
</template>

<style lang="scss">
$bg1: $panel-content;
$bg2: $panel-light;
$bg3: lighten($panel-light, 15%);
$bg1-gradient: linear-gradient(135deg, lighten($bg1, 15%), $bg1);
$bg2-gradient: linear-gradient(135deg, lighten($bg2, 25%), $bg2);
$bg3-gradient: linear-gradient(135deg, lighten($bg3, 35%), $bg3);
.logo {
  position: relative;
  border-radius: 50%;
  background: $bg1-gradient;

  &-inner {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-66.6%, -66.6%);
    transform-origin: right bottom;
    background: $bg2-gradient;
    width: 66.6%;
    height: 66.6%;
    border-radius: 50%;

    &-inner {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-66.6%, -66.6%);
      transform-origin: right bottom;
      background: $bg3-gradient;
      width: 66.6%;
      height: 66.6%;
      border-radius: 50%;
    }
  }
}
</style>
