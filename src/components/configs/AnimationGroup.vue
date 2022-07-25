<script setup lang="ts">
import Group from '../widgets/Group.vue'
import SliderItem from '@/components/configs/items/SliderItem.vue'
import SelectItem from '@/components/configs/items/SelectItem.vue'
import { PageNode } from '@/config'
import Icon from '../widgets/Icon.vue'
import { getDefaultAnimationItem, getDefaultAnimationSettings } from '@/utils/defaultConfig'

interface IAnimationGroupProps {
  node: PageNode
  animation: IAnimation
}
const { animation, node } = defineProps<IAnimationGroupProps>()

const handleAddAnimation = () => {
  animation.animationList.push(getDefaultAnimationItem('fade'))
}

const animationNameMap = {
  'fade': 'Fade',
  'slide-up': 'Slide Up',
  'slide-down': 'Slide Down',
  'slide-left': 'Slide Left',
  'slide-right': 'Slide Right',
  'zoom-in': 'Zoom In',
  'zoom-out': 'Zoom Out',
}

const animationTriggerMap = {
  'hover': 'Hover',
  'click': 'Click',
  'scrollIntoView': 'Scroll Into View',
  'always': 'Always',
}

const timingFunction = {
  'ease': 'Ease',
  'ease-in': 'Ease In',
  'ease-out': 'Ease Out',
  'ease-in-out': 'Ease In Out',
  'linear': 'Linear'
}

const fillModeMap = {
  'forwards': 'Forwards',
  'backwards': 'Backwards',
  'both': 'Both',
  'none': 'None',
}

const directionMap = {
  'normal': 'Normal',
  'reverse': 'Reverse',
  'alternate': 'Alternate',
  'alternate-reverse': 'Alternate Reverse',
}

const handleChangeAnimationName = (name: IAnimationItem['name'], index: number) => {
  console.log('1', name, getDefaultAnimationSettings(name))
  animation.animationList[index].settings = getDefaultAnimationSettings(name)
  console.log('animation.animationList[index].settings >', animation.animationList[index].settings)
  animation.animationList[index].name = name
}

</script>

<template>
  <Group
    title="Animation"
    class="animation-group"
    :can-advanced="false"
    :default-collapsed="true"
  >
    <div class="item column animation-item" v-for="(item, index) in animation.animationList">
      <SelectItem
        label="Name"
        :options="animationNameMap"
        :model-value="item.name"
        @update:model-value="(val) => handleChangeAnimationName(val, index)"
      ></SelectItem>
      <SelectItem
        label="Trigger Type"
        :options="animationTriggerMap"
        v-model="item.trigger"
      ></SelectItem>
      <SliderItem
        label="Duration"
        :min="0"
        :max="10"
        :interval="0.05"
        v-model="item.duration"
      ></SliderItem>
      <SliderItem
        label="Delay"
        :min="0"
        :max="10"
        :interval="0.05"
        v-model="item.delay"
      ></SliderItem>
      <SelectItem
        label="Timing Function"
        :options="timingFunction"
        v-model="item.timingFunction"
      ></SelectItem>
      <SelectItem
        label="Fill Mode"
        :options="fillModeMap"
        v-model="item.fillMode"
      ></SelectItem>
      <SelectItem
        label="Direction"
        :options="directionMap"
        v-model="item.direction"
      ></SelectItem>
    </div>
    <div class="item">
      <div class="full-btn" @click="handleAddAnimation">Add Animation</div>
    </div>
  </Group>
</template>

<style lang="scss" scoped>
.animation-group {
}
</style>
