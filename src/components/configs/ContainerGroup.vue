<script setup lang="ts">
import Group from '../widgets/Group.vue'
import SelectItem from '@/components/configs/items/SelectItem.vue'
import { PageNode } from '@/config'
import TabsItem from './items/TabsItem.vue'
import SliderItem from './items/SliderItem.vue'

interface IContainerGroupProps {
  node: PageNode
  container: IContainer
}
const { container, node } = defineProps<IContainerGroupProps>()

</script>

<template>
  <Group title="Container" class="container-group" :can-advanced="false" :default-collapsed="true">
    <SliderItem
      label="Opacity"
      v-model="container.opacity"
      :min="0"
      :max="1"
      :interval="0.01"
    ></SliderItem>
    <SelectItem
      label="Overflow"
      :options="{ visible: 'Visible', hidden: 'Hidden', scroll: 'Scroll', auto: 'Auto' }"
      v-model="container.overflow"
    ></SelectItem>
    <!-- TODO: 换成 box shadow 模块 -->
    <TabsItem
      label="Box Shadow"
      :data="[
        {
          key: '0 0 10px 3px rgba(0, 0, 0, .16)',
          value: 'Float',
        },
        {
          key: '0 0 20px 5px rgba(0, 0, 0, 0.16)',
          value: 'Bigger',
        },
        {
          key: '1px 1px 3px 1px rgba(0, 0, 0, 0.36)',
          value: 'Bulge',
        },
      ]"
      v-model="container.boxShadow"
    ></TabsItem>
  </Group>
</template>

<style lang="scss" scoped>
.container-group {
  .label {
    flex: 1;
    margin-right: 8px;
  }
}
</style>
