<script lang="ts">
export default {
  inheritAttrs: false
}
</script>

<script setup lang="ts">
import { useAttrs } from 'vue';
import Icon from '../widgets/Icon.vue';

interface IModalProps {
  width?: string
  modelValue?: boolean
  title?: string
  onHide?: () => boolean | void
}

const { modelValue, title, width, onHide } = defineProps<IModalProps>()
const onUpdate = useAttrs()['onUpdate:modelValue'] as any

const handleClose = () => {
  if (onHide?.() === true) return
  onUpdate(false)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div :class="['modal-wrapper']" v-show="modelValue">
        <div class="modal-mask" @click="handleClose"></div>
        <div :class="['modal-content']" :style="{ width: width ? `${width}`: '' }" v-bind="$attrs">
          <div class="modal-content-header">
            <div class="modal-content-header-title" v-if="title">{{ title }}</div>
          </div>
          <Icon
            name="close"
            type="btn"
            :size="20"
            class="modal-content-close"
            @click="handleClose"
          ></Icon>
          <slot></slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.modal-wrapper {
  position: fixed;
  z-index: $modal-zIndex;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  .modal-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }

  .modal-content {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    min-width: 200px;
    max-height: 70vh;
    overflow: auto;
    padding: 16px 20px;
    z-index: 1;
    background-color: $panel;
    border-radius: $normal-radius;
    box-shadow: $shadow;
    color: $color;

    &-header {
      padding-bottom: 24px;

      &:empty {
        display: none;
      }

      &-title {
        font-size: 18px;
        font-weight: bold;
        color: $yellow;
      }
    }

    &-close {
      position: absolute;
      right: 8px;
      top: 10px;
    }
  }
}
</style>

<style lang="scss">
.modal-fade-leave-active,
.modal-fade-enter-active {
  transition: all 0.2s;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>