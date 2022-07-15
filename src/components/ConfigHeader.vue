<script setup lang="ts">
import { useHover } from 'ahooks-vue'
import { storeToRefs } from 'pinia'

import Btn from './widgets/Btn.vue'
import Avatar from './widgets/Avatar.vue'
import { useDisplayStore } from '@/stores/display'
import Dropdown from './widgets/Dropdown.vue'
import Icon from './widgets/Icon.vue'
import { presetDevice } from '@/utils/device'
import { onMounted, ref, watchEffect } from 'vue'
import Slider from './widgets/Slider.vue'

const displayStore = useDisplayStore()
const { device } = storeToRefs(displayStore)
const { setDevice } = displayStore

const name = $ref('index')

const text = $computed(
  () => `${device.value.width || 'width'} x ${device.value.height || 'height'}`
)

const zoomText = $computed(() => `${Math.round(device.value.zoom * 100)}%`)

const desktop = $ref(presetDevice.desktop)

const hoverIndex = ref(-1)
const activeIndex = $computed(() =>
  presetDevice.desktop.findIndex((d) => device.value.width === d[0] && device.value.height === d[1])
)

const setDeviceBySize = (width: number, height: number) => {
  setDevice({
    width,
    height,
    zoom: device.value.zoom,
  })
}
</script>

<template>
  <div class="header">
    <div class="left">
      <div class="name">{{ name }}</div>
      <div class="ext">.html</div>
    </div>
    <div class="center">
      <Dropdown>
        <div class="size">{{ text }}</div>
        <template #content>
          <div class="device-wrapper">
            <div class="title">
              Options
              <span class="device-size" v-if="hoverIndex > -1">
                {{ desktop[hoverIndex].join(' × ') }}
              </span>
            </div>
            <div class="device-list">
              <div
                :class="['device-item', { active: activeIndex === index }]"
                v-for="(item, index) in desktop"
                :key="index"
                v-hover="(isHover: boolean) => hoverIndex = isHover ? index : -1"
                @click="setDeviceBySize(item[0], item[1])"
              >
                <Icon v-if="index === 0" name="device-sm" type="pure" :size="28" />
                <Icon v-else-if="index === 1" name="device-md" type="pure" :size="28" />
                <Icon v-else name="device-lg" type="pure" :size="28" />
              </div>
            </div>
          </div>
        </template>
      </Dropdown>
      <Dropdown>
        <div class="zoom">{{ zoomText }}</div>
        <template #content>
          <Slider width="200px" v-model="device.zoom" :min="0.2" :max="2" :interval="0.01"></Slider>
        </template>
      </Dropdown>
    </div>
    <div class="right">
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
  background-color: $panel-header;
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
      color: $theme;
      font-size: 24px;
      font-weight: bold;
    }
    .ext {
      font-size: 14px;
      margin-left: 3px;
    }
  }

  .right {
    display: flex;
    flex-shrink: 0;
  }

  .center {
    display: flex;
    align-items: center;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .size,
  .zoom {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $panel-light;
    margin: 0 5px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background-color: lighten($panel-light, 7%);
    }
  }

  .size {
    height: 36px;
    padding: 0 18px;
    font-size: 16px;
    border-radius: 18px;
  }

  .zoom {
    height: 34px;
    width: 34px;
    font-size: 12px;
    border-radius: 200px;
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

    .device-size {
      margin-left: 2px;
      font-size: 10px;
      font-weight: lighter;
      opacity: 0.7;
    }
  }
  .device-list {
    color: $color;
    display: flex;
    justify-content: space-between;

    .device-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 42px;
      height: 42px;
      font-size: 10px;
      color: $panel;
      background-color: $panel-light;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.3s;

      &:not(:last-child) {
        margin-right: 8px;
      }

      &:hover {
        background-color: #999;
      }

      &.active {
        background-color: #999;
        color: #e3e3e3;
      }

      .device-text {
        margin-top: 2px;
      }
    }
  }
}
</style>
