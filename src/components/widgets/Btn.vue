<script setup lang="ts">
interface IBtnProps {
  text: string
  size?: 'md'
  type?: 'primary'
}
const { text, size = 'md', type = 'primary' } = defineProps<IBtnProps>()
</script>

<template>
  <div :class="['btn', `btn-size-${size}`, `btn-type-${type}`]" role="button">
    <div class="text">{{ text }}</div>
  </div>
</template>

<style lang="scss" scoped>
.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;

  &-size-md {
    padding: 0 32px;
    font-size: 14px;
    height: 36px;
    border-radius: 18px;
    font-weight: bold;
  }

  &-type-primary {
    color: $color;
    background: $theme-gradient;

    &:hover {
      opacity: .8;
    }
  }
}
</style>
