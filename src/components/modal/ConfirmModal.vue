<script lang="ts">
export default {
  inheritAttrs: true
}
</script>

<script setup lang="ts">
import Modal from './Modal.vue'
import Btn from '../widgets/Btn.vue';
import Icon from '../widgets/Icon.vue';

interface IConfirmModal {
  title?: string
  msg: string
  extraLink?: string
  onExtraLinkClick?: () => void
  okText?: string
  cancelText?: string
  onOk?: () => void
  onCancel?: () => void
}

const {
  title,
  msg,
  extraLink = '',
  onExtraLinkClick,
  okText = '确认',
  cancelText = '取消',
  onOk,
  onCancel,
} = defineProps<IConfirmModal>()

let modal = $ref<InstanceType<typeof Modal> | null>(null)

defineExpose({
})
</script>

<template>
  <Modal ref="modal" class="confirm-modal" :title="title" v-bind="$attrs">
    <div class="modal-msg">
      <!-- <Icon class="tip-icon" color="theme" :name="'warning'" :size="16"></Icon> -->
      <div>{{ msg }}</div>
    </div>
    <div class="btn-group">
      <div class="extra-link-wrapper" v-if="extraLink">
        <Btn type="text" size="sm" class="extra-link" @click="onExtraLinkClick">
          {{ extraLink }}
        </Btn>
      </div>
      <Btn class="cancel-btn" type="btn" size="sm" color="default" @click="() => {
        onCancel?.()
        modal?.hide()
      }">{{ cancelText }}</Btn>
      <Btn class="ok-btn" type="btn" size="sm" @click="() => {
        onOk?.()
        modal?.hide()
      }">{{ okText }}</Btn>
    </div>
  </Modal>
</template>

<style lang="scss">
.confirm-modal {
  width: 350px;
  .modal-msg {
    display: flex;
    font-size: 14px;
    padding: 0 0 8px 0;

    .tip-icon {
      margin-right: 10px;
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
