<script setup lang="ts">
import {
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
}
const { basic, font, spacing, border, background, container, position, event } =
  defineProps<ITextProps>()

const style = $computed(() =>
  useStyle({
    ...useFontStyle(font),
    ...useSpacingStyle(spacing),
    ...useBorderStyle(border),
    ...useBackgroundStyle(background),
    ...useContainerStyle(container),
    ...usePositionStyle(position),
  })
)

const elem = ref<HTMLDivElement | null>(null)
useEvent(event, elem)
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
