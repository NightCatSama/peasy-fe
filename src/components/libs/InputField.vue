<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script setup lang="ts">
import { getContext } from '@/utils/context';
import { useAttrs } from 'vue'
import { IProps, useProps } from './hooks/common'

const { elem, uName, style, props, tagClassNames } = useProps(
  useAttrs() as unknown as IProps<'InputField'>,
  'InputField'
)

const classNames = $computed(() => ['input-field', uName.value, ...tagClassNames.value])
const context = getContext()
const disabled = $computed(() => context?.isEditMode && context?.displayMode !== 'preview')
</script>

<template>
  <label
    ref="elem"
    :class="['input-field-wrapper']"
    :for="uName"
  >
    <component
      :class="classNames"
      :is="props.basic.type"
      :placeholder="props.basic.placeholder"
      :disabled="disabled || props.basic.disabled"
      :maxlength="props.basic.maxLength"
      :style="style"
      v-bind="props.inheritAttrs"
      :id="uName"
    ></component>
  </label>
</template>

<style lang="scss" scoped>
.input-field-wrapper {
  display: inline-flex;
  .input-field {
    background: transparent;
    outline: none;
    resize: none;
    &:focus, &:active {
      border: none;
      outline: none;
    }
    &::placeholder {
      color: #9e9e9e;
    }
  }
}
</style>
