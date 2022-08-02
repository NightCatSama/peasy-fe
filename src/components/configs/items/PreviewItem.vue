<script setup lang="ts">
import { emitter } from '@/utils/event'
import InputItem from './InputItem.vue'
interface IPreviewItemProps {
  label: string
  modelValue: string
  options: string[]
  hideAdvanced?: boolean
}

const { label, modelValue, options, hideAdvanced } = defineProps<IPreviewItemProps>()
const emit = defineEmits(['update:model-value'])

const activeIndex = $computed(() => options.indexOf(modelValue))

const handleChange = (item: string) => {
  emit('update:model-value', item)
  emitter.emit('saveHistory')
}

const showCodeInput = $ref(false)
</script>

<template>
  <div class="item preview-item">
    <div class="label" @dblclick="showCodeInput = hideAdvanced ? false : !showCodeInput">
      {{ label }}
    </div>
    <div class="preview-wrapper">
      <div
        v-for="(item, index) in options"
        :key="index"
        :class="['preview-wrapper-item', { active: activeIndex === index }]"
        @click="() => handleChange(activeIndex === index ? '' : item)"
      >
        <slot :item="item" :index="index" :active="activeIndex === index"></slot>
      </div>
    </div>
    <InputItem
      v-if="showCodeInput"
      :label="label + ' Code'"
      :model-value="modelValue"
      @update:model-value="handleChange"
    ></InputItem>
  </div>
</template>

<style lang="scss" scoped>
.preview-item {
  align-items: flex-start;
  flex-direction: column;

  .label {
    margin: 5px 0 10px 0;
  }

  .preview-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    &-item {
      position: relative;
      margin-right: 10px;
      margin-bottom: 10px;
      width: calc(33.3% - 10px);
      height: 78px;
      border-radius: $normal-radius;
      background: $color;
      padding: 20px;
      cursor: pointer;
      overflow: hidden;
      display: flex;
      flex-direction: column;

      &:nth-child(n + 3) {
        margin-right: 0;
      }
    }

    :deep(.inner-box) {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: $inner-radius;
      background: $white-gradient;
      overflow: hidden;

      $edge: 8px;
      &.active::after {
        content: '';
        position: absolute;
        right: -$edge;
        top: -$edge;
        width: $edge * 2;
        height: $edge * 2;
        background: $theme;
        transform: rotate(45deg);
        box-shadow: $shadow;
      }
    }
  }
}
</style>
