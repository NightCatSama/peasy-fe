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

interface ICustomGroupProps extends IModuleConfigGroup {
  node: PageNode
}

const { node, title, icon, data, defaultCollapsed } = useAttrs() as unknown as ICustomGroupProps
const dataRef = reactive(data)
const getComponentData = (type: string) => getFormPropsByType(type)
</script>

<template>
  <Group :title="title" :icon="icon" class="basic-group" :default-collapsed="defaultCollapsed">
    <template v-for="item in dataRef">
      <component
        :is="getComponentData(item.type).component"
        :model-value="item.getValue?.(node) || ''"
        :label="item.label"
        v-bind="{
          ...getComponentData(item.type).props,
          ...item.props,
        }"
        @update:model-value="(val: any) => item.setValue?.(val, node)"
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
