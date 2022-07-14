<script setup lang="ts">
import Vue3DraggableResizable from 'vue3-draggable-resizable'
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'
import { onMounted, reactive, ref } from 'vue'
import { useDisplayStore } from '@/stores/display'

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

onMounted(() => {
  wrapperSize.width = wrapperRef.value?.clientWidth || 0
  wrapperSize.height = wrapperRef.value?.clientHeight || 0

  setDeviceByParent(wrapperSize.width)

  observer.observe(contentRef.value!, {
    attributes: true,
    childList: true,
    subtree: true,
  })
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
        :draggable="!noPageData"
        :resizable="false"
        :parent="false"
        :style="{ border: 'none' }"
      >
        <div ref="contentRef" class="edit-content" :style="editContentStyle">
          <slot></slot>
        </div>
      </Vue3DraggableResizable>
      <div class="no-data" v-if="noPageData">TODO: 没有数据，提示左侧「+」</div>
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
}
</style>
