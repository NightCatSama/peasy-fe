<script setup lang="ts">
import Group from '../widgets/Group.vue'
import InputItem from '@/components/configs/items/InputItem.vue'
import SelectItem from '@/components/configs/items/SelectItem.vue'
import ColorItem from './items/ColorItem.vue';
import { usePageStore } from '@/stores/page';
import { PageNode } from '@/config';

interface IContainerGroupProps {
  node: PageNode
  container: IContainer
}
const { container, node } = defineProps<IContainerGroupProps>()

const updateBackgroundType = (type: 'color' | 'image' | 'gradient') => {
  container.backgroundType = type
}

</script>

<template>
  <Group title="Container" class="container-group" :can-advanced="true" :default-collapsed="true">
    <SelectItem
      :model-value="container.backgroundType"
      :label='"Background"'
      :options="{
        'color': 'Color',
        'image': 'Image',
        'gradient': 'Gradient'
      }"
      @update:model-value="updateBackgroundType"
    ></SelectItem>
    <ColorItem
      v-if="container.backgroundType === 'color'"
      :model-value="container.backgroundColor"
      :label="'Background Color'"
      @update:model-value="color => container.backgroundColor = color"
    ></ColorItem>
    <InputItem
      v-if="container.backgroundType === 'image'"
      :model-value="container.backgroundImage"
      :label="'Image Link'"
      @update:model-value="image => container.backgroundImage = image"
    ></InputItem>
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
