<script setup lang="ts">
import LibComponent from '../LibComponent.vue'
import Icon from './Icon.vue'
interface IElementProps {
  cover?: string
  name: string
  canDelete?: boolean
}
const { cover = '', name, canDelete } = defineProps<IElementProps>()
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
    <div class="image" :style="{ backgroundImage: `url(${cover})` }">
      <div v-if="!cover" class="image-placeholder">
        <Icon name="empty" :size="24" />
        <span>No Cover</span>
      </div>
    </div>
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
    background-color: #fff;
    transition: all 0.3s;
    cursor: pointer;

    &-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 12px;

      .icon {
        margin-bottom: 2px;
      }
    }
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
