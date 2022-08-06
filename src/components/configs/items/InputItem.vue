<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script setup lang="ts">
import Input from '@/components/widgets/Input.vue'
import { emitter } from '@/utils/event'
import { useDebounce } from 'ahooks-vue'
import { watch } from 'vue'

type IInputProps = Partial<InstanceType<typeof Input>>

interface ISelectItemProps extends IInputProps {
  label?: string
  modelValue: string
  type?: IInputProps['type']
  realTime?: boolean
  onFocus?: IInputProps['onFocus']
  onBlur?: IInputProps['onBlur']
  wrapperClass?: string
}

const props = defineProps<ISelectItemProps>()
const { label, modelValue, type, realTime, wrapperClass, onFocus, onBlur } = $(props)

const emit = defineEmits(['update:model-value'])

const value = $computed({
  get: () => modelValue,
  set: (val: string) => {
    emit('update:model-value', val)
  },
})

let preValue = $ref('')

const handleFocus = (e: Event) => {
  // preValue = modelValue
  onFocus?.(e)
}

const handleBlur = (e: Event) => {
  if (modelValue !== preValue) {
    emitter.emit('saveHistory')
  }
  onBlur?.(e)
}
</script>

<template>
  <div :class="['item', { column: type === 'textarea' }, wrapperClass]">
    <span class="label" v-if="label">
      <slot name="label" :label="label">{{ label }}</slot>
    </span>
    <Input
      class="input"
      v-model="value"
      :type="type"
      :real-time="realTime"
      :on-focus="handleFocus"
      :on-blur="handleBlur"
      v-bind="$attrs"
    >
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

  &.column > .input {
    width: 100%;
    flex: 1;
    height: auto;
  }
}
</style>
