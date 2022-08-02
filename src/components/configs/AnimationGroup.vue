<script setup lang="ts">
import Group from '../widgets/Group.vue'
import SliderItem from '@/components/configs/items/SliderItem.vue'
import SelectItem from '@/components/configs/items/SelectItem.vue'
import { PageNode } from '@/config'
import { getDefaultAnimationItem, getDefaultAnimationSettings } from '@/utils/defaultConfig'
import PreviewItem from '@/components/configs/items/PreviewItem.vue'
import Tip from '../widgets/Tip.vue'
import Btn from '../widgets/Btn.vue'
import CollapseItem from './items/CollapseItem.vue'

interface IAnimationGroupProps {
  node: PageNode
  animation: IAnimation
}
const { animation, node } = defineProps<IAnimationGroupProps>()

let collapsedIndex = $ref(0)

const handleAddAnimation = () => {
  animation.animationList.push(getDefaultAnimationItem('fade'))
  collapsedIndex = animation.animationList.length - 1
}

const animationNameList = [
  'fade',
  'slide-up',
  'slide-down',
  'slide-left',
  'slide-right',
  'zoom-in',
  'zoom-out',
  'rotate-x',
  'rotate-y',
]
const animationNameMap: any = {
  fade: 'Fade',
  'slide-up': 'Slide Up',
  'slide-down': 'Slide Down',
  'slide-left': 'Slide Left',
  'slide-right': 'Slide Right',
  'zoom-in': 'Zoom In',
  'zoom-out': 'Zoom Out',
  'rotate-x': 'Rotate X',
  'rotate-y': 'Rotate Y',
}

const animationTriggerMap = {
  hover: 'Hover',
  click: 'Click',
  scrollIntoView: 'Scroll Into View',
  always: 'Always',
}

const timingFunction = {
  ease: 'Ease',
  'ease-in': 'Ease In',
  'ease-out': 'Ease Out',
  'ease-in-out': 'Ease In Out',
  linear: 'Linear',
}

const fillModeMap = {
  forwards: 'Forwards',
  backwards: 'Backwards',
  both: 'Both',
  none: 'None',
}

const directionMap = {
  normal: 'Normal',
  reverse: 'Reverse',
  alternate: 'Alternate',
  'alternate-reverse': 'Alternate Reverse',
}

const handleChangeAnimationName = (name: IAnimationItem['name'], index: number) => {
  animation.animationList[index].settings = getDefaultAnimationSettings(name)
  animation.animationList[index].name = name
}

const handleChangeAnimationTrigger = (trigger: IAnimationItem['trigger'], index: number) => {
  animation.animationList[index].trigger = trigger
  animation.animationList[index].direction = isOneCount(trigger) ? 'normal' : 'alternate-reverse'
}

// 只动画一次的动画效果
const isOneCount = (trigger: IAnimationItem['trigger']) =>
  ['scrollIntoView', 'click'].includes(trigger)

let showAdvancedSettings = $ref(false)
</script>

<template>
  <Group
    group-name="animation"
    class="animation-group"
    :can-advanced="false"
    :default-collapsed="false"
  >
    <div class="item">
      <Tip type="warning" message="只可在 Preview 模式下能预览动画效果" :block="true"></Tip>
    </div>
    <CollapseItem
      v-for="(item, index) in animation.animationList"
      class="animation-item"
      :key="index"
      :collapsed="index === collapsedIndex"
      :name="animationTriggerMap[item.trigger]"
      :tag="index !== collapsedIndex ? animationNameMap[item.name] : ''"
      @delete="() => animation.animationList.splice(index, 1)"
      @collapse="() => (collapsedIndex = collapsedIndex === index ? -1 : index)"
    >
      <template #default>
        <SelectItem
          label="Trigger Type"
          :options="animationTriggerMap"
          :model-value="item.trigger"
          @update:model-value="(val) => handleChangeAnimationTrigger(val, index)"
          @dblclick="showAdvancedSettings = !showAdvancedSettings"
        ></SelectItem>
        <PreviewItem
          label="Animation"
          :options="animationNameList"
          :model-value="item.name"
          :hide-advanced="true"
          @update:model-value="(val) => val && handleChangeAnimationName(val, index)"
        >
          <template #default="{ item: name, active }">
            <div
              :class="['inner-box', { active }]"
              :style="{
                animation: `${name} 1s infinite ${
                  isOneCount(item.trigger) ? 'normal' : 'alternate-reverse'
                }`,
              }"
            ></div>
            <div class="inner-text">{{ animationNameMap[name] }}</div>
          </template>
        </PreviewItem>
        <template v-if="item.settings">
          <SliderItem
            v-if="item.settings.fade"
            label="Opacity"
            :min="0"
            :max="1"
            :interval="0.01"
            v-model="item.settings.fade.opacity"
          ></SliderItem>
          <template v-if="item.settings.slide">
            <SliderItem
              label="Offset(%)"
              :min="0"
              :max="100"
              :interval="1"
              v-model="item.settings.slide.offset"
            ></SliderItem>
            <SliderItem
              label="Opacity"
              :min="0"
              :max="1"
              :interval="0.01"
              v-model="item.settings.slide.opacity"
            ></SliderItem>
          </template>
          <template v-if="item.settings.zoom">
            <SliderItem
              label="Zoom"
              :min="0"
              :max="1"
              :interval="0.01"
              v-model="item.settings.zoom.zoom"
            ></SliderItem>
            <SliderItem
              label="Opacity"
              :min="0"
              :max="1"
              :interval="0.01"
              v-model="item.settings.zoom.opacity"
            ></SliderItem>
          </template>
          <template v-if="item.settings.rotate">
            <SliderItem
              label="Zoom"
              :min="0"
              :max="360"
              :interval="10"
              v-model="item.settings.rotate.angle"
            ></SliderItem>
            <SliderItem
              label="Opacity"
              :min="0"
              :max="1"
              :interval="0.01"
              v-model="item.settings.rotate.opacity"
            ></SliderItem>
          </template>
        </template>
        <SliderItem
          label="Duration"
          :min="0"
          :max="5"
          :interval="0.05"
          v-model="item.duration"
        ></SliderItem>
        <SliderItem
          label="Delay"
          :min="0"
          :max="5"
          :interval="0.05"
          v-model="item.delay"
        ></SliderItem>
        <template v-if="showAdvancedSettings">
          <SelectItem
            label="Timing"
            :options="timingFunction"
            v-model="item.timingFunction"
          ></SelectItem>
          <SelectItem label="Fill Mode" :options="fillModeMap" v-model="item.fillMode"></SelectItem>
          <SelectItem
            label="Direction"
            :options="directionMap"
            v-model="item.direction"
          ></SelectItem>
        </template>
      </template>
    </CollapseItem>
    <div class="item">
      <Btn type="text" :is-block="true" icon="plus" @click="handleAddAnimation">Add Animation</Btn>
    </div>
  </Group>
</template>

<style lang="scss" scoped>
.animation-group {
  .animation-item :deep(.preview-wrapper-item) {
    height: auto;
    padding: 12px 16px 24px;

    .inner-box {
      width: 100%;
      height: 32px;
    }

    .inner-text {
      position: absolute;
      bottom: 3px;
      left: 50%;
      flex-shrink: 0;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      user-select: none;
      transform: translateX(-50%) scale(0.86);
      white-space: nowrap;
      color: rgba($panel-light, 80%);
    }
  }
}
</style>
