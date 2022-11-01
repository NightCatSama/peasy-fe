<script setup lang="ts">
import { DefaultColor } from '@/config'
import { usePageStoreHelper } from '@/hooks/store'
import ColorItem from '../configs/items/ColorItem.vue'
import GroupItem from '../configs/items/GroupItem.vue'
import InputItem from '../configs/items/InputItem.vue'
import Btn from '../widgets/Btn.vue'

const { colorVars } = usePageStoreHelper()

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
      <InputItem :label="$t('colorVariableName')" prefix="$" v-model="item.name"></InputItem>
      <ColorItem
        :model-value="item.color"
        :label="$t('colorVariableColor')"
        hide-variable
        @update:model-value="(color) => (item.color = color)"
      >
      </ColorItem>
    </GroupItem>
    <Btn is-block type="inner" class="full-btn add-color-btn" @click="handleAddColor">{{
      $t('addColor')
    }}</Btn>
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
