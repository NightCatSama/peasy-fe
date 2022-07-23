<script setup lang="ts">
import Group from '../widgets/Group.vue'
import SelectItem from '@/components/configs/items/SelectItem.vue'
import { PageNode } from '@/config'
import TabsItem from './items/TabsItem.vue'
import SliderItem from './items/SliderItem.vue'

interface IContainerGroupProps {
  node: PageNode
  container: IContainer
}
const { container, node } = defineProps<IContainerGroupProps>()

const presetShadow = $computed(() => [
  '0 2px 2px 0 rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.08)',
  '0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2)',
  '0 2px 5px 0 rgba(0,0,0,0.26), 0 2px 10px 0 rgba(0,0,0,0.16)',
  '5px 5px 50px 10px rgba(158,155,158,0.15)',
  '0 6px 6px rgba(10,16,20,.15), 0 0 52px rgba(10,16,20,.12)',
  '0 16px 24px 2px rgba(0,0,0,0.14), 0 6px 30px 5px rgba(0,0,0,0.12), 0 8px 10px -5px rgba(0,0,0,0.2)',
])

const curShadowIndex = $computed(() => presetShadow.indexOf(container.boxShadow))
</script>

<template>
  <Group title="Container" class="container-group" :can-advanced="false" :default-collapsed="false">
    <SliderItem
      label="Opacity"
      v-model="container.opacity"
      :min="0"
      :max="1"
      :interval="0.01"
    ></SliderItem>
    <SelectItem
      label="Overflow"
      :options="{ visible: 'Visible', hidden: 'Hidden', scroll: 'Scroll', auto: 'Auto' }"
      v-model="container.overflow"
    ></SelectItem>
    <div class="item shadow-item">
      <div class="label">Shadow</div>
      <div class="shadow-preview">
        <div
          v-for="(shadow, index) in presetShadow"
          :key="index"
          :class="['shadow-preview-item', { active: curShadowIndex === index }]"
          @click="container.boxShadow = curShadowIndex === index ? '' : shadow"
        >
          <div class="inner" :style="{ boxShadow: shadow }"></div>
        </div>
      </div>
    </div>
  </Group>
</template>

<style lang="scss" scoped>
.container-group {
  .shadow-item {
    align-items: flex-start;
    flex-direction: column;

    .label {
      margin: 10px 0;
    }

    .shadow-preview {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      &-item {
        position: relative;
        margin-right: 10px;
        margin-bottom: 10px;
        width: 78px;
        height: 78px;
        border-radius: $normal-radius;
        background: $color;
        padding: 20px;
        cursor: pointer;
        overflow: hidden;

        .inner {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: $inner-radius;
          background: $white-gradient;
          overflow: hidden;
        }

        $edge: 8px;
        &.active .inner::after {
          content: '';
          position: absolute;
          right: -$edge;
          top: -$edge;
          width: $edge * 2;
          height: $edge * 2;
          background: $theme;
          transform: rotate(45deg);
          box-shadow: $shadow;
        }
      }
    }
  }
}
</style>
