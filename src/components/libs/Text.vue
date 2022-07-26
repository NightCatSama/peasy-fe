<script setup lang="ts">
import {
useAnimationStyle,
  useBackgroundStyle,
  useBorderStyle,
  useContainerStyle,
  useFontStyle,
  usePositionStyle,
  useSpacingStyle,
  useStyle,
} from './style'
import { ref } from 'vue'
import { useEvent } from './event'
import { useAnimation } from './animation';

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
  animation: IAnimation
}
const { basic, font, spacing, border, background, container, position, event, animation } =
  defineProps<ITextProps>()

const elem = ref<HTMLDivElement | null>(null)
useEvent(event, elem)

const { animationMap } = useAnimation(animation, elem)

const style = $computed(() =>
  useStyle({
    ...useFontStyle(font),
    ...useSpacingStyle(spacing),
    ...useBorderStyle(border),
    ...useBackgroundStyle(background),
    ...useContainerStyle(container),
    ...usePositionStyle(position),
    ...useAnimationStyle(animationMap),
  })
)

</script>

<template>
  <div ref="elem" class="text" :style="style">{{ basic.text }}</div>
</template>

<style scoped>
.text {
  display: inline-flex;
  word-wrap: break-word;
  white-space: pre-wrap;
}
</style>
