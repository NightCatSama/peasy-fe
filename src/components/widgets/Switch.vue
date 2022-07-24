<script setup lang="ts">
import { watchEffect, defineEmits } from 'vue'

const emit = defineEmits(['update:model-value'])

interface ISwitchProps {
  modelValue: boolean
}

const { modelValue } = defineProps<ISwitchProps>()

const handleChange = (event: Event) => {
  emit('update:model-value', !modelValue)
}
</script>

<template>
  <div :class="['switch', { active: modelValue }]" @click="handleChange">
    <div :class="['switch-handler']"></div>
  </div>
</template>

<style lang="scss" scoped>
.switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 100%;
  width: 44px;
  height: 24px;
  padding: 3px;
  background: $panel-light;
  border-radius: 18px;
  cursor: pointer;
  transition: background-color 0.3s;

  &.active {
    background: $theme;

    .switch-handler {
      transform: translateX((44px - 6px) * 0.5);
    }
  }

  .switch-handler {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: $color;
    transition: all 0.3s;
  }
}
</style>
