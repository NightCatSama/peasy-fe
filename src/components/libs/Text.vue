<script setup lang="ts">
import { usePositionStyle, useStyle } from '@/utils/style'

interface ITextProps {
  color: string
  text: string
  position?: IPosition
}
const { color, text, position } = defineProps<ITextProps>()

const style = $computed(() => useStyle({
  color,
  ...usePositionStyle(position),
}))
</script>

<template>
  <div class="text" :style="style">{{ text }}</div>
</template>

<style scoped>
.text {
  display: inline-flex;
  word-wrap: break-word;
  white-space: pre-wrap;
}
</style>
