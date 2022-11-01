<script setup lang="ts">
import InputItem from '@/components/configs/items/InputItem.vue'
import { PageNode } from '@/config'
import { $t } from '@/constants/i18n'
import { updateDirection } from '@/utils/moveable'
import Group from '../widgets/Group.vue'

interface ISizeGroupProps {
  node: PageNode
  size: ISize
}
const { size, node } = defineProps<ISizeGroupProps>()

const isSection = $computed(() => node.type === 'section')

const list: any = $computed(() => [
  {
    hide: isSection,
    name: $t('width'),
    type: 'number',
    value: size.width,
    setValue: (val: string) => {
      size.width = val
      updateDirection(node)
    },
    suffix: ['px', '%', 'rem', 'vw', 'auto', 'stretch'],
  },
  {
    name: $t('height'),
    type: 'number',
    value: size.height,
    setValue: (val: string) => {
      size.height = val
      updateDirection(node)
    },
    suffix: isSection
      ? ['px', '%', 'rem', 'vw', 'auto']
      : ['px', '%', 'rem', 'vh', 'vw', 'auto', 'stretch'],
  },
  {
    hide: isSection,
    name: $t('minWidth'),
    type: 'number',
    value: size.minWidth,
    setValue: (val: string) => (size.minWidth = val),
    suffix: ['px', '%', 'rem', 'vw', 'auto'],
    isAdvanced: true,
  },
  {
    name: $t('minHeight'),
    type: 'number',
    value: size.minHeight,
    setValue: (val: string) => (size.minHeight = val),
    suffix: ['px', '%', 'rem', 'vh', 'vw', 'auto'],
    isAdvanced: true,
  },
  {
    hide: isSection,
    name: $t('maxWidth'),
    type: 'number',
    value: size.maxWidth,
    setValue: (val: string) => (size.maxWidth = val),
    suffix: ['px', '%', 'rem', 'vw', 'none'],
    isAdvanced: true,
  },
  {
    name: $t('maxHeight'),
    type: 'number',
    value: size.maxHeight,
    setValue: (val: string) => (size.maxHeight = val),
    suffix: ['px', '%', 'rem', 'vh', 'vw', 'none'],
    isAdvanced: true,
  },
])
</script>

<template>
  <Group group-name="size" class="size-group" :can-advanced="true" :default-collapsed="false">
    <template #default="{ showAdvanced }">
      <template v-for="(item, index) in list" :key="item.name">
        <InputItem
          v-if="!item.hide && (!item.isAdvanced || showAdvanced)"
          :label="item.name"
          :model-value="item.value"
          :suffix="item.suffix"
          :type="item.type"
          @update:model-value="item.setValue"
        >
        </InputItem>
      </template>
    </template>
  </Group>
</template>

<style lang="scss" scoped>
.size-group {
  .label {
    flex: 1;
    margin-right: 8px;
  }
}
</style>
