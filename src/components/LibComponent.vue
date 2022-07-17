<script setup lang="ts">
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, ref, watch } from 'vue'
import Moveable from 'moveable'
import { covertPXToUnit, fixedPointToNumber, getUnit, isUnitType } from '@/utils/sizeHelper'
import { useDisplayStore } from '@/stores/display'
import { emitter } from '@/utils/event'
import { getMoveable, updateMoveableRect } from '@/utils/moveable'

interface ILibComponentProps {
  parent?: CNode
  item: CNode
}

const { parent, item } = defineProps<ILibComponentProps>()
const pageStore = usePageStore()
const { setActiveNode } = pageStore
const { activeNode, pageData } = storeToRefs(pageStore)

const componentRef = $ref(null)

const setActive = () => {
  setActiveNode(item)
  emitter.emit('switchNodePanel', false)
}

let isActive = ref(false)
watch(activeNode, (newNode) => {
  isActive.value = newNode === item
})

watch(
  isActive,
  (val) => {
    const moveable = getMoveable()
    if (!moveable) return

    if (val) {
      const elem = document.querySelector('.lib-component.active') as HTMLDivElement
      if (!elem) return

      const disableWidth = item.type === 'section' || !isUnitType(getUnit(item.props.size?.width))
      const disableHeight = !isUnitType(getUnit(item.props.size?.height))

      if (disableWidth && disableHeight) return

      /** 记录原先的单位 */
      let units: { width?: string; height?: string } = {}

      const renderDirections = disableWidth
        ? ['s', 'n']
        : disableHeight
        ? ['w', 'e']
        : ['n', 'nw', 'ne', 's', 'se', 'sw', 'e', 'w']

      moveable.resizable = true
      moveable.target = elem
      moveable.renderDirections = renderDirections

      moveable.off()
      moveable.on('resizeStart', (e) => {
        if (!disableWidth) units.width = getUnit(item.props.size.width)
        if (!disableHeight) units.height = getUnit(item.props.size.height)
      })
      moveable.on('resize', (e) => {
        if (units?.width) elem.style.width = fixedPointToNumber(e.width) + 'px'
        if (units?.height) elem.style.height = fixedPointToNumber(e.height) + 'px'
      })
      moveable.on('resizeEnd', (e) => {
        if (units.width)
          item.props.size.width = covertPXToUnit(
            elem.style.width,
            units.width,
            parent && elem.parentElement ? elem.parentElement.clientWidth : useDisplayStore().device.width
          )
        if (units.height)
          item.props.size.height = covertPXToUnit(
            elem.style.height,
            units.height,
            parent && elem.parentElement ? elem.parentElement.clientHeight : useDisplayStore().device.height
          )
      })
    }
  },
  {
    flush: 'post',
  }
)

watch(isActive, (val) => {
  const moveable = getMoveable()
  if (!val && moveable) moveable.resizable = false
}, {
  flush: 'pre',
})

onBeforeUnmount(() => {
  const moveable = getMoveable()
  if (isActive.value && moveable) moveable.resizable = false
})

</script>

<template>
  <Component
    ref="componentRef"
    :class="['lib-component', { active: isActive }]"
    v-tap.stop="setActive"
    :is="item.component"
    v-bind="item.props || {}"
    :direction="parent?.props?.layout?.direction"
  >
    <template v-if="item.children">
      <LibComponent v-for="subItem in item.children" :item="subItem" :parent="item"></LibComponent>
    </template>
  </Component>
</template>

<style lang="scss" scoped>
.lib-component {
  cursor: default;
}
.active {
  position: relative;
  cursor: default;
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    // background: rgba(0, 0, 0, 0.15);
    pointer-events: none;
    border: 5px dashed $theme;
    z-index: 99;
    box-sizing: border-box;
  }
}
</style>
