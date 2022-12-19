<script setup lang="ts">
import { PageNode } from '@/config'
import { useDisplayStoreHelper, useDragStoreHelper, usePageStoreHelper } from '@/hooks/store'
import { useConfigProps } from '@/utils/config'
import { emitter } from '@/utils/event'
import { disabledMoveable, getMoveable, useMoveable } from '@/utils/moveable'
import { isContainerNode } from '@/utils/node'
import type { SortableEvent } from 'sortablejs'
import { ComponentPublicInstance, onBeforeUnmount, onMounted, watch } from 'vue'
import draggable from 'vuedraggable'

interface ILibComponentProps {
  /** 父组件 */
  parent?: PageNode
  /** 当前组件数据 */
  item: PageNode<any>
  /** 是否无法选择 */
  noSelect?: boolean
}

const { parent, item, noSelect } = defineProps<ILibComponentProps>()

const { activeNode, setActiveNode, insertNode, swapNode, addActiveParentChain } =
  usePageStoreHelper()

const {
  dragNode,
  dragType,
  dropZone,
  dragNodeType,
  isCancelDrag,
  setDropZone,
  setDragNode,
  getIsInDragNode,
} = useDragStoreHelper()

const { displayMode, lockDrag } = useDisplayStoreHelper()

const componentRef = $ref<ComponentPublicInstance | null>(null)
let $el = $ref<HTMLElement | null>(null)

/** 当前组件是否为激活组件 */
const isActive = $computed(() => activeNode.value === item)
const isHide = $computed(() => useConfigProps(item)?.common?.hide)

/** 设置当前组件为激活组件 */
const setActive = () => {
  if (!$el || !$el.parentElement) return
  setActiveNode(item)
  emitter.emit('switchMaterialsPanel', false)
}

const openMoveable = () => {
  if (isActive && !isHide) {
    // 预览和拖拽模式下，是不展示 moveable 的
    if (['preview', 'drag'].includes(displayMode.value)) {
      disabledMoveable()
      return
    }

    const moveable = getMoveable()
    if (!moveable || !$el) return

    /** 切换到子文本时，不更新 moveable */
    let moveableTarget: HTMLElement = $el
    if (item.component === 'Text' && item?.config?.props?.basic?.isSonText) {
      moveableTarget = $el.parentElement?.parentElement as HTMLElement
    }

    // 开启 moveable
    useMoveable(moveableTarget, item, parent)
    setTimeout(() => emitter.emit('updateMoveable'), 300) // drag 视图切回来有个缩放动画，需要等动画完毕后重新定位
  }
}

// 切换编辑模式时，如果当前组件为激活组件，需要重新设置 moveable
watch(
  () => [isActive, displayMode.value, isHide, $el],
  () => openMoveable(),
  { flush: 'post' }
)

// 取消激活时，关闭 moveable
watch(
  () => [isActive, isHide],
  () => (!isActive || isHide) && disabledMoveable(),
  { flush: 'pre' }
)

// 激活时，手动去触发父组件的 active-node 事件，用于更新 pageStore 的父组件链 activeParentChain
watch(
  () => [isActive, $el],
  () => isActive && $el?.parentElement?.dispatchEvent(new Event('active-node', { bubbles: true })),
  { flush: 'post' }
)

// 销毁组件时手动关闭 moveable
onMounted(() => {
  $el = componentRef?.$el
  openMoveable()
})
onBeforeUnmount(() => isActive && disabledMoveable())

/** 当前组件是否拖拽中 */
let inDraggable = $computed(() => dropZone.value === item)

/** 处理从物料栏拖拽组件进来 */
const handleAddNode = (event: SortableEvent) => {
  if (!dragNode.value || isCancelDrag.value) return
  // 新增组件
  if (event.pullMode === 'clone' && event.newIndex !== void 0) {
    insertNode(dragNode.value, item, event.newIndex)
    setDragNode(null)
    emitter.emit('saveHistory')
  }
}

/** 处理组件与组件的排序 */
const handleSortNode = (event: SortableEvent) => {
  // 交互组件位置
  // NOTE: isContainer 暂不支持拖拽原因，因为内部存在多个元素，无法确定可拖拽进去的元素，所以此处索引有问题
  if (event.pullMode !== 'clone' && event.oldIndex !== void 0 && event.newIndex !== void 0) {
    swapNode(item, event.oldIndex, event.newIndex)
    setDragNode(null)
    emitter.emit('saveHistory')
  }
}

