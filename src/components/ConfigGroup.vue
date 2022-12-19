<script setup lang="ts">
import { defaultGroupIcon, groupIconMap, groupTitleMap } from '@/constants/group'
import { lang } from '@/constants/i18n'
import { usePageStoreHelper } from '@/hooks/store'
import { AlertError } from '@/utils/alert'
import { onErrorCaptured } from 'vue'
import AnimationGroup from './configs/AnimationGroup.vue'
import BackgroundGroup from './configs/BackgroundGroup.vue'
import BasicGroup from './configs/BasicGroup.vue'
import BorderGroup from './configs/BorderGroup.vue'
import CodeGroup from './configs/CodeGroup.vue'
import ContainerGroup from './configs/ContainerGroup.vue'
import CustomGroup from './configs/CustomGroup.vue'
import EffectGroup from './configs/EffectGroup.vue'
import EventGroup from './configs/EventGroup.vue'
import ExtraGroup from './configs/ExtraGroup.vue'
import FontGroup from './configs/FontGroup.vue'
import LayoutGroup from './configs/LayoutGroup.vue'
import PositionGroup from './configs/PositionGroup.vue'
import SizeGroup from './configs/SizeGroup.vue'
import SpacingGroup from './configs/SpacingGroup.vue'
import Dropdown from './widgets/Dropdown.vue'
import Icon from './widgets/Icon.vue'

interface IConfigGroupProps {
  groupType: string
  groupProps: Record<string, any>
  minimize?: boolean
}
const { groupType, groupProps, minimize } = defineProps<IConfigGroupProps>()

const { activeNode } = usePageStoreHelper()

const componentName = $computed(() => {
  if (groupType === 'module') {
    return CustomGroup
  }
  if (groupType === 'extra') {
    return ExtraGroup
  }
  return componentNameMap[groupType] || null
})

const componentNameMap: { [type in string]: any | null } = {
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
  code: CodeGroup,
}

const ignoreGroup = activeNode.value?.type === 'section' ? ['position'] : []

const bindProps = $computed(() => groupProps)

const iconName = $computed(
  () => (bindProps as any)?.icon || groupIconMap[groupType] || defaultGroupIcon
)

const showTitle = $computed(() =>
  (bindProps as any)?.title
    ? (lang === 'en' && (bindProps as any)?.titleEn) || (bindProps as any)?.title
    : groupTitleMap[groupType]
)

onErrorCaptured((err) => {
  AlertError(err?.message ?? err?.name)
  console.error(err)
  return false
})
</script>

<template>
  <div v-if="activeNode && componentName && !ignoreGroup.includes(groupType)" class="config-group">
    <Component
      v-if="!minimize"
      :is="componentName"
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
