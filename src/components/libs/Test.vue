<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { IProps, useProps } from './hooks/common'

const { elem, uName, style, props, tagClassNames } = useProps(
  useAttrs() as unknown as IProps<'Test'>
)

const { custom } = props
</script>

<template>
  <div class="test" :style="style">{{ custom.text }}</div>
</template>

<style lang="scss" scoped>
.test {
  width: 200px;
  height: 200px;
  background-color: pink;
}
</style>
