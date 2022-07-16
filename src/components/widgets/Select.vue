<script setup lang="ts">
import { watchEffect, defineEmits } from 'vue';
import Icon from './Icon.vue';

const emit = defineEmits(['change']);

interface ISelectProps {
  display?: 'inline' | 'block'
  value: string
  options: { [key: string]: string }
}

const { display = 'block', options, value } = defineProps<ISelectProps>()

let isOpen = $ref(false)

const showValue = $computed(() => options[value] || '')

const handleChange = (val: string) => {
  emit('change', val)
  isOpen = false
}

</script>

<template>
  <div
    :class="['select', `select-display-${display}`]"
    @click="isOpen = !isOpen"
  >
    <div class="select-value">{{ showValue }}</div>
    <div :class="['select-option-wrapper', { hide: !isOpen }]" v-click-outside="() => isOpen = false">
      <div
        :class="['select-option', { active: key === value }]"
        v-for="(label, key) in options"
        :key="key"
        @click.stop="() => handleChange(key as string)"
      >{{ label }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.select {
  position: relative;
  display: inline-flex;
  align-items: center;

  &-display-inline {
    flex: 1;
    color: darken($color, 30%);
    cursor: pointer;
    padding: 0 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: $panel-dark-gradient;
    border-radius: 6px;
    transition: all .3s;
  }

  .select-option-wrapper {
    position: absolute;
    right: 0px;
    top: 100%;
    transform: translateY(10px);
    display: flex;
    flex-direction: column;
    background: $panel-dark;
    border-radius: 8px;
    box-shadow: $float-shadow;
    padding: 4px 6px;
    transition: all .3s;
    z-index: 999;
    min-width: 100%;
    border: 1px solid $theme;

    &.hide {
      pointer-events: none;
      opacity: 0;
      transform: scale(.8);
    }

    .select-option {
      padding: 4px 8px;
      font-size: 14px;
      background: $panel-dark;
      border-radius: 4px;
      &:not(:last-child) {
        margin-bottom: 4px;
      }
      &:hover {
        color: $theme;
      }
      &.active {
        color: $black;
        background: $theme-gradient;
      }
    }
  }
}
</style>
