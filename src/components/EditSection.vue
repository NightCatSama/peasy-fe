<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, reactive, watch, ref, watchEffect, nextTick } from 'vue'
import draggable from 'vuedraggable'
import panzoom, { PanZoom } from 'panzoom'
import type { SortableEvent } from 'sortablejs'
import { useKeyPress, useSize } from 'ahooks-vue'

import LibComponent from '@/components/LibComponent.vue'
import { usePageStore } from '@/stores/page'
import { useDisplayStore } from '@/stores/display'
import Icon from './widgets/Icon.vue'
import { emitter } from '@/utils/event'
import { useDragStore } from '@/stores/drag'
import Btn from './widgets/Btn.vue'
import { ShortcutKey } from '@/constants/shortcut'
import MaterialCard from './widgets/MaterialCard.vue'
import { AlertSuccess } from '@/utils/alert'
import { $t } from '@/constants/i18n'
import { useDisplayStoreHelper, useDragStoreHelper, usePageStoreHelper } from '@/hooks/store'

const {
  pageData,
  activeNode,
  activeParentNode,
  activeSectionIndex,
  templateList,
  activeNodeIsSonText,
  setActiveNode,
  addSection,
  setActiveParentNodeToActive,
  setActiveNodeChildrenToActive,
  setActiveNodeToRound,
  getActiveNodeRound,
  deleteActiveNode,
  getTemplateData,
  loadTemplateData,
} = usePageStoreHelper()

const { device, displayMode, curFootSize, isFirst, setDeviceByParent } = useDisplayStoreHelper()
const { dragNode, dragType, dragNodeType, isCancelDrag, setIsCancelDrag } = useDragStoreHelper()

let isLoadingTemplate = $ref(false)

const wrapperRef = ref<HTMLDivElement | null>(null)
const contentRef = ref<HTMLDivElement | null>(null)

const contentElem = $computed(() => ((contentRef.value as any)?.$el as HTMLDivElement) || null)
const editContentStyle = $computed(() => ({
  width: `${device.value.width}px`,
  fontSize: `${curFootSize}px`,
}))
const noPageData = $computed(() => pageData.value.length === 0)

// PanZoom
const pz = ref<PanZoom | null>(null)
let isSmoothing = $ref(false)

const wrapperSize = useSize(wrapperRef) as { width: number; height: number }

/** 设置容器尺寸 */
const setWrapperSize = () => {
  wrapperSize.width = wrapperRef.value?.clientWidth || 0
  wrapperSize.height = wrapperRef.value?.clientHeight || 0
}

const handleGetTemplateList = async () => {
  if (templateList.value.length > 0) return
  isLoadingTemplate = true
  await getTemplateData()
  isLoadingTemplate = false
}

onMounted(() => {
  setWrapperSize()
  window.addEventListener('resize', setWrapperSize, false)

  if (isFirst.value) {
    // 根据屏幕宽度初始化设备
    setDeviceByParent(wrapperSize!.width, wrapperSize!.height)
  }

  // 初始化 PanZoom
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
  // 缩放和移动时，同步去更新 Moveable 的激活框
  pz.value.on('zoom', (e: any) => {
    device.value.zoom = e.getTransform().scale
    setTimeout(() => emitter.emit('updateMoveable'))
  })
  pz.value.on('pan', () => emitter.emit('updateMoveable'))
  handleGetTemplateList()
})
onUnmounted(() => window.removeEventListener('resize', setWrapperSize))

// 手动缩放时，更新 PanZoom 的缩放值
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

// 页面数据变化时，同步去更新 Moveable 的激活框
watch(
  [pageData],
  () => {
    nextTick(() => emitter.emit('updateMoveable'))
  },
  { flush: 'post', deep: true }
)

// 当首次新建 Section，去居中预览页面窗口
watch(
  () => noPageData,
  (newValue, oldValue) => {
    if (!newValue && oldValue) {
      setTimeout(() => handleLocationPage(true))
    }
  },
  { flush: 'post' }
)

/**
 * 重置预览位置，居中显示
 * immediate: 是否跳过过渡动画，立即居中
 */
