<script setup lang="ts">
import AddIcon from '@/assets/add.svg'
import FocusIcon from '@/assets/focus.svg'
import DeviceSmIcon from '@/assets/device-sm.svg'
import DeviceMdIcon from '@/assets/device-md.svg'
import DeviceLgIcon from '@/assets/device-lg.svg'
import CheckIcon from '@/assets/check.svg'
import DownIcon from '@/assets/down.svg'
import AdvancedIcon from '@/assets/advanced.svg'

interface IIconProps {
  name: 'add' | 'focus' | 'device-sm' | 'device-md' | 'device-lg' | 'check' | 'down' | 'advanced'
  type?: 'circle' | 'pure'
  size?: number
  active?: boolean
}

const iconMap = {
  add: AddIcon,
  focus: FocusIcon,
  'device-sm': DeviceSmIcon,
  'device-md': DeviceMdIcon,
  'device-lg': DeviceLgIcon,
  check: CheckIcon,
  down: DownIcon,
  advanced: AdvancedIcon,
}

const { name, size = 26, type = 'circle', active } = defineProps<IIconProps>()

const style = $ref({
  width: size + 'px',
  height: size + 'px',
})
</script>

<template>
  <div :class="['icon', `icon-type-${type}`, { active }]">
    <component :is="iconMap[name]" :class="['icon-inner', { active }]" :style="style"></component>
  </div>
</template>

<style lang="scss" scoped>
.icon {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;

  &-type-circle {
    padding: 4px;
    border-radius: 50%;
  }

  .icon-inner {
    transition: all 0.3s, transform 0.6s;

    &.active {
      color: $theme;
      transform: rotateY(360deg);
    }
  }
}
</style>
