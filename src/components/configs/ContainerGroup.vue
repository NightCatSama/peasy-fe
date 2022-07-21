<script setup lang="ts">
import Group from '../widgets/Group.vue'
import InputItem from '@/components/configs/items/InputItem.vue'
import SelectItem from '@/components/configs/items/SelectItem.vue'
import ColorItem from './items/ColorItem.vue'
import { usePageStore } from '@/stores/page'
import { PageNode } from '@/config'
import Icon from '../widgets/Icon.vue'
import { put } from '@/utils/oss'
import TabsItem from './items/TabsItem.vue'
import SliderItem from './items/SliderItem.vue'

interface IContainerGroupProps {
  node: PageNode
  container: IContainer
}
const { container, node } = defineProps<IContainerGroupProps>()

const updateBackgroundType = (type: 'color' | 'image' | 'gradient') => {
  container.backgroundType = type
}

const uploadImage = async (e: InputEvent) => {
  const files = (e.target as HTMLInputElement).files
  if (files?.[0]) {
    const url = await put(files[0])
    container.backgroundImage = url as string
  }
}
</script>

<template>
  <Group title="Container" class="container-group" :can-advanced="true" :default-collapsed="true">
    <template #default="{ showAdvanced }">
      <SelectItem
        :model-value="container.backgroundType"
        :label="'Background'"
        :options="{
          color: 'Color',
          image: 'Image',
          gradient: 'Gradient',
        }"
        @update:model-value="updateBackgroundType"
      ></SelectItem>
      <ColorItem
        v-if="container.backgroundType === 'color'"
        :model-value="container.backgroundColor"
        :label="'Background Color'"
        @update:model-value="(color) => (container.backgroundColor = color)"
      ></ColorItem>
      <template v-if="container.backgroundType === 'image'">
        <InputItem
          :model-value="container.backgroundImage"
          :label="'Image Link'"
          :type="'textarea'"
          :placeholder="'https://'"
          @update:model-value="(image) => (container.backgroundImage = image)"
        >
          <template #suffix>
            <div class="upload-wrapper">
              <div class="upload-btn">
                Upload
                <input
                  type="file"
                  class="upload-btn-input"
                  accept=".jpg, .jpeg, .png .gif .webp"
                  @change="uploadImage"
                />
              </div>
              <Icon
                name="question"
                :size="13"
                v-tooltip="{ content: 'Stability not guaranteed' }"
              ></Icon>
            </div>
          </template>
        </InputItem>
        <TabsItem
          label="Background Size"
          :data="{ cover: 'Cover', contain: 'Contain', auto: 'Auto' }"
          v-model="container.backgroundSize"
        ></TabsItem>
        <template v-if="showAdvanced">
          <!-- TODO: 换成方向图标 -->
          <TabsItem
            label="Background Position"
            :data="{ left: 'Left', center: 'Center', right: 'Right' }"
            v-model="container.backgroundPosition"
          ></TabsItem>
          <!-- TODO: 换成 repeat 图标 -->
          <TabsItem
            label="Background Repeat"
            :data="{
              repeat: 'Repeat',
              'repeat-x': 'Only-X',
              'repeat-y': 'Only-Y',
              'no-repeat': 'None',
            }"
            v-model="container.backgroundRepeat"
          ></TabsItem>
        </template>
      </template>
      <template v-if="showAdvanced">
        <!-- TODO: 换成 Overflow 图标 -->
        <TabsItem
          label="Overflow"
          :data="{ visible: 'Vis', hidden: 'Hide', scroll: 'Scroll', auto: 'Auto' }"
          v-model="container.overflow"
        ></TabsItem>
        <SliderItem
          label="Opacity"
          v-model="container.opacity"
          :min="0"
          :max="1"
          :interval="0.01"
        ></SliderItem>
        <!-- TODO: 换成 box shadow 模块 -->
        <TabsItem
          label="Box Shadow"
          :data="[
            {
              key: '0 0 10px 3px rgba(0, 0, 0, .16)',
              value: 'Float',
            },
            {
              key: '0 0 20px 5px rgba(0, 0, 0, 0.16)',
              value: 'Bigger',
            },
            {
              key: '1px 1px 3px 1px rgba(0, 0, 0, 0.36)',
              value: 'Bulge',
            },
          ]"
          v-model="container.boxShadow"
        ></TabsItem>
      </template>
    </template>
  </Group>
</template>

<style lang="scss" scoped>
.container-group {
  .label {
    flex: 1;
    margin-right: 8px;
  }

  .upload-wrapper {
    position: absolute;
    right: 4px;
    bottom: 4px;
    font-size: 13px;
    display: flex;
    align-items: center;
    z-index: 1;
    padding: 4px;
    cursor: pointer;

    .upload-btn {
      position: relative;
      margin-right: 4px;

      &:hover {
        color: $theme;
      }
      &-input {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
      }
    }
  }
}
</style>
