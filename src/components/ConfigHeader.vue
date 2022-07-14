<script setup lang="ts">
import Btn from './widgets/Btn.vue'
import Avatar from './widgets/Avatar.vue'
import { useDisplayStore } from '@/stores/display'
import { storeToRefs } from 'pinia'
import Dropdown from './widgets/Dropdown.vue';
import Icon from './widgets/Icon.vue';
import { presetDevice } from '@/utils/device';

const displayStore = useDisplayStore()
const { device } = storeToRefs(displayStore)

const name = $ref('index')

const text = $computed(
  () => `Device: ${device.value.width || 'width'} x ${device.value.height || 'height'}`
)

const zoomText = $computed(() => `${device.value.zoom * 100}%`)

const desktop = $ref(presetDevice.desktop)

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
          <div class="device-list">
            <div class="device-item" v-for="(item, index) in desktop" :key="index">
              <Icon v-if="index === 0" name="device-sm" type="pure" :size="28" />
              <Icon v-else-if="index === 1" name="device-md" type="pure" :size="28" />
              <Icon v-else name="device-lg" type="pure" :size="28" />
              <div class="device-text">{{ item[0] + '×' + item[1] }}</div>
            </div>
          </div>
        </template>
      </Dropdown>
      <div class="zoom">{{ zoomText }}</div>
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
    height: 32px;
    width: 32px;
    font-size: 12px;
    border-radius: 200px;
  }

  .avatar {
    margin-left: 20px;
  }
}

.device-list {
  color: $color;
  display: flex;

  .device-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 80px;
    font-size: 10px;
    color: $panel-light;
    border: 3px solid $panel-light;
    border-radius: 4px;
    margin: 0 4px;
    cursor: pointer;

    .device-text {
      margin-top: 2px;
    }
  }
}
</style>
