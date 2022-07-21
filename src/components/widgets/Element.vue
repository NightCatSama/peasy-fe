<script setup lang="ts">
import LibComponent from '../LibComponent.vue'
interface IElementProps {
  cover?: string
  name: string
}
const { cover = 'https://www.fillmurray.com/640/360', name } = defineProps<IElementProps>()
</script>

<template>
  <div class="element">
    <div class="image" :style="{ backgroundImage: `url(${cover})` }"></div>
    <div class="name">{{ name }}</div>
  </div>
</template>

<style lang="scss" scoped>
.element {
  display: flex;
  flex-direction: column;
  justify-content: center;

  &:hover .image {
    transform: scale(1.03);
    border: 2px solid $theme;
  }

  .image {
    flex: 1;
    width: 100%;
    border-radius: $normal-radius;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    transition: all 0.3s;
    cursor: pointer;
  }

  .name {
    font-size: 16px;
    margin-top: 4px;
  }
}
</style>
