<script setup lang="ts">
import Vue3DraggableResizable from 'vue3-draggable-resizable'
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useDisplayStore } from '@/stores/display'
import Icon from './widgets/Icon.vue'
import { emitter } from '@/utils/event'

const pageStore = usePageStore()
const { pageData, activeNode } = storeToRefs(pageStore)

const displayStore = useDisplayStore()
const { setDevice, setDeviceByParent } = displayStore
const { device } = storeToRefs(displayStore)

let x = $ref(0)
let y = $ref(0)
let w = $ref(0)
let h = $ref(0)
let active = $ref(false)
/** 是否重新定位中 */
let focusing = $ref(false)

const wrapperRef = ref<HTMLDivElement | null>(null)
const contentRef = ref<HTMLDivElement | null>(null)

const wrapperSize = reactive({
  width: 0,
  height: 0,
})

let MutationObserver = window.MutationObserver
let observer = new MutationObserver(() => {
  const rect = contentRef.value?.getBoundingClientRect()
  const [preW, preH] = [w, h]
  w = rect?.width || 0
  h = rect?.height || 0

  if (!w || !h) return

  if (preW === 0 || preH === 0) {
    if (w < wrapperSize.width) {
      x = (wrapperSize.width - w) / 2
    }
    if (y < wrapperSize.height) {
      y = (wrapperSize.height - h) / 2
    }
  }
})

const setWrapperSize = () => {
  wrapperSize.width = wrapperRef.value?.clientWidth || 0
  wrapperSize.height = wrapperRef.value?.clientHeight || 0
}

onMounted(() => {
  setWrapperSize()
  setDeviceByParent(wrapperSize.width)
  observer.observe(contentRef.value!, {
    attributes: true,
    childList: true,
    subtree: true,
  })
  window.addEventListener('resize', setWrapperSize, false)
})

onUnmounted(() => {
  window.removeEventListener('resize', setWrapperSize)
})

const editContentStyle = $computed(() => {
  return {
    width: `${device.value.width}px`,
    // minHeight: `${device.value.height}px`,
    transform: `scale(${device.value.zoom})`,
  }
})

const noPageData = $computed(() => {
  return pageData.value.length === 0
})

const handleFocusView = () => {
  const { width, height } = wrapperSize
  x = (width - w) / 2
  y = h < height ? (height - h) / 2 : 0

  focusing = true

  setTimeout(() => {
    focusing = false
  }, 300)
}

emitter.on('location', handleFocusView)
</script>

<template>
  <div ref="wrapperRef" class="edit-section">
    <div class="edit-wrapper">
      <Vue3DraggableResizable
        :min-w="0"
        :min-h="0"
        v-model:x="x"
        v-model:y="y"
        v-model:w="w"
        v-model:h="h"
        v-model:active="active"
        :draggable="!noPageData && !focusing"
        :resizable="false"
        :parent="false"
        :style="{ border: 'none' }"
        :class="{ focusing }"
      >
        <div ref="contentRef" class="edit-content" :style="editContentStyle">
          <slot></slot>
        </div>
      </Vue3DraggableResizable>
      <div class="no-data" v-if="noPageData">TODO: 没有数据，提示左侧「+」</div>
      <Icon class="focus-btn" name="focus" :size="32" @click="handleFocusView"></Icon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.edit-section {
  position: relative;
  flex: 1;
  height: 100%;
  overflow: hidden;

  .edit-wrapper {
    width: 100%;
    height: 100%;
    overflow: auto;
    position: relative;

    .edit-content {
      position: relative;
      display: flex;
      flex-direction: column;
      overflow: auto;
      transform-origin: left top;
    }
  }

  .no-data {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px;
    color: $panel-light;
  }

  .focus-btn {
    position: absolute;
    right: 20px;
    bottom: 20px;
    opacity: 0.6;
    transition: all 0.3s;

    &:hover {
      opacity: 1;
    }
  }
}
.focusing {
  transition: all 300ms ease-in-out;
}
</style>
