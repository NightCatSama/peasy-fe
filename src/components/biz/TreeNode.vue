<script setup lang="ts">
import { PageNode } from '@/config'
import { useDisplayStore } from '@/stores/display'
import { Alert } from '@/utils/alert'
import { watch, ref } from 'vue'
import { storeToRefs } from 'pinia'
import Icon from '../widgets/Icon.vue'
import { usePageStore } from '@/stores/page'
import { emitter } from '@/utils/event'
import { useConfigProps } from '@/utils/config'
import draggable from 'vuedraggable'
import type { SortableEvent } from 'sortablejs'
import { useDragStore } from '@/stores/drag'
import { useDisplayStoreHelper, useDragStoreHelper } from '@/hooks/store'

interface ITreeNodeListProps {
  node: PageNode
  preview?: boolean
  canDrag?: boolean
}

const { node, preview, canDrag } = defineProps<ITreeNodeListProps>()

const { layerStatus } = useDisplayStoreHelper()

const { dragNode, setDropZone, setDragNode } = useDragStoreHelper()

const pageStore = usePageStore()
const { activeNode, activeParentChain } = storeToRefs(pageStore)
const { setActiveNodeHide, setActiveNode, deleteActiveNode, copyActiveNode, separateActiveNode, changeNodeName, swapNode } =
  pageStore

let collapse = ref(!!layerStatus.value.get(node))
let isEdit = $ref(false)

const isActive = $computed(() => activeNode.value === node)

const canCollapse = $computed(() => node.children?.length && !node.isModule)

const isHide = $computed(() => useConfigProps(node).common?.hide)

const icon = $computed(() => {
  if (node.type === 'section') {
    return 'circle'
  }
  if (node.isModule) {
    return 'module'
  }
  return (
    {
      Image: 'image',
      Text: 'text',
      Block: 'block',
      Icon: 'symbol',
      Media: 'video',
      InputField: 'input',
    } as any
  )[node.component]
})

watch(
  () => collapse.value,
  (val: boolean) => layerStatus.value.set(node, val)
)

watch(
  [activeNode],
  () => {
    if (activeNode.value && activeParentChain.value.some((n) => n === node)) {
      collapse.value = true
    }
  },
  { immediate: true, flush: 'post' }
)

const handleActiveNodeChange = async (event: Event) => {
  isEdit = false
  if (!activeNode.value) return
  const elem = event.target as HTMLDivElement
  if (activeNode.value.name === elem.innerText) return
  elem.scrollLeft = 0
  changeNodeName(activeNode.value, elem.innerText)
  elem.innerText = activeNode.value.name
}

/** 拖拽排序组件 */
const handleSortNode = (event: SortableEvent) => {
  // 只在拖拽组件为当前组件时才处理，避免重复处理
  if (dragNode.value !== node) {
    return
  }
  // 交互组件位置
  if (event.pullMode !== 'clone' && event.oldIndex !== void 0 && event.newIndex !== void 0) {
    swapNode(node, event.oldIndex, event.newIndex)
    setDragNode(null)
  }
}

/** 子组件的 drag start 事件处理 */
const handleChildrenDragStart = (event: DragEvent) => {
  // 已存在拖拽元素或者当前组件是 Module 组件，不允许拖拽
  if (dragNode.value || node.isModule) {
    return
  }
  // 设置拖拽组件
  setDragNode(node, 'move')
  setDropZone(node)
}

const handleDragEnter = (e: DragEvent) => {
  if (
    dragNode.value && // 存在拖拽组件
    node.component === 'Block' &&
    !node.isModule // 当前组件不是 Module 组件
  ) {
    e.stopPropagation()
    setDropZone(node)
  }
}
</script>

