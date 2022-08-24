<script setup lang="ts">
import LogoIcon from '@/assets/logo.svg'
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
import ItalicIcon from '@/assets/italic.svg'
import BoldIcon from '@/assets/bold.svg'
import UnderlineIcon from '@/assets/underline.svg'
import LineThroughIcon from '@/assets/line-through.svg'
import AlignLeftIcon from '@/assets/align-left.svg'
import AlignCenterIcon from '@/assets/align-center.svg'
import AlignRightIcon from '@/assets/align-right.svg'
import AlignJustifyIcon from '@/assets/align-justify.svg'
import TopCircleIcon from '@/assets/top-circle.svg'
import AbsoluteIcon from '@/assets/absolute.svg'
import WarningIcon from '@/assets/warning.svg'
import LockIcon from '@/assets/lock.svg'
import UnlockIcon from '@/assets/unlock.svg'
import DragIcon from '@/assets/drag.svg'
import EditIcon from '@/assets/edit.svg'
import PreviewIcon from '@/assets/preview.svg'
import EventIcon from '@/assets/event.svg'
import AnimationIcon from '@/assets/animation.svg'
import CloseIcon from '@/assets/close.svg'
import EffectIcon from '@/assets/effect.svg'
import PlusIcon from '@/assets/plus.svg'
import SeparateIcon from '@/assets/separate.svg'
import ColorIcon from '@/assets/color.svg'
import ImageIcon from '@/assets/image.svg'
import TextIcon from '@/assets/text.svg'
import BlockIcon from '@/assets/block.svg'
import CircleIcon from '@/assets/circle.svg'
import SymbolIcon from '@/assets/symbol.svg'
import LayersIcon from '@/assets/layers.svg'
import LayersSlashIcon from '@/assets/layers-slash.svg'
import ModuleIcon from '@/assets/module.svg'
import RedoIcon from '@/assets/redo.svg'
import UploadIcon from '@/assets/upload.svg'
import MobileIcon from '@/assets/mobile.svg'
import MobileSlashIcon from '@/assets/mobile-slash.svg'
import HideIcon from '@/assets/hide.svg'
import EyeIcon from '@/assets/eye.svg'
import EyeSlashIcon from '@/assets/eye-slash.svg'
import SwitchIcon from '@/assets/switch.svg'
import LinkBrokenIcon from '@/assets/link-broken.svg'
import LinkIcon from '@/assets/link.svg'
import SaveIcon from '@/assets/save.svg'
import TabletIcon from '@/assets/tablet.svg'
import ProjectSettingIcon from '@/assets/project-setting.svg'
import EmptyIcon from '@/assets/empty.svg'
import ImgErrorIcon from '@/assets/img-error.svg'
import SpinIcon from '@/assets/spin.svg'
import KeyboardIcon from '@/assets/keyboard.svg'
import QuestionCircleIcon from '@/assets/question-circle.svg'
import VariableIcon from '@/assets/variable.svg'
import SyncIcon from '@/assets/sync.svg'
import StartIcon from '@/assets/start.svg'

interface IIconProps {
  name: string
  type?: 'circle' | 'pure' | 'btn' | 'cube'
  color?: string
  size?: number
  active?: boolean
  loading?: boolean
}

const iconMap = {
  logo: LogoIcon,
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
  italic: ItalicIcon,
  bold: BoldIcon,
  underline: UnderlineIcon,
  'line-through': LineThroughIcon,
  'align-left': AlignLeftIcon,
  'align-center': AlignCenterIcon,
  'align-right': AlignRightIcon,
  'align-justify': AlignJustifyIcon,
  'top-circle': TopCircleIcon,
  absolute: AbsoluteIcon,
  warning: WarningIcon,
  lock: LockIcon,
  unlock: UnlockIcon,
  drag: DragIcon,
  edit: EditIcon,
  preview: PreviewIcon,
  event: EventIcon,
  animation: AnimationIcon,
  close: CloseIcon,
  effect: EffectIcon,
  plus: PlusIcon,
  separate: SeparateIcon,
  color: ColorIcon,
  image: ImageIcon,
  text: TextIcon,
  block: BlockIcon,
  circle: CircleIcon,
  symbol: SymbolIcon,
  layers: LayersIcon,
  'layers-slash': LayersSlashIcon,
  module: ModuleIcon,
  redo: RedoIcon,
  upload: UploadIcon,
  mobile: MobileIcon,
  'mobile-slash': MobileSlashIcon,
  hide: HideIcon,
  eye: EyeIcon,
  'eye-slash': EyeSlashIcon,
  switch: SwitchIcon,
  'link-broken': LinkBrokenIcon,
  link: LinkIcon,
  save: SaveIcon,
  tablet: TabletIcon,
  'project-setting': ProjectSettingIcon,
  empty: EmptyIcon,
  'img-error': ImgErrorIcon,
  spin: SpinIcon,
  keyboard: KeyboardIcon,
  'question-circle': QuestionCircleIcon,
  variable: VariableIcon,
  sync: SyncIcon,
  start: StartIcon,
} as any

const { name, size = 26, type = 'circle', loading, active, color } = defineProps<IIconProps>()

const style = $ref({
  width: size + 'px',
  height: size + 'px',
})
</script>

<template>
  <div :class="['icon', `icon-type-${type}`, { active, [`icon-color-${color}`]: color, loading }]">
    <component :is="iconMap[name]" :class="['icon-inner', { active }]" :style="style"></component>
  </div>
</template>

<style lang="scss" scoped>
.icon {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  user-select: none;

  &-type-circle {
    padding: 4px;
    border-radius: 50%;
  }

  &-type-btn {
    cursor: pointer;
    border-radius: $normal-radius;
    padding: 4px;

    &:hover {
      opacity: 0.8;
    }
    &:active {
      opacity: 0.9;
    }
  }

  &-type-cube {
    cursor: pointer;
    padding: 3px;
    color: $white;
    background: $panel-light;
    border-radius: $inner-radius;

    &:hover {
      opacity: .8;
    }
    &:active {
      opacity: 0.9;
    }
  }

  &.loading {
    animation: spin 3s linear infinite;
  }

  .icon-inner {
    transition: fill 0.3s;

    &.active {
      color: $theme;
      transform: rotateY(360deg);
    }
  }

  &.icon-color-orange {
    color: $orange;
  }
  &.icon-color-cyan {
    color: $cyan;
  }
  &.icon-color-pink {
    color: $pink;
  }
  &.icon-color-red {
    color: $red;
  }
  &.icon-color-theme {
    color: $theme;
  }
  &.icon-color-purple {
    color: $purple;
  }
  &.icon-color-roseate {
    color: $roseate;
  }
  &.icon-color-grey {
    color: $grey;
  }
}
</style>
