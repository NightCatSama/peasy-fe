<script setup lang="ts">
import { fixedPointToNumber, isUnitType } from '@/utils/sizeHelper'
import { watchEffect, defineEmits, nextTick, watch } from 'vue'
import Select from './Select.vue'

const emit = defineEmits(['update:modelValue'])

interface IInputProps {
  type?: 'text' | 'number' | 'textarea'
  modelValue?: string
  disabled?: boolean
  suffix?: SuffixType[]
  placeholder?: string
  realTime?: boolean
}

const { type = 'text', modelValue = '', suffix, disabled, realTime } = defineProps<IInputProps>()

let inputValue = $ref(modelValue)
let suffixInValue = $ref(suffix?.[0] ?? '')
let focus = $ref(false)
let inputRef = $ref<HTMLInputElement | null>(null)
let memoryNumberValue = $ref(0)
const suffixMap = {
  px: 'px',
  '%': '%',
  rem: 'rem',
  auto: 'Adaptive',
  none: 'Unlimited',
  stretch: 'Stretch',
}
const hideInput = $computed(() => type === 'number' && !isUnitType(suffixInValue))

const getSuffixText = $computed(() => (suffixType: SuffixType) => {
  return suffixMap[suffixType]
})

const getValueBySuffix = $computed(() => (suffixType: SuffixType) => {
  const val = isUnitType(suffixType) ? fixedPointToNumber(inputValue) || memoryNumberValue : ''
  return (
    {
      px: `${val}px`,
      '%': `${val}%`,
      rem: `${val}rem`,
      auto: 'auto',
      none: 'none',
      stretch: 'stretch',
    }[suffixType] || inputValue
  )
})

watchEffect(() => {
  if (suffix && suffix.length > 0 && modelValue) {
    if (suffixInValue) {
    } else {
      suffixInValue = suffix[0]
    }
    let newSuffixInValue = suffixInValue
    suffix.some((s: string) => {
      if (modelValue.slice(-s.length) === s) {
        newSuffixInValue = s
        return true
      }
    })
    if (newSuffixInValue !== suffixInValue) {
      // 切到无数值选项时记录数值，切回来后恢复
      memoryNumberValue = !isUnitType(newSuffixInValue)
        ? fixedPointToNumber(inputValue) || 0
        : memoryNumberValue
      suffixInValue = newSuffixInValue
    }
    inputValue = modelValue.slice(0, -suffixInValue.length)
  }
})

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value
  if (type === 'number') {
    value = '' + (parseFloat(value) || 0)
  }
  inputValue = value
  emit('update:modelValue', getValueBySuffix(suffixInValue as SuffixType))
}

const handleSuffixClick = (key: SuffixType) => {
  emit('update:modelValue', getValueBySuffix(key))
  nextTick(() => inputRef?.focus?.())
}

const handleInput = (e: any) => {
  console.log(realTime)
  realTime && handleChange(e)
}
</script>

<template>
  <div :class="['input-wrapper', { disabled, focus }]">
    <component
      :is="type === 'textarea' ? 'textarea' : 'input'"
      ref="inputRef"
      v-show="!hideInput"
      :type="'text'"
      :value="inputValue"
      :disabled="disabled"
      :placeholder="placeholder"
      :rows="4"
      @keyup.enter="handleChange"
      @focus="focus = true"
      @blur="(e: Event) => {
        focus = false
        handleChange(e)
      }"
      @input.stop.prevent="handleInput"
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

  input,
  textarea {
    background: $tr;
    border: none;
    outline: none;
    color: $color;
    width: 100%;
    padding: 0 12px;
    font-family: $font-family;

    &[disabled] {
      cursor: not-allowed;
    }

    &::placeholder {
      font-size: 12px;
      opacity: 0.6;
    }
  }

  textarea {
    padding: 8px;
    resize: none;
    line-height: 1.4;
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
