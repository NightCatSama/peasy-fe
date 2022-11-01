<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script setup lang="ts">
import Input from '@/components/widgets/Input.vue'
import Icon from '@/components/widgets/Icon.vue'
import { emitter } from '@/utils/event'
import { inConfigMain } from '@/utils/helper'
import { nextTick } from 'vue'

type IInputProps = Partial<InstanceType<typeof Input>>

interface ISelectItemProps extends IInputProps {
  label?: string
  modelValue: string
  type?: IInputProps['type']
  realTime?: boolean
  onFocus?: IInputProps['onFocus']
  onBlur?: IInputProps['onBlur']
  wrapperClass?: string
  tip?: string
}

const props = defineProps<ISelectItemProps>()
const { label, modelValue, type, realTime, wrapperClass, tip, onFocus, onBlur } = $(props)

const emit = defineEmits(['update:model-value'])

const value = $computed({
  get: () => modelValue,
  set: (val: string) => {
    emit('update:model-value', val)
  },
})

let preValue = $ref('')

const handleFocus = (e: Event) => {
  preValue = modelValue
  onFocus?.(e)
}

const handleBlur = (e: Event) => {
  const elem = e.target as HTMLElement
  nextTick(() => {
    if (modelValue !== preValue && inConfigMain(elem)) {
      emitter.emit('saveHistory')
    }
  })
  onBlur?.(e)
}
</script>

<template>
  <div :class="['item', { column: type === 'textarea' }, wrapperClass]">
    <span class="label" v-if="label">
      <slot name="label" :label="label">{{ label }}</slot>
      <Icon
        v-if="tip"
        name="question"
        class="question-icon"
        :size="13"
        v-tooltip="{
          content: tip,
          html: true,
        }"
      ></Icon>
      <div class="label-suffix"><slot name="label-suffix"></slot></div>
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
    display: flex;
    align-items: center;

    &-suffix {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }

  .input {
    width: $item-width;
    flex: none;
  }

  &.column > .label {
    width: 100%;
  }

  &.column > .input {
    width: 100%;
    flex: 1;
    height: auto;
  }
}
</style>
