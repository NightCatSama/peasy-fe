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
import { get, set } from 'lodash'
import { useConfig } from '@/utils/config'

interface ICustomGroupProps extends IModuleConfigGroup {
  node: PageNode
}

const { node, title, icon, data, defaultCollapsed } = useAttrs() as unknown as ICustomGroupProps
const dataRef = reactive(data)
const getComponentData = (type: string) => getFormPropsByType(type)

const getValue = (sourceValue: string) => get(node, sourceValue)
const setValue = (sourceValue: string | string[], value: string) =>
  Array.isArray(sourceValue)
    ? sourceValue.forEach((v) => set(node, v, value))
    : set(node, sourceValue, value)
</script>

<template>
  <Group :title="title" :icon="icon" class="basic-group" :default-collapsed="defaultCollapsed">
    <template v-for="item in dataRef">
      <component
        :is="getComponentData(item.type).component"
        :model-value="item.sourceValue ? getValue(item.sourceValue!) : ''"
        :label="item.label"
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
