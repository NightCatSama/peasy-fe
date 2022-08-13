<script lang="ts">
export interface ISelectItem {
  title: string
  icon?: string
  [key: string]: any
}
</script>
<script setup lang="ts">
import { watchEffect } from 'vue'
import Icon from './Icon.vue'
import Dropdown from './Dropdown.vue'

const emit = defineEmits(['update:model-value'])

interface ISelectProps {
  display?: 'inline' | 'block' | 'text'
  placement?: string
  modelValue: string
  container?: string
  disabled?: boolean
  distance?: number
  options: { [key: string]: string | ISelectItem }
}

const {
  display = 'block',
  disabled,
  placement,
  options,
  modelValue,
  container,
  distance,
} = defineProps<ISelectProps>()

const showValue = $computed(() => {
  const value = options[modelValue] || modelValue
  if (typeof value === 'string') {
    return value || ''
  }
  return value.title || ''
})

const handleChange = (val: string) => {
  emit('update:model-value', val)
}
</script>

<template>
  <Dropdown
    type="pure"
    :placement="placement"
    :disabled="disabled"
    :container="container"
    :distance="distance"
  >
    <div :class="['select', `select-display-${display}`, { disabled }]">
      <slot name="value" :value="showValue">
        <div class="select-value">
          {{ showValue }}
          <Icon class="select-icon" v-if="display === 'text'" name="down" :size="8"></Icon>
        </div>
      </slot>
    </div>
    <template #content="{ hide }">
      <div :class="['select-option-wrapper']">
        <div
          v-for="(label, key) in options"
          :key="key"
          :class="['select-option', { active: key === modelValue, 'has-icon': (label as any)?.icon }]"
          @click.stop="() => {
            handleChange(key as string)
            hide()
          }"
        >
          <slot name="item" :item="label">
            <template v-if="typeof label === 'string'">{{ label }}</template>
            <template v-else>
              <Icon class="option-icon" v-if="label.icon" :name="label.icon" :size="11" />
              <div>{{ label.title }}</div>
            </template>
          </slot>
        </div>
      </div>
    </template>
  </Dropdown>
</template>

<style lang="scss" scoped>
.select {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 100%;

  &-display-block {
    border-radius: $normal-radius;
    padding: $item-gap;
    height: $item-height;
    background: $item-bg;
    border: 1px solid $item-bg;
    font-size: 12px;
    min-width: $item-width;
  }

  &-display-inline {
    flex: 1;
  }

  &-display-text {
    flex: 1;
    padding: 0 8px;
    height: $item-height;
    background: $tr;
    font-size: 12px;

    .select-value {
      background: $tr !important;
    }

    .select-icon {
      color: darken($color, 30%);
      margin-left: 2px;
    }

    &.disabled {
      .select-value {
        cursor: default;
      }
      .select-icon {
        visibility: hidden;
      }
    }
  }

  .select-value {
    flex: 1;
    height: 100%;
    color: darken($color, 30%);
    cursor: pointer;
    padding: 0 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: $panel-dark-gradient;
    border-radius: $inner-radius;
    white-space: nowrap;
    transition: all 0.3s;
  }
}
</style>

<style lang="scss">
.select-option-wrapper {
  display: flex;
  flex-direction: column;
  background: $panel-dark;
  border-radius: $normal-radius;
  padding: 4px 6px;
  transition: all 0.3s;
  z-index: $select-zIndex;
  min-width: 120px;
  border: 1px solid $theme;
  max-height: 320px;
  overflow-y: auto;

  .select-option {
    padding: 4px 12px 4px 8px;
    font-size: 13px;
    color: darken($color, 20%);
    background: $panel-dark;
    border-radius: $inner-radius;
    white-space: nowrap;
    width: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;

    &:not(:last-child) {
      margin-bottom: 4px;
    }
    &:hover {
      color: $theme;
      background: rgba($theme, 8%);
    }
    &.active {
      color: $black;
      background: $theme-gradient;
    }

    &.has-icon {
      padding-left: 6px;
    }

    .option-icon {
      margin-right: 4px;
    }
  }
}
</style>
