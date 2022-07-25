<script setup lang="ts">
import {
  useStyle,
  useSizeStyle,
  useBorderStyle,
  usePositionStyle,
  useSpacingStyle,
  useContainerStyle,
  useImageBasicStyle,
} from './style'
import { ref } from 'vue'
import { useEvent } from './event'

interface IImageProps {
  direction?: 'row' | 'column'
  basic: IImageBasicType
  position: IPosition
  size: ISize
  spacing: ISpacing
  border: IBorder
  container: IContainer
  event: IEvent
}

const { basic, size, border, direction, spacing, container, position, event } =
  defineProps<IImageProps>()

const style = $computed(() =>
  useStyle({
    ...useImageBasicStyle(basic),
    ...useSizeStyle(size, direction),
    ...useBorderStyle(border),
    ...useSpacingStyle(spacing),
    ...useContainerStyle(container),
    ...usePositionStyle(position),
  })
)

const src = $computed(() => basic.src.trim() || '')

const elem = ref<HTMLDivElement | null>(null)
useEvent(event, elem)
</script>

<template>
  <img ref="elem" :class="['image', { 'no-image': !basic.src }]" :style="style" :src="src" />
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
