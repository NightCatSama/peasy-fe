<script setup lang="ts">
import {
  useStyle,
  useSizeStyle,
  useBorderStyle,
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
  border: IBorder
}

const { size, layout, border, direction, spacing } = defineProps<IBlockProps>()

const style = $computed(() =>
  useStyle({
    // ...usePositionStyle(position),
    ...useSizeStyle(size, direction),
    ...useLayoutStyle(layout),
    ...useBorderStyle(border),
    ...useSpacingStyle(spacing),
  })
)
</script>

<template>
  <div :class="'block'" :style="style"><slot></slot></div>
</template>

<style scoped>
</style>
