<script lang="ts" setup>
import Icon from '@/components/widgets/Icon.vue';

interface ICollapseItemProps {
  name?: string
  collapsed: boolean
  tag?: string | string[]
  tagType?: 'default' | 'red' | 'theme'
}

const {
  name,
  collapsed,
  tag,
  tagType = 'default',
} = defineProps<ICollapseItemProps>()

const tags = $computed(() => !tag ? [] : Array.isArray(tag) ? tag : [tag])
</script>

<template>
  <div :class="['item column collapse-item', { active: collapsed }]">
    <div class="collapse-content">
      <div class="collapse-header" @click="() => $emit('collapse', !collapsed)">
        <div class="collapse-name">
          <slot name="name">{{ name }}</slot>
        </div>
        <div v-for="item in tags" :class="['collapse-tag', `collapse-tag-${tagType}`]" v-show="item">{{ item }}</div>
        <Icon class="close-btn" name="close" :size="18" @click.stop="$emit('delete')"></Icon>
      </div>
      <div class="collapse-main" v-collapse="collapsed">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.collapse-item {
  padding: 3px;
  border-radius: $normal-radius;
  background: $item-bg;
  border: 1px solid $item-bg;
  transition: all .3s ease;
  &.active {
    border-color: $theme;
    .collapse-header {
      color: $yellow;
    }
  }
  .collapse-content {
    width: 100%;
    border-radius: $inner-radius;
    background-color: $bg-default;
    cursor: pointer;
    user-select: none;

    .collapse-header {
      display: flex;
      align-items: center;
      font-size: 14px;
      padding: 8px 10px 8px 16px;

      .collapse-name {
        flex: 1;
      }

      .collapse-tag {
        padding: 2px 8px;
        font-size: 12px;
        border-radius: 4px;
        margin-right: 4px;
        color: $color;
        white-space: nowrap;
        flex-shrink: 0;
        transform: scale(.9);
        transform-origin: right center;

        &-default {
          color: $color;
          background: $panel-light-gradient;
        }
        &-red {
          color: $color;
          background: $red-gradient;
        }
        &-theme {
          color: $color;
          background: $theme-gradient;
        }
      }

      .close-btn {
        flex-shrink: 0;
        padding: 2px;
        color: darken($color, 27%);
        &:hover {
          color: $red;
        }
      }
    }

    .collapse-main {
      padding: 8px 16px;
    }
  }
}
</style>