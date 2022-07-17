<script setup lang="ts">
import { ITextBasicType } from '@/config'
import { usePositionStyle, useStyle } from '@/utils/style'

interface ITextProps {
  direction?: 'row' | 'column'
  basic: ITextBasicType
  position?: IPosition
}
const { basic, position } = defineProps<ITextProps>()

const style = $computed(() =>
  useStyle({
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
