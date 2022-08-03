<script setup lang="ts">
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'
import { Alert } from '@/utils/alert'
import InputItem from '../configs/items/InputItem.vue'
import ImageItem from '../configs/items/ImageItem.vue'
import SelectItem from '../configs/items/SelectItem.vue'
import { useDisplayStore } from '@/stores/display'
import { nextTick } from 'vue'
import { emitter } from '@/utils/event'

const pageStore = usePageStore()
const { setting } = storeToRefs(pageStore)

const displayStore = useDisplayStore()
const { deviceType } = storeToRefs(displayStore)
const { setDevice } = displayStore

const handleClientChange = (client: IPageSetting['client']) => {
  setting.value.client = client
  if (client === 'desktop' && deviceType.value === 'mobile') {
    deviceType.value = 'desktop'
    setDevice(0)
    nextTick(() => emitter.emit('location', true))
  }
  if (client === 'mobile' && deviceType.value === 'desktop') {
    deviceType.value = 'mobile'
    setDevice(0)
    nextTick(() => emitter.emit('location', true))
  }
}
</script>

<template>
  <div :class="['global-setting-panel']">
    <SelectItem
      label="Support Device"
      container=".sidebar-dropdown"
      wrapper-class="select-item"
      :options="{ desktop: 'Desktop', mobile: 'Mobile', both: 'Desktop & Mobile' }"
      :model-value="setting.client"
      @update:model-value="handleClientChange"
    ></SelectItem>
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

  .select-item {
    display: flex;
    align-items: center;
    .label {
      flex: 1;
    }
  }
}
</style>
