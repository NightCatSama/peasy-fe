<script setup lang="ts">
import { GroupType, IModuleConfigGroup, IModuleConfigItem, PageNode } from '@/config'
import { getFormPropsByType } from '@/constants/form'
import { lang } from '@/constants/i18n'
import { useGroupConfig } from '@/utils/config'
import { get, has, set } from 'lodash-es'
import { reactive, useAttrs } from 'vue'
import Group from '../widgets/Group.vue'

interface IExtraGroupProps extends IModuleConfigGroup {
  node: PageNode
}

const {
  node,
  title,
  titleEn,
  icon,
  data,
  defaultCollapsed = false,
} = useAttrs() as unknown as IExtraGroupProps

const dataRef = reactive(data)
const getComponentData = (type: string) => getFormPropsByType(type)

const getValue = (sourceValue: string) => {
  const list = sourceValue.split('.')
  const props = useGroupConfig(node, list[0] as GroupType)
  const path = list.slice(1).join('.')
  return get(props, path)
}
const setValue = (targetValue: string | string[], value: string) => {
  if (Array.isArray(targetValue)) {
    targetValue.forEach((item) => setValueOnce(item, value))
  } else {
    setValueOnce(targetValue, value)
  }
}
const setValueOnce = (targetValue: string, value: string) => {
  const list = targetValue.split('.')
  const props = useGroupConfig(node, list[0] as GroupType)
  const path = list.slice(1).join('.')
  if (has(props, path)) {
    set(props, path, value)
  }
}

const showTitle = $computed(() => (lang === 'en' && titleEn) || title)
const getLabel = $computed(
  () => (item: IModuleConfigItem) => (lang === 'en' && item.labelEn) || item.label
)
</script>

<template>
  <Group :title="showTitle" :icon="icon" class="data-group" :default-collapsed="defaultCollapsed">
    <template v-for="item in dataRef">
      <component
        :is="getComponentData(item.type).component"
        :model-value="item.sourceValue ? getValue(item.sourceValue!) : ''"
        :label="getLabel(item)"
        v-bind="{
          ...getComponentData(item.type).props,
          ...item.props,
        }"
        @update:model-value="(val: any) => item.targetValue ? setValue(item.targetValue, val) : null"
      ></component>
    </template>
  </Group>
</template>

<style lang="scss" scoped>
.data-group {
  .label {
    flex: 1;
    margin-right: 8px;
  }
  :deep(.tip) {
    margin-bottom: 8px;
  }
}
</style>
