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
  title: string
  msg: string
  okText?: string
  cancelText?: string
  onOk?: () => void
  onCancel?: () => void
}

const {
  title,
  msg,
  okText = '确定',
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
      <Icon class="tip-icon" color="theme" :name="'warning'" :size="16"></Icon>
      <div>{{ msg }}</div>
    </div>
    <div class="btn-group">
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
  max-width: 500px;
  .modal-msg {
    display: flex;
    font-size: 16px;
    padding: 10px 8px 8px;

    .tip-icon {
      margin-right: 10px;
    }
  }
  .btn-group {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;

    .cancel-btn {
      font-size: 14px;
      margin-right: 10px;
      color: darken($color, 20%);

      &:hover {
        color: $color;
      }
    }
    .ok-btn {
      font-size: 14px;
      // color: $theme;
    }
  }
}
</style>
