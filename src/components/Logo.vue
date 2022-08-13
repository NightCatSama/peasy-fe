<script setup lang="ts">
import LogoImage from '@/assets/logo.png'

interface ILogoProps {
  size?: number
}

const { size } = defineProps<ILogoProps>()
</script>

<template>
  <img :src="LogoImage" :class="['logo']" :style="{ width: `${size}px`, height: `${size}px` }" />
</template>

<style lang="scss">
.logo {
}
</style>