const handleLocationPage = (immediate = false) => {
  // 平滑滚动过程中，不需要再居中，避免过渡出问题
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

  // 如果已经有激活的组件，再将激活的组件居中
  if (activeElem) {
    const activeRect = activeElem.getBoundingClientRect()
    left = activeRect.left - rect.left - (wrapperSize.width - activeRect.width) / 2 + Math.min(x, 0)
    top = activeRect.top - rect.top - (wrapperSize.height - activeRect.height) / 2 + Math.min(y, 0)
  }

  // 最后将容器滚动到计算好的位置
  wrapperRef.value?.scrollTo({
    top: Math.max(top, 0),
    left: Math.max(left, 0),
    behavior: 'smooth',
  })
}

// emitter
emitter.on('location', (immediate?: boolean) => handleLocationPage(immediate))

// 点击编辑区域的空白区域，取消当前选择组件
const handleEditSectionClick = (e: Event) => {
  const target = e.target as HTMLDivElement
  if (target?.classList.contains('edit-wrapper')) {
    setActiveNode()
  }
  emitter.emit('switchMaterialsPanel', false)
  emitter.emit('switchPageList', false)
}

// 快捷键 - 定位当前组件
useKeyPress(ShortcutKey.location, (e) => {
  e.preventDefault()
  handleLocationPage()
})

// 快捷键 - 删除激活组件
useKeyPress(ShortcutKey.delete, (e) => {
  if (activeNodeIsSonText.value) return
  e.preventDefault()
  deleteActiveNode()
})

// 快捷键 - 组件切换
useKeyPress(ShortcutKey.nextComponent, (e) => {
  e.preventDefault()
  setActiveNodeToRound(1)
})
useKeyPress(ShortcutKey.prevComponent, (e) => {
  e.preventDefault()
  setActiveNodeToRound(-1)
})
useKeyPress(ShortcutKey.parentComponent, (e) => {
  e.preventDefault()
  setActiveParentNodeToActive()
})
useKeyPress(ShortcutKey.childrenComponent, (e) => {
  e.preventDefault()
  setActiveNodeChildrenToActive()
})

// draggable
const dragEvents = $computed(() =>
  dragNode && dragNodeType.value === 'section'
    ? {
        add: (event: SortableEvent) => {
          if (!dragNode.value || isCancelDrag.value) return
          addSection(dragNode.value, (event.newIndex || 0) + activeSectionIndex.value)
        },
      }
    : {}
)

// 拖进垃圾桶则取消本次拖拽
const handleEnterTrash = () => setIsCancelDrag(true)
const handleLeaveTrash = (e: DragEvent) => {
  // NOTE: 不知道为啥在垃圾桶上松开后也会触发一次 dragleave 并且数据都是 0
  if (!e.clientX && !e.clientY) return
  setIsCancelDrag(false)
}

/** 选中一个模板 */
const handleSelectTemplate = async (templateId: string) => {
  emitter.emit('saveHistory')
  isLoadingTemplate = true
  await loadTemplateData(templateId)
  isLoadingTemplate = false
  AlertSuccess($t('templateApplySuccess'))
  emitter.emit('saveHistory')
}
</script>

