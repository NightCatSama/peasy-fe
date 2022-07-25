<script setup lang="ts">
import { useDisplayStore } from '@/stores/display'
import { onMounted, onUpdated, watchEffect } from 'vue'
import Icon from './Icon.vue'
interface IGroupProps {
  title: string
  defaultCollapsed?: boolean
  canAdvanced?: boolean
}
const { title, defaultCollapsed = true, canAdvanced } = defineProps<IGroupProps>()

const displayStore = useDisplayStore()
const { saveGroupStatus, getGroupStatus } = displayStore

const status = getGroupStatus(title)

let collapsed = $ref(status ? status.collapsed : defaultCollapsed)
let showAdvanced = $ref(status ? status.advanced : false)

onUpdated(() => {
  saveGroupStatus(title, { collapsed, advanced: showAdvanced })
})

const iconName = {
  Layout: 'layout',
  Size: 'size',
  Spacing: 'spacing',
  Border: 'border',
  Font: 'font',
  Background: 'background',
  Container: 'container',
  Basic: 'basic',
  Position: 'absolute',
  Event: 'event',
  Animation: 'animation',
} as any
</script>

<template>
  <div class="group">
    <div class="info">
      <span class="title" @click="collapsed = !collapsed">
        <Icon class="icon" :name="iconName[title]" :size="14"></Icon>
        <span>{{ title }}</span>
      </span>
      <span class="info-op">
        <Icon
          :class="{ rotate: collapsed }"
          @click="collapsed = !collapsed"
          name="down"
          :size="12"
          type="pure"
        />
      </span>
    </div>
    <div class="content" v-collapse="collapsed">
      <slot :showAdvanced="showAdvanced"></slot>
      <div class="advanced-switch" v-if="canAdvanced" @click="showAdvanced = !showAdvanced">
        <span>{{ !showAdvanced ? 'Advanced Options' : 'Hide Advanced Options' }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.group {
  display: flex;
  flex-direction: column;
  font-size: 14px;

  .info {
    padding: 0 16px;
    height: 44px;
    display: flex;
    align-items: center;

    .title {
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;
      font-size: 18px;
      font-weight: bold;
      color: lighten($color, 15%);
      user-select: none;
      cursor: default;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      .icon {
        margin-right: 8px;
      }
    }

    .info-op {
      flex-shrink: 0;
      display: flex;
      justify-content: flex-end;

      :deep(.icon) {
        cursor: pointer;
        user-select: none;
        transition: all 0.3s;
        margin: 0 3px;

        &.rotate {
          transform: rotateZ(180deg);
        }
      }
    }
  }

  .content {
    background: $panel-content;
    padding: 10px 16px 10px;
    transition: all 0.3s;
    display: flex;
    flex-direction: column;

    .advanced-switch {
      position: relative;
      display: inline-flex;
      align-self: flex-start;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: darken($color, 30%);
      cursor: pointer;
      user-select: none;
      opacity: 0.4;
      transition: all 0.3s;

      &:hover {
        opacity: 0.8;
      }
    }
  }
}

:deep(.item) {
  width: 100%;
  display: flex;
  align-items: center;
  min-height: 32px;
  &:not(:last-child) {
    margin-bottom: 10px;
  }
  .label {
    flex: 1;
    font-size: 14px;
    margin-right: 10px;
    cursor: default;
    user-select: none;
    &.short {
      flex: none;
    }
  }
  &.column {
    flex-direction: column;
    align-items: flex-start;
    > .label {
      margin-bottom: 10px;
    }
  }

  .full-btn {
    width: 100%;
    height: 32px;
    border-radius: $normal-radius;
    border: 1px solid $theme;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $theme;
    cursor: pointer;
    user-select: none;

    &:hover {
      background: linear-gradient(90deg, rgba($theme, 13%), rgba($theme, 23%));
    }
  }
}

:deep(.divider) {
  position: relative;
  margin: 16px 0 24px;
  height: 0;
  opacity: 1;
  border: 1px solid rgba($panel-light, 50%);
  outline: none;
  overflow: visible;

  &::after {
    content: attr(data-text);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: $panel-content;
    padding: 0 8px;
    color: rgba($color, 50%);
    z-index: 1;
  }
}
</style>
