<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script setup lang="ts">
import { useAttrs } from 'vue'
import { IProps, useProps } from './hooks/common'

interface IData {
  text: string
  height: number
}

const { elem, style, props, tagClassNames } = useProps(useAttrs() as unknown as IProps<'Test'>)

const data: IData = props.data
</script>

<template>
  <div
    class="test"
    :style="style"
    v-bind="{
      ...props.inheritAttrs,
    }"
  >
    <div class="text" :style="{ height: data.height }">{{ data.text }}</div>
    <div class="container">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss">
.test {
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: column;

  .text {
    height: 32px;
    width: 100%;
    background-color: skyblue;
  }

  .container {
    flex: 1;
    background-color: pink;
  }
}
</style>
