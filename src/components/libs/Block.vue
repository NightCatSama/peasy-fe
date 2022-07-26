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
useAnimationStyle,
} from './style'
import { useEvent } from './event'
import { onBeforeMount, onMounted, ref, watchEffect } from 'vue'
import { useAnimation } from './animation';
import type { PageNode } from '@/config';

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
  animation: IAnimation
}

const { size, layout, border, direction, spacing, background, container, position, event, animation } =
  defineProps<IBlockProps>()

const elem = ref<HTMLDivElement | null>(null)
useEvent(event, elem)

const { animationMap } = useAnimation(animation, elem)

const style = $computed(() =>
  useStyle({
    ...useSizeStyle(size, direction),
    ...useLayoutStyle(layout),
    ...useBorderStyle(border),
    ...useSpacingStyle(spacing),
    ...useBackgroundStyle(background),
    ...useContainerStyle(container),
    ...usePositionStyle(position),
    ...useAnimationStyle(animationMap),
  })
)

</script>

<template>
  <div ref="elem" :class="'block'" :style="style">
    <slot></slot>
  </div>
</template>

<style scoped>
.block {}
</style>
