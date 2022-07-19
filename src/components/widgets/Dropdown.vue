<script setup lang="ts">
import { Dropdown as VDropdown } from 'floating-vue'
interface IDropdownProps {
  type?: 'default' | 'color-picker'
  disabled?: boolean
  triggers?: string[]
}
const { type = 'default', disabled, triggers = ['click'] } = defineProps<IDropdownProps>()
</script>

<template>
  <VDropdown
    :disabled="disabled"
    :triggers="triggers"
    :popperClass="['dropdown-popper', `dropdown-popper-${type}`]"
    :distance="10"
    :arrow-padding="10"
    auto-hide
    v-bind="$attrs"
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
    border-radius: $normal-radius;
    color: $color;
    border: none;
    box-shadow: $dropdown-shadow;
  }

  &.dropdown-popper-default {
    .v-popper__inner {
      background: $panel;
      padding: 12px;
    }
    .v-popper__arrow-outer,
    .v-popper__arrow-inner {
      border-color: $panel;
    }
  }

  &.dropdown-popper-color-picker {
    // 手动 hack 与边缘间距
    $hack-gap: 14px;
    left: -$hack-gap;
    .v-popper__arrow-container {
      transform: translateX($hack-gap);
    }
    .v-popper__inner {
      padding: 8px;
      background: lighten($panel-dark, 10%);
    }
    .v-popper__arrow-outer,
    .v-popper__arrow-inner {
      border-color: lighten($panel-dark, 10%);
    }
    .vc-chrome, .vc-chrome-body {
      background-color: $panel-dark;
      border-radius: $inner-radius;
    }
    .vc-chrome-active-color {
      border-radius: 50%;
      border: 1px solid rgba($white, .5);
    }
    .vc-hue, .vc-alpha, .vc-alpha-checkboard-wrap, .vc-alpha-gradient {
      border-radius: $normal-radius!important;
    }
    .vc-input__input {
      height: 24px;
      font-size: 12px;
      color: darken($color, 20%);
      background-color: $panel-dark;
      box-shadow: none;
      background: $panel-gradient;
      border-radius: $inner-radius;
    }
    .vc-chrome-fields .vc-input__label {
      color: darken($color, 20%);
    }
    .vc-chrome-toggle-icon path {
      fill: darken($color, 20%);
    }
    .vc-chrome-toggle-icon-highlight {
      background-color: transparent;
    }
    .vc-chrome-color-wrap {
      width: 45px;
    }
    .vc-hue-picker, .vc-alpha-picker {
      background-color: $tr;
      border: 2px solid $white;
      box-shadow: 0 0 1px 2px rgba($black, .1);
    }
  }
}
.v-popper__popper.v-popper__popper--show-from,
.v-popper__wrapper {
  transform: scale(0.9);
}
.v-popper__popper.v-popper__popper--show-to .v-popper__wrapper {
  transform: none;
}
.v-popper__wrapper {
  transition: transform 0.15s;
}
</style>
