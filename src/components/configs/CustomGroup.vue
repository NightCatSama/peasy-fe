<script setup lang="ts">
import Group from '../widgets/Group.vue'
import {
  PageNode,
  isSomeBasicType,
  DefaultIconStyleLink,
  IModuleConfigItem,
  ModuleConfigType,
  IModuleConfigGroup,
} from '@/config'
import { getFormPropsByType } from '@/constants/form'
import { onUpdated, reactive, useAttrs } from 'vue'
import { get, set, has } from 'lodash-es'
import { useConfig } from '@/utils/config'
import { lang } from '@/constants/i18n'
import { emitter } from '@/utils/event'

interface ICustomGroupProps extends IModuleConfigGroup {
  node: PageNode
}

const { node, title, titleEn, icon, data, defaultCollapsed = false } = useAttrs() as unknown as ICustomGroupProps
const dataRef = reactive(data)
const getComponentData = (type: string) => getFormPropsByType(type)

const getValue = (sourceValue: string) => get(node, sourceValue)
const setValue = (targetValue: string | string[], value: string) => {
  const list = Array.isArray(targetValue) ? targetValue.slice() : [targetValue]
  while (list.length) {
    const v = list.shift()!
    if (v.includes('config.all.')) {
      list.unshift(
        v.replace('config.all.', 'config.props.'),
        v.replace('config.all.', 'config.mobile.')
      )
    } else {
      has(node, v) && set(node, v, value)
    }
  }
}

const showTitle = $computed(() => lang === 'en' && titleEn || title)
const getLabel = $computed(() => (item: IModuleConfigItem) => lang === 'en' && item.labelEn || item.label)
</script>

<template>
  <Group :title="showTitle" :icon="icon" class="basic-group" :default-collapsed="defaultCollapsed">
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
.basic-group {
  .label {
    flex: 1;
    margin-right: 8px;
  }
  :deep(.tip) {
    margin-bottom: 8px;
  }
}
</style>
