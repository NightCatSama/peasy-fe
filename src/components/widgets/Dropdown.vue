<script setup lang="ts">
import { Dropdown as VDropdown } from 'floating-vue'
interface IDropdownProps {
  type?: 'default' | 'color-picker' | 'pure' | 'pure-dropdown'
  disabled?: boolean
  triggers?: string[]
  placement?: string
  popperClass?: string
  delay?: any
  isMenu?: boolean
  showGroup?: string
  distance?: number
}
const {
  type = 'default',
  disabled,
  triggers = ['click'],
  placement = 'bottom-end',
  popperClass = '',
  delay,
  isMenu,
  showGroup,
  distance = 5,
} = defineProps<IDropdownProps>()
</script>

<template>
  <component
    :is="VDropdown"
    :disabled="disabled"
    :triggers="triggers"
    :class="'dropdown-handle'"
    :popperClass="['dropdown-popper', `dropdown-popper-${type}`, popperClass]"
    :distance="distance"
    :arrow-padding="10"
    :placement="placement"
    :delay="delay"
    :instant-move="!!isMenu"
    :show-group="showGroup"
    :auto-hide="!isMenu"
    v-bind="$attrs"
  >
    <template #default="{ shown }">
      <slot :shown="shown"></slot>
    </template>
    <template #popper="{ hide }">
      <div
        ref="el"
        v-click-outside="
          isMenu
            ? {
                handler: () => hide(),
                extraSelectors: ['.dropdown-popper', '.dropdown-handle.v-popper--shown'],
              }
            : null
        "
      >
        <slot name="content" :hide="hide"></slot>
      </div>
    </template>
  </component>
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

  &.dropdown-popper-pure,
  &.dropdown-popper-pure-dropdown {
    .v-popper__inner {
      background: $panel;
      padding: 0;
    }
    .v-popper__arrow-outer,
    .v-popper__arrow-inner {
      border-color: $panel;
    }
  }
  &.dropdown-popper-pure {
    .v-popper__arrow-outer,
    .v-popper__arrow-inner {
      display: none;
    }
  }

  &.dropdown-popper-color-picker {
    // 手动 hack 与边缘间距
    $hack-gap: 14px;
    left: -$hack-gap;
    .v-popper__arrow-container {
      transform: translateX($hack-gap);
    }
    > .v-popper__wrapper > .v-popper__inner {
      width: 241px;
      padding: 8px;
      background: lighten($panel-dark, 10%);
    }
    .v-popper__arrow-outer,
    .v-popper__arrow-inner {
      border-color: lighten($panel-dark, 10%);
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
