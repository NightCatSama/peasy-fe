<script setup lang="ts">
import { useAttrs } from 'vue'
import { IProps, useProps } from './hooks/common';

const { elem, uName, style, props } = useProps(useAttrs() as unknown as IProps<'Block'>, 'Block')

const classNames = $computed(() => ['block', uName])
</script>

<template>
  <div ref="elem" :class="classNames" :style="style" :id="uName">
    <slot></slot>
  </div>
</template>

<style scoped>
.block {}
</style>
