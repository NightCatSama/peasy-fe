<script setup lang="ts">
import {
  useStyle,
  useSizeStyle,
  useContainerStyle,
  useLayoutStyle,
  usePositionStyle,
useSpacingStyle,
} from '@/utils/style'

interface IBlockProps {
  direction?: 'row' | 'column'
  // position: IPosition
  size: ISize
  layout: ILayout
  spacing: ISpacing
  container: IContainer
}

const { size, layout, container, direction, spacing } = defineProps<IBlockProps>()

const style = $computed(() =>
  useStyle({
    // ...usePositionStyle(position),
    ...useSizeStyle(size, direction),
    ...useLayoutStyle(layout),
    ...useContainerStyle(container),
    ...useSpacingStyle(spacing),
  })
)
</script>

<template>
  <div :class="'block'" :style="style"><slot></slot></div>
</template>

<style scoped></style>
