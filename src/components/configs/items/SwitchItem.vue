<script setup lang="ts">
import Switch from '@/components/widgets/Switch.vue'
import { emitter } from '@/utils/event'

interface ISwitchItemProps {
  label: string
  modelValue: boolean
}

const { label, modelValue } = defineProps<ISwitchItemProps>()
const emit = defineEmits(['update:model-value'])

const value = $computed({
  get: () => modelValue,
  set: (val: boolean) => {
    emit('update:model-value', val)
    modelValue !== val && emitter.emit('saveHistory')
  },
})
</script>

<template>
  <div class="item">
    <div class="label">{{ label }}</div>
    <Switch v-model="value"></Switch>
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
