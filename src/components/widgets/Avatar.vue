<script setup lang="ts">
import { upload, uploadByEvent } from '@/utils/oss'

interface IAvatarProps {
  image?: string
  size?: number
  canOperator?: boolean
  canUpload?: boolean
  onUpload?: (img: string) => void
}
const { image = '', size = 24, canOperator, canUpload, onUpload } = defineProps<IAvatarProps>()

const src = $computed(
  () =>
    image ||
    'data:image/png;base64,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'
)

const handleImageUpload = (e: InputEvent) => {
  if (!onUpload) return
  uploadByEvent(e, onUpload)
}
</script>

<template>
  <div
    :class="['avatar', { 'can-operator': canOperator }]"
    :style="{ backgroundImage: `url(${src})`, width: `${size}px`, height: `${size}px` }"
  >
    <input
      v-if="canUpload && onUpload"
      class="upload-wrapper"
      type="file"
      accept="image/*"
      @change="handleImageUpload"
    />
  </div>
</template>

<style lang="scss" scoped>
.avatar {
  position: relative;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;

  &.can-operator {
    cursor: pointer;
  }

  .upload-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: -1;
  }
}
</style>
