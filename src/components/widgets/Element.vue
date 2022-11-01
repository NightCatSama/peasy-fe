<script setup lang="ts">
import { imgErrorFallback } from '@/config'
import { watch } from 'vue'
import Icon from './Icon.vue'

interface IElementProps {
  cover?: string
  name: string
  canOperate?: boolean
}
const { cover = '', name, canOperate } = defineProps<IElementProps>()

let coverUrl = $ref(cover)
let srcset = $computed(() => {
  if (coverUrl && window.devicePixelRatio >= 2) {
    return `${coverUrl} 2x`
  }
  return ''
})

watch(
  () => cover,
  () => {
    coverUrl = cover
  }
)
const handleCoverError = () => {
  coverUrl = imgErrorFallback
}
</script>

<template>
  <div class="element">
    <div class="name">
      <span class="text">{{ name }}</span>
      <Icon
        v-if="canOperate"
        type="cube"
        class="element-btn"
        name="advanced"
        :size="11"
        v-tooltip="$t('setting')"
        @click.stop="$emit('edit')"
      ></Icon>
      <Icon
        v-if="canOperate"
        type="cube"
        class="element-btn danger"
        name="delete"
        :size="10"
        v-tooltip="$t('delete')"
        @click.stop="$emit('delete')"
      ></Icon>
    </div>
    <div class="image">
      <img v-if="coverUrl" :src="coverUrl" :srcset="srcset" @error="handleCoverError" />
      <div v-else class="image-placeholder">
        <Icon name="empty" :size="24" />
        <span>{{ $t('notCover') }}</span>
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
    height: 100%;
    overflow: hidden;
    border-radius: $inner-radius;
    background-color: #fff;
    transition: all 0.3s;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

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
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .element-btn {
      display: none;
      margin-left: 3px;

      &.danger:hover {
        background: $red;
      }
    }
  }
  &:hover :deep(.icon) {
    display: flex;
  }
}
</style>
