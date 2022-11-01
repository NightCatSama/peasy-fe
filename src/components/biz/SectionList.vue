<script setup lang="ts">
import { PageNode } from '@/config'
import { useDragStoreHelper, usePageStoreHelper } from '@/hooks/store'
import { emitter } from '@/utils/event'
import type { SortableEvent } from 'sortablejs'
import { nextTick } from 'vue'
import draggable from 'vuedraggable'

const {
  activeSection,
  isActiveAllSection,
  allPageData,
  addSection,
  setActiveSection,
  setActiveNode,
  swapSection,
} = usePageStoreHelper()

const { dragNode, dragType, dragNodeType, isCancelDrag } = useDragStoreHelper()

const handleSectionItemClick = (item: PageNode | null) => {
  setActiveSection(item)
  setActiveNode(item)
  nextTick(() => emitter.emit('location'))
}

const allKey = Symbol('all')
const showAllItem = $computed(() => allPageData.value.length > 0)

// draggable
let inDraggable = $ref(false)
const dragEvents = $computed(() => ({
  dragover: (event: DragEvent) => {
    event.dataTransfer!.setDragImage(new Image(), 0, 0)
  },
  add: (event: SortableEvent) => {
    if (!dragNode.value) return
    // 交互组件位置
    if (event.pullMode === 'clone' && event.newIndex !== void 0) {
      if (isCancelDrag.value) return
      addSection(dragNode.value, event.newIndex! - (showAllItem ? 1 : 0))
    }
  },
  start: () => (inDraggable = true),
  end: (event: SortableEvent) => {
    // 交互组件位置
    if (event.pullMode !== 'clone' && event.oldIndex !== void 0 && event.newIndex !== void 0) {
      swapSection(event.oldIndex - (showAllItem ? 1 : 0), event.newIndex - (showAllItem ? 1 : 0))
    }
    inDraggable = false
  },
}))
</script>

<template>
  <draggable
    :class="[
      'section-list',
      { 'section-list-drag': inDraggable || (dragType === 'clone' && dragNodeType === 'section') },
    ]"
    :item-key="'name'"
    :group="{ name: 'section', put: true, pull: true }"
    :disabled="dragNode && dragNodeType !== 'section'"
    ghost-class="section-item-ghost"
    :model-value="allPageData || []"
    :component-data="{
      tag: 'transition-group',
      name: 'fade',
    }"
    v-on="dragEvents"
  >
    <template #header>
      <div
        v-if="showAllItem"
        :key="allKey"
        :class="['section-item', { active: isActiveAllSection }]"
        @click="handleSectionItemClick(null)"
      >
        A
      </div>
    </template>
    <template #item="{ element: item, index }">
      <div
        :class="['section-item', { active: item === activeSection }]"
        :key="item.name"
        v-tooltip="{ content: item.name, placement: 'right', distance: 10 }"
        @click="handleSectionItemClick(item)"
      >
        {{ index + 1 }}
      </div>
    </template>
  </draggable>
</template>

<style lang="scss" scoped>
.section-list {
  position: relative;
  height: auto;
  min-height: 48px;
  width: 48px;
  padding: 6px;
  border-radius: $normal-radius;
  border: 2px dashed $tr;
  display: flex;
  flex-direction: column;
  overflow: auto;
  margin-top: 10px;

  &::-webkit-scrollbar {
    display: none;
  }

  &-drag {
    border-color: rgba($white, 50%);

    &:empty::after {
      content: '+';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 24px;
      color: rgba($white, 50%);
    }
  }

  .section-item,
  &:deep(.section-item-ghost) {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    border-radius: $normal-radius;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    text-shadow: $text-shadow;
    opacity: 0.8;
    background: $bg-default-gradient;
    cursor: pointer;
    transition: all 0.3s, transform 0.3s 0.1s;
    user-select: none;

    &:not(:last-child) {
      margin-bottom: 12px;
    }

    &.active {
      color: $bg-default;
      background: $theme-gradient;
      text-shadow: none;
      font-weight: bold;
      box-shadow: $float-shadow;
      font-size: 18px;
      transform: scale(1.05);
    }
  }
  &:deep(.section-item-ghost) {
    > * {
      display: none;
    }
  }
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0 !important;
  transform: scale(0);
}

.fade-leave-active {
  position: absolute;
}
</style>
