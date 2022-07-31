<script setup lang="ts">
import { upload } from '@/utils/oss'
import InputItem from './InputItem.vue'
import Icon from '@/components/widgets/Icon.vue'
import { emitter } from '@/utils/event';

interface IImageItemProps {
  label: string
  modelValue: string
  placeholder?: string
}
const { modelValue, label, placeholder = 'https://' } = defineProps<IImageItemProps>()
const emit = defineEmits(['update:model-value'])

const handleChange = (img: string) => {
  emit('update:model-value', img)
  emitter.emit('saveHistory')
}

const uploadImage = async (e: InputEvent) => {
  const files = (e.target as HTMLInputElement).files
  if (files?.[0]) {
    const url = await upload(files[0])
    handleChange(url as string)
  }
}
</script>

<template>
  <InputItem
    class="image-item"
    :model-value="modelValue"
    :label="label"
    :type="'textarea'"
    :placeholder="placeholder"
    @update:model-value="handleChange"
  >
    <template #suffix>
      <div class="upload-wrapper">
        <div class="upload-btn">
          Upload
          <input type="file" class="upload-btn-input" accept="image/*" @change="uploadImage" />
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
    padding: 4px;

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
