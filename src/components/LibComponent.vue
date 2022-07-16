<script setup lang="ts">
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'

interface ILibComponentProps {
  parent?: CNode
  item: CNode
}

const { parent, item } = defineProps<ILibComponentProps>()
const pageStore = usePageStore()
const { setActiveNode } = pageStore
const { activeNode } = storeToRefs(pageStore)

const mousedownTime = $ref(0)

const setActive = () => {
  if (Date.now() - mousedownTime > 300) return
  setActiveNode(item)
}

const isActive = ref(false)

watch(activeNode, (newNode) => {
  isActive.value = newNode === item
})

</script>

<template>
  <Component
    :class="['lib-component', { active: isActive }]"
    @click.stop="setActive"
    @mousedown="mousedownTime = Date.now()"
    :is="item.component"
    v-bind="item.props || {}"
    :direction="parent?.props?.layout?.direction"
  >
    <template v-if="item.children">
      <LibComponent
        v-for="subItem in item.children"
        :item="subItem"
        :parent="item"
      ></LibComponent>
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
