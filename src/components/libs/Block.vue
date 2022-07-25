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
import { useEvent } from './event'
import { onBeforeMount, onMounted, ref, watchEffect } from 'vue'

interface IBlockProps {
  direction?: 'row' | 'column'
  position: IPosition
  size: ISize
  layout: ILayout
  spacing: ISpacing
  border: IBorder
  background: IBackground
  container: IContainer
  event: IEvent
}

const { size, layout, border, direction, spacing, background, container, position, event } =
  defineProps<IBlockProps>()

const style = $computed(() =>
  useStyle({
    ...useSizeStyle(size, direction),
    ...useLayoutStyle(layout),
    ...useBorderStyle(border),
    ...useSpacingStyle(spacing),
    ...useBackgroundStyle(background),
    ...useContainerStyle(container),
    ...usePositionStyle(position),
  })
)

const elem = ref<HTMLDivElement | null>(null)
useEvent(event, elem)

</script>

<template>
  <div ref="elem" :class="'block'" :style="style">
    <slot></slot>
  </div>
</template>

<style scoped></style>
