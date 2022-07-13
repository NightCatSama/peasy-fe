<script setup lang="ts">
import { usePositionStyle } from '@/utils/style'
import { inject } from 'vue'

interface ITextProps {
  color: string
  text: string
  position?: IPosition
}
const { color, text, position } = defineProps<ITextProps>()

const isEditMode = !!inject('isEditMode')

const style = $computed(() => ({
  color,
  ...usePositionStyle(position, isEditMode),
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
