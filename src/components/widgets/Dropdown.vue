<script setup lang="ts">
import { Dropdown as VDropdown } from 'floating-vue'
interface IDropdownProps {
  disabled?: boolean
  triggers?: string[]
}
const { disabled, triggers = ['click'] } = defineProps<IDropdownProps>()
</script>

<template>
  <VDropdown
    :disabled="disabled"
    :triggers="triggers"
    popperClass="dropdown-popper"
    :distance="10"
    auto-hide
  >
    <slot></slot>
    <template #popper>
      <slot name="content"></slot>
    </template>
  </VDropdown>
</template>

<style lang="scss">
.dropdown-popper.v-popper__popper {
  .v-popper__inner {
    padding: 12px 16px;
    border-radius: 8px;
    color: $color;
    background-color: $panel;
    border: none;
    box-shadow: none;
  }

  .v-popper__arrow-outer, .v-popper__arrow-inner {
    border-color: $panel;
  }
}
</style>
