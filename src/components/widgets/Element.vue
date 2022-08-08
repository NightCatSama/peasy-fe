<script setup lang="ts">
import LibComponent from '../LibComponent.vue'
import Icon from './Icon.vue';
interface IElementProps {
  cover?: string
  name: string
  canDelete?: boolean
}
const { cover = 'https://avatars.githubusercontent.com/u/13888962?v=4', name, canDelete } =
  defineProps<IElementProps>()
</script>

<template>
  <div class="element">
    <div class="name">
      <span class="text">{{ name }}</span>
      <Icon
        v-if="canDelete"
        name="delete"
        :size="10"
        color="red"
        type="btn"
        @click.stop="$emit('delete')"
      ></Icon>
    </div>
    <div class="image" :style="{ backgroundImage: `url(${cover})` }"></div>
  </div>
</template>

<style lang="scss" scoped>
.element {
  display: flex;
  flex-direction: column;
  justify-content: center;

  &:hover .image {
    // transform: scale(1.03);
    // border: 2px solid $theme;
  }

  .image {
    flex: 1;
    width: 100%;
    border-radius: $inner-radius;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center center;
    background-color: #FFF;
    transition: all 0.3s;
    cursor: pointer;
  }

  .name {
    display: flex;
    align-items: center;
    margin-bottom: 4px;

    .text {
      flex: 1;
      font-size: 14px;
    }

    :deep(.icon) {
      display: none;
      margin-right: -2px;
    }
  }
  &:hover :deep(.icon) {
    display: flex;
  }
}
</style>
