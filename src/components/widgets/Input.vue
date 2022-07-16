<script setup lang="ts">
import { watchEffect, defineEmits, nextTick } from 'vue'
import Select from './Select.vue'

const emit = defineEmits(['update:modelValue'])

type SuffixType = 'px' | '%' | 'auto' | 'none' | 'stretch'

interface IInputProps {
  type?: 'text' | 'number'
  modelValue?: string
  disabled?: boolean
  suffix?: SuffixType[]
}

const { type = 'text', modelValue = '', suffix, disabled } = defineProps<IInputProps>()

let inputValue = $ref(modelValue)
let suffixInValue = $ref('')
let focus = $ref(false)
let inputRef = $ref<HTMLInputElement | null>(null)
let memoryNumberValue = $ref(0)

watchEffect(() => (memoryNumberValue = parseFloat(inputValue) || memoryNumberValue))

const suffixMap = {
  px: 'px',
  '%': '%',
  auto: 'Adaptive',
  none: 'Unlimited',
  stretch: 'Stretch',
}

const hideInput = $computed(() => ['auto', 'none', 'stretch'].includes(suffixInValue))

const getSuffixText = $computed(() => (suffixType: SuffixType) => {
  return suffixMap[suffixType]
})

const getValueBySuffix = $computed(() => (suffixType: string) => {
  return (
    {
      px: (parseFloat(inputValue) || memoryNumberValue) + 'px',
      '%': (parseFloat(inputValue) || memoryNumberValue) + '%',
      auto: 'auto',
      none: 'none',
      stretch: 'stretch',
    }[suffixType] || inputValue
  )
})

watchEffect(() => {
  if (suffix && suffix.length > 0 && modelValue) {
    suffixInValue = suffix[0]
    suffix.some((s: string) => {
      if (modelValue.slice(-s.length) === s) {
        suffixInValue = s
        return true
      }
    })
    if (suffixInValue) {
      inputValue = modelValue.slice(0, -suffixInValue.length)
    }
  }
})

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value
  if (type === 'number') {
    value = '' + (parseFloat(value) || 0)
  }
  inputValue = value
  emit('update:modelValue', getValueBySuffix(suffixInValue))
}

const handleSuffixClick = (key: string) => {
  emit('update:modelValue', getValueBySuffix(key))
  nextTick(() => inputRef?.focus?.())
}
</script>

<template>
  <div :class="['input-wrapper', { disabled, focus }]">
    <input
      ref="inputRef"
      v-show="!hideInput"
      :type="'text'"
      :value="inputValue"
      :disabled="disabled"
      @keyup.enter="handleChange"
      @focus="focus = true"
      @blur="(e: Event) => {
        focus = false
        handleChange(e)
      }"
    />
    <template v-if="suffixInValue && suffix">
      <Select
        display="inline"
        :model-value="suffixInValue"
        :options="Object.fromEntries(suffix.map((s) => [s, getSuffixText(s)]))"
        @update:model-value="handleSuffixClick"
      ></Select>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.input-wrapper {
  display: inline-flex;
  border-radius: $normal-radius;
  padding: 2px;
  height: $item-height;
  background: $item-bg;
  border: 1px solid $item-bg;
  flex: 1;
  font-size: 12px;

  &.disabled {
    cursor: not-allowed;
    opacity: 0.5;
    transition: all 0.3s;
  }

  &.focus {
    border-color: $theme;
  }

  input {
    background: $tr;
    border: none;
    outline: none;
    color: $color;
    width: 100%;
    padding: 0 12px;

    &[disabled] {
      cursor: not-allowed;
    }
  }

  .suffix {
    flex: 1;
    color: darken($color, 30%);
    cursor: pointer;
    padding: 0 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: $panel-dark;
    border-radius: $normal-radius;
    transition: all 0.3s;
  }
}
</style>
