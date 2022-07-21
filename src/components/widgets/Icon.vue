<script setup lang="ts">
import AddIcon from '@/assets/add.svg'
import FocusIcon from '@/assets/focus.svg'
import DeviceSmIcon from '@/assets/device-sm.svg'
import DeviceMdIcon from '@/assets/device-md.svg'
import DeviceLgIcon from '@/assets/device-lg.svg'
import CheckIcon from '@/assets/check.svg'
import DownIcon from '@/assets/down.svg'
import CaretDownIcon from '@/assets/caret-down.svg'
import AdvancedIcon from '@/assets/advanced.svg'
import MoreIcon from '@/assets/more.svg'
import DeleteIcon from '@/assets/delete.svg'
import LineIcon from '@/assets/line.svg'
import DashedIcon from '@/assets/dashed.svg'
import DottedIcon from '@/assets/dotted.svg'
import LineDoubleIcon from '@/assets/line-double.svg'
import LayoutIcon from '@/assets/layout.svg'
import SizeIcon from '@/assets/size.svg'
import SpacingIcon from '@/assets/spacing.svg'
import BorderIcon from '@/assets/border.svg'
import FontIcon from '@/assets/font.svg'
import ContainerIcon from '@/assets/container.svg'
import BackgroundIcon from '@/assets/background.svg'
import CopyIcon from '@/assets/copy.svg'
import BasicIcon from '@/assets/basic.svg'
import QuestionIcon from '@/assets/question.svg'

interface IIconProps {
  name:
    | 'add'
    | 'focus'
    | 'device-sm'
    | 'device-md'
    | 'device-lg'
    | 'check'
    | 'down'
    | 'advanced'
    | 'more'
    | 'delete'
    | 'caret-down'
    | 'line'
    | 'dashed'
    | 'dotted'
    | 'line-double'
    | 'layout'
    | 'size'
    | 'spacing'
    | 'border'
    | 'font'
    | 'container'
    | 'background'
    | 'copy'
    | 'basic'
    | 'question'
  type?: 'circle' | 'pure' | 'btn'
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
  more: MoreIcon,
  delete: DeleteIcon,
  'caret-down': CaretDownIcon,
  line: LineIcon,
  dashed: DashedIcon,
  dotted: DottedIcon,
  'line-double': LineDoubleIcon,
  layout: LayoutIcon,
  size: SizeIcon,
  spacing: SpacingIcon,
  border: BorderIcon,
  font: FontIcon,
  container: ContainerIcon,
  copy: CopyIcon,
  basic: BasicIcon,
  question: QuestionIcon,
  background: BackgroundIcon,
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
  position: relative;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;

  &-type-circle {
    padding: 4px;
    border-radius: 50%;
  }

  &-type-btn {
    cursor: pointer;
    border-radius: $normal-radius;
    padding: 4px;

    &:active {
      opacity: 0.8;
    }
  }

  .icon-inner {
    transition: all 0.3s;

    &.active {
      color: $theme;
      transform: rotateY(360deg);
    }
  }
}
</style>
