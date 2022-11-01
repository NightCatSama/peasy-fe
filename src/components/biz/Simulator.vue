<script setup lang="ts">
import { $t } from '@/constants/i18n'
import { ShortcutKey } from '@/constants/shortcut'
import { useDisplayStore } from '@/stores/display'
import { usePageStore } from '@/stores/page'
import { emitter } from '@/utils/event'
import { useKeyPress } from 'ahooks-vue'
import { storeToRefs } from 'pinia'
import { nextTick, ref } from 'vue'
import Dropdown from '../widgets/Dropdown.vue'
import Icon from '../widgets/Icon.vue'
import Switch from '../widgets/Switch.vue'
import Slider from '../widgets/Slider.vue'
import Btn from '../widgets/Btn.vue'
import Input from '../widgets/Input.vue'
import { useDisplayStoreHelper, usePageStoreHelper } from '@/hooks/store'

const {
  device,
  activeIndex,
  deviceType,
  curWidthFootSize,
  curFootSize,
  curPresetDeviceList: deviceList,
  setDevice,
} = useDisplayStoreHelper()

const { setting, template, setMediaFontSize } = usePageStoreHelper()

const hoverIndex = ref(-1)

const text = $computed(
  () => `${device.value.width || $t('headerWidth')} x ${device.value.height || $t('headerHeight')}`
)
const zoomText = $computed(() => `${Math.round(device.value.zoom * 100)}%`)
// const activeIndex = $computed(() =>
//   deviceList.value.findIndex(
//     (d: number[]) => device.value.width === d[0] && device.value.height === d[1]
//   )
// )

const setDeviceBySize = (index: number) => {
  if (index >= deviceList.value.length || index < 0) return
  setDevice(index)
  nextTick(() => {
    emitter.emit('location', true)
    emitter.emit('updateMoveable')
  })
}

const handleFontSizeChange = (value: number) => setMediaFontSize(device.value.width, value)

const handleDeviceChange = () => {
  deviceType.value = deviceType.value === 'mobile' ? 'desktop' : 'mobile'
  setDevice(0)
  nextTick(() => {
    emitter.emit('location', true)
    emitter.emit('updateMoveable')
  })
}

const handleFontSizeSwitch = (value: boolean) => {
  if (value) {
    setMediaFontSize(device.value.width, curFootSize.value)
  } else {
    setMediaFontSize(device.value.width, 0)
  }
}

const handleChangePreset = (val: string, type: 'width' | 'height') => {
  deviceList.value[activeIndex.value][type === 'width' ? 0 : 1] = Number(val)
  device.value[type] = Number(val)
}

/** 切换模拟器 */
useKeyPress(ShortcutKey.switchDevice, (e) => {
  if (setting.value.client !== 'both') return
  e.preventDefault()
  handleDeviceChange()
})
/** 切换到下一个设备尺寸 */
useKeyPress(ShortcutKey.nextDeviceIndex, (e) => {
  e.preventDefault()
  setDeviceBySize(activeIndex.value + 1)
})
/** 切换到上一个设备尺寸 */
useKeyPress(ShortcutKey.prevDeviceIndex, (e) => {
  e.preventDefault()
  setDeviceBySize(activeIndex.value - 1)
})
</script>

<template>
  <Dropdown placement="bottom" :distance="10">
    <div class="device-size">
      {{ text }}<span class="zoom">{{ zoomText }}</span>
    </div>
    <template #content>
      <div class="device-wrapper">
        <div class="title">
          <span>
            {{ $t('simulator') }}
            <span class="title-extra" v-if="hoverIndex > -1 && deviceList[hoverIndex]">
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
            {{ deviceType === 'desktop' ? $t('mobile') : $t('desktop') }}
          </Btn>
        </div>
        <div class="device-list">
          <div
            :class="['device-item', { active: activeIndex === index }]"
            v-for="(_, index) in deviceList"
            :key="index"
            v-hover="(isHover: boolean) => hoverIndex = isHover ? index : -1"
            @click="setDeviceBySize(index)"
          >
            <template v-if="deviceType === 'mobile'">
              <Icon v-if="index === 0" name="mobile" type="pure" :size="20" />
              <Icon v-else-if="index === 1" name="mobile" type="pure" :size="24" />
              <Icon v-else-if="index === 2" name="tablet" type="pure" :size="26" />
              <Icon v-else name="pen" type="pure" :size="20" />
            </template>
            <template v-else>
              <Icon v-if="index === 0" name="device-sm" type="pure" :size="28" />
              <Icon v-else-if="index === 1" name="device-md" type="pure" :size="28" />
              <Icon v-else-if="index === 2" name="device-lg" type="pure" :size="28" />
              <Icon v-else name="pen" type="pure" :size="20" />
            </template>
          </div>
        </div>
        <div class="device-input">
          <Input
            type="text"
            :model-value="'' + device.width"
            :disabled="activeIndex !== 3"
            @update:model-value="(val) => handleChangePreset(val, 'width')"
          ></Input>
          <span class="symbol">×</span>
          <Input
            type="text"
            :model-value="'' + device.height"
            :disabled="activeIndex !== 3"
            @update:model-value="(val) => handleChangePreset(val, 'height')"
          ></Input>
        </div>
        <div class="title">
          <span
            >{{ $t('zoom') }} <span class="title-extra">{{ zoomText }}</span></span
          >
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
            {{ $t('mediaFontSize') }}
            <Icon
              name="question"
              class="question-icon"
              :size="13"
              v-tooltip="{
                content: $t('mediaFontSizeTip'),
              }"
            ></Icon>
            <span v-if="curWidthFootSize" class="title-extra">{{ curFootSize }}px</span>
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
</template>

<style lang="scss" scoped>
.device-size {
  height: 36px;
  padding: 0 18px;
  font-size: 14px;
  border-radius: 18px;
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

      .question-icon {
        position: relative;
        top: 2px;
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
  .device-input {
    display: flex;
    align-items: center;
    margin-bottom: 12px;

    .input-wrapper {
      width: 64px;
    }

    .symbol {
      margin: 0 6px;
    }
  }
}
</style>
