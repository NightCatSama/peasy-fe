<script setup lang="ts">
import Select from '@/components/widgets/Select.vue'

interface ISelectItemProps {
  label: string
  modelValue: string
  options: { [key: string]: string }
}

const { label, modelValue, options } = defineProps<ISelectItemProps>()
const emit = defineEmits(['update:modelValue'])

const value = $computed({
  get: () => modelValue,
  set: (val: string) => {
    emit('update:modelValue', val)
  },
})

</script>

<template>
  <div class="item">
    <div class="label">{{ label }}</div>
    <Select v-model="value" :options="options"></Select>
  </div>
</template>

<style lang="scss" scoped>
.item {
  .label {
    flex: 1;
  }
}
</style>
