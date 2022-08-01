<script setup lang="ts">
import { usePageStore } from '@/stores/page';
import { storeToRefs } from 'pinia'
import { Alert } from '@/utils/alert';
import InputItem from '../configs/items/InputItem.vue';
import ImageItem from '../configs/items/ImageItem.vue';

const pageStore = usePageStore()
const { setting } = storeToRefs(pageStore)

</script>

<template>
  <div :class="['global-setting-panel']">
    <InputItem
      label="Title"
      placeholder="网站标题"
      wrapper-class="title-item"
      v-model="setting.title"
    ></InputItem>
    <InputItem
      label="Desc"
      placeholder="网站简短描述，用于搜索引擎优化"
      wrapper-class="title-item"
      v-model="setting.description"
    ></InputItem>
    <ImageItem
      label="Favicon"
      wrapper-class="favicon-item"
      accept="image/x-icon,image/png"
      v-model="setting.favicon"
    >
    </ImageItem>
  </div>
</template>

<style lang="scss">
.global-setting-panel {
  width: $global-setting-panel-width;
  max-height: 60vh;
  overflow-y: auto;
  border-radius: $normal-radius;
  z-index: $global-setting-panel-zIndex;
  box-shadow: $shadow;
  background: $panel-sidebar-gradient;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;

  > .item:not(:last-child) {
    margin-bottom: 10px;
  }

  .item {
    display: flex;
    align-items: center;

    .label {
      flex: 0;
      flex-basis: 64px;
      flex-shrink: 0;
      font-size: 14px;
    }

    .input {
      flex: 1;
      font-size: 13px;
    }
  }
}
</style>
