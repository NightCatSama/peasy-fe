<script setup lang="ts">
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, reactive, watch, ref, watchEffect, nextTick } from 'vue'
import { useDisplayStore } from '@/stores/display'
import Icon from './widgets/Icon.vue'
import { emitter } from '@/utils/event'
import panzoom, { PanZoom } from 'panzoom'
import { useKeyPress } from 'ahooks-vue'

const pageStore = usePageStore()
const { setActiveNode } = pageStore
const { pageData, activeNode } = storeToRefs(pageStore)

const displayStore = useDisplayStore()
const { realDeviceSize, setDevice, setDeviceByParent } = displayStore
const { device } = storeToRefs(displayStore)

const wrapperRef = ref<HTMLDivElement | null>(null)
const contentRef = ref<HTMLDivElement | null>(null)

const editContentStyle = $computed(() => {
  return {
    width: `${device.value.width}px`,
    fontSize: `${device.value.fontSize}px`,
  }
})

const pz = ref<PanZoom | null>(null)
let isSmoothing = $ref(false)

const wrapperSize = reactive({
  width: 0,
  height: 0,
})

const setWrapperSize = () => {
  wrapperSize.width = wrapperRef.value?.clientWidth || 0
  wrapperSize.height = wrapperRef.value?.clientHeight || 0
}

onMounted(() => {
  setWrapperSize()
  setDeviceByParent(wrapperSize.width)
  window.addEventListener('resize', setWrapperSize, false)
  pz.value = panzoom(contentRef.value!, {
    initialZoom: device.value.zoom,
    minZoom: 0.2,
    maxZoom: 2,
    zoomSpeed: 0.2,
    zoomDoubleClickSpeed: 1,
    pinchSpeed: 40,
    smoothScroll: false,
    filterKey: () => true,
    beforeWheel: function (e) {
      var shouldIgnore = !e.ctrlKey && !e.metaKey
      return shouldIgnore
    },
  })
  pz.value.on('zoom', (e: any) => {
    device.value.zoom = e.getTransform().scale
    emitter.emit('updateMoveable')
  })
  pz.value.on('pan', () => emitter.emit('updateMoveable'))
  handleLocationPage()
})

watchEffect(() => {
  const trans = pz.value?.getTransform()
  const rect = contentRef.value?.getBoundingClientRect()
  if (trans && rect && trans?.scale !== device.value.zoom) {
    pz.value?.zoomTo(
      trans!.x + rect.width / 2,
      trans!.y + rect.height / 2,
      device.value.zoom / trans.scale
    )
  }
})

watch(pageData, () => {
  emitter.emit('updateMoveable')
}, { flush: 'post', deep: true })

onUnmounted(() => {
  window.removeEventListener('resize', setWrapperSize)
})

const noPageData = $computed(() => {
  return pageData.value.length === 0
})

/** 重置预览位置，居中显示 */
const handleLocationPage = (immediate = false) => {
  if (!contentRef.value || isSmoothing) return

  if (immediate !== true) {
    isSmoothing = true
    setTimeout(() => (isSmoothing = false), 300)
  }

  let x, y, left = 0, top = 0

  const activeElem = activeNode && document.querySelector('.lib-component.active') as HTMLDivElement

  const { width, height } = wrapperSize
  const rect = contentRef.value!.getBoundingClientRect()
  const w = rect.width
  const h = rect.height
  x = (width - w) / 2
  y = h < height ? (height - h) / 2 : 0

  // 先将页面完全居中
  immediate === true ? pz.value!.moveTo(x, y) : pz.value!.smoothMoveTo(x, y)

  if (activeElem) {
    const activeRect = activeElem.getBoundingClientRect()
    left = (activeRect.left - rect.left) - ((wrapperSize.width - activeRect.width) / 2)
    top = (activeRect.top - rect.top) - ((wrapperSize.height - activeRect.height) / 2)
  }

  wrapperRef.value?.scrollTo({
    top,
    left,
    behavior: 'smooth',
  })
}

// emitter
emitter.on('location', (immediate?: boolean) => handleLocationPage(immediate))
const hideNodePanel = (e: Event) => {
  const target = e.target as HTMLDivElement
  if (target?.classList.contains('edit-wrapper')) {
    setActiveNode()
  }
  emitter.emit('switchNodePanel', false)
}
</script>

<template>
  <div class="edit-section" v-tap="hideNodePanel">
    <div ref="wrapperRef" class="edit-wrapper">
      <div ref="contentRef" v-show="!noPageData" class="edit-content" :style="editContentStyle">
        <slot></slot>
      </div>
    </div>
    <div class="no-data" v-if="noPageData">TODO: 没有数据，提示左侧「+」</div>
    <Icon
      :class="['focus-btn']"
      name="focus"
      :size="26"
      @click="() => handleLocationPage()"
    ></Icon>
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

    &:active,
    &:focus {
      outline: none;
      border: none;
    }

    .edit-content {
      position: relative;
      display: flex;
      flex-direction: column;
      border-radius: $normal-radius;
      overflow: hidden;
      background: #fff;
      color: black;
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
    padding: 8px;
    opacity: 0.3;
    transition: all 0.3s;
    background: $panel-light;

    &:hover,
    &.active {
      opacity: 0.8;
    }
  }
}
.focusing {
  transition: all 300ms ease-in-out;
}
</style>
