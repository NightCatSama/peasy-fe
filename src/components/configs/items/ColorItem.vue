<script setup lang="ts">
import { Chrome } from '@ckpack/vue-color'
import InputItem from './InputItem.vue';
import Dropdown from '@/components/widgets/Dropdown.vue';

interface IColorItemProps {
  label: string
  modelValue: string
}

const { label, modelValue, ...props } = defineProps<IColorItemProps>()
const restProps = $(props)
const emit = defineEmits(['update:modelValue'])

let showColorPicker = $ref(false)

const value = $computed({
  get: () => modelValue,
  set: (val: any) => {
    emit('update:modelValue', val.hex8 ? val.hex8.slice(-2) === 'FF' ? val.hex : val.hex8 : val)
  },
})

const test = () => emit('update:modelValue', value)

</script>

<template>
  <div :class="['color-item']">
    <InputItem type="text" label="Color" v-model="value">
      <template #suffix>
        <Dropdown type="color-picker" :skidding="20" @apply-hide="test">
          <div class="color-item" :style="{ background: modelValue }"></div>
          <template #content>
            <Chrome v-model="value"></Chrome>
          </template>
        </Dropdown>
      </template>
    </InputItem>
  </div>
</template>

<style lang="scss" scoped>
.item {
  .label {
    flex: 1;
  }

  .color-item {
    width: 26px;
    height: 100%;
    cursor: pointer;
    border-radius: 4px;
    white-space: nowrap;
    transition: all 0.3s;
    border: 1px solid rgba($white, .4);
  }
}
</style>
