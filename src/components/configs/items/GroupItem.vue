<script lang="ts" setup>
import Icon from '@/components/widgets/Icon.vue'

interface ICollapseItemProps {
  canDelete?: boolean
}

const { canDelete = true } = defineProps<ICollapseItemProps>()
</script>

<template>
  <div class="group-item">
    <div class="group-item-content">
      <slot></slot>
    </div>
    <div class="group-item-delete" v-if="canDelete">
      <Icon
        :class="['delete-btn']"
        type="circle"
        name="line"
        :size="10"
        @click="$emit('delete')"
      ></Icon>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.group-item {
  display: flex;

  &:not(:last-child) {
    margin-bottom: 10px;
  }

  &-content {
    flex: 1;
    padding: 6px;
    border-radius: 6px;
    border: 1px dashed rgba($white, 0.3);
  }

  &-delete {
    width: 32px;
    flex-shrink: 0;
    padding: 0 3px;
    margin-left: 4px;
    .delete-btn {
      border-radius: $inner-radius;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: $red;
      color: $color;
      cursor: pointer;
      &:hover {
        background: lighten($red, 8%);
      }
    }
  }

  :deep(.item) {
    width: 100%;
    display: flex;
    align-items: center;
    min-height: 32px;
    &:not(:last-child) {
      margin-bottom: 8px;
    }
    .label {
      flex: 1;
      font-size: 12px;
      margin-right: 12px;
      padding-left: 10px;
    }
  }
}
</style>
