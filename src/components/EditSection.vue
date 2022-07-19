<script setup lang="ts">
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, reactive, watch, ref, watchEffect, nextTick } from 'vue'
import draggable from 'vuedraggable'

import LibComponent from '@/components/LibComponent.vue'
import { useDisplayStore } from '@/stores/display'
import Icon from './widgets/Icon.vue'
import { emitter } from '@/utils/event'
import panzoom, { PanZoom } from 'panzoom'
import { useDragStore } from '@/stores/drag'
import { SortableEvent } from 'sortablejs'
import { useSize } from 'ahooks-vue'

const pageStore = usePageStore()
const { setActiveNode, addSection } = pageStore
const { pageData, activeNode } = storeToRefs(pageStore)

const displayStore = useDisplayStore()
const { setDeviceByParent } = displayStore
const { device, displayMode } = storeToRefs(displayStore)

const dragStore = useDragStore()
const { dragNode, dragType, dragNodeType, isCancelDrag } = storeToRefs(dragStore)
const { setIsCancelDrag } = dragStore

const wrapperRef = ref<HTMLDivElement | null>(null)
const contentRef = ref<HTMLDivElement | null>(null)

const contentElem = $computed(() => (contentRef.value as any)?.$el as HTMLDivElement || null)
const editContentStyle = $computed(() => {
  return {
    width: `${device.value.width}px`,
    fontSize: `${device.value.fontSize}px`,
  }
})

const pz = ref<PanZoom | null>(null)
let isSmoothing = $ref(false)

const wrapperSize = useSize(wrapperRef, {
  onChange(size) {
    console.log('wrapperSize change => ', size)
  }
}) as { width: number; height: number }

const setWrapperSize = () => {
  wrapperSize.width = wrapperRef.value?.clientWidth || 0
  wrapperSize.height = wrapperRef.value?.clientHeight || 0
}

onMounted(() => {
  setWrapperSize()
  setDeviceByParent(wrapperSize!.width)
  window.addEventListener('resize', setWrapperSize, false)
  pz.value = panzoom(contentElem!, {
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
  const rect = contentElem?.getBoundingClientRect()
  if (trans && rect && trans?.scale !== device.value.zoom) {
    pz.value?.zoomTo(
      trans!.x + rect.width / 2,
      trans!.y + rect.height / 2,
      device.value.zoom / trans.scale
    )
  }
})

watch(
  [pageData],
  () => {
    emitter.emit('updateMoveable')
  },
  { flush: 'post', deep: true }
)

watch(
  [displayMode],
  () => {
    setTimeout(() => emitter.emit('updateMoveable'), 300)
  },
  { flush: 'post' }
)

onUnmounted(() => {
  window.removeEventListener('resize', setWrapperSize)
})

const noPageData = $computed(() => {
  return pageData.value.length === 0
})

/** 重置预览位置，居中显示 */
const handleLocationPage = (immediate = false) => {
  if (!contentElem || isSmoothing) return

  if (immediate !== true) {
    isSmoothing = true
    setTimeout(() => (isSmoothing = false), 300)
  }

  let x,
    y,
    left = 0,
    top = 0

  const activeElem =
    activeNode && (document.querySelector('.lib-component.active') as HTMLDivElement)

  const { width, height } = wrapperSize
  const rect = contentElem!.getBoundingClientRect()
  const w = rect.width
  const h = rect.height
  x = (width - w) / 2
  y = h < height ? (height - h) / 2 : 0

  // 先将页面完全居中
  immediate === true ? pz.value!.moveTo(x, y) : pz.value!.smoothMoveTo(x, y)

  if (activeElem) {
    const activeRect = activeElem.getBoundingClientRect()
    left = activeRect.left - rect.left - (wrapperSize.width - activeRect.width) / 2
    top = activeRect.top - rect.top - (wrapperSize.height - activeRect.height) / 2
  }

  wrapperRef.value?.scrollTo({
    top,
    left,
    behavior: 'smooth',
  })
}

// emitter
emitter.on('location', (immediate?: boolean) => handleLocationPage(immediate))
const hideMaterialsPanel = (e: Event) => {
  const target = e.target as HTMLDivElement
  if (target?.classList.contains('edit-wrapper')) {
    setActiveNode()
  }
  emitter.emit('switchMaterialsPanel', false)
}

// draggable
const dragEvents = $computed(() => (dragNode && dragNodeType.value === 'section' ? {
  add: (event: SortableEvent) => {
    console.log('isCancelDrag.value => ', isCancelDrag.value)
    if (!dragNode.value || isCancelDrag.value) return
    addSection(dragNode.value, event.newIndex)
  },
} : {}))

const handleLeaveTrash = (e: DragEvent) => {
  // NOTE: 不知道为啥在垃圾桶上松开后也会触发一次 dragleave 并且数据都是 0
  if (!e.clientX && !e.clientY) return
  setIsCancelDrag(false)
}

</script>

<template>
  <div class="edit-section" v-tap="hideMaterialsPanel">
    <div ref="wrapperRef" class="edit-wrapper">
      <draggable
        ref="contentRef"
        v-show="!noPageData"
        :model-value="pageData || []"
        :item-key="'name'"
        :group="{ name: 'section', put: true, pull: false }"
        :disabled="displayMode !== 'drag' || (dragNode && dragNodeType !== 'section')"
        :class="['edit-content', `edit-content-${displayMode}`]"
        :ghost-class="dragNode && dragType === 'clone' ? 'ghost-clone-section' : 'ghost-move'"
        :style="editContentStyle"
        v-on="dragEvents"
      >
        <template #item="{ element: item }">
          <LibComponent
            :item="item"
            :key="item.name"
          ></LibComponent>
        </template>
      </draggable>
    </div>
    <div class="no-data" v-if="noPageData">TODO: 没有数据，提示左侧「+」</div>
    <Icon :class="['focus-btn']" name="focus" :size="26" @click="() => handleLocationPage()"></Icon>
    <Icon
      v-if="dragNode && dragType === 'clone'"
      :class="['cancel-clone-btn', { active: isCancelDrag }]"
      name="delete"
      :size="40"
      @dragover="() => setIsCancelDrag(true)"
      @dragleave="handleLeaveTrash"
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
    opacity: 0.5;
    transition: all 0.3s;
    background: $panel-light;

    &:hover,
    &.active {
      opacity: 1;
    }
  }

  .cancel-clone-btn {
    position: absolute;
    left: 20px;
    bottom: 20px;
    padding: 20px;
    opacity: .8;
    color: $red;
    border: 4px dashed $red;
    box-shadow: $shadow;
    background: linear-gradient(rgba($white, .8), rgba($white, 1));
    animation-name: shake;
    transform-origin: center bottom;
    animation-duration: 1.5s;
    animation-fill-mode: both;
    animation-iteration-count: infinite;
    animation-delay: .2s;
    transition: all 0s;
    cursor: pointer;

    &:hover,
    &.active {
      opacity: 1;
      color: $white;
      border: 4px solid $red;
      background: $red-gradient;
      animation: none;
    }

    :deep(*) {
      pointer-events: none;
    }
  }
}
.focusing {
  transition: all 300ms ease-in-out;
}
</style>
