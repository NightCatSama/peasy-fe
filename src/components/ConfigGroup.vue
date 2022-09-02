<script setup lang="ts">
import { GroupType } from '@/config'
import { groupIconMap, defaultGroupIcon, groupTitleMap } from '@/constants/group'
import { usePageStore } from '@/stores/page'
import { useConfig, useConfigProps, useGroupConfig } from '@/utils/config'
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
import { lang } from '@/constants/i18n'
import CodeGroup from './configs/CodeGroup.vue'
import { onErrorCaptured } from 'vue'
import { AlertError } from '@/utils/alert'

interface IConfigGroupProps {
  groupType: GroupType
  index: number
  minimize?: boolean
}
const { groupType, index, minimize } = defineProps<IConfigGroupProps>()

const pageStore = usePageStore()
const { activeNode } = storeToRefs(pageStore)

const componentNameMap: { [type in GroupType]: any | null } = {
  common: null,
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
  code: CodeGroup,
}

const ignoreGroup = activeNode.value?.type === 'section' ? ['position'] : []

const bindProps = $computed(() =>
  activeNode.value?.isModule
    ? activeNode.value.moduleConfig?.[index]
    : { [groupType]: useGroupConfig(activeNode.value, groupType) }
)

const iconName = $computed(
  () => (bindProps as any)?.icon || groupIconMap[groupType] || defaultGroupIcon
)

const showTitle = $computed(
  () => (bindProps as any)?.title
    ? lang === 'en' && (bindProps as any)?.titleEn || (bindProps as any)?.title
    : groupTitleMap[groupType]
)

onErrorCaptured((err) => {
  AlertError(err?.message ?? err?.name)
  console.error(err)
  return false
})
</script>

<template>
  <div
    v-if="
      activeNode &&
      componentNameMap[groupType] &&
      !ignoreGroup.includes(groupType)
    "
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
        <div
          :class="['config-group-mini-item', { active: shown }]"
          v-tooltip="{ content: showTitle, placement: 'left', disabled: !showTitle }"
        >
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
    height: $mini-item-height;
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
