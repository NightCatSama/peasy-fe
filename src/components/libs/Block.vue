<script setup lang="ts">
import { useBoxStyle, useContainerStyle, useLayoutStyle, usePositionStyle } from '@/utils/style'

interface IBlockProps {
  position: IPosition
  box: IBox
  layout: ILayout
  container: IContainer
}

const { position, box, layout, container } = defineProps<IBlockProps>()

const style = $computed(() => ({
  ...usePositionStyle(position),
  ...useBoxStyle(box),
  ...useLayoutStyle(layout),
  ...useContainerStyle(container),
}))
</script>

<template>
  <div :style="style"><slot></slot></div>
</template>

<style scoped></style>
