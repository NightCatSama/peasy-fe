<script lang="ts">
export default {
  inheritAttrs: true,
}
</script>

<script setup lang="ts">
import Modal from './Modal.vue'
import Btn from '../widgets/Btn.vue'
import Icon from '../widgets/Icon.vue'
import { $t } from '@/constants/i18n';

interface IGuideModal {
  title?: string
  tips: { image: string; msg: string }[]
  extraLink?: string
  onExtraLinkClick?: () => void
  onOk?: () => void
}

const {
  title,
  tips,
  extraLink = '',
  onExtraLinkClick = null,
  onOk,
} = defineProps<IGuideModal>()

let modal = $ref<InstanceType<typeof Modal> | null>(null)
let index = $ref(0)

const tip = $computed(() => tips[index])

defineExpose({})
</script>

<template>
  <Modal ref="modal" class="guide-modal" :title="title + ` (${index + 1}/${tips.length})`" v-bind="$attrs">
    <div class="modal-container">
      <div class="modal-tip-item" v-if="tip">
        <img class="modal-tip-item-image" :src="tip.image" :alt="tip.msg">
        <div class="modal-tip-item-text" v-html="tip.msg"></div>
      </div>
    </div>
    <div class="btn-group">
      <div class="extra-link-wrapper" v-if="extraLink">
        <Btn type="text" size="sm" class="extra-link" @click="onExtraLinkClick">
          {{ extraLink }}
        </Btn>
      </div>
      <Btn
        v-if="index > 0"
        class="cancel-btn"
        type="text"
        size="sm"
        color="second"
        @click="index--"
        >{{ $t('prevStep') }}</Btn
      >
      <Btn
        class="ok-btn"
        type="btn"
        size="sm"
        @click="
          () => {
            if (index >= tips.length - 1) {
              onOk?.()
              modal?.hide()
            } else {
              index++
            }
          }
        "
        >{{ index >= tips.length - 1 ? $t('finish') : $t('nextStep') }}</Btn
      >
    </div>
  </Modal>
</template>

<style lang="scss">
.guide-modal {
  width: 600px;
  .modal-tip-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &-image {
      width: 100%;
      // height: 320px;
      object-fit: contain;
      border-radius: $normal-radius;
      margin-bottom: 10px;
    }
    &-text {
      font-size: 13px;
      color: $color;
      text-align: center;
      line-height: 20px;
      margin: 0 24px;
      a {
        color: $orange;
        text-decoration: underline;
      }
      b {
        font-weight: bold;
        color: $white;
      }
      em {
        font-style: normal;
        font-size: 14px;
        font-weight: bold;
        color: $yellow;
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
      margin-right: 24px;
    }
    .ok-btn {
    }
  }
}
</style>
