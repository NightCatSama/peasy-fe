<script setup lang="ts">
import { storeToRefs } from 'pinia'

import Btn from './widgets/Btn.vue'
import Avatar from './widgets/Avatar.vue'
import { useDisplayStore } from '@/stores/display'
import Dropdown from './widgets/Dropdown.vue'
import Icon from './widgets/Icon.vue'
import { onMounted, ref } from 'vue'
import Slider from './widgets/Slider.vue'
import Select from './widgets/Select.vue'
import { useKeyPress } from 'ahooks-vue'
import { emitter } from '@/utils/event'
import { ShortcutKey } from '@/constants/shortcut'
import ColorVarList from './biz/ColorVarList.vue'
import { useHistoryStore } from '@/stores/history'

const displayStore = useDisplayStore()
const { device, displayMode } = storeToRefs(displayStore)
const { setDevice, curPresetDeviceList, setDisplayMode } = displayStore

const historyStore = useHistoryStore()
const { canUndoHistory, canRedoHistory } = storeToRefs(historyStore)
const { saveHistory, undoHistory, redoHistory } = historyStore

const name = $ref('index')

const text = $computed(
  () => `${device.value.width || 'width'} x ${device.value.height || 'height'}`
)

const zoomText = $computed(() => `${Math.round(device.value.zoom * 100)}%`)

const desktop = $ref(curPresetDeviceList)

const hoverIndex = ref(-1)
const activeIndex = $computed(() =>
  curPresetDeviceList.findIndex(
    (d: number[]) => device.value.width === d[0] && device.value.height === d[1]
  )
)

const setDeviceBySize = (size: number[]) => {
  setDevice({
    width: size[0],
    height: size[1],
    zoom: device.value.zoom,
    fontSize: size[2],
  })
}

const modeMap = {
  edit: {
    title: 'Edit',
    icon: 'edit',
  },
  drag: {
    title: 'Drag',
    icon: 'drag',
  },
  preview: {
    title: 'Preview',
    icon: 'preview',
  },
}

const handleModeClick = (value: any) => {
  setDisplayMode(value)
}

useKeyPress(ShortcutKey.SwitchDisplayMode, (e) => {
  e.preventDefault()
  const displayModeList = ['edit', 'drag', 'preview'] as const
  setDisplayMode(displayModeList[(displayModeList.indexOf(displayMode.value) + 1) % 3])
})
useKeyPress(ShortcutKey.SwitchMaterialPanel, (e) => {
  e.preventDefault()
  emitter.emit('switchMaterialsPanel')
})
</script>

