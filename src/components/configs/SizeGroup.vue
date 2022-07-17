<script setup lang="ts">
import Group from '../widgets/Group.vue'
import InputItem from '@/components/configs/items/InputItem.vue'

interface ISizeGroupProps {
  node: CNode
  size: ISize
}
const { size, node } = defineProps<ISizeGroupProps>()

const isSection = $computed(() => node.type === 'section')

const list: any = $computed(() => [
  {
    hide: isSection,
    name: 'Width',
    type: 'number',
    value: size.width,
    setValue: (val: string) => (size.width = val),
    suffix: ['px', '%', 'rem', 'auto', 'stretch'],
  },
  {
    name: 'Height',
    type: 'number',
    value: size.height,
    setValue: (val: string) => (size.height = val),
    suffix: isSection ? ['px', '%', 'rem', 'auto'] : ['px', '%', 'rem', 'auto', 'stretch'],
  },
  {
    hide: isSection,
    name: 'Min W',
    type: 'number',
    value: size.minWidth,
    setValue: (val: string) => (size.minWidth = val),
    suffix: ['px', '%', 'rem', 'auto'],
    isAdvanced: true,
  },
  {
    name: 'Min H',
    type: 'number',
    value: size.minHeight,
    setValue: (val: string) => (size.minHeight = val),
    suffix: ['px', '%', 'rem', 'auto'],
    isAdvanced: true,
  },
  {
    hide: isSection,
    name: 'Max W',
    type: 'number',
    value: size.maxWidth,
    setValue: (val: string) => (size.maxWidth = val),
    suffix: ['px', '%', 'rem', 'none'],
    isAdvanced: true,
  },
  {
    name: 'Max H',
    type: 'number',
    value: size.maxHeight,
    setValue: (val: string) => (size.maxHeight = val),
    suffix: ['px', '%', 'rem', 'none'],
    isAdvanced: true,
  },
])
</script>

<template>
  <Group title="Size" class="size-group" :can-advanced="true">
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
