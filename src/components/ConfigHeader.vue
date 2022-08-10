<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLogto } from '@logto/vue'

import Btn from './widgets/Btn.vue'
import Avatar from './widgets/Avatar.vue'
import { useDisplayStore } from '@/stores/display'
import Dropdown from './widgets/Dropdown.vue'
import Icon from './widgets/Icon.vue'
import { nextTick, onMounted, ref } from 'vue'
import Slider from './widgets/Slider.vue'
import Select from './widgets/Select.vue'
import { useKeyPress } from 'ahooks-vue'
import { emitter } from '@/utils/event'
import { ShortcutKey } from '@/constants/shortcut'
import ColorVarList from './biz/ColorVarList.vue'
import { useHistoryStore } from '@/stores/history'
import { usePageStore } from '@/stores/page'
import { useUserStore } from '@/stores/user'
import Switch from './widgets/Switch.vue'
import { useRouter } from 'vue-router'

const { signIn, signOut, isAuthenticated } = useLogto();
const handleSignIn = () => signIn(import.meta.env.VITE_LOGTO_REDIRECT_URL)
const handleSignOut = () => signOut(import.meta.env.VITE_LOGTO_SIGN_OUT_URL)
const router = useRouter()
const gotoMePage = () => router.push('/me')

const userStore = useUserStore()
const { userName, avatar } = storeToRefs(userStore)

const pageStore = usePageStore()
const { setting, colorVars } = storeToRefs(pageStore)
const { updateAllPageNode, setMediaFontSize } = pageStore

const displayStore = useDisplayStore()
const { device, displayMode, deviceType, curWidthFootSize, curFootSize, curPresetDeviceList: deviceList } = storeToRefs(displayStore)
const { setDevice, setDisplayMode } = displayStore

const historyStore = useHistoryStore()
const { canUndoHistory, canRedoHistory } = storeToRefs(historyStore)
const { saveHistory, undoHistory, redoHistory } = historyStore

const name = $ref('index')
let showColorVarDropdown = $ref(false)

const text = $computed(
  () => `${device.value.width || 'width'} x ${device.value.height || 'height'}`
)

const zoomText = $computed(() => `${Math.round(device.value.zoom * 100)}%`)

const hoverIndex = ref(-1)
const activeIndex = $computed(() =>
  deviceList.value.findIndex(
    (d: number[]) => device.value.width === d[0] && device.value.height === d[1]
  )
)

const setDeviceBySize = (index: number) => {
  setDevice(index)
  nextTick(() => emitter.emit('location', true))
}

