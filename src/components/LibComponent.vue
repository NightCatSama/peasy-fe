<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch, watchPostEffect } from 'vue'
import { storeToRefs } from 'pinia'
import draggable from 'vuedraggable'
import { active, SortableEvent } from 'sortablejs'

import { usePageStore } from '@/stores/page'
import { useDragStore } from '@/stores/drag'
import { emitter } from '@/utils/event'
import { disabledMoveable, getMoveable, updateMoveableRect, useMoveable } from '@/utils/moveable'
import { useDisplayStore } from '@/stores/display'
import { PageNode } from '@/config'

interface ILibComponentProps {
  parent?: PageNode
  item: PageNode
}

const { parent, item } = defineProps<ILibComponentProps>()

const pageStore = usePageStore()
const { setActiveNode, insertNode, swapNode, addActiveParentChain } = pageStore
const { activeNode } = storeToRefs(pageStore)

const dragStore = useDragStore()
const { dragNode, dragType, dropZone, dragNodeType, isCancelDrag } = storeToRefs(dragStore)
const { setDropZone, setDragNode, getIsInDragNode } = dragStore

const displayStore = useDisplayStore()
const { displayMode } = storeToRefs(displayStore)

const componentRef = ref(null)

const setActive = (e: Event) => {
  setActiveNode(item, parent)
  ;(e.target as HTMLDivElement).parentElement!.dispatchEvent(
    new Event('active-node', { bubbles: true })
  )
  emitter.emit('switchMaterialsPanel', false)
}

let isActive = $computed(() => activeNode.value === item)

watch(
  () => isActive,
  () => {
    if (isActive) {
      if (displayMode.value === 'preview') return
      const moveable = getMoveable()
      if (!moveable) return
      // 获取当前选中的元素，并去更新 moveable 示例
      const elem = (componentRef?.value as any)?.$el as HTMLDivElement
      if (!elem) return
      useMoveable(elem, item, parent)
    }
  },
  { flush: 'post' }
)

watch(
  () => isActive,
  () => !isActive && disabledMoveable(),
  { flush: 'pre' }
)

onBeforeUnmount(() => isActive && disabledMoveable())

/** 拖拽逻辑 */
let inDraggable = $computed(() => dropZone.value === item)
const handleAddNode = (event: SortableEvent) => {
  if (!dragNode.value || isCancelDrag.value) return
  // 新增组件
  if (event.pullMode === 'clone' && event.newIndex !== void 0) {
    insertNode(dragNode.value, item, event.newIndex)
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
const scrollList: Set<HTMLDivElement> = new Set()
const dragEvents = $computed(() =>
  isBlockComponent
    ? {
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
        scroll: (e: Event) => {
          const elem = e.target as HTMLDivElement
          scrollList.add(elem)
        },
        'active-node': () => {
          addActiveParentChain(item)
        },
      }
    : {}
)

watch(
  [displayMode, activeNode],
  () => {
    if (scrollList.size > 0) {
      scrollList.forEach((el) => {
        el.scrollLeft = 0
        el.scrollTop = 0
      })
      scrollList.clear()
    }
  },
  { flush: 'pre' }
)

const handleDragStart = (event: DragEvent, node: PageNode) => {
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
    :disabled="displayMode !== 'drag' || (dragNode && dragNodeType !== 'component')"
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
        :key="subItem.name"
        @mousedown="preventMousedown"
        @dragstart="(event: DragEvent) => handleDragStart(event, subItem)"
      ></LibComponent>
    </template>
  </draggable>
</template>

<style lang="scss" scoped>
.lib-component {
  cursor: default;

  &.grading {
  }
}
</style>
