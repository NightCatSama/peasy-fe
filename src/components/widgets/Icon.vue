<script setup lang="ts">
import AddIcon from '@/assets/add.svg'

interface IIconProps {
  size?: number
  active?: boolean
}
const { size = 26, active } = defineProps<IIconProps>()

const style = $ref({
  width: size + 'px',
  height: size + 'px',
})
</script>

<template>
  <div class="icon">
    <add-icon :class="['icon-inner', { active }]" :style="style"></add-icon>
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
