<script setup lang="ts">
interface IElementProps {
  image?: string
  name: string
}
const { image = 'https://avatars.githubusercontent.com/u/13888962?v=4', name } =
  defineProps<IElementProps>()
</script>

<template>
  <div class="element">
    <div class="image" :style="{ backgroundImage: `url(${image})` }" />
    <div class="name">{{ name }}</div>
  </div>
</template>

<style lang="scss" scoped>
.element {
  display: flex;
  flex-direction: column;
  justify-content: center;

  .image {
    flex: 1;
    width: 100%;
    border: 1px solid $border;
    border-radius: $radius;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    transition: all 0.3s;
    cursor: pointer;

    &:hover {
      transform: scale(1.03);
      outline: 3px solid $theme;
    }
  }

  .name {
    font-size: 16px;
    margin-top: 4px;
  }
}
</style>