<template>
  <div class="header">
    <div class="left">
      <div class="name">{{ name }}</div>
      <div class="ext">.html</div>
    </div>
    <div class="center">
      <Dropdown placement="bottom" type="pure-dropdown" :distance="10">
        <template #default="{ shown }">
          <div :class="['color-plate', { active: shown }]">
            <Icon name="color" :size="18" />
          </div>
        </template>
        <template #content>
          <ColorVarList></ColorVarList>
        </template>
      </Dropdown>
      <Dropdown placement="bottom" :distance="10">
        <div class="size">
          {{ text }}<span class="zoom">{{ zoomText }}</span>
        </div>
        <template #content>
          <div class="device-wrapper">
            <div class="title">
              Options
              <span class="title-extra" v-if="hoverIndex > -1">
                {{ desktop[hoverIndex][0] + ' × ' + desktop[hoverIndex][1] }}
              </span>
            </div>
            <div class="device-list">
              <div
                :class="['device-item', { active: activeIndex === index }]"
                v-for="(item, index) in desktop"
                :key="index"
                v-hover="(isHover: boolean) => hoverIndex = isHover ? index : -1"
                @click="setDeviceBySize(item)"
              >
                <Icon v-if="index === 0" name="mobile" type="pure" :size="20" />
                <Icon v-else-if="index === 1" name="device-sm" type="pure" :size="28" />
                <Icon v-else-if="index === 2" name="device-md" type="pure" :size="28" />
                <Icon v-else name="device-lg" type="pure" :size="28" />
              </div>
            </div>
            <div class="title">Zoom</div>
            <Slider
              width="200px"
              v-model="device.zoom"
              :min="0.2"
              :max="2"
              :interval="0.01"
              :contained="true"
            ></Slider>
          </div>
        </template>
      </Dropdown>
      <Select
        class="mode-wrapper"
        :options="modeMap"
        :display="'inline'"
        placement="bottom-start"
        :model-value="displayMode"
        @update:model-value="handleModeClick"
      >
        <template #value>
          <Icon class="icon" :name="modeMap[displayMode].icon" :size="11"></Icon>
          <span>{{ modeMap[displayMode].title }}</span>
        </template>
      </Select>
    </div>
    <div class="right">
      <Icon
        :class="['undo-icon', { disabled: !canUndoHistory }]"
        name="redo"
        :size="16"
        type="btn"
        v-tooltip="'撤销'"
      ></Icon>
      <Icon
        :class="['redo-icon', { disabled: !canRedoHistory }]"
        name="redo"
        :size="16"
        type="btn"
        v-tooltip="'重做'"
      ></Icon>
      <Btn @click="$emit('download')" text="Download"></Btn>
      <Avatar :size="36" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: $header-height;
  flex-shrink: 0;
  background: $panel-header;
  padding: 10px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  .left {
    flex: 1;
    display: flex;
    align-items: baseline;

    .name {
      color: $yellow;
      font-size: 24px;
      font-weight: bold;
    }
    .ext {
      font-size: 14px;
      margin-left: 3px;
      color: darken($color, 10%);
    }
  }

  .right {
    display: flex;
    flex-shrink: 0;

    .redo-icon,
    .undo-icon {
      margin-right: 20px;

      &:not(.disabled):hover {
        color: $theme;
      }

      &.disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
    }

    .undo-icon {
      margin-right: 10px;
      transform: rotateY(180deg);
    }
  }

  .center {
    display: flex;
    align-items: center;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .mode-wrapper {
      position: absolute;
      left: 100%;
      top: 50%;
      transform: translate(12px, -50%);
      font-size: 13px;
      background: $panel;
      padding: 6px 16px 6px 14px;
      border-radius: $normal-radius;
      white-space: nowrap;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      user-select: none;
      transition: all 0.3s;

      &:hover {
        background: lighten($panel, 3%);
      }

      :deep(.icon) {
        padding: 0;
        margin-right: 4px;
        margin-top: -0.03em;
      }
    }
    .color-plate {
      color: $color;
      margin: 0 8px;
      cursor: pointer;
      &:hover,
      &.active {
        color: $roseate;
      }
    }
  }

  .size {
    display: flex;
    justify-content: center;
    align-items: center;
    background: $panel-light-gradient;
    margin: 0 5px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      opacity: 0.8;
    }
  }

  .size {
    height: 36px;
    padding: 0 18px;
    font-size: 14px;
    border-radius: 18px;
    .zoom {
      position: relative;
      margin-left: 16px;

      &::after {
        content: '';
        position: absolute;
        left: -8px;
        top: 50%;
        transform: translateY(-50%);
        width: 1px;
        height: 10px;
        background: darken($color, 20%);
      }
    }
  }

  .avatar {
    margin-left: 20px;
  }
}

.device-wrapper {
  .title {
    font-size: 14px;
    color: $color;
    margin-bottom: 5px;
    font-weight: bold;

    .title-extra {
      margin-left: 10px;
      font-size: 10px;
      font-weight: lighter;
      opacity: 0.7;
    }
  }
  .device-list {
    color: $color;
    display: flex;
    justify-content: flex-start;
    margin-bottom: 12px;

    .device-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 42px;
      height: 42px;
      font-size: 10px;
      color: $panel;
      background: $panel-light-gradient;
      border-radius: 5px;
      cursor: pointer;

      &:not(:last-child) {
        margin-right: 8px;
      }

      &:hover {
        background: lighten($panel-light, 17%);
      }

      &.active {
        background: lighten($panel-light, 17%);
        color: $white;
      }

      .device-text {
        margin-top: 2px;
      }
    }
  }
}
</style>
