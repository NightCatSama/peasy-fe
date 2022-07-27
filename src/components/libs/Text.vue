<script setup lang="ts">
import {
useAnimationStyle,
  useBackgroundStyle,
  useBorderStyle,
  useContainerStyle,
  useEffectStyle,
  useFontStyle,
  usePositionStyle,
  useSpacingStyle,
  useStyle,
} from './style'
import { ref, useSlots } from 'vue'
import { useEvent } from './event'
import { useAnimation } from './animation';
import { useEffect } from './effect';
import { getUniqueName } from '@/config';

interface ITextProps {
  componentName: string
  direction?: 'row' | 'column'
  basic: ITextBasicType
  font: IFont
  spacing: ISpacing
  border: IBorder
  background: IBackground
  container: IContainer
  position: IPosition
  event: IEvent
  effect: IEffect
  animation: IAnimation
}

const { basic, font, spacing, border, background, container, position, event, effect, animation, componentName: name } =
  defineProps<ITextProps>();

const elem = ref<HTMLDivElement | null>(null)
useEvent(event, elem)

const { animationMap } = useAnimation(animation, elem, position)

useEffect(effect, name)

const style = $computed(() =>
  useStyle({
    ...useFontStyle(font),
    ...useSpacingStyle(spacing),
    ...useBorderStyle(border),
    ...useBackgroundStyle(background),
    ...useContainerStyle(container),
    ...usePositionStyle(position),
    ...useAnimationStyle(animationMap),
    ...useEffectStyle(effect, name)
  })
)

const uName = $computed(() => getUniqueName(name))
const classNames = $computed(() => ['text', uName])

</script>

<template>
  <div
    ref="elem"
    :id="uName"
    :style="style"
    :class="classNames"
  >{{ basic.text }}</div>
</template>

<style scoped>
.text {
  display: inline-flex;
  word-wrap: break-word;
  white-space: pre-wrap;
}
</style>
