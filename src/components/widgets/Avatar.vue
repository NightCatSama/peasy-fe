<script setup lang="ts">
interface IAvatarProps {
  image?: string
  size?: number
}
const { image = 'https://avatars.githubusercontent.com/u/13888962?v=4', size = 24 } = defineProps<IAvatarProps>()
</script>

<template>
  <div class="avatar" :style="{ backgroundImage: `url(${image})`, width: `${size}px`, height: `${size}px` }" />
</template>

<style lang="scss" scoped>
.avatar {
  border-radius: 200px;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
}
</style>
