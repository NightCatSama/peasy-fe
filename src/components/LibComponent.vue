<script setup lang="ts">
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'

interface ILibComponentProps {
  item: any
}

const { item } = defineProps<ILibComponentProps>()
const pageStore = usePageStore()
const { setActiveNode } = pageStore
const { activeNode } = storeToRefs(pageStore)

const test = () => {
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
    @click.stop="test"
    :is="item.component"
    v-bind="item.props || {}"
  >
    <template v-if="item.children">
      <LibComponent v-for="subItem in item.children" :item="subItem"></LibComponent>
    </template>
  </Component>
</template>

<style lang="scss" scoped>
.lib-component {
  cursor: default;
}
.active {
  outline: 1px solid skyblue;
  position: relative;
  cursor: default;
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.15);
    pointer-events: none;
  }
}
</style>
