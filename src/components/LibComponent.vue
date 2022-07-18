<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import draggable from 'vuedraggable'
import type { SortableEvent } from 'sortablejs'

import { usePageStore } from '@/stores/page'
import { useDisplayStore } from '@/stores/display'
import { emitter } from '@/utils/event'
import { getMoveable, useMoveable } from '@/utils/moveable'

interface ILibComponentProps {
  parent?: CNode
  item: CNode
}

const { parent, item } = defineProps<ILibComponentProps>()
const pageStore = usePageStore()
const { setActiveNode, insertDragNode, swapNode } = pageStore
const { activeNode, dragNode } = storeToRefs(pageStore)
const displayStore = useDisplayStore()

const componentRef = ref(null)

const setActive = () => {
  setActiveNode(item, parent)
  emitter.emit('switchMaterialsPanel', false)
}

let isActive = ref(false)
watch(activeNode, (newNode) => {
  isActive.value = newNode === item
})

watch(
  isActive,
  (val) => {
    const moveable = getMoveable()
    if (!moveable || !val) return

    // 获取当前选中的元素，并去更新 moveable 示例
    const elem = document.querySelector('.lib-component.active') as HTMLDivElement
    if (!elem) return

    useMoveable(elem, item)
  },
  {
    flush: 'post',
  }
)

watch(
  isActive,
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
  if (isActive.value && moveable) moveable.resizable = false
})

/** 拖拽逻辑 */
let inDraggable = $ref(false)
const handleAddNode = (event: SortableEvent) => {
  // 新增组件
  if (event.pullMode === 'clone' && event.newIndex !== void 0) {
    insertDragNode(item, event.newIndex)
  }
}

const handleSortNode = (event: SortableEvent) => {
  // 交互组件位置
  if (event.pullMode !== 'clone' && event.oldIndex !== void 0 && event.newIndex !== void 0) {
    swapNode(item, event.oldIndex, event.newIndex)
  }
}

const componentElem = $computed(() => (componentRef.value as any).$el as HTMLElement)

const isBlockComponent = $computed(() => item.component === 'Block')
const dragEvents = $computed(() => (isBlockComponent ? {
  dragover: (e: DragEvent) => {
    if (dragNode && !inDraggable) {
      inDraggable = true
      // ;(e.currentTarget as HTMLDivElement)?.parentElement?.dispatchEvent(new Event('dragleave', { bubbles: true }))
    }
  },
  dragleave: (e: DragEvent) => {
    inDraggable = false
  },
  drop: () => inDraggable = false,
  add: handleAddNode,
  sort: handleSortNode,
} : {}))
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
    :disabled="!dragNode && !isActive"
    :sort="true"
    :ghost-class="dragNode ? 'ghost-clone' : 'ghost-sort'"
    v-tap.stop="setActive"
    v-on="dragEvents"
  >
    <template #item="{ element: subItem }">
      <LibComponent
        :item="subItem"
        :parent="item"
        @mousedown.stop=""
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
  min-width: 80px;
  min-height: 80px;
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
.ghost-sort {
  opacity: .5;
  outline: 2px dashed $theme;
}
</style>