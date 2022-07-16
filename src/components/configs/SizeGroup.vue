<script setup lang="ts">
import { reactive } from 'vue'
import Group from '../widgets/Group.vue'
import Tabs from '../widgets/Tabs.vue'
import Input from '../widgets/Input.vue'
interface ISizeGroupProps {
  node: CNode
  size: ISize
}
const { size, node } = defineProps<ISizeGroupProps>()

const isSection = $computed(() => node.type === 'section')

const list: any = reactive([
  {
    hide: isSection,
    name: 'Width',
    type: 'number',
    value: size.width,
    suffix: ['px', '%', 'auto', 'stretch'],
  },
  {
    name: 'Height',
    type: 'number',
    value: size.height,
    suffix: isSection ? ['px', '%', 'auto'] : ['px', '%', 'auto', 'stretch'],
  },
  {
    hide: isSection,
    name: 'Min W',
    type: 'number',
    value: size.minWidth,
    suffix: ['px', '%', 'auto'],
    isAdvanced: true,
  },
  {
    name: 'Min H',
    type: 'number',
    value: size.minHeight,
    suffix: ['px', '%', 'auto'],
    isAdvanced: true,
  },
  {
    hide: isSection,
    name: 'Max W',
    type: 'number',
    value: size.maxWidth,
    suffix: ['px', '%', 'none'],
    isAdvanced: true,
  },
  {
    name: 'Max H',
    type: 'number',
    value: size.maxHeight,
    suffix: ['px', '%', 'none'],
    isAdvanced: true,
  },
])
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
            v-model="item.value"
            :suffix="item.suffix"
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