<template>
  <div :class="['tree-node', { collapse, active: preview ? false : isActive }]">
    <Icon
      v-if="canCollapse && !preview"
      class="collapse-btn"
      name="caret-down"
      :size="10"
      @click="collapse = !collapse"
    ></Icon>
    <div class="tree-node-info" @click="() => !preview && setActiveNode(node)">
      <Icon class="tree-node-info-icon" :name="icon" :size="12"></Icon>
      <div class="tree-node-info-name">
        <div
          class="tree-node-info-name-text"
          :title="node.name"
          :contenteditable="isEdit && !preview"
          @dblclick="(e: Event) => {
            isEdit = !preview;
            ;(e.target as HTMLDivElement).focus()
          }"
          @keydown.enter.stop="(e: Event) => (e.target as HTMLDivElement)?.blur()"
          @blur="handleActiveNodeChange"
        >{{ node.name }}</div>
        <Icon
          v-if="isHide"
          class="tree-node-info-name-icon"
          name="hide"
          :size="10"
          @click="setActiveNodeHide(false)"
        ></Icon>
      </div>
      <template v-if="activeNode === node && !preview">
        <Icon
          v-if="activeNode.isModule"
          class="tree-node-info-op-icon separate-icon"
          name="separate"
          :size="10"
          v-tooltip="$t('ungroup')"
          @click="
            () => {
              separateActiveNode()
              collapse = true
            }
          "
        ></Icon>
        <Icon
          v-if="!isHide"
          class="tree-node-info-op-icon eye-slash-icon"
          name="eye-slash"
          :size="13"
          v-tooltip="$t('hidden')"
          @click="setActiveNodeHide(true)"
        ></Icon>
        <Icon
          v-if="isHide"
          class="tree-node-info-op-icon eye-icon"
          name="eye"
          :size="13"
          v-tooltip="$t('visible')"
          @click="setActiveNodeHide(false)"
        ></Icon>
        <Icon
          class="tree-node-info-op-icon copy-icon"
          name="copy"
          :size="10"
          v-tooltip="$t('copy')"
          @click.stop="copyActiveNode"
        ></Icon>
        <Icon
          class="tree-node-info-op-icon delete-icon"
          name="delete"
          :size="10"
          v-tooltip="$t('delete')"
          @click.stop="deleteActiveNode"
        ></Icon>
      </template>
    </div>
    <div class="tree-node-children">
      <draggable
        ref="contentRef"
        :model-value="node.children"
        :item-key="'name'"
        :group="{ name: 'tree', put: true, pull: true }"
        :disabled="!canDrag"
        :component-data="{
          onDragenter: handleDragEnter,
        }"
        :ghost-class="'ghost-move'"
        @sort="handleSortNode"
      >
        <template #item="{ element: child }">
          <TreeNode
            v-if="preview || (canCollapse && collapse)"
            :preview="preview"
            :key="child.name"
            :node="child"
            :can-drag="canDrag"
            @dragstart="(event: DragEvent) => handleChildrenDragStart(event)"
          ></TreeNode>
        </template>
      </draggable>
    </div>
  </div>
</template>

<style lang="scss">
.tree-node {
  position: relative;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  cursor: pointer;

  &.active {
    // color: $yellow;
    background-color: $panel-dark;

    > .tree-node-info {
      color: $theme;
    }
  }

  &-info {
    display: flex;
    align-items: center;
    height: 24px;
    border-radius: $inner-radius;

    &:hover {
      background-color: rgba($theme, 6%);
    }

    &-icon {
      flex-shrink: 0;
      margin-right: 2px;
    }

    &-name {
      flex: 1;
      display: flex;
      align-items: center;
      overflow: hidden;
      &-icon {
        margin-left: 2px;
        color: lighten($red, 30%);
      }
      &-text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &:not(:focus) {
          text-overflow: ellipsis;
        }

        &:focus {
          outline: none;
        }
      }
    }

    &-op-icon {
      color: rgba($color, 80%);
      flex-shrink: 0;
      &.delete-icon {
        &:hover {
          color: $red;
        }
      }
      &.copy-icon {
        &:hover {
          color: $theme;
        }
      }
      &.eye-slash-icon {
        &:hover {
          color: $orange;
        }
      }
      &.eye-icon {
        color: $orange;
      }
      &.separate-icon {
        &:hover {
          color: $pink;
        }
      }
    }
  }

  &-children {
    position: relative;
    padding-left: 16px;

    &::before {
      content: '';
      position: absolute;
      left: 9px;
      top: 6px;
      bottom: 6px;
      height: auto;
      width: 2px;
      border-left: 1px dashed lighten($panel, 10%);
    }
  }

  .collapse-btn {
    opacity: 0;
    position: absolute;
    left: -15px;
    top: 3px;
    transform: rotateZ(-90deg);
    transition: all 0.2s;
  }

  &.collapse {
    > .collapse-btn {
      transform: rotateZ(0);
    }
  }

  &:hover {
    > .collapse-btn {
      opacity: 1;
    }
  }
}
</style>
