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
useEffectStyle,
} from './style'
import { useEvent } from './event'
import { onBeforeMount, onMounted, ref, watchEffect } from 'vue'
import { useAnimation } from './animation';
import type { PageNode } from '@/config';
import { useEffect } from './effect';

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
  effect: IEffect
  animation: IAnimation
}

const { size, layout, border, direction, spacing, background, container, position, event, effect, animation } =
  defineProps<IBlockProps>()

const elem = ref<HTMLDivElement | null>(null)
useEvent(event, elem)

const { animationMap } = useAnimation(animation, elem, position)

const { className } = useEffect(effect)

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
    ...useEffectStyle(effect),
  })
)

</script>

<template>
  <div ref="elem" :class="['block', className]" :style="style">
    <slot></slot>
  </div>
</template>

<style scoped>
.block {}
</style>
