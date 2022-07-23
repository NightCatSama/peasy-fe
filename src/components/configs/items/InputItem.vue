<script setup lang="ts">
import Input from '@/components/widgets/Input.vue'

type IInputProps = InstanceType<typeof Input>

interface ISelectItemProps {
  label: string
  modelValue: string
  placeholder?: string
  suffix?: IInputProps['suffix']
  realTime?: boolean
  type?: IInputProps['type']
  autoFocus?: boolean
}

const { label, modelValue, type, placeholder, suffix, realTime, autoFocus } =
  defineProps<ISelectItemProps>()
const restProps = $computed(() => ({
  placeholder,
  suffix,
  realTime,
  type,
  autoFocus,
}))
const emit = defineEmits(['update:model-value'])

const value = $computed({
  get: () => modelValue,
  set: (val: string) => {
    emit('update:model-value', val)
  },
})
</script>

<template>
  <div :class="['item', { column: type === 'textarea' }]">
    <span class="label">{{ label }}</span>
    <Input class="input" v-model="value" v-bind="restProps">
      <template #suffix><slot name="suffix"></slot></template>
    </Input>
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.item {
  .label {
    flex: 1;
  }

  .input {
    width: $item-width;
    flex: none;
  }

  &.column {
    .input {
      width: 100%;
      flex: 1;
      height: auto;
    }
  }
}
</style>
