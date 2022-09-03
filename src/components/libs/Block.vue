<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script setup lang="ts">
import { nextTick, useAttrs, watch } from 'vue'
import { IProps, useProps } from './hooks/common'

const { elem, uName, style, props, tagClassNames } = useProps(
  useAttrs() as unknown as IProps<'Block'>,
  'Block'
)

const classNames = $computed(() => ['block', uName.value, ...tagClassNames.value, customAttrs?.class])
const elementTag = $computed(() => props.basic?.tag || 'div')
const emit = defineEmits(['updateElem'])
const customAttrs = $computed(() => props.basic?.attrs ? Object.fromEntries(
  props.basic.attrs
    .split('\n')
    .map((str) => str.split(':'))
    .filter((arr) => arr.length === 2 && arr[0] && arr[1])
    .map(([key, value]) => {
      const name = key.trim()
      const val = value.trim()
      return [name, val.slice(-1) === ';' ? val.slice(0, -1) : val]
    })
  ) : null
)

watch(() => elementTag, () => {
  nextTick(() => emit('updateElem', elem.value))
}, { flush: 'post' })
</script>

<template>
  <component
    :is="elementTag"
    ref="elem"
    v-bind="{
      ...customAttrs,
      ...props.inheritAttrs,
    }"
    :class="classNames"
    :style="style"
    :id="uName"
    @submit.prevent
  >
    <slot></slot>
  </component>
</template>

<style scoped>
.block {
}
</style>
