<script setup lang="ts">
import Select, { ISelectItem } from '@/components/widgets/Select.vue'
import { emitter } from '@/utils/event'

interface ISelectItemProps {
  label: string
  modelValue: string
  options: { [key: string]: string | ISelectItem }
}

const { label, modelValue, options } = defineProps<ISelectItemProps>()
const emit = defineEmits(['update:model-value'])

const value = $computed({
  get: () => modelValue,
  set: (val: string) => {
    emit('update:model-value', val)
    modelValue !== val && emitter.emit('saveHistory')
  },
})
</script>

<template>
  <div class="item">
    <div class="label">{{ label }}</div>
    <Select v-model="value" :options="options" v-bind="$attrs">
      <template #item="{ item }"><slot name="item" :item="item"></slot></template>
    </Select>
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.item {
  .label {
    flex: 1;
  }
}
</style>
