<script setup lang="ts">
import { DefaultColor, PageNode } from '@/config'
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'
import ColorItem from '../configs/items/ColorItem.vue';
import Icon from '../widgets/Icon.vue';
import InputItem from '../configs/items/InputItem.vue';
import Btn from '../widgets/Btn.vue';
import GroupItem from '../configs/items/GroupItem.vue';

const pageStore = usePageStore()
const { addSection, setActiveSection, setActiveNode, swapSection } = pageStore
const { colorVars } = storeToRefs(pageStore)

const deleteColor = (index: number) => {
  colorVars.value.splice(index, 1)
}

const handleAddColor = () => {
  colorVars.value.push({
    name: '',
    color: DefaultColor,
  })
}
</script>

<template>
  <div class="color-var-list">
    <GroupItem
      v-for="(item, index) in colorVars"
      :key="item.name + index"
      class="color-var-item"
      @delete="deleteColor(index)"
    >
      <InputItem
        label="Name"
        prefix="$"
        v-model="item.name"
      ></InputItem>
      <ColorItem
        :model-value="item.color"
        :label="'Color'"
        hide-variable
        @update:model-value="(color) => item.color = color"
      >
      </ColorItem>
    </GroupItem>
    <Btn is-block type="inner" class="full-btn add-color-btn" @click="handleAddColor">Add Color</Btn>
  </div>
</template>

<style lang="scss" scoped>
.color-var-list {
  width: 250px;
  padding: 12px;
  max-height: 60vh;
  overflow-y: auto;

  .add-color-btn {
    cursor: pointer;
  }
}
</style>
