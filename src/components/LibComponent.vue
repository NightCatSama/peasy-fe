<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch, watchPostEffect } from 'vue'
import { storeToRefs } from 'pinia'
import draggable from 'vuedraggable'
import type { SortableEvent } from 'sortablejs'

import { usePageStore } from '@/stores/page'
import { useDragStore } from '@/stores/drag'
import { emitter } from '@/utils/event'
import { getMoveable, useMoveable } from '@/utils/moveable'
import { useDisplayStore } from '@/stores/display'

interface ILibComponentProps {
  parent?: CNode
  item: CNode
}

const { parent, item } = defineProps<ILibComponentProps>()

const pageStore = usePageStore()
const { setActiveNode, insertDragNode, swapNode } = pageStore
const { activeNode } = storeToRefs(pageStore)

const dragStore = useDragStore()
const { dragNode, dragType, dropZone } = storeToRefs(dragStore)
const { setDropZone, setDragNode, getIsInDragNode } = dragStore

const displayStore = useDisplayStore()
const { displayMode } = storeToRefs(displayStore)

const componentRef = ref(null)

const setActive = () => {
  setActiveNode(item, parent)
  emitter.emit('switchMaterialsPanel', false)
}

let isActive = $computed(() => activeNode.value === item)

watchPostEffect(() => {
  if (isActive) {
    const moveable = getMoveable()

    if (!moveable) return
    // 获取当前选中的元素，并去更新 moveable 示例
    const elem = document.querySelector('.lib-component.active') as HTMLDivElement
    if (!elem) return

    useMoveable(elem, item, parent)
  }
})

watch(
  $$(isActive),
  (val) => {
    const moveable = getMoveable()
    if (!val && moveable) moveable.resizable = false
  },
  {
    flush: 'pre',
  }
)

onBeforeUnmount(() => {
  const moveable = getMoveable()
  if (isActive && moveable) moveable.resizable = false
})

/** 拖拽逻辑 */
let inDraggable = $computed(() => dropZone.value === item)
const handleAddNode = (event: SortableEvent) => {
  if (!dragNode.value) return
  // 新增组件
  if (event.pullMode === 'clone' && event.newIndex !== void 0) {
    insertDragNode(dragNode.value, item, event.newIndex)
    setDragNode(null)
  }
}

const handleSortNode = (event: SortableEvent) => {
  // 交互组件位置
  if (event.pullMode !== 'clone' && event.oldIndex !== void 0 && event.newIndex !== void 0) {
    swapNode(item, event.oldIndex, event.newIndex)
    setDragNode(null)
  }
}

const isBlockComponent = $computed(() => item.component === 'Block')
const dragEvents = $computed(() => (isBlockComponent ? {
  dragenter: (e: DragEvent) => {
    if (
      dragNode.value &&
      !inDraggable &&
      !getIsInDragNode(item.name) &&
      (e.target as HTMLDivElement)?.dataset?.name === item.name
    ) {
      setDropZone(item)
    }
  },
  add: handleAddNode,
  end: handleSortNode,
} : {}))

const handleDragStart = (event: DragEvent, node: CNode) => {
  if (dragNode.value) return
  setDragNode(node, 'move')
}

/** 拖拽模式下阻止编辑窗口移动 */
const preventMousedown = (e: MouseEvent) => {
  if (displayMode.value !== 'drag') return
  e.stopPropagation()
}
</script>

<template>
  <draggable
    ref="componentRef"
    :model-value="item.children || []"
    :group="{ name: 'component', put: isBlockComponent ? true : false, pull: true }"
    :class="['lib-component', { active: isActive, grading: inDraggable }]"
    :item-key="'name'"
    :tag="item.component"
    :component-data="{
      ...item.props,
      direction: parent?.props?.layout?.direction,
    }"
    :disabled="displayMode !== 'drag'"
    :sort="true"
    :ghost-class="dragNode && dragType === 'clone' ? 'ghost-clone' : 'ghost-move'"
    :chosen-class="'chosen-clone'"
    :data-name="item.name"
    v-tap.stop="setActive"
    v-on="dragEvents"
  >
    <template #item="{ element: subItem }">
      <LibComponent
        :item="subItem"
        :parent="item"
        @mousedown="preventMousedown"
        @dragstart="(event: DragEvent) => handleDragStart(event, subItem)"
      ></LibComponent>
    </template>
  </draggable>
</template>

<style lang="scss" scoped>
.lib-component {
  cursor: default;

  &.active {
    position: relative;
    cursor: default;
    &:not(.snapshot)::after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      border: 2px dashed rgba($theme, 70%);
      z-index: 99;
      box-sizing: border-box;
    }
  }
  &.grading {
    box-shadow: inset 0 0 0px 10px rgba($green, 40%);
  }
}
</style>

<style lang="scss">
.ghost-clone {
  width: 100%;
  height: 100%;
  max-width: 100px;
  max-height: 100px;
  overflow: hidden;

  &::after {
    content: 'Push Here';
    font-size: 14px;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    color: $color;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: $panel-dark;
  }
}
.ghost-move {
  opacity: .6;
  outline: 2px dashed $theme;
}
.chosen-clone {
  pointer-events: painted;
  opacity: .3;
}
</style>