const handleDeviceChange = () => {
  deviceType.value = deviceType.value === 'mobile' ? 'desktop' : 'mobile'
  setDevice(0)
  nextTick(() => emitter.emit('location', true))
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

const handleFontSizeSwitch = (value: boolean) => {
  if (value) {
    setMediaFontSize(device.value.width, curFootSize.value)
  } else {
    setMediaFontSize(device.value.width, 0)
  }
}

const handleFontSizeChange = (value: number) => setMediaFontSize(device.value.width, value)

useKeyPress(ShortcutKey.switchDevice, () => {
  if (setting.value.client !== 'both') return
  handleDeviceChange()
})
useKeyPress(ShortcutKey.SwitchDisplayMode, (e) => {
  e.preventDefault()
  const displayModeList = ['edit', 'drag', 'preview'] as const
  setDisplayMode(displayModeList[(displayModeList.indexOf(displayMode.value) + 1) % 3])
})
useKeyPress(ShortcutKey.SwitchMaterialPanel, (e) => {
  e.preventDefault()
  emitter.emit('switchMaterialsPanel')
})

emitter.on('saveColorVars', (color: string) => {
  showColorVarDropdown = true
  colorVars.value.push({
    name: '',
    color,
  })
})
</script>

<template>
  <div class="header">
    <div class="left">
      <div class="name">{{ name }}</div>
      <div class="ext">.html</div>
    </div>
    <div class="center">
      <Dropdown
        :shown="showColorVarDropdown"
        placement="bottom"
        type="pure-dropdown"
        :distance="10"
        @apply-hide="showColorVarDropdown = false"
      >
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
              <span>
                Simulator
                <span class="title-extra" v-if="hoverIndex > -1">
                  {{ deviceList[hoverIndex][0] + ' × ' + deviceList[hoverIndex][1] }}
                </span>
              </span>
              <Btn
                v-if="setting.client === 'both'"
                type="text"
                icon="switch"
                size="sm"
                class="switch-device-btn"
                @click="handleDeviceChange"
              >
                {{ deviceType === 'desktop' ? 'Mobile' : 'Desktop' }}
              </Btn>
            </div>
            <div class="device-list">
              <div
                :class="['device-item', { active: activeIndex === index }]"
                v-for="(item, index) in deviceList"
                :key="index"
                v-hover="(isHover: boolean) => hoverIndex = isHover ? index : -1"
                @click="setDeviceBySize(index)"
              >
                <template v-if="deviceType === 'mobile'">
                  <Icon v-if="index === 0" name="mobile" type="pure" :size="20" />
                  <Icon v-else-if="index === 1" name="mobile" type="pure" :size="24" />
                  <Icon v-else name="tablet" type="pure" :size="26" />
                </template>
                <template v-else>
                  <Icon v-if="index === 0" name="device-sm" type="pure" :size="28" />
                  <Icon v-else-if="index === 1" name="device-md" type="pure" :size="28" />
                  <Icon v-else name="device-lg" type="pure" :size="28" />
                </template>
              </div>
            </div>
            <div class="title">
              <span>Zoom <span class="title-extra">{{ zoomText }}</span></span>
            </div>
            <Slider
              width="200px"
              v-model="device.zoom"
              :min="0.2"
              :max="2"
              :interval="0.01"
              :contained="true"
            ></Slider>
            <div class="title media-title">
              <span>
                Media Font Size
                <span class="title-extra">{{ curFootSize }}px</span>
              </span>
              <Switch
                :model-value="!!curWidthFootSize"
                @update:model-value="handleFontSizeSwitch"
              ></Switch>
            </div>
            <Slider
              v-if="!!curWidthFootSize"
              width="200px"
              :model-value="curWidthFootSize"
              :min="10"
              :max="100"
              :interval="1"
              :contained="true"
              @update:model-value="handleFontSizeChange"
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
        @click="() => updateAllPageNode(undoHistory())"
      ></Icon>
      <Icon
        :class="['redo-icon', { disabled: !canRedoHistory }]"
        name="redo"
        :size="16"
        type="btn"
        v-tooltip="'重做'"
        @click="() => updateAllPageNode(redoHistory())"
      ></Icon>
      <Btn class="download-btn" @click="$emit('download')" text="Download"></Btn>
      <Dropdown type="default">
        <Avatar :image="avatar" :size="36" can-operator />
        <template #content>
          <div v-if="isAuthenticated">
            <div class="user-name" @click="gotoMePage">{{ userName }}</div>
            <div @click="handleSignOut">退出登录</div>
          </div>
          <div v-else>
            <Btn type="inner" @click="handleSignIn">登录</Btn>
          </div>
        </template>
      </Dropdown>
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

  .download-btn {
    margin-right: 20px;
  }
}

.device-wrapper {
  .title {
    position: relative;
    font-size: 14px;
    color: $color;
    margin-bottom: 5px;
    font-weight: bold;
    display: flex;
    align-items: center;
     justify-content: space-between;

    &.media-title {
      display: flex;
      margin-top: 10px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .title-extra {
      margin-left: 2px;
      font-size: 12px;
      color: rgba($pink, 80%);
    }

    .switch-device-btn {
      font-size: 12px;
      color: $theme;
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
