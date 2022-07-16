<script setup lang="ts">
import Group from '../widgets/Group.vue'
import Input from '../widgets/Input.vue'
import Tabs from '../widgets/Tabs.vue'
import Select from '../widgets/Select.vue'
import { useLayoutStyle } from '@/utils/style'
interface ILayoutGroupProps {
  node: CNode
  layout: ILayout
}
const { layout, node } = defineProps<ILayoutGroupProps>()

const isSection = $computed(() => node.type === 'section')

const justifyMap: { [key in ILayout['justify']]: string } = {
  start: 'Start',
  center: 'Center',
  end: 'End',
  'space-around': 'Space Around',
  'space-between': 'Space Between',
  'space-evenly': 'Space Evenly',
}
const alignMap: { [key in ILayout['align']]: string } = {
  start: 'Start',
  center: 'Center',
  end: 'End',
  stretch: 'Stretch',
  baseline: 'Baseline',
}

const previewStyle = $computed(() => useLayoutStyle(layout))
</script>

<template>
  <Group title="Layout" class="layout-group" :default-collapsed="true">
    <div class="item">
      <Tabs
        :data="{ row: 'Row', column: 'Column' }"
        :active-key="layout.direction"
        @change="(key) => (layout.direction = key)"
      ></Tabs>
    </div>
    <div class="item">
      <div class="label">Main-Axis Align</div>
      <Select v-model="layout.justify" :options="justifyMap"></Select>
    </div>
    <div class="item">
      <div class="label">Cross-Axis Align</div>
      <Select v-model="layout.align" :options="alignMap"></Select>
    </div>
    <div class="align-preview" data-title="Preview" :style="previewStyle">
      <div class="align-preview-item">1</div>
      <div class="align-preview-item">2</div>
      <div class="align-preview-item">3</div>
    </div>
  </Group>
</template>

<style lang="scss" scoped>
.layout-group {
  .label {
    flex: 1;
    margin-right: 8px;
  }

  .align-preview {
    position: relative;
    display: flex;
    align-self: center;
    width: 180px;
    height: 180px;
    border: 1px dashed rgba($panel-light, 0.5);
    padding: 4px;
    margin-bottom: 10px;
    border-radius: $normal-radius;

    &::before {
      content: attr(data-title);
      position: absolute;
      left: 50%;
      bottom: 8px;
      transform: translateX(-50%);
      color: $panel-light;
      opacity: 0.3;
      font-size: 18px;
      font-weight: bold;
      z-index: 0;
    }

    &-item {
      min-width: 30px;
      min-height: 30px;
      margin: 4px;
      background: $panel-light-gradient;
      border-radius: $inner-radius;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
