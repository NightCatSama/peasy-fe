<script setup lang="ts">
import { useStyle, useBoxStyle, useContainerStyle, useLayoutStyle, usePositionStyle } from '@/utils/style'

interface IBlockProps {
  position: IPosition
  box: IBox
  layout: ILayout
  container: IContainer
}

const { position, box, layout, container } = defineProps<IBlockProps>()

const style = $computed(() => useStyle({
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
