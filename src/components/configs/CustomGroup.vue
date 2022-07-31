<script setup lang="ts">
import Group from '../widgets/Group.vue'
import { PageNode, isSomeBasicType, DefaultIconStyleLink, IModuleConfigItem, ModuleConfigType } from '@/config'
import { getFormPropsByType } from '@/constants/form'
import { onUpdated, reactive } from 'vue';

interface ICustomGroupProps {
  node: PageNode
  title: string
  /** 图标 */
  icon?: string
  /** 是否默认展开 */
  defaultCollapsed?: boolean
  /** 展示数据 */
  data: IModuleConfigItem[]
}
const { node, title, icon, data, defaultCollapsed } = defineProps<ICustomGroupProps>()
const dataRef = reactive(data)
const getComponentData = (type: string) => getFormPropsByType(type)
</script>

<template>
  <Group
    :title="title"
    :icon="icon"
    class="basic-group"
    :default-collapsed="defaultCollapsed"
  >
    <template v-for="item in dataRef">
      <component
        :is="getComponentData(item.type).component"
        :model-value="item.getValue?.(node) || ''"
        :label="item.label"
        v-bind="{ ...getComponentData(item.type).props, ...item.props }"
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
}
</style>
