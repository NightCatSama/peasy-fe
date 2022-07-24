<script setup lang="ts">
import Group from '../widgets/Group.vue'
import InputItem from '@/components/configs/items/InputItem.vue'
import SelectItem from '@/components/configs/items/SelectItem.vue'
import ColorItem from './items/ColorItem.vue'
import { PageNode } from '@/config'
import Icon from '../widgets/Icon.vue'
import { upload } from '@/utils/oss'
import TabsItem from './items/TabsItem.vue'
import SliderItem from './items/SliderItem.vue'
import Slider from '../widgets/Slider.vue'
import PositionTable from '../widgets/PositionTable.vue'
import ImageItem from './items/ImageItem.vue'

interface IBackgroundGroupProps {
  node: PageNode
  background: IBackground
}
const { background, node } = defineProps<IBackgroundGroupProps>()

const updateBackgroundType = (type: 'color' | 'image' | 'gradient') => {
  background.backgroundType = type
  if (type === 'gradient') {
    background.backgroundGradient = [
      {
        color: '#fff',
        percentage: 0,
      },
      {
        color: '#000',
        percentage: 100,
      },
    ]
  }
}

const handleAddColor = () => {
  background.backgroundGradient.push({
    color: background.backgroundGradient[background.backgroundGradient.length - 1].color,
    percentage: 100,
  })
}

const deleteColor = (index: number) => {
  if (background.backgroundGradient.length <= 2) return
  background.backgroundGradient.splice(index, 1)
}

const uploadImage = async (e: InputEvent) => {
  const files = (e.target as HTMLInputElement).files
  if (files?.[0]) {
    const url = await upload(files[0])
    background.backgroundImage = url as string
  }
}
</script>

<template>
  <Group
    title="Background"
    class="background-group"
    :can-advanced="false"
    :default-collapsed="false"
  >
    <SelectItem
      :model-value="background.backgroundType"
      :label="'Background'"
      :options="{
        none: 'None',
        color: 'Color',
        image: 'Image',
        gradient: 'Gradient',
      }"
      @update:model-value="updateBackgroundType"
    ></SelectItem>

    <!-- 背景色设置 -->
    <ColorItem
      v-if="background.backgroundType === 'color'"
      :model-value="background.backgroundColor"
      :label="'Background Color'"
      @update:model-value="(color) => (background.backgroundColor = color)"
    ></ColorItem>

    <!-- 背景图设置 -->
    <template v-if="background.backgroundType === 'image'">
      <ImageItem
        :label="'Image Link'"
        :model-value="background.backgroundImage"
        @update:model-value="(image) => (background.backgroundImage = image)"
      ></ImageItem>
      <TabsItem
        label="Background Size"
        :data="{ cover: 'Cover', contain: 'Contain', auto: 'Auto' }"
        v-model="background.backgroundSize"
      ></TabsItem>
      <div class="item">
        <div class="label">Background Position</div>
        <PositionTable
          v-model="background.backgroundPosition"
          :options="[
            'left top',
            'top',
            'right top',
            'left',
            'center',
            'right',
            'left bottom',
            'bottom',
            'right bottom',
          ]"
        ></PositionTable>
      </div>
      <SelectItem
        label="Background Repeat"
        :options="{
          repeat: 'Repeat',
          'repeat-x': 'Repeat-X',
          'repeat-y': 'Repeat-Y',
          'no-repeat': 'None',
        }"
        v-model="background.backgroundRepeat"
      ></SelectItem>
    </template>

    <!-- 背景渐变设置 -->
    <template v-if="background.backgroundType === 'gradient'">
      <SliderItem
        label="Angle"
        type="angle"
        v-model="background.backgroundGradientAngle"
        :min="0"
        :max="360"
        :interval="1"
      >
      </SliderItem>
      <div class="item" v-if="background.backgroundGradient.length > 0">
        <Slider
          width="100%"
          :model-value="background.backgroundGradient.map((item) => item.percentage)"
          :min="0"
          :max="100"
          :contained="true"
          :dot-options="
            background.backgroundGradient.map((item) => ({
              disabled: false,
              style: { background: item.color },
            }))
          "
          :process="
            (dotsPos) =>
              dotsPos.slice(0, -1).map((_, i) => [
                dotsPos[i],
                dotsPos[i + 1],
                {
                  background: `linear-gradient(90deg, ${background.backgroundGradient[i].color}, ${
                    background.backgroundGradient[i + 1].color
                  })`,
                },
              ])
          "
          @update:model-value="
            (values) => {
              background.backgroundGradient.forEach((item, index) => {
                item.percentage = values[index]
              })
            }
          "
        ></Slider>
      </div>
      <ColorItem
        v-for="(color, index) in background.backgroundGradient"
        :model-value="color.color"
        :label="`Color ${index + 1}`"
        @update:model-value="(color) => (background.backgroundGradient[index].color = color)"
      >
        <Icon
          :class="['delete-color-btn', { disabled: background.backgroundGradient.length <= 2 }]"
          type="circle"
          name="line"
          :size="8"
          @click="deleteColor(index)"
        ></Icon>
      </ColorItem>
      <div class="item">
        <div class="full-btn add-color-btn" @click="handleAddColor">Add Color</div>
      </div>
    </template>
  </Group>
</template>

<style lang="scss" scoped>
.background-group {
  .label {
    flex: 1;
    margin-right: 8px;
  }

  .delete-color-btn {
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

  .full {
  }

  .add-color-btn {
    cursor: pointer;

    &:hover {
      color: $theme;
    }
  }
}
</style>
