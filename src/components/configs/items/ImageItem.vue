<script setup lang="ts">
import { upload, uploadByEvent } from '@/utils/oss'
import InputItem from './InputItem.vue'
import Icon from '@/components/widgets/Icon.vue'
import { emitter } from '@/utils/event'

interface IImageItemProps {
  label?: string
  modelValue: string
  hideLabel?: boolean
  placeholder?: string
  accept?: string
}
const {
  modelValue,
  label,
  hideLabel,
  placeholder = 'https://',
  accept = 'image/*',
} = defineProps<IImageItemProps>()
const emit = defineEmits(['update:model-value'])

const handleChange = (img: string) => {
  emit('update:model-value', img)
  emitter.emit('saveHistory')
}

const uploadImage = async (e: InputEvent) => {
  uploadByEvent(e, handleChange)
}
</script>

<template>
  <InputItem
    class="image-item"
    :model-value="modelValue"
    :label="label"
    :type="'textarea'"
    :placeholder="placeholder"
    v-bind="$attrs"
    @update:model-value="handleChange"
  >
    <template #label v-if="!hideLabel"><slot name="label"></slot></template>
    <template #suffix>
      <div class="upload-wrapper">
        <div class="upload-btn">
          Upload
          <input type="file" class="upload-btn-input" :accept="accept" @change="uploadImage" />
        </div>
        <Icon
          name="question"
          class="question-icon"
          :size="13"
          v-tooltip="{
            showTriggers: ['click'],
            hideTriggers: ['click', 'hover'],
            content: 'Stability not guaranteed',
          }"
        ></Icon>
      </div>
    </template>
    <template #default><slot></slot></template>
  </InputItem>
</template>

<style lang="scss" scoped>
.image-item {
  .upload-wrapper {
    position: absolute;
    right: 4px;
    bottom: 4px;
    font-size: 13px;
    display: flex;
    align-items: center;
    z-index: 1;
    padding: 4px 4px 4px 8px;
    background: rgba($panel, 70%);
    border-radius: $inner-radius;

    .upload-btn {
      position: relative;
      margin-right: 4px;

      &-input {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: default;
      }
    }

    .upload-btn,
    .question-icon {
      cursor: default;
      &:hover {
        color: $theme;
      }
    }
  }
}
</style>
