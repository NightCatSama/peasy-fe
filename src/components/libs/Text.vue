<script setup lang="ts">
import {
  useBackgroundStyle,
  useBorderStyle,
  useContainerStyle,
  useFontStyle,
  usePositionStyle,
  useSpacingStyle,
  useStyle,
} from '@/utils/style'

interface ITextProps {
  direction?: 'row' | 'column'
  basic: ITextBasicType
  font: IFont
  spacing: ISpacing
  border: IBorder
  background: IBackground
  container: IContainer
  position?: IPosition
}
const { basic, font, spacing, border, background, container, position } = defineProps<ITextProps>()

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
</script>

<template>
  <div class="text" :style="style">{{ basic.text }}</div>
</template>

<style scoped>
.text {
  display: inline-flex;
  word-wrap: break-word;
  white-space: pre-wrap;
}
</style>
