<script setup lang="ts">
import Switch from '@/components/widgets/Switch.vue'

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
