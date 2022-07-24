<script setup lang="ts">
import { GroupType } from '@/config'
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'
import BasicGroup from './configs/BasicGroup.vue'
import BorderGroup from './configs/BorderGroup.vue'
import FontGroup from './configs/FontGroup.vue'
import LayoutGroup from './configs/LayoutGroup.vue'
import SizeGroup from './configs/SizeGroup.vue'
import SpacingGroup from './configs/SpacingGroup.vue'
import ContainerGroup from './configs/ContainerGroup.vue'
import BackgroundGroup from './configs/BackgroundGroup.vue'
import PositionGroup from './configs/PositionGroup.vue'
import EventGroup from './configs/EventGroup.vue'

interface IConfigGroupProps {
  groupType: GroupType
}
const { groupType } = defineProps<IConfigGroupProps>()

const pageStore = usePageStore()
const { activeNode } = storeToRefs(pageStore)

const componentNameMap: { [type in GroupType]: any | null } = {
  basic: BasicGroup,
  size: SizeGroup,
  font: FontGroup,
  spacing: SpacingGroup,
  position: PositionGroup,
  layout: LayoutGroup,
  border: BorderGroup,
  background: BackgroundGroup,
  container: ContainerGroup,
  event: EventGroup,
  animation: null,
}

const ignoreGroup = activeNode.value?.type === 'section' ? ['position'] : []
</script>

<template>
  <div
    v-if="activeNode && componentNameMap[groupType] && !ignoreGroup.includes(groupType)"
    class="config-group"
  >
    <Component
      :is="componentNameMap[groupType]"
      :node="activeNode"
      v-bind="activeNode.props"
    ></Component>
  </div>
</template>

<style lang="scss" scoped>
.config-group {
  position: relative;
  display: flex;
  flex-direction: column;
  // padding: 12px 18px;

  &::before,
  &:last-child::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 1px;
    background: rgba(255, 255, 255, 0.15);
    transform: scaleY(0.5);
  }

  &:last-child::after {
    top: auto;
    bottom: 0;
  }
}
</style>
