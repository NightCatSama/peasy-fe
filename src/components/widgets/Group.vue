<script setup lang="ts">
import { useDisplayStore } from '@/stores/display'
import { onBeforeUnmount, onMounted, onUpdated, watchEffect } from 'vue'
import { groupIconMap, defaultGroupIcon, groupTitleMap } from '@/constants/group'
import Icon from './Icon.vue'
import { storeToRefs } from 'pinia'
import { GroupType } from '@/config'
import { useGroupConfigByNode, useMobileConfig, isMobileGroupConfig } from '@/utils/config'
import { emitter } from '@/utils/event'
import { usePageStore } from '@/stores/page'
import { lang } from '@/constants/i18n'
interface IGroupProps {
  title?: string
  titleEn?: string
  groupName?: GroupType
  icon?: string
  minimize?: boolean
  defaultCollapsed?: boolean
  canAdvanced?: boolean
}
const { title, titleEn, groupName, icon, defaultCollapsed = true, canAdvanced } = defineProps<IGroupProps>()

const pageStore = usePageStore()
const { activeNode } = storeToRefs(pageStore)
const { unlinkActiveNodePropGroup, switchActiveNodeConfigMode } = pageStore

const displayStore = useDisplayStore()
const { saveGroupStatus, getGroupStatus } = displayStore

const groupStatusKey = $computed(() => title || groupName!)
const showTitle = $computed(() => {
  return title
    ? lang === 'en' && titleEn || title
    : (groupName && groupTitleMap[groupName])
})

const status = getGroupStatus(groupStatusKey)

let collapsed = $ref(status ? status.collapsed : defaultCollapsed)
let showAdvanced = $ref(status ? status.advanced : false)

const showMobileConfig = $computed(() => groupName && useMobileConfig())
const isMobileStyle = $computed(() => isMobileGroupConfig(activeNode.value, groupName))
const handleSwitchMobileConfig = () => groupName && switchActiveNodeConfigMode(groupName)

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

const isLink = $computed(
  () =>
    !!activeNode.value?.propLink && groupName && !useGroupConfigByNode(activeNode.value, groupName)
)

const handleUnlinkPropGroup = () => {
  unlinkActiveNodePropGroup(groupName!)
}
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
          v-if="isLink"
          type="btn"
          color="pink"
          :size="14"
          name="link-broken"
          v-tooltip="$t('brokenLink')"
          @click.stop="handleUnlinkPropGroup"
        ></Icon>
        <div
          v-if="showMobileConfig"
          :class="['mobile-config-text', { mobile: isMobileStyle }]"
          v-tooltip="isMobileStyle ? $t('configMobileTip') : $t('configBothTip')"
          @click.stop="handleSwitchMobileConfig"
        >
          {{ isMobileStyle ? $t('configMobile') : $t('configBoth') }}
        </div>
        <!-- <Icon
          v-if="showMobileConfig"
          type="btn"
          :color="isMobileStyle ? 'theme' : 'roseate'"
          :size="12"
          :name="isMobileStyle ? 'mobile' : 'mobile-slash'"
          v-tooltip="isMobileStyle ? '当前只应用于移动端' : '不区分配置'"
          @click.stop="handleSwitchMobileConfig"
        ></Icon> -->
        <Icon
          v-if="!minimize"
          :class="{ rotate: collapsed }"
          @click="collapsed = !collapsed"
          name="down"
          :size="12"
          type="btn"
        />
      </span>
    </div>
    <div class="content" v-collapse="minimize || collapsed">
      <slot :showAdvanced="showAdvanced"></slot>
      <div class="advanced-switch" v-if="canAdvanced" @click="showAdvanced = !showAdvanced">
        <span>{{ !showAdvanced ? $t('advancedOptions') : $t('hideAdvancedOptions') }}</span>
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
    padding: 0 12px;
    height: $group-height;
    display: flex;
    align-items: center;
    flex-shrink: 0;

    .title {
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;
      font-size: 16px;
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
      align-items: center;

      :deep(.icon) {
        cursor: pointer;
        user-select: none;
        transition: all 0.3s;
        margin: 0 1px;

        &.rotate {
          transform-origin: center;
          transform: rotateX(180deg);
        }
      }

      .mobile-config-text {
        font-size: 12px;
        margin-right: 4px;
        color: lighten($theme, 17%);
        cursor: pointer;
        user-select: none;

        &:hover {
          color: $theme;
        }

        &.mobile {
          color: $orange;
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
      opacity: 0.6;
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
