<script setup lang="ts">
import Group from '../widgets/Group.vue'
import InputItem from '@/components/configs/items/InputItem.vue'
import { PageNode, isSomeBasicType, DefaultIconStyleLink, IModuleConfigItem } from '@/config'
import ImageItem from './items/ImageItem.vue'
import SelectItem from './items/SelectItem.vue'
import { usePageStore } from '@/stores/page'
import SliderItem from './items/SliderItem.vue'
import ColorItem from './items/ColorItem.vue'
import Tip from '../widgets/Tip.vue'

interface ICustomGroupProps {
  node: PageNode
  /** 图标 */
  icon?: string
  /** 是否默认展开 */
  defaultCollapsed?: boolean
  /** 展示数据 */
  data: IModuleConfigItem[]
}
const { node, icon, data, defaultCollapsed } = defineProps<ICustomGroupProps>()

interface ShowItem {
  isAdvanced?: boolean
  component: any
  props: any
  setValue?: (val: any) => void
  hide?: boolean
}
</script>

<template>
  <Group
    title="Basic"
    group-name="basic"
    class="basic-group"
    :default-collapsed="defaultCollapsed"
  >
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
