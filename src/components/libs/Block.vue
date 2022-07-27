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
import { getUniqueName, PageNode } from '@/config';
import { useEffect } from './effect';

interface IBlockProps {
  componentName: string
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

const { componentName: name, size, layout, border, direction, spacing, background, container, position, event, effect, animation } =
  defineProps<IBlockProps>()

const elem = ref<HTMLDivElement | null>(null)
useEvent(event, elem)

const { animationMap } = useAnimation(animation, elem, position)

useEffect(effect, name)

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
    ...useEffectStyle(effect, name),
  })
)

const uName = $computed(() => getUniqueName(name))
const classNames = $computed(() => ['block', uName])
</script>

<template>
  <div ref="elem" :class="classNames" :style="style" :id="uName">
    <slot></slot>
  </div>
</template>

<style scoped>
.block {}
</style>
