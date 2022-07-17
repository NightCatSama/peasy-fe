<script setup lang="ts">
import { reactive } from 'vue'
import Group from '../widgets/Group.vue'
import Tabs from '../widgets/Tabs.vue'
import Input from '../widgets/Input.vue'
import { fixedPoint, getUnit } from '@/utils/sizeHelper';
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

const handleChange = (val: string, handler: any) => {
  handler(fixedPoint(val))
}
</script>

<template>
  <Group title="Size" class="size-group" :can-advanced="true">
    <template #default="{ showAdvanced }">
      <template v-for="(item, index) in list" :key="item.name">
        <div class="item" v-if="!item.hide && (!item.isAdvanced || showAdvanced)">
          <span class="label">{{ item.name }}</span>
          <Input
            class="size-input"
            type="number"
            :model-value="item.value"
            :suffix="item.suffix"
            @update:model-value="val => handleChange(val, item.setValue)"
          ></Input>
        </div>
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
  .size-input {
    width: $item-width;
    flex: none;
    transition: all 0.3s;

    &.hide {
      opacity: 0;
      transform: scale(0.9);
      pointer-events: none;
    }
  }
  .size-check {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-left: 10px;

    :deep(.icon) {
      background: $bg-default;
      opacity: 0.5;
      transition: all 0.5s;

      &.active {
        opacity: 1;
      }
    }
  }
}
</style>
