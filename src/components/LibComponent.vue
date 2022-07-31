<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch, watchPostEffect } from 'vue'
import { storeToRefs } from 'pinia'
import draggable from 'vuedraggable'
import type { SortableEvent } from 'sortablejs'

import { usePageStore } from '@/stores/page'
import { useDragStore } from '@/stores/drag'
import { emitter } from '@/utils/event'
import { disabledMoveable, getMoveable, updateMoveableRect, useMoveable } from '@/utils/moveable'
import { useDisplayStore } from '@/stores/display'
import { PageNode } from '@/config'

interface ILibComponentProps {
  parent?: PageNode
  item: PageNode
  inModule?: boolean
}

const { parent, item, inModule } = defineProps<ILibComponentProps>()

const pageStore = usePageStore()
const { setActiveNode, insertNode, swapNode, addActiveParentChain } = pageStore
const { activeNode } = storeToRefs(pageStore)

const dragStore = useDragStore()
const { dragNode, dragType, dropZone, dragNodeType, isCancelDrag } = storeToRefs(dragStore)
const { setDropZone, setDragNode, getIsInDragNode } = dragStore

const displayStore = useDisplayStore()
const { lockDrag } = displayStore
const { displayMode } = storeToRefs(displayStore)

const componentRef = ref(null)

const $el = $computed(() => (componentRef?.value as any)?.$el as HTMLDivElement)

const setActive = () => {
  if (!$el || !$el.parentElement) return
  setActiveNode(item, parent)
  emitter.emit('switchMaterialsPanel', false)
}

let isActive = $computed(() => activeNode.value === item)

watch(
  () => [isActive, displayMode.value],
  () => {
    if (isActive) {
      if (['preview', 'drag'].includes(displayMode.value)) {
        disabledMoveable()
        return
      }
      const moveable = getMoveable()
      if (!moveable || !$el) return

      useMoveable($el, item, parent)
      setTimeout(() => emitter.emit('updateMoveable'), 300) // drag 视图切回来有个缩放动画，需要等动画完毕后重新定位
    }
  },
  { flush: 'post' }
)

watch(
  () => isActive,
  () => !isActive && disabledMoveable(),
  { flush: 'pre' }
)

watch(
  () => isActive,
  () => isActive && $el?.parentElement!.dispatchEvent(new Event('active-node', { bubbles: true })),
  { flush: 'post' }
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
const componentEvents = $computed(() =>
  isBlockComponent
    ? {
        onDragenter: (e: DragEvent) => {
          if (
            dragNode.value &&
            !item.isModule &&
            !inDraggable &&
            !getIsInDragNode(item.name) &&
            (e.target as HTMLDivElement)?.dataset?.name === item.name
          ) {
            setDropZone(item)
          }
        },
        onAdd: handleAddNode,
        onEnd: handleSortNode,
        onScroll: (e: Event) => {
          const elem = e.target as HTMLDivElement
          scrollList.add(elem)
        },
        onActiveNode: () => {
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
  if (dragNode.value || item.isModule) {
    return
  }
  setDragNode(node, 'move')
}

/** 拖拽模式下阻止编辑窗口移动 */
const preventMousedown = (e: MouseEvent, subItem: PageNode) => {
  if (
    displayMode.value === 'drag' ||
    (!lockDrag && ['absolute', 'fixed'].includes(subItem.props?.position?.position))
  ) {
    e.stopPropagation()
  }
}
</script>

<template>
  <draggable
    ref="componentRef"
    :model-value="item.children || []"
    :group="{ name: 'component', put: isBlockComponent ? !item.isModule : false, pull: item.isModule ? false : true }"
    :item-key="'name'"
    :tag="item.component"
    :component-data="{
      ...item.props,
      tags: item.tags,
      componentName: item.name,
      direction: parent?.props?.layout?.direction,
      inheritAttrs: {
        class: [
          'lib-component',
          {
            active: isActive,
            grading: inDraggable,
            module: !!item.isModule,
            inModule: inModule,
          }
        ],
        'data-name': item.name,
        ...componentEvents,
        ...$attrs,
      }
    }"
    :disabled="(
      displayMode !== 'drag' ||
      (dragNode && dragNodeType !== 'component')
      // (dragNode && item.isModule)
    )"
    :sort="true"
    :ghost-class="dragNode && dragType === 'clone' ? 'ghost-clone' : 'ghost-move'"
    :chosen-class="'chosen-clone'"
    v-tap.stop="setActive"
  >
    <template #item="{ element: subItem }">
      <LibComponent
        :item="subItem"
        :parent="item"
        :in-module="item.isModule || inModule"
        :key="subItem.name"
        @mousedown="(e) => preventMousedown(e, subItem)"
        @dragstart="(event: DragEvent) => handleDragStart(event, subItem)"
      ></LibComponent>
    </template>
  </draggable>
</template>

<style lang="scss" scoped>
.lib-component {
  cursor: default;

  &.grading {
    user-select: none;
  }
}
</style>
