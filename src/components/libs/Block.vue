<script setup lang="ts">
import {
  useStyle,
  useSizeStyle,
  useBorderStyle,
  useLayoutStyle,
  usePositionStyle,
useSpacingStyle,
useContainerStyle,
} from '@/utils/style'

interface IBlockProps {
  direction?: 'row' | 'column'
  // position: IPosition
  size: ISize
  layout: ILayout
  spacing: ISpacing
  border: IBorder
  container: IContainer
}

const { size, layout, border, direction, spacing, container } = defineProps<IBlockProps>()

const style = $computed(() =>
  useStyle({
    // ...usePositionStyle(position),
    ...useSizeStyle(size, direction),
    ...useLayoutStyle(layout),
    ...useBorderStyle(border),
    ...useSpacingStyle(spacing),
    ...useContainerStyle(container),
  })
)
</script>

<template>
  <div :class="'block'" :style="style"><slot></slot></div>
</template>

<style scoped>
</style>
