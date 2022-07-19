<script setup lang="ts">
import {
  useStyle,
  useSizeStyle,
  useContainerStyle,
  useLayoutStyle,
  usePositionStyle,
} from '@/utils/style'

interface IBlockProps {
  direction?: 'row' | 'column'
  position: IPosition
  size: ISize
  layout: ILayout
  container: IContainer
}

const { position, size, layout, container, direction } = defineProps<IBlockProps>()

const style = $computed(() =>
  useStyle({
    ...usePositionStyle(position),
    ...useSizeStyle(size, direction),
    ...useLayoutStyle(layout),
    ...useContainerStyle(container),
  })
)
</script>

<template>
  <div :class="'block'" :style="style"><slot></slot></div>
</template>

<style scoped></style>