// 只有 block 组件才有拖拽排序功能（包含 children）
const isBlockComponent = $computed(() => isContainerNode(item))

// 滚动列表
const scrollList: Set<HTMLDivElement> = new Set()

// block 组件事件绑定
const componentEvents = $computed(() =>
  isBlockComponent
    ? {
        /** 拖拽进来触发事件 */
        onDragenter: (e: DragEvent) => {
          if (
            dragNode.value && // 存在拖拽组件
            !item.isModule && // 当前组件不是 Module 组件
            !inDraggable && // 当前组件不是拖拽中的组件 （避免自己拖拽进自己）
            !getIsInDragNode.value(item.id!) && // 当前组件不是拖拽组件的子组件 （避免把拖拽自己拖进自己的子组件）
            // NOTE: isContainer 拖拽时触发 drag-enter 不一定是当前组件，所以以下判断有问题
            (e.target as HTMLDivElement)?.dataset?.id === item.id // 确认目前触发的元素是当前组件
          ) {
            setDropZone(item)
          }
        },
        /** Sortable 触发的组件新增事件 */
        onAdd: handleAddNode,
        /** Sortable 触发的组件排序事件 */
        onEnd: handleSortNode,
        /** 滚动事件，记录组件是否触发了滚动 */
        onScroll: (e: Event) => {
          const elem = e.target as HTMLDivElement
          scrollList.add(elem)
        },
        /** 监听自定义事件 'active-node'，用于记录激活的组件的父组件链 */
        onActiveNode: () => {
          addActiveParentChain(item)
        },
      }
    : {}
)

/** 子组件的 drag start 事件处理 */
const handleChildrenDragStart = (event: DragEvent, node: PageNode) => {
  // 已存在拖拽元素或者当前组件是 Module 组件，不允许拖拽
  if (dragNode.value || item.isModule) {
    return
  }
  // 设置拖拽组件
  setDragNode(node, 'move')
}

// 当切换模式或切换组件时，如果当前组件滚动过，则重置滚动位置，避免 moveable 等插件错乱
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

/** 子组件的 mousedown 事件处理，调用 stopPropagation 时可以取消 panZoom 的拖拽移动 */
const preventChildrenMousedown = (e: MouseEvent, subItem: PageNode) => {
  if (
    displayMode.value === 'drag' || // 拖拽模式下
    (!lockDrag.value &&
      ['absolute', 'fixed'].includes(useConfigProps(subItem).position?.position || '')) // 组件调整绝对定位位置时
  ) {
    e.stopPropagation()
  }
}

const handleSetElement = (el: HTMLElement) => ($el = el)

const isNoSelect = $computed(() => item.isModule || noSelect)
</script>

<template>
  <draggable
    ref="componentRef"
    :model-value="item.children || []"
    :group="{
      name: 'component',
      put: isBlockComponent ? !item.isModule : false,
      pull: item.isModule ? false : true,
    }"
    :item-key="'name'"
    :tag="item.component"
    :component-data="{
      ...useConfigProps(item),
      tags: item.tags,
      id: item.id,
      direction: parent ? useConfigProps(parent).layout?.direction : void 0,
      children: item.component === 'Text' && item.children ? item.children : void 0,
      inheritAttrs: {
        class: [
          'lib-component',
          {
            active: isActive,
            grading: inDraggable,
            module: !!item.isModule,
            noSelect: noSelect,
          },
        ],
        'data-id': item.id,
        ...componentEvents,
        ...$attrs,
      },
      onUpdateElem: (el: HTMLElement) => handleSetElement(el)
    }"
    :disabled="displayMode !== 'drag' || (dragNode && dragNodeType !== 'component')"
    :sort="true"
    :ghost-class="dragNode && dragType === 'clone' ? 'ghost-clone' : 'ghost-move'"
    :chosen-class="'chosen-clone'"
    v-tap.stop="setActive"
  >
    <template #item="{ element: subItem }">
      <LibComponent
        :item="subItem"
        :parent="item"
        :no-select="isNoSelect"
        :key="subItem.name"
        @mousedown="(e: MouseEvent) => preventChildrenMousedown(e, subItem)"
        @dragstart="(event: DragEvent) => handleChildrenDragStart(event, subItem)"
      ></LibComponent>
    </template>
  </draggable>
</template>

<style lang="scss" scoped>
.lib-component {
  // cursor: default;
  &.grading {
    user-select: none;
  }
}
</style>
