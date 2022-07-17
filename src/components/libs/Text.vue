<script setup lang="ts">
import { ITextBasicType } from '@/config'
import { useFontStyle, usePositionStyle, useStyle } from '@/utils/style'

interface ITextProps {
  direction?: 'row' | 'column'
  basic: ITextBasicType
  font: IFont
  position?: IPosition
}
const { basic, font, position } = defineProps<ITextProps>()

const style = $computed(() =>
  useStyle({
    ...usePositionStyle(position),
    ...useFontStyle(font),
  })
)

</script>

<template>
  <div class="text" :style="style">
    {{ basic.text }}
  </div>
</template>

<style scoped>
.text {
  display: inline-flex;
  word-wrap: break-word;
  white-space: pre-wrap;
}
</style>
