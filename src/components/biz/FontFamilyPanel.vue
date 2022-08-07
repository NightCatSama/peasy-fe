<script setup lang="ts">
import { Alert } from '@/utils/alert'
import InputItem from '../configs/items/InputItem.vue'
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'
import GroupItem from '../configs/items/GroupItem.vue'
import SliderItem from '../configs/items/SliderItem.vue'
import Btn from '../widgets/Btn.vue'

const pageStore = usePageStore()
const { font } = storeToRefs(pageStore)

const handleAddFontFace = () => {
  font.value.customFontFace.push('')
  // font.value.customFontFace.push({
  //   fontFamily: '',
  //   url: '',
  //   fontStyle: 'normal',
  //   fontWeight: 'normal',
  // })
}

const deleteFontFace = (index: number) => {
  font.value.customFontFace.splice(index, 1)
}
</script>

<template>
  <div :class="['font-family-panel']">
    <SliderItem
      wrapper-class="font-size-item"
      label="Root Font Size"
      v-model="font.fontSize"
      :min="10"
      :max="100"
    >
    </SliderItem>
    <InputItem
      wrapper-class="font-family-item"
      label="Font Family"
      type="textarea"
      v-model="font.fontFamily"
    ></InputItem>
    <GroupItem
      v-for="(item, index) in font.customFontFace"
      :key="index"
      :class="['font-face-group']"
      @delete="deleteFontFace(index)"
    >
      <template v-if="typeof item === 'object'">
        <InputItem label="Font Name" v-model="item.fontFamily"></InputItem>
        <InputItem label="Url" v-model="item.url"></InputItem>
        <InputItem label="Font Style" v-model="item.fontStyle"></InputItem>
        <InputItem label="Font Weight" v-model="item.fontWeight"></InputItem>
      </template>
      <InputItem
        v-else
        label="Link"
        type="textarea"
        :rows="2"
        :placeholder="'https://'"
        :auto-focus="true"
        :model-value="item"
        @update:model-value="(val: string) => font.customFontFace[index] = val"
      ></InputItem>
    </GroupItem>
    <Btn is-block type="inner" class="full-btn add-color-btn" @click="handleAddFontFace">Add FontFace</Btn>
  </div>
</template>

<style lang="scss">
.font-family-panel {
  width: $font-family-panel-width;
  max-height: 80vh;
  overflow-y: auto;
  border-radius: $normal-radius;
  z-index: $global-setting-panel-zIndex;
  box-shadow: $shadow;
  background: $panel-sidebar-gradient;
  padding: 12px 12px;
  display: flex;
  flex-direction: column;

  .item.column > .label {
    font-size: 14px;
    display: flex;
    margin-bottom: 6px;
  }

  .font-face-group {
    .item.column {
      flex-direction: column;
      align-items: flex-start;
      .label {
        flex: 0;
        margin: 2px 0 4px 0;
        font-size: 14px;
      }
      .input {
        flex: 1;
        word-break: break-all;
        padding: 4px;
        font-size: 13px;
      }
    }
  }

  .font-family-item, .font-size-item {
    margin-bottom: 12px;
  }

  .font-size-item {
    display: flex;
    align-items: center;
  }

  .group-item-delete {
    width: 44px;
  }

  .add-color-btn {
    min-height: 32px;
    flex-shrink: 0;
  }
}
</style>
