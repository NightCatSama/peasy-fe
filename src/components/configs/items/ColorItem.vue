<script setup lang="ts">
import { Chrome } from '@ckpack/vue-color'
import InputItem from './InputItem.vue'
import Dropdown from '@/components/widgets/Dropdown.vue'

interface IColorItemProps {
  label: string
  modelValue: string
}

const { label, modelValue } = defineProps<IColorItemProps>()
const emit = defineEmits(['update:model-value'])

const value = $computed({
  get: () => modelValue,
  set: (val: any) => {
    emit('update:model-value', val.hex8 ? (val.hex8.slice(-2) === 'FF' ? val.hex : val.hex8) : val)
  },
})

const test = () => emit('update:model-value', value)
</script>

<template>
  <InputItem type="text" :label="label" v-model="value">
    <template #suffix>
      <Dropdown type="color-picker" :skidding="20" @apply-hide="test">
        <div class="color-preview" :style="{ background: modelValue }"></div>
        <template #content>
          <Chrome v-model="value"></Chrome>
        </template>
      </Dropdown>
    </template>
    <slot></slot>
  </InputItem>
</template>

<style lang="scss" scoped>
.item {
  display: flex;
  align-items: center;
  .label {
    flex: 1;
  }

  .color-preview {
    width: 26px;
    height: 100%;
    cursor: pointer;
    border-radius: 4px;
    white-space: nowrap;
    transition: all 0.3s;
    border: 1px solid rgba($white, 0.4);
  }
}
</style>
