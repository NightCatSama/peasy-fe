<script setup lang="ts">
import { defineEmits } from 'vue'
import Icon from './Icon.vue'

const emit = defineEmits(['change'])

interface ICheckerProps {
  check: boolean
  text?: string
}

const { check, text } = defineProps<ICheckerProps>()

const handleChange = (event: Event) => {
  emit('change', !check)
}
</script>

<template>
  <div class="checker" @click="handleChange">
    <div class="check">
      <Icon name="check" :size="14" :active="check"></Icon>
    </div>
    <div v-if="text" class="text">{{ text }}</div>
    <slot v-else></slot>
  </div>
</template>

<style lang="scss" scoped>
.checker {
  display: inline-flex;
  align-items: center;
  margin: 0 4px;

  .text {
    margin-left: 4px;
    font-size: 14px;
  }
}
</style>
