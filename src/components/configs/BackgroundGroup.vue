<script setup lang="ts">
import SelectItem from '@/components/configs/items/SelectItem.vue'
import SwitchItem from '@/components/configs/items/SwitchItem.vue'
import { getColor } from '@/components/libs/hooks/color'
import { PageNode } from '@/config'
import Group from '../widgets/Group.vue'
import Icon from '../widgets/Icon.vue'
import PositionTable from '../widgets/PositionTable.vue'
import Slider from '../widgets/Slider.vue'
import ColorItem from './items/ColorItem.vue'
import ImageItem from './items/ImageItem.vue'
import SliderItem from './items/SliderItem.vue'
import TabsItem from './items/TabsItem.vue'

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

const updateBackgroundClip = (clip: IBackground['backgroundClip']) =>
  (background.backgroundClip = clip)

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
</script>

<template>
  <Group
    group-name="background"
    class="background-group"
    :can-advanced="false"
    :default-collapsed="false"
  >
    <!-- 背景类型 -->
    <SelectItem
      :model-value="background.backgroundType"
      :label="$t('background')"
      :options="{
        none: $t('backgroundTypeNone'),
        color: $t('backgroundTypeColor'),
        image: $t('backgroundTypeImage'),
        gradient: $t('backgroundTypeGradient'),
      }"
      @update:model-value="updateBackgroundType"
    ></SelectItem>

    <!-- 背景裁切 -->
    <SelectItem
      v-if="background.backgroundType !== 'none'"
      :model-value="background.backgroundClip || ''"
      :label="$t('backgroundClip')"
      :tip="background.backgroundClip === 'text' ? $t('backgroundClipTextTip') : ''"
      :options="{
        'border-box': $t('backgroundClipBorder'),
        'padding-box': $t('backgroundClipPadding'),
        'content-box': $t('backgroundClipContent'),
        ...(node.component === 'Text'
          ? {
              text: $t('backgroundClipText'),
            }
          : null),
      }"
      @update:model-value="updateBackgroundClip"
    ></SelectItem>

    <!-- 背景色设置 -->
    <ColorItem
      v-if="background.backgroundType === 'color'"
      :model-value="background.backgroundColor"
      :label="$t('backgroundColor')"
      @update:model-value="(color) => (background.backgroundColor = color)"
    ></ColorItem>

    <!-- 背景图设置 -->
    <template v-if="background.backgroundType === 'image'">
      <ImageItem
        :label="$t('backgroundLink')"
        :model-value="background.backgroundImage"
        @update:model-value="(image) => (background.backgroundImage = image)"
      ></ImageItem>
      <TabsItem
        :label="$t('backgroundSize')"
        :data="{
          cover: $t('backgroundSizeCover'),
          contain: $t('backgroundSizeContain'),
          auto: $t('backgroundSizeAuto'),
        }"
        v-model="background.backgroundSize"
      ></TabsItem>
      <div class="item">
        <div class="label">{{ $t('backgroundPosition') }}</div>
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
        :label="$t('backgroundRepeat')"
        :options="{
          repeat: $t('backgroundRepeatRepeat'),
          'repeat-x': $t('backgroundRepeatRepeatX'),
          'repeat-y': $t('backgroundRepeatRepeatY'),
          'no-repeat': $t('backgroundRepeatNoRepeat'),
        }"
        v-model="background.backgroundRepeat"
      ></SelectItem>
      <SwitchItem
        :label="$t('fixedBackground')"
        :model-value="background.backgroundAttachment === 'fixed'"
        @update:model-value="(value: boolean) => (background.backgroundAttachment = value ? 'fixed' : 'scroll')"
      ></SwitchItem>
    </template>

    <!-- 背景渐变设置 -->
    <template v-if="background.backgroundType === 'gradient'">
      <SliderItem
        :label="$t('angle')"
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
              style: { background: getColor(item.color) },
            }))
          "
          :process="
            (dotsPos) =>
              dotsPos.slice(0, -1).map((_, i) => [
                dotsPos[i],
                dotsPos[i + 1],
                {
                  background: `linear-gradient(90deg, ${getColor(
                    background.backgroundGradient[i].color
                  )}, ${getColor(background.backgroundGradient[i + 1].color)})`,
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
        :label="$t('colorIndex', index + 1)"
        @update:model-value="(color) => (background.backgroundGradient[index].color = color)"
      >
        <Icon
          :class="['delete-btn', { disabled: background.backgroundGradient.length <= 2 }]"
          type="circle"
          name="line"
          :size="8"
          @click="deleteColor(index)"
        ></Icon>
      </ColorItem>
      <div class="item">
        <div class="full-btn add-color-btn" @click="handleAddColor">{{ $t('addColor') }}</div>
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