<template>
  <div :class="['edit-section', `edit-section-${displayMode}`]" v-tap="handleEditSectionClick">
    <div ref="wrapperRef" class="edit-wrapper">
      <draggable
        ref="contentRef"
        :model-value="pageData || []"
        :item-key="'name'"
        :group="{ name: 'section', put: true, pull: false }"
        :disabled="displayMode !== 'drag' || (dragNode && dragNodeType !== 'section')"
        :class="['edit-content', { placeholder: noPageData }]"
        :component-data="{
          'data-placeholder': $t('noDataPlaceholder'),
        }"
        :ghost-class="dragNode && dragType === 'clone' ? 'ghost-clone-section' : 'ghost-move'"
        :style="editContentStyle"
        v-on="dragEvents"
      >
        <template #item="{ element: item }">
          <LibComponent :item="item" :key="item.name" :in-module="item.isModule"></LibComponent>
        </template>
      </draggable>
    </div>
    <Icon
      v-if="!noPageData"
      :class="['focus-btn']"
      name="focus"
      :size="26"
      @click="() => handleLocationPage()"
    ></Icon>
    <Icon
      v-if="dragNode && !noPageData && dragType === 'clone'"
      :class="['cancel-clone-btn', { active: isCancelDrag }]"
      name="delete"
      :size="24"
      @dragover="handleEnterTrash"
      @dragleave="handleLeaveTrash"
    ></Icon>
    <div class="node-operation" v-if="activeNode">
      <Btn
        class="prev-btn"
        :text="$t('prevNode')"
        type="text"
        color="default"
        size="sm"
        icon="top-circle"
        :disabled="!getActiveNodeRound(-1)"
        @click="setActiveNodeToRound(-1)"
      ></Btn>
      <Btn
        class="next-btn"
        :text="$t('nextNode')"
        type="text"
        color="default"
        size="sm"
        icon="top-circle"
        :disabled="!getActiveNodeRound(1)"
        @click="setActiveNodeToRound(1)"
      ></Btn>
      <Btn
        :text="$t('parentNode')"
        type="text"
        color="default"
        size="sm"
        icon="top-circle"
        :disabled="activeParentNode === null"
        @click="setActiveParentNodeToActive"
      ></Btn>
      <Btn
        class="children-btn"
        :text="$t('childrenNode')"
        type="text"
        color="default"
        size="sm"
        icon="top-circle"
        :disabled="!activeNode.children?.length"
        @click="setActiveNodeChildrenToActive"
      ></Btn>
    </div>
    <div v-if="noPageData" :class="['template-wrapper', { operate: !templateList.length }]">
      <div class="template-title">{{ $t('templatePlaceholder') }}</div>
      <div class="template-list" v-if="templateList.length">
        <MaterialCard
          :class="['template-item']"
          v-for="item in templateList"
          type="template"
          :item="item"
          :key="item.id"
          hide-operate
          @on-material-click="handleSelectTemplate(item.id!)"
        ></MaterialCard>
      </div>
      <Icon v-else-if="isLoadingTemplate" name="spin" :size="48" loading></Icon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.edit-section {
  position: relative;
  flex: 1;
  height: 100%;
  overflow: hidden;
  background-color: var(--editor-background-color);

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
      overflow: visible;
      background: #fff;
      color: black;
      border-radius: $normal-radius;

      &.placeholder {
        min-height: 80px;
        background: $tr;
        border: 4px dashed darken($color, 50%);
        left: 50%;
        top: 50%;
        width: 600px !important;
        right: auto;
        bottom: auto;
        transform: translate(-50%, -50%) !important;
        transform-origin: center !important;

        &::after {
          content: attr(data-placeholder);
          color: darken($color, 50%);
          font-size: 20px;
          white-space: nowrap;
          font-family: $font-family;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: -1;
        }
      }
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
    cursor: pointer;

    &:hover,
    &.active {
      opacity: 1;
    }
  }

  .cancel-clone-btn {
    position: absolute;
    left: 20px;
    bottom: 20px;
    padding: 16px;
    opacity: 0.8;
    color: $red;
    border: 4px dashed $red;
    box-shadow: $shadow;
    background: linear-gradient(rgba($white, 0.8), rgba($white, 1));
    animation-name: shake;
    transform-origin: center bottom;
    animation-duration: 1.5s;
    animation-fill-mode: both;
    animation-iteration-count: infinite;
    animation-delay: 0.2s;
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

  .node-operation {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: absolute;
    right: 80px;
    bottom: 10px;
    user-select: none;

    .prev-btn :deep(.icon) {
      transform: rotate(-45deg);
    }
    .next-btn :deep(.icon) {
      transform: rotate(45deg);
    }
    .children-btn :deep(.icon) {
      transform: rotate(90deg);
    }
  }
  .template-wrapper {
    position: absolute;
    bottom: 10px;
    left: 12px;
    right: 12px;
    color: $color;
    font-size: 16px;
    transition: all 0.3s;
    padding: 12px 6px 4px;
    border-radius: $normal-radius;

    &:hover {
      background-color: rgba($panel, 90%);
    }

    .template-title {
      padding-left: 8px;
      margin-bottom: 12px;
      font-size: 14px;
      color: rgba($color, 60%);
    }

    .template-list {
      overflow-x: auto;
      display: flex;
      align-items: center;
      border-radius: $normal-radius;
      height: 160px;
      padding: 4px 0;
    }
  }
  .template-item {
    width: 100px;
    height: 100%;
    margin: 0 8px;
    flex-shrink: 0;

    :deep(.material-card-info-name) {
      color: $color;
    }

    &:hover :deep(.material-card-image) {
      transform: scale(1.03);
    }
  }
}
.focusing {
  transition: all 300ms ease-in-out;
}
</style>
