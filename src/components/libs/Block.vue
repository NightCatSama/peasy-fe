<script setup lang="ts">
import {
  useStyle,
  useSizeStyle,
  useBorderStyle,
  useLayoutStyle,
  usePositionStyle,
  useSpacingStyle,
  useBackgroundStyle,
  useContainerStyle,
} from '@/utils/style'

interface IBlockProps {
  direction?: 'row' | 'column'
  // position: IPosition
  size: ISize
  layout: ILayout
  spacing: ISpacing
  border: IBorder
  background: IBackground
  container: IContainer
}

const { size, layout, border, direction, spacing, background, container } = defineProps<IBlockProps>()

const style = $computed(() =>
  useStyle({
    // ...usePositionStyle(position),
    ...useSizeStyle(size, direction),
    ...useLayoutStyle(layout),
    ...useBorderStyle(border),
    ...useSpacingStyle(spacing),
    ...useBackgroundStyle(background),
    ...useContainerStyle(container),
  })
)
</script>

<template>
  <div :class="'block'" :style="style"><slot></slot></div>
</template>

<style scoped></style>
