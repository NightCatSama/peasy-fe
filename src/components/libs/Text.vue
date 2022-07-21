<script setup lang="ts">
import { ITextBasicType } from '@/config'
import {
  useBackgroundStyle,
  useBorderStyle,
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
  // position?: IPosition
}
const { basic, font, spacing, border, background } = defineProps<ITextProps>()

const style = $computed(() =>
  useStyle({
    // ...usePositionStyle(position),
    ...useFontStyle(font),
    ...useSpacingStyle(spacing),
    ...useBorderStyle(border),
    ...useBackgroundStyle(background),
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
