<script setup lang="ts">
import { upload, uploadByEvent } from '@/utils/oss'
import InputItem from './InputItem.vue'
import Icon from '@/components/widgets/Icon.vue'
import { emitter } from '@/utils/event'
import { AlertError } from '@/utils/alert'
import { watch } from 'vue'
import { imgErrorFallback } from '@/config'
import { $t } from '@/constants/i18n'
import { inConfigMain } from '@/utils/helper'

interface IImageItemProps {
  label?: string
  modelValue: string
  hideLabel?: boolean
  placeholder?: string
  accept?: string
  loading?: boolean
}
const {
  modelValue,
  label,
  hideLabel,
  placeholder = 'https://',
  accept = 'image/*',
  loading,
} = defineProps<IImageItemProps>()
const emit = defineEmits(['update:model-value'])

let showCover = $ref(!!modelValue)
let coverUrl = $ref(modelValue)
const elem = $ref<HTMLElement | null>(null)

const handleChange = (img: string) => {
  emit('update:model-value', img)
  if (inConfigMain(elem)) {
    emitter.emit('saveHistory')
  }
}

watch(
  () => modelValue,
  () => {
    coverUrl = modelValue
    if (coverUrl) {
      showCover = true
    }
  },
  { immediate: true }
)

const uploadImage = async (e: InputEvent) => {
  uploadByEvent(e, handleChange)
}

const handleCoverError = () => {
  AlertError($t('imageLoadError'))
  coverUrl = imgErrorFallback
}
</script>

<template>
  <InputItem
    ref="elem"
    :wrapper-class="'image-item'"
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
        <Icon
          v-if="modelValue"
          class="preview-btn"
          name="preview"
          type="circle"
          color="primary"
          :size="13"
          @click="showCover = !showCover"
        />
        <div class="upload-btn">
          {{ $t('upload') }}
          <input type="file" class="upload-btn-input" :accept="accept" @change="uploadImage" />
        </div>
        <Icon
          name="question"
          class="question-icon"
          :size="13"
          v-tooltip="{
            showTriggers: ['click'],
            hideTriggers: ['click', 'hover'],
            content: $t('uploadTip'),
          }"
        ></Icon>
      </div>
      <div v-if="showCover && coverUrl && !loading" class="cover" @click="showCover = false">
        <img :src="coverUrl" @error="handleCoverError" />
      </div>
      <div v-if="loading" class="cover">
        <Icon name="spin" :size="32" loading></Icon>
      </div>
    </template>
    <template #default>
      <slot></slot>
    </template>
  </InputItem>
</template>

<style lang="scss" scoped>
.image-item {
  position: relative;
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

    .preview-btn {
      position: absolute;
      right: 100%;
      top: 50%;
      transform: translate(-5px, -50%);
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      background: rgba($panel, 70%);
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        color: $theme;
        background: $panel;
      }
    }

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
      cursor: pointer;
      &:hover {
        color: $theme;
      }
    }
  }
  :deep(.cover) {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    background-color: $panel-dark;
    border-radius: $normal-radius;
    z-index: 1;
    opacity: 0.95;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      max-width: 90%;
      max-height: 90%;
      object-fit: contain;
      border-radius: $inner-radius;
    }
  }
}
</style>
