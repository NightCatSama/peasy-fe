<script setup lang="ts">
import { DefaultColor, PageNode } from '@/config'
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'
import ColorItem from '../configs/items/ColorItem.vue';
import Icon from '../widgets/Icon.vue';
import InputItem from '../configs/items/InputItem.vue';
import Btn from '../widgets/Btn.vue';

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
    <div
      v-for="(item, index) in colorVars"
      :key="item.name + index"
      class="color-var-item"
    >
      <div class="color-var-item-content">
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
      </div>
      <div class="color-var-item-delete">
        <Icon
          :class="['delete-btn']"
          type="circle"
          name="line"
          :size="10"
          @click="deleteColor(index)"
        ></Icon>
      </div>
     </div>
     <Btn is-block type="inner" class="full-btn add-color-btn" @click="handleAddColor">Add Color</Btn>
  </div>
</template>

<style lang="scss" scoped>
.color-var-list {
  width: 250px;
  padding: 12px;
  max-height: 60vh;
  overflow-y: auto;

  .color-var-item {
    display: flex;
    margin-bottom: 10px;

    &-content {
      flex: 1;
      padding: 6px;
      border-radius: 6px;
      border: 1px dashed rgba($white, .3);
    }

    &-delete {
      width: 32px;
      flex-shrink: 0;
      padding: 0 3px;
      margin-left: 4px;
      .delete-btn {
        border-radius: $inner-radius;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: $red;
        color: $color;
        cursor: pointer;
        &:hover {
          background: lighten($red, 8%)
        }
      }
    }

    :deep(.item) {
      width: 100%;
      display: flex;
      align-items: center;
      min-height: 32px;
      &:first-child {
        margin-bottom: 8px;
      }
      .label {
        flex: 1;
        font-size: 12px;
        text-align: right;
        margin-right: 12px;
      }
    }
  }
  .add-color-btn {
    cursor: pointer;
  }
}
</style>
