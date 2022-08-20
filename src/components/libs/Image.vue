<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script setup lang="ts">
import { getIsEditMode } from '@/utils/context';
import { ref, useAttrs } from 'vue'
import { IProps, useProps } from './hooks/common'

const { elem, uName, style, props, tagClassNames } = useProps(
  useAttrs() as unknown as IProps<'Image'>,
  'Image'
)

const isEditMode = getIsEditMode()

const src = $computed(() => props.basic.src.trim() || '')

const classNames = $computed(() => [
  'image',
  uName.value,
  ...tagClassNames.value,
  { 'no-image': !props.basic.src },
])

const componentName = $computed(() => isEditMode ? 'div' : 'img')
</script>

<template>
  <component
    ref="elem"
    :is="componentName"
    :class="classNames"
    :style="style"
    :id="uName"
    :src="src"
    v-bind="props.inheritAttrs"
  />
</template>

<style lang="scss" scoped>
.image.no-image {
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9IiM4ZThlOGUiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0Ij48cGF0aCBkPSJNMjQgMjRIMFYwaDI0djI0eiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0yMSAzSDNDMiAzIDEgNCAxIDV2MTRjMCAxLjEuOSAyIDIgMmgxOGMxIDAgMi0xIDItMlY1YzAtMS0xLTItMi0yek01IDE3bDMuNS00LjUgMi41IDMuMDFMMTQuNSAxMWw0LjUgNkg1eiIvPjwvc3ZnPg==);
    background-size: 30%;
    background-position: 50%;
    background-repeat: no-repeat;
    background-color: rgba($black, 20%);
    z-index: 1;
    // box-shadow: inset 0 0 0 2px $panel;
  }
}
</style>
