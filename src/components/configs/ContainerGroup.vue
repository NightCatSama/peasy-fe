<script setup lang="ts">
import Group from '../widgets/Group.vue'
import SelectItem from '@/components/configs/items/SelectItem.vue'
import { PageNode } from '@/config'
import TabsItem from './items/TabsItem.vue'
import SliderItem from './items/SliderItem.vue'
import InputItem from './items/InputItem.vue'
import PreviewItem from './items/PreviewItem.vue'

interface IContainerGroupProps {
  node: PageNode
  container: IContainer
}
const { container, node } = defineProps<IContainerGroupProps>()
const showFilterCode = $ref(false)

const presetShadow = $computed(() => [
  '0 2px 2px 0 rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.08)',
  '0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2)',
  '0 2px 5px 0 rgba(0,0,0,0.26), 0 2px 10px 0 rgba(0,0,0,0.16)',
  '5px 5px 50px 10px rgba(158,155,158,0.15)',
  '0 6px 6px rgba(10,16,20,.15), 0 0 52px rgba(10,16,20,.12)',
  '0 16px 24px 2px rgba(0,0,0,0.14), 0 6px 30px 5px rgba(0,0,0,0.12), 0 8px 10px -5px rgba(0,0,0,0.2)',
])

const blur = $computed({
  get(): number {
    return parseFloat(container.filter?.match(/blur\((\d+)px\)/)?.[1] || '') || 0
  },
  set(val: number) {
    if (val > 0) {
      container.filter = `blur(${val}px)`
    } else {
      container.filter = ''
    }
  },
})
</script>

<template>
  <Group
    group-name="container"
    class="container-group"
    :can-advanced="true"
    :default-collapsed="false"
  >
    <template #default="{ showAdvanced }">
      <SliderItem
        :label="$t('opacity')"
        v-model="container.opacity"
        :min="0"
        :max="1"
        :interval="0.01"
      ></SliderItem>
      <SelectItem
        :label="$t('overflow')"
        :options="{
          visible: $t('visible'),
          hidden: $t('hidden'),
          scroll: $t('scroll'),
          auto: $t('auto'),
        }"
        v-model="container.overflow"
      ></SelectItem>
      <SelectItem
        :label="$t('cursor')"
        :options="{
          inherit: $t('inherit'),
          auto: $t('auto'),
          default: $t('default'),
          pointer: $t('pointer'),
          move: $t('move'),
          text: $t('text'),
          wait: $t('wait'),
          help: $t('help'),
          'not-allowed': $t('notAllowed'),
        }"
        v-model="container.cursor"
      ></SelectItem>
      <SliderItem
        :label="$t('filterBlur')"
        v-model="blur"
        :min="0"
        :max="20"
        :interval="1"
        @dblclick="showFilterCode = !showFilterCode"
      ></SliderItem>
      <InputItem
        v-if="showFilterCode"
        :label="$t('filterCode')"
        v-model="container.filter"
      ></InputItem>
      <PreviewItem :label="$t('shadow')" v-model="container.boxShadow" :options="presetShadow">
        <template #default="{ item: shadow, active }">
          <div :class="['inner', { active }]" :style="{ boxShadow: shadow }"></div>
        </template>
      </PreviewItem>
      <InputItem
        v-if="showAdvanced"
        :label="$t('customShadow')"
        v-model="container.boxShadow"
      ></InputItem>
    </template>
  </Group>
</template>

<style lang="scss" scoped>
.container-group {
  :deep(.inner) {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: $inner-radius;
    background: $white-gradient;
    overflow: hidden;

    $edge: 8px;
    &.active::after {
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
</style>
