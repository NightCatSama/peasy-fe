<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script setup lang="ts">
import { $t } from '@/constants/i18n'
import { covertSizeToOtherUnit, fixedPointToNumber, isUnitType } from '@/utils/sizeHelper'
import { nextTick, onMounted, watchEffect } from 'vue'
import Select from './Select.vue'

const emit = defineEmits(['update:model-value'])

interface IInputProps {
  type?: 'text' | 'number' | 'textarea'
  modelValue?: string
  disabled?: boolean
  prefix?: string
  suffix?: SuffixType[]
  placeholder?: string
  realTime?: boolean
  hideSuffix?: boolean
  autoFocus?: boolean
  onBlur?: (e: Event) => void
  onFocus?: (e: Event) => void
}

const {
  type = 'text',
  modelValue = '',
  prefix = '',
  suffix,
  disabled,
  realTime,
  hideSuffix,
  autoFocus,
  onBlur,
  onFocus,
} = defineProps<IInputProps>()

let inputValue = $ref(modelValue)
let suffixInValue = $ref(suffix?.[0] ?? '')
let focus = $ref(false)
let inputRef = $ref<HTMLInputElement | null>(null)
let memoryNumberValue = $ref(0)
const suffixMap = {
  px: 'px',
  '%': '%',
  rem: 'rem',
  x: '×',
  vw: 'vw',
  vh: 'vh',
  circle: $t('unitCircle'),
  refined: $t('unitRefined'),
  auto: $t('unitAuto'),
  none: $t('unitNone'),
  stretch: $t('unitStretch'),
  inherit: $t('inherit'),
}
const hideInput = $computed(() => type === 'number' && !isUnitType(suffixInValue))

const getSuffixText = $computed(() => (suffixType: SuffixType) => {
  return suffixMap[suffixType]
})

const getValueBySuffix = $computed(() => (suffixType: SuffixType) => {
  const getVal = () =>
    covertSizeToOtherUnit(
      fixedPointToNumber(inputValue) || memoryNumberValue,
      suffixInValue,
      suffixType
    )
  return (
    (prefix || '') +
    ({
      px: `${getVal()}px`,
      '%': `${getVal()}%`,
      rem: `${getVal()}rem`,
      vw: `${getVal()}vw`,
      vh: `${getVal()}vh`,
      x: `${getVal()}x`,
      circle: 'circle',
      refined: 'refined',
      auto: 'auto',
      none: 'none',
      stretch: 'stretch',
      inherit: 'inherit',
    }[suffixType] || inputValue)
  )
})

watchEffect(() => {
  let newValue = modelValue
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
    newValue = modelValue.slice(0, -suffixInValue.length)
  }
  if (prefix) {
    newValue = newValue.slice(prefix.length)
  }
  inputValue = newValue
})

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value = target.value
  if (type === 'number') {
    value = '' + (parseFloat(value) || 0)
  }
  inputValue = value
  emit('update:model-value', getValueBySuffix(suffixInValue as SuffixType))
}

const handleSuffixClick = (key: SuffixType) => {
  emit('update:model-value', getValueBySuffix(key))
  nextTick(() => inputRef?.focus?.())
}

const handleInput = (e: Event) => realTime && handleChange(e)

const handleFocus = (e: Event) => {
  focus = true
  onFocus?.(e)
}

const handleBlur = (e: Event) => {
  focus = false
  handleChange(e)
  onBlur?.(e)
}

const handleKeydown = (e: KeyboardEvent) => {
  // 阻止冒泡，避免触发组件的剪切复制粘贴
  if (['x', 'c', 'v', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(e.key)) {
    e.stopPropagation()
  }
}

onMounted(() => {
  if (autoFocus) inputRef?.focus()
})
</script>

<template>
  <div :class="['input-wrapper', { disabled, focus }, $attrs.class || '']">
    <span v-if="prefix" class="prefix">{{ prefix }}</span>
    <component
      :is="type === 'textarea' ? 'textarea' : 'input'"
      ref="inputRef"
      v-show="!hideInput"
      :type="'text'"
      :value="inputValue"
      :disabled="disabled"
      :placeholder="placeholder"
      :rows="4"
      v-bind="$attrs"
      @keydown="handleKeydown"
      @keyup.enter="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      @input.stop.prevent="handleInput"
    />
    <slot name="suffix">
      <template v-if="suffixInValue && suffix && !hideSuffix">
        <Select
          :display="'inline'"
          :class="hideInput ? 'suffix-select-hide-input' : 'suffix-select'"
          :model-value="suffixInValue"
          :options="Object.fromEntries(suffix.map((s) => [s, getSuffixText(s)]))"
          :disabled="disabled || suffix.length <= 1"
          @update:model-value="handleSuffixClick"
        ></Select>
      </template>
    </slot>
  </div>
</template>

<style lang="scss" scoped>
.input-wrapper {
  position: relative;
  display: inline-flex;
  border-radius: $normal-radius;
  padding: $item-gap;
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
    color: darken($color, 20%);
    width: 100%;
    padding: 0 12px;
    font-size: 14px;
    font-family: $font-family;

    &[disabled] {
      cursor: not-allowed;
    }

    &::placeholder {
      opacity: 0.6;
    }
  }

  textarea {
    font-size: 14px;
    padding: 8px;
    resize: none;
    line-height: 1.4;
  }

  .prefix {
    position: relative;
    left: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px 0;
    color: darken($color, 35%);
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

  :deep(.suffix-select-hide-input),
  :deep(.select) {
    width: 100%;
  }
}
</style>
