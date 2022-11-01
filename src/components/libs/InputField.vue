<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script setup lang="ts">
import { getContext } from '@/utils/context'
import { useAttrs } from 'vue'
import { IProps, useProps } from './hooks/common'
import { useStyle } from './hooks/style'

const { elem, uName, style, styleMap, props, tagClassNames } = useProps(
  useAttrs() as unknown as IProps<'InputField'>,
  'InputField'
)

const classNames = $computed(() => ['input-field', uName.value, ...tagClassNames.value])
const context = getContext()
const disabled = $computed(() => context?.isEditMode && context?.displayMode !== 'preview')

const wrapperStyles = $computed(() =>
  useStyle({
    ...styleMap.value.size,
    ...styleMap.value.position,
    ...styleMap.value.common,
  })
)

const componentStyles = $computed(() =>
  useStyle({
    ...styleMap.value.basic,
    ...styleMap.value.font,
    ...styleMap.value.spacing,
    ...styleMap.value.border,
    ...styleMap.value.background,
    ...styleMap.value.container,
    ...styleMap.value.animation,
    ...styleMap.value.effect,
  })
)
</script>

<template>
  <label
    ref="elem"
    :class="['input-field-wrapper', { disabled }]"
    :for="uName"
    :style="wrapperStyles"
    v-bind="props.inheritAttrs"
  >
    <component
      :class="classNames"
      :is="props.basic.type"
      :placeholder="props.basic.placeholder"
      :disabled="disabled || props.basic.disabled"
      :maxlength="props.basic.maxLength"
      :style="componentStyles"
      :id="uName"
    ></component>
  </label>
</template>

<style lang="scss" scoped>
.input-field-wrapper {
  display: inline-flex;
  &.disabled::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
  }
  .input-field {
    width: 100%;
    height: 100%;
    background: transparent;
    outline: none;
    resize: none;
    &:focus,
    &:active {
      border: none;
      outline: none;
    }
    &::placeholder {
      color: #9e9e9e;
    }
  }
}
</style>
