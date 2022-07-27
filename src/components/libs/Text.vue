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
import { ref } from 'vue'
import { useEvent } from './event'
import { useAnimation } from './animation';
import { useEffect } from './effect';

interface ITextProps {
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
const { basic, font, spacing, border, background, container, position, event, effect, animation } =
  defineProps<ITextProps>()

const elem = ref<HTMLDivElement | null>(null)
useEvent(event, elem)

const { animationMap } = useAnimation(animation, elem, position)
const { className } = useEffect(effect)

const style = $computed(() =>
  useStyle({
    ...useFontStyle(font),
    ...useSpacingStyle(spacing),
    ...useBorderStyle(border),
    ...useBackgroundStyle(background),
    ...useContainerStyle(container),
    ...usePositionStyle(position),
    ...useAnimationStyle(animationMap),
    ...useEffectStyle(effect)
  })
)


</script>

<template>
  <div ref="elem" class="text" :style="style" :class="className">{{ basic.text }}</div>
</template>

<style scoped>
.text {
  display: inline-flex;
  word-wrap: break-word;
  white-space: pre-wrap;
}
</style>
