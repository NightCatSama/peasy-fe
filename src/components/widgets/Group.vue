<script setup lang="ts">
import { useDisplayStore } from '@/stores/display'
import { onBeforeUnmount, onMounted, onUpdated, watchEffect } from 'vue'
import { groupIconMap, defaultGroupIcon, groupTitleMap } from '@/constants/group'
import Icon from './Icon.vue'
import { storeToRefs } from 'pinia'
import { GroupType } from '@/config'
import { emitter } from '@/utils/event'
interface IGroupProps {
  title?: string
  groupName?: GroupType
  icon?: string
  minimize?: boolean
  defaultCollapsed?: boolean
  canAdvanced?: boolean
}
const { title, groupName, icon, defaultCollapsed = true, canAdvanced } = defineProps<IGroupProps>()

const displayStore = useDisplayStore()
const { saveGroupStatus, getGroupStatus } = displayStore

const groupStatusKey = $computed(() => title || groupName!)
const showTitle = $computed(() => title || (groupName && groupTitleMap[groupName]))

const status = getGroupStatus(groupStatusKey)

let collapsed = $ref(status ? status.collapsed : defaultCollapsed)
let showAdvanced = $ref(status ? status.advanced : false)

onUpdated(() => {
  saveGroupStatus(groupStatusKey, { collapsed, advanced: showAdvanced })
})
const collapseFn = () => (collapsed = false)
onMounted(() => {
  emitter.on('collapseGroup', collapseFn)
})
onBeforeUnmount(() => {
  emitter.off('collapseGroup', collapseFn)
})

const iconName = $computed(() => icon || groupIconMap[groupName!] || defaultGroupIcon)
</script>

<template>
  <div class="group">
    <div class="info">
      <span class="title" @click="!minimize ? (collapsed = !collapsed) : null">
        <Icon class="icon" :name="iconName" :size="14"></Icon>
        <span>{{ showTitle }}</span>
      </span>
      <span class="info-op">
        <Icon
          v-if="!minimize"
          :class="{ rotate: collapsed }"
          @click="collapsed = !collapsed"
          name="down"
          :size="12"
          type="pure"
        />
      </span>
    </div>
    <div class="content" v-collapse="minimize || collapsed">
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
    flex-shrink: 0;

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

  .add-btn {
    margin-left: 8px;
    background: $theme;
    // border: 1px solid $theme;
    color: $color;
    padding: 2px;
    cursor: pointer;

    &.disabled {
      opacity: 0.5;
      // border: 1px solid $panel-light;
      color: $panel-light;
      cursor: not-allowed;
    }

    &:not(.disabled):hover {
      color: $white;
    }
  }

  .delete-btn {
    margin-left: 8px;
    background: $tr;
    border: 1px solid $red;
    color: $red;
    padding: 2px;
    cursor: pointer;

    &.disabled {
      opacity: 0.5;
      border: 1px solid $panel-light;
      color: $panel-light;
      cursor: not-allowed;
    }

    &:not(.disabled):hover {
      color: $white;
      background-color: $red;
    }
  }

  .full-btn {
    width: 100%;
    height: 35px;
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
  margin: 24px 0 24px;
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
    background-color: $panel-dark;
    padding: 0 8px;
    color: rgba($color, 50%);
    z-index: 1;
  }
}
</style>
