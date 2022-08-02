<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script setup lang="ts">
import { ref, useAttrs, watch } from 'vue'
import { IProps, useProps } from './hooks/common'

const { elem, uName, style, props, tagClassNames } = useProps(
  useAttrs() as unknown as IProps<'Icon'>,
  'Icon'
)

let styleElem = $ref<HTMLLinkElement | null>(null)

watch(
  () => props.basic.styleLink,
  () => {
    if (styleElem) {
      document.body.removeChild(styleElem)
      styleElem = null
    }
    if (props.basic.styleLink) {
      styleElem = document.createElement('link')
      styleElem.rel = 'stylesheet'
      styleElem.href = props.basic.styleLink
      document.body.appendChild(styleElem)
    }
  },
  { immediate: true }
)

const classNames = $computed(() => [
  'fa',
  uName.value,
  ...tagClassNames.value,
  `${props.basic.prefixClass || ''}${props.basic.name}`,
  `${props.basic?.extraClass || ''}`,
])
</script>

<template>
  <div :class="['fa-icon']" v-bind="props.inheritAttrs">
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
