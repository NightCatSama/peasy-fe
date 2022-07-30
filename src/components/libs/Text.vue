<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { useProps, IProps } from './hooks/common';

const { elem, uName, style, props, tagClassNames } = useProps(useAttrs() as unknown as IProps<'Text'>, 'Text')

const classNames = $computed(() => ['text', uName.value, ...tagClassNames.value])
</script>

<template>
  <div
    ref="elem"
    :id="uName"
    :style="style"
    :class="classNames"
    v-bind="props.inheritAttrs"
  >{{ props.basic.text }}</div>
</template>

<style scoped>
.text {
  display: inline-flex;
  word-wrap: break-word;
  white-space: pre-wrap;
}
</style>
