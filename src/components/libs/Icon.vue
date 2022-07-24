<script setup lang="ts">
import { useStyle, useIconBasicStyle, useBorderStyle, useSpacingStyle } from '@/utils/style'
import { watch } from 'vue'

interface IBlockProps {
  direction?: 'row' | 'column'
  basic: IIconBasicType
  spacing: ISpacing
  border: IBorder
}

const { basic, border, direction, spacing } = defineProps<IBlockProps>()

const style = $computed(() =>
  useStyle({
    ...useIconBasicStyle(basic),
    ...useBorderStyle(border),
    ...useSpacingStyle(spacing),
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
</script>

<template>
  <div class="fa-icon">
    <i
      :class="['fa', `${basic.prefixClass || ''}${basic.name}`, `${basic?.extraClass || ''}`]"
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
