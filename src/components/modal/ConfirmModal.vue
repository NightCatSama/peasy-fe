<script lang="ts">
export default {
  inheritAttrs: true,
}
</script>

<script setup lang="ts">
import { $t } from '@/constants/i18n'
import Btn from '../widgets/Btn.vue'
import Input from '../widgets/Input.vue'
import Modal from './Modal.vue'

interface IConfirmModal {
  title?: string
  msg: string
  extraLink?: string
  onExtraLinkClick?: () => void
  okText?: string
  cancelText?: string
  onOk?: () => void
  onCancel?: () => void
  inputVerify?: string
}

const {
  title,
  msg,
  extraLink = '',
  onExtraLinkClick = null,
  okText = $t('ok'),
  cancelText = $t('cancel'),
  inputVerify = '',
  onOk,
  onCancel,
} = defineProps<IConfirmModal>()

let modal = $ref<InstanceType<typeof Modal> | null>(null)
let value = $ref('')

const okBtnDisabled = $computed(() => !!(inputVerify && value !== inputVerify))

defineExpose({})
</script>

<template>
  <Modal ref="modal" class="confirm-modal" :title="title" v-bind="$attrs">
    <div class="modal-msg">
      <!-- <Icon class="tip-icon" color="theme" :name="'warning'" :size="16"></Icon> -->
      <div>{{ msg }}</div>
    </div>
    <div v-if="inputVerify" class="input-verify">
      <div class="input-verify-text">
        {{ $t('deleteConfirmInput1') }}<span class="highlight">{{ inputVerify }}</span
        >{{ $t('deleteConfirmInput2') }}
      </div>
      <Input v-model="value" @input="(e: any) => value = e.target.value"></Input>
    </div>
    <div class="btn-group">
      <div class="extra-link-wrapper" v-if="extraLink">
        <Btn type="text" size="sm" class="extra-link" @click="onExtraLinkClick">
          {{ extraLink }}
        </Btn>
      </div>
      <Btn
        class="cancel-btn"
        type="btn"
        size="sm"
        color="default"
        @click="
          () => {
            onCancel?.()
            modal?.hide()
          }
        "
        >{{ cancelText }}</Btn
      >
      <Btn
        class="ok-btn"
        type="btn"
        size="sm"
        :disabled="okBtnDisabled"
        @click="
          () => {
            onOk?.()
            modal?.hide()
          }
        "
        >{{ okText }}</Btn
      >
    </div>
  </Modal>
</template>

<style lang="scss">
.confirm-modal {
  width: 400px;
  .modal-msg {
    display: flex;
    font-size: 14px;
    padding: 0 0 8px 0;
    white-space: pre-line;

    .tip-icon {
      margin-right: 10px;
    }
  }
  .input-verify {
    margin-top: 12px;
    font-size: 14px;
    display: flex;
    flex-direction: column;

    &-text {
      margin-bottom: 6px;

      .highlight {
        color: $yellow;
        font-weight: bold;
      }
    }
  }
  .btn-group {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;

    .extra-link-wrapper {
      margin-left: -4px;
      flex: 1;
    }
    .cancel-btn {
      margin-right: 10px;
    }
    .ok-btn {
    }
  }
}
</style>
