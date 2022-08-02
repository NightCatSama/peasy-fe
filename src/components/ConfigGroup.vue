<script setup lang="ts">
import { GroupType } from '@/config'
import { groupIconMap, defaultGroupIcon } from '@/constants/group'
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
import AnimationGroup from './configs/AnimationGroup.vue'
import EffectGroup from './configs/EffectGroup.vue'
import Dropdown from './widgets/Dropdown.vue'
import Icon from './widgets/Icon.vue'
import CustomGroup from './configs/CustomGroup.vue'

interface IConfigGroupProps {
  groupType: GroupType
  index: number
  minimize?: boolean
}
const { groupType, index, minimize } = defineProps<IConfigGroupProps>()

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
  effect: EffectGroup,
  animation: AnimationGroup,
  custom: CustomGroup,
}

const ignoreGroup = activeNode.value?.type === 'section' ? ['position'] : []

const bindProps = $computed(() =>
  activeNode.value?.isModule ? activeNode.value.moduleConfig?.[index] : activeNode.value?.props
)

const iconName = $computed(() => bindProps?.icon || groupIconMap[groupType] || defaultGroupIcon)
</script>

<template>
  <div
    v-if="activeNode && componentNameMap[groupType] && !ignoreGroup.includes(groupType)"
    class="config-group"
  >
    <Component
      v-if="!minimize"
      :is="componentNameMap[groupType]"
      :node="activeNode"
      v-bind="bindProps"
    ></Component>
    <Dropdown
      v-else
      type="pure"
      :show-group="groupType"
      :popper-class="'group-dropdown'"
      is-menu
      placement="left-start"
    >
      <template #default="{ shown }">
        <div :class="['config-group-mini-item', { active: shown }]">
          <Icon :name="iconName" :size="16"></Icon>
        </div>
      </template>
      <template #content>
        <Component
          :is="componentNameMap[groupType]"
          :node="activeNode"
          :minimize="true"
          v-bind="bindProps"
        ></Component>
      </template>
    </Dropdown>
  </div>
</template>

<style lang="scss" scoped>
.config-group {
  position: relative;
  display: flex;
  flex-direction: column;

  & {
    border-top: 1px solid $border;
  }

  &:last-child {
    border-bottom: 1px solid $border;
  }

  &-mini-item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 44px;
    cursor: pointer;

    &.active {
      color: $yellow;
    }
  }
}
</style>

<style lang="scss">
.group-dropdown {
  .group {
    width: 300px;
    max-height: 60vh;
    overflow-y: auto;
  }
}
</style>
