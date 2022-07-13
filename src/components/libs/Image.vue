<script setup lang="ts">
interface IImageProps {
  width: number | string
  height: number | string
  src: string
}
const { width, height, src } = defineProps<IImageProps>()

const count = $ref(0)
</script>

<template>
  <img class="image" :style="{ width, height }" :src="src" />
</template>

<style scoped>
.image {
  display: flex;
  margin: 20px;
  box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.16);
}
</style>
