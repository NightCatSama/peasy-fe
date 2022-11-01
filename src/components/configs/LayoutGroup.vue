<script setup lang="ts">
import { useLayoutStyle } from '@/components/libs/hooks/style'
import { PageNode } from '@/config'
import { $t } from '@/constants/i18n'
import Group from '../widgets/Group.vue'
import SelectItem from './items/SelectItem.vue'
import SwitchItem from './items/SwitchItem.vue'
import TabsItem from './items/TabsItem.vue'

interface ILayoutGroupProps {
  node: PageNode
  layout: ILayout
}
const { layout, node } = defineProps<ILayoutGroupProps>()

const justifyMap: { [key in ILayout['justify']]: string } = {
  start: $t('justifyStart'),
  center: $t('justifyCenter'),
  end: $t('justifyEnd'),
  'space-around': $t('justifySpaceAround'),
  'space-between': $t('justifySpaceBetween'),
  'space-evenly': $t('justifySpaceEvenly'),
}
const alignMap: { [key in ILayout['align']]: string } = {
  start: $t('alignStart'),
  center: $t('alignCenter'),
  end: $t('alignEnd'),
  stretch: $t('alignStretch'),
  baseline: $t('alignBaseline'),
}
const isWrap = $computed({
  get() {
    return layout.wrap === 'wrap'
  },
  set(val: boolean) {
    layout.wrap = val ? 'wrap' : 'nowrap'
  },
})
const isReverse = $computed({
  get() {
    return !!layout.reverse
  },
  set(val: boolean) {
    layout.reverse = val
  },
})

const previewStyle = $computed(() => useLayoutStyle(layout))
</script>

<template>
  <Group group-name="layout" class="layout-group" :default-collapsed="true">
    <div class="align-preview" data-title="Preview" :style="previewStyle">
      <div class="align-preview-item">1</div>
      <div class="align-preview-item">2</div>
      <div class="align-preview-item">3</div>
    </div>
    <TabsItem
      :label="$t('direction')"
      :data="{ row: $t('row'), column: $t('column') }"
      v-model="layout.direction"
    >
    </TabsItem>
    <SelectItem
      :label="$t('mainAxisAlign')"
      v-model="layout.justify"
      :options="justifyMap"
    ></SelectItem>
    <SelectItem
      :label="$t('crossAxisAlign')"
      v-model="layout.align"
      :options="alignMap"
    ></SelectItem>
    <SwitchItem :label="$t('wrap')" v-model="isWrap"></SwitchItem>
    <SwitchItem :label="$t('reverse')" v-model="isReverse"></SwitchItem>
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
