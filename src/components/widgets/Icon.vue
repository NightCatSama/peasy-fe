<script setup lang="ts">
import AddIcon from '@/assets/add.svg'
import FocusIcon from '@/assets/focus.svg'

interface IIconProps {
  name: 'add' | 'focus'
  size?: number
  active?: boolean
}

const iconMap = {
  add: AddIcon,
  focus: FocusIcon,
}

const { name, size = 26, active } = defineProps<IIconProps>()

const style = $ref({
  width: size + 'px',
  height: size + 'px',
})

const IconComp: any = iconMap[name]
</script>

<template>
  <div class="icon">
    <IconComp :class="['icon-inner', { active }]" :style="style"></IconComp>
  </div>
</template>

<style lang="scss" scoped>
.icon {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  background-color: $panel;
  padding: 4px;
  border-radius: 50%;
  cursor: default;

  .icon-inner {
    color: $color;
    transition: transform 0.8s, color 0.3s 0.3s;

    &.active {
      color: $theme;
      transform: rotateY(540deg);
    }
  }
}
</style>
