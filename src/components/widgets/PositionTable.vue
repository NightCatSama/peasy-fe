<script setup lang="ts">
interface ICheckerProps {
  modelValue: string
  options: string[]
  size?: number
}

const { modelValue, options, size = 88 } = defineProps<ICheckerProps>()
const emit = defineEmits(['update:model-value'])

const handleClick = (key: string) => {
  emit('update:model-value', key)
}
</script>

<template>
  <div class="position-table" :style="{ width: `${size}px`, height: `${size}px` }">
    <div
      :class="['position-item', { active: key === modelValue }]"
      v-for="key in options"
      :key="key"
      @click="() => handleClick(key)"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
.position-table {
  display: grid;
  grid:
    'item item item'
    'item item item'
    'item item item';
  justify-content: space-around;
  align-items: center;
  border: 1px dashed $panel-light;
  border-radius: $normal-radius;

  .position-item {
    position: relative;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $panel-light;
    cursor: default;

    &.active {
      background: $yellow;
    }

    &::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 20px;
      height: 20px;
    }
  }
}
</style>
