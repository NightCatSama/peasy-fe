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
import { getUniqueName } from '@/config';

interface IBlockProps {
  componentName: string
  direction?: 'row' | 'column'
  basic: IIconBasicType
  spacing: ISpacing
  border: IBorder
  event: IEvent
  effect: IEffect
}

const { componentName: name, basic, border, direction, spacing, event, effect } = defineProps<IBlockProps>()

useEffect(effect, name)

const style = $computed(() =>
  useStyle({
    ...useIconBasicStyle(basic),
    ...useBorderStyle(border),
    ...useSpacingStyle(spacing),
    ...useEffectStyle(effect, name),
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

const uName = $computed(() => getUniqueName(name))

const classNames = $computed(() => [
  'fa',
  uName,
  `${basic.prefixClass || ''}${basic.name}`,
  `${basic?.extraClass || ''}`
 ])
</script>

<template>
  <div :class="['fa-icon']">
    <i :class="classNames" :style="style" :id="uName" />
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
