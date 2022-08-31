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

const googleAnalytics = $computed({
  get() {
    return setting.value.googleAnalytics || ''
  },
  set(val) {
    setting.value.googleAnalytics = val
  }
})

const customCode = $computed({
  get() {
    return setting.value.customCode || ''
  },
  set(val) {
    setting.value.customCode = val
  }
})
</script>

<template>
  <div :class="['global-setting-panel']">
    <SelectItem
      :label="$t('supportDevice')"
      container=".sidebar-dropdown"
      wrapper-class="select-item"
      :options="{ desktop: $t('desktop'), mobile: $t('mobile'), both: $t('bothClient') }"
      :model-value="setting.client"
      @update:model-value="handleClientChange"
    ></SelectItem>
    <InputItem
      :label="$t('pageTitle')"
      :placeholder="$t('pageTitlePlaceholder')"
      wrapper-class="title-item"
      v-model="setting.title"
    ></InputItem>
    <InputItem
      :label="$t('pageDescription')"
      :placeholder="$t('pageDescriptionPlaceholder')"
      wrapper-class="title-item"
      v-model="setting.description"
    ></InputItem>
    <ImageItem
      :label="$t('pageFavicon')"
      wrapper-class="image-item"
      accept="image/x-icon,image/png"
      v-model="setting.favicon"
    >
    </ImageItem>
    <InputItem
      v-if="false"
      :label="$t('pageGoogleAnalytics')"
      :tip="$t('pageGoogleAnalyticsTip')"
      :placeholder="$t('pageGoogleAnalyticsPlaceholder')"
      wrapper-class="auto-item"
      v-model="googleAnalytics"
    ></InputItem>
    <InputItem
      v-if="false"
      :label="$t('customCode')"
      type="textarea"
      v-model="customCode"
      wrapper-class="column-item"
      :placeholder="$t('customCodePlaceholder')"
    ></InputItem>
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

    &.auto-item {
      padding-top: 12px;
      border-top: 1px solid rgba($white, 20%);
      .label {
        flex: 1;
        flex-basis: auto;
        flex-shrink: 0;
        font-size: 14px;
      }
      .input {
        // flex: 1;
        width: 140px;
        font-size: 13px;
      }
    }

    &.column-item {
      flex-direction: column;
      .label {
        flex-basis: auto;
        margin-bottom: 4px;
      }
    }
  }

  .select-item {
    display: flex;
    align-items: center;
    .label {
      flex: 1;
    }
    .select-value {
      background: $panel-content-gradient;
    }
  }
}
</style>
