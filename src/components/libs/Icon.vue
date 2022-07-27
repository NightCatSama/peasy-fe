<script setup lang="ts">
import {
  useStyle,
  useIconBasicStyle,
  useBorderStyle,
  useSpacingStyle,
  usePositionStyle,
useEffectStyle,
} from './style'
import { ref, watch } from 'vue'
import { useEvent } from './event'
import { useEffect } from './effect';

interface IBlockProps {
  direction?: 'row' | 'column'
  basic: IIconBasicType
  spacing: ISpacing
  border: IBorder
  event: IEvent
  effect: IEffect
}

const { basic, border, direction, spacing, event, effect } = defineProps<IBlockProps>()

const { className } = useEffect(effect)

const style = $computed(() =>
  useStyle({
    ...useIconBasicStyle(basic),
    ...useBorderStyle(border),
    ...useSpacingStyle(spacing),
    ...useEffectStyle(effect),
  })
)

let styleElem = $ref<HTMLLinkElement | null>(null)

watch(
  () => basic.styleLink,
  () => {
    if (styleElem) {
      document.body.removeChild(styleElem)
      styleElem = null
    }
    if (basic.styleLink) {
      styleElem = document.createElement('link')
      styleElem.rel = 'stylesheet'
      styleElem.href = basic.styleLink
      document.body.appendChild(styleElem)
    }
  },
  { immediate: true }
)

const elem = ref<HTMLDivElement | null>(null)
useEvent(event, elem)
</script>

<template>
  <div :class="['fa-icon']">
    <i
      :class="['fa', `${basic.prefixClass || ''}${basic.name}`, `${basic?.extraClass || ''}`, className]"
      :style="style"
    />
  </div>
</template>

<style lang="scss" scoped>
.fa-icon {
  display: inline-flex;

  .fa {
    font-style: normal;
  }
}
</style>
