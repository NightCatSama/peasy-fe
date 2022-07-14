<script setup lang="ts">
import AddIcon from '@/assets/add.svg'
import FocusIcon from '@/assets/focus.svg'
import DeviceSm from '@/assets/device-sm.svg'
import DeviceMd from '@/assets/device-md.svg'
import DeviceLg from '@/assets/device-lg.svg'

interface IIconProps {
  name: 'add' | 'focus' | 'device-sm' | 'device-md' | 'device-lg'
  type: 'circle' | 'pure'
  size?: number
  active?: boolean
}

const iconMap = {
  add: AddIcon,
  focus: FocusIcon,
  'device-sm': DeviceSm,
  'device-md': DeviceMd,
  'device-lg': DeviceLg,
}

const { name, size = 26, type = 'circle', active } = defineProps<IIconProps>()

const style = $ref({
  width: size + 'px',
  height: size + 'px',
})

const IconComp: any = iconMap[name]
</script>

<template>
  <div :class="['icon', `icon-type-${type}`]">
    <IconComp :class="['icon-inner', { active }]" :style="style"></IconComp>
  </div>
</template>

<style lang="scss" scoped>
.icon {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  cursor: default;

  &-type-circle {
    padding: 4px;
    border-radius: 50%;
    background-color: $panel;
  }

  .icon-inner {
    transition: transform 0.8s, color 0.3s 0.3s;

    &.active {
      color: $theme;
      transform: rotateY(540deg);
    }
  }
}
</style>
