<script setup lang="ts">
import { useBoxStyle, useLayoutStyle, usePositionStyle } from '@/utils/style'

interface IBlockProps {
  position: IPosition
  box: IBox
  layout: ILayout
}
const { position, box, layout } = defineProps<IBlockProps>()

const style = $computed(() => ({
  ...usePositionStyle(position),
  ...useBoxStyle(box),
  ...useLayoutStyle(layout),
}))
</script>

<template>
  <div :style="style"><slot></slot></div>
</template>

<style scoped></style>
