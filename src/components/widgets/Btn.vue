<script setup lang="ts">
import Icon from './Icon.vue'

interface IBtnProps {
  text?: string
  size?: 'lg' | 'md' | 'sm' | 'xs'
  type?: 'text' | 'btn' | 'inner' | 'icon'
  color?: 'primary' | 'default' | 'second' | 'purple' | 'orange' | 'red'
  icon?: InstanceType<typeof Icon>['name']
  disabled?: boolean
  isBlock?: boolean
}
const {
  text,
  size = 'md',
  type = 'btn',
  color = 'primary',
  icon,
  disabled,
  isBlock,
} = defineProps<IBtnProps>()

const handleClick = (e: MouseEvent) => {
  if (disabled) {
    e.stopImmediatePropagation()
    return
  }
}

const iconSize = $computed(() => {
  if (size === 'lg') {
    return 20
  }
  if (size === 'sm') {
    return 14
  }
  return 14
})
</script>

<template>
  <div
    :class="[
      'btn',
      `size-${size}`,
      `${color}`,
      `btn-type-${type}`,
      { disabled, 'btn-block': isBlock },
    ]"
    role="button"
    @click="handleClick"
  >
    <Icon v-if="icon" class="btn-icon" :name="icon" :size="iconSize"></Icon>
    <div class="text">
      <slot>{{ text }}</slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.btn {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  user-select: none;

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    user-select: none;
  }

  &-icon {
    margin-right: 4px;
    margin-top: -0.1em;
  }

  &-block {
    width: 100%;
    flex: 1;
  }

  &-type-text {
    &.primary {
      color: $theme;

      &:not(.disabled):hover {
        opacity: 0.8;
      }
    }

    &.default {
      color: darken($color, 10%);

      &:not(.disabled):hover {
        color: $color;
      }
    }

    &.size-md {
      padding: 4px 8px;
    }

    &.size-sm {
      font-size: 12px;
      padding: 2px 4px;

      .btn-icon {
        margin-right: 0;
      }
    }
  }

  &-type-btn {
    &.primary {
      color: $white;
      background: $theme-gradient;

      &:not(.disabled):hover {
        opacity: 0.8;
      }
    }

    &.default {
      color: $panel;
      background: $grey-gradient;

      &:not(.disabled):hover {
        opacity: 0.8;
      }
    }

    &.purple {
      color: $white;
      background: $purple-gradient;

      &:not(.disabled):hover {
        opacity: 0.8;
      }
    }

    &.orange {
      color: $white;
      background: $orange-gradient;

      &:not(.disabled):hover {
        opacity: 0.8;
      }
    }

    &.size-md {
      padding: 0 24px;
      border-radius: 18px;
      font-size: 14px;
      height: 36px;
      font-weight: bold;
    }

    &.size-sm {
      padding: 0 16px;
      border-radius: $inner-radius;
      font-size: 13px;
      height: 28px;
    }

    &.size-xs {
      padding: 0 8px;
      border-radius: 12px;
      font-size: 12px;
      height: 24px;
      .btn-icon {
        margin-left: -2px;
        margin-right: 0;
      }
    }
  }

  &-type-inner {
    &.primary {
      color: $color;
      background: $theme-gradient;

      &:not(.disabled):hover {
        opacity: 0.8;
      }
    }

    &.default {
      color: $color;
      background: $panel;

      &:not(.disabled):hover {
        opacity: 0.8;
      }
    }

    &.second {
      color: $color;
      background: $panel-light;

      &:not(.disabled):hover {
        opacity: 0.8;
      }
    }

    &.purple {
      color: $white;
      background: $purple-gradient;

      &:not(.disabled):hover {
        opacity: 0.8;
      }
    }

    &.red {
      color: $white;
      background: $red-gradient;

      &:not(.disabled):hover {
        opacity: 0.8;
      }
    }

    &.size-md {
      padding: 0 12px;
      border-radius: $inner-radius;
      font-size: 14px;
      height: 32px;
      font-weight: bold;
      text-align: center;
      width: 100%;
    }

    &.size-sm {
      padding: 0 12px;
      border-radius: $inner-radius;
      font-size: 12px;
      height: 24px;
      font-weight: bold;
      text-align: center;
    }
  }

  &-type-icon {
    &.primary {
      color: $color;
      background: $theme-gradient;

      &:not(.disabled):hover {
        opacity: 0.8;
      }
    }
    &.second {
      color: $color;
      background: $purple-gradient;

      &:not(.disabled):hover {
        opacity: 0.8;
      }
    }

    &.default {
      color: $color;
      background: $panel;

      &:not(.disabled):hover {
        opacity: 0.8;
      }
    }

    &.size-md {
      border-radius: 50%;
      font-size: 16px;
      width: 28px;
      height: 28px;
      font-weight: bold;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &.size-lg {
      border-radius: 50%;
      font-size: 18px;
      width: 42px;
      height: 42px;
      font-weight: bold;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .btn-icon {
      margin: 0;
    }
  }
}
</style>
