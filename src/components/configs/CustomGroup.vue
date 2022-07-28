<script setup lang="ts">
import Group from '../widgets/Group.vue'
import InputItem from '@/components/configs/items/InputItem.vue'
import { PageNode, isSomeBasicType, DefaultIconStyleLink, IModuleConfigItem, ModuleConfigType } from '@/config'
import ImageItem from './items/ImageItem.vue'
import SelectItem from './items/SelectItem.vue'
import { usePageStore } from '@/stores/page'
import SliderItem from './items/SliderItem.vue'
import ColorItem from './items/ColorItem.vue'
import Tip from '../widgets/Tip.vue'

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

const getComponentByType = (type: ModuleConfigType) => ({
  [ModuleConfigType.Text]: InputItem,
  [ModuleConfigType.Color]: ColorItem,
})[type]
</script>

<template>
  <Group
    :title="title"
    :icon="icon"
    class="basic-group"
    :default-collapsed="defaultCollapsed"
  >
    <template v-for="item in data">
      <component
        :is="getComponentByType(item.type)"
        :model-value="item.getValue?.(node) || ''"
        :label="item.label"
        v-bind="item.props || {}"
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
