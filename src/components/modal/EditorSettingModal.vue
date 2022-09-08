<script lang="ts">
export default {
  inheritAttrs: true,
}
</script>

<script setup lang="ts">
import InputItem from '../configs/items/InputItem.vue'
import Btn from '../widgets/Btn.vue'
import Modal from './Modal.vue'
import { createMaterialSnapshot } from '@/utils/snapshot'
import ImageItem from '../configs/items/ImageItem.vue'
import { Alert, AlertError, AlertLoading } from '@/utils/alert'
import { reactive, useAttrs, watch } from 'vue'
import { $t } from '@/constants/i18n'
import { uploadByBase64 } from '@/utils/oss'
import SwitchItem from '../configs/items/SwitchItem.vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { verifySubDomain } from '@/utils/validation'
import { usePageStore } from '@/stores/page'
import ColorItem from '../configs/items/ColorItem.vue'
import { useDisplayStore } from '@/stores/display'

const displayStore = useDisplayStore()

const { editorSettings } = storeToRefs(displayStore)

const handleSave = () => null
</script>

<template>
  <Modal
    ref="modal"
    class="editor-setting-modal"
    :title="$t('editorSetting')"
    :width="'320px'"
    close-on-click-mask
    v-bind="$attrs"
  >
    <div class="info-wrapper">
      <ColorItem :label="$t('editorBackground')" v-model="editorSettings.backgroundColor"></ColorItem>
      <ColorItem :label="$t('editorSelected')" v-model="editorSettings.selectColor"></ColorItem>
      <ColorItem :label="$t('editorContours')" v-model="editorSettings.contoursColor"></ColorItem>
    </div>
  </Modal>
</template>

<style lang="scss">
.editor-setting-modal {
  .info-wrapper {
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
  }
  .item {
    display: flex;
    align-items: center;

    &:not(:last-child) {
      margin-bottom: 12px;
    }
    .label {
      flex: none;
      width: 120px;
      margin-right: 12px;
      font-size: 14px;
    }
    .input {
      flex: 1;
    }
  }
  .btn-wrapper {
    display: flex;
    justify-content: flex-end;

    &-left {
      flex: 1;
      display: flex;
    }

    .save-btn {
      min-height: 36px;
      width: 120px;
    }
  }
}
</style>
