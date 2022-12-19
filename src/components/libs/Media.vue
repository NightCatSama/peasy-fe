<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script setup lang="ts">
import { getContext } from '@/utils/context'
import { useAttrs } from 'vue'
import { IProps, useProps } from './hooks/common'

const { elem, style, props, tagClassNames } = useProps(
  useAttrs() as unknown as IProps<'Media'>,
  'Media'
)

const context = getContext()
const disabled = $computed(() => context?.isEditMode && context?.displayMode !== 'preview')
const classNames = $computed(() => ['media', ...tagClassNames.value])

const controls = $computed(() => {
  if (context?.isEditMode && context?.displayMode !== 'preview') {
    return true
  }
  return true
})

const componentName = $computed(() => {
  switch (props.basic.type) {
    case 'source':
      return `video`
    case 'youtube':
    case 'iframe':
      return 'iframe'
  }
})

const src = $computed(() => {
  switch (props.basic.type) {
    case 'youtube':
      return `https://www.youtube.com/embed/${props.basic.youtubeId}`
    case 'source':
    case 'iframe':
      return props.basic.src
  }
})

const autoplayAttrs = $computed(() => {
  if (props.basic.type === 'source' && props.basic.autoplay) {
    return {
      autoplay: true,
      muted: true,
    }
  }
  return null
})

const iframeAttrs = $computed(() => {
  if (props.basic.type === 'iframe' || props.basic.type === 'youtube') {
    return {
      scrolling: 'no',
      border: '0',
      frameborder: '0',
      framespacing: '0',
      allowfullscreen: 'true',
    }
  }
  return null
})

const componentAttrs = $computed(() => ({
  controls,
  src,
  ...autoplayAttrs,
  ...iframeAttrs,
}))
</script>

<template>
  <div
    ref="elem"
    :class="['media-wrapper', { disabled }, ...classNames]"
    :style="style"
    v-bind="props.inheritAttrs"
  >
    <component :is="componentName" v-bind="componentAttrs"></component>
  </div>
</template>

<style lang="scss">
.media-wrapper {
  > iframe,
  > video {
    width: 100%;
    height: 100%;
  }
  &.disabled {
    > iframe,
    > video {
      pointer-events: none;
    }
  }
}
</style>
