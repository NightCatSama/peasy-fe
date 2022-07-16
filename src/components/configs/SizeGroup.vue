<script setup lang="ts">
import Group from '../widgets/Group.vue';
import Tabs from '../widgets/Tabs.vue';
import Input from '../widgets/Input.vue';
interface ISizeGroupProps {
  node: CNode
  size: ISize
}
const { size, node } =
  defineProps<ISizeGroupProps>()

const isSection = $computed(() => node.type === 'section')

</script>

<template>
  <Group title="Size" class="size-group">
    <div class="item" v-if="!isSection">
      <span class="label">Width</span>
      <Input
        :class="['size-input', {}]"
        type="number"
        :value="size.width"
        :suffix="['px', '%', 'auto', 'stretch']"
        @change="val => size.width = val"
      ></Input>
    </div>
    <div class="item">
      <span class="label">Height</span>
      <Input
        :class="['size-input', {}]"
        type="number"
        :value="size.height"
        :suffix="isSection ? ['px', '%', 'auto'] : ['px', '%', 'auto', 'stretch']"
        @change="val => size.height = val"
      ></Input>
    </div>
    <div class="item" v-if="!isSection">
      <span class="label">Min W</span>
      <Input
        :class="['size-input', {}]"
        type="number"
        :value="size.minWidth"
        :suffix="['px', '%', 'auto']"
        @change="val => size.minWidth = val"
      ></Input>
    </div>
    <div class="item" v-if="!isSection">
      <span class="label">Max W</span>
      <Input
        :class="['size-input', {}]"
        type="number"
        :value="size.maxWidth"
        :suffix="['px', '%', 'none']"
        @change="val => size.maxWidth = val"
      ></Input>
    </div>
    <div class="item">
      <span class="label">Min H</span>
      <Input
        :class="['size-input', {}]"
        type="number"
        :value="size.minHeight"
        :suffix="['px', '%', 'auto']"
        @change="val => size.minHeight = val"
      ></Input>
    </div>
    <div class="item">
      <span class="label">Max H</span>
      <Input
        :class="['size-input', {}]"
        type="number"
        :value="size.maxHeight"
        :suffix="['px', '%', 'none']"
        @change="val => size.maxHeight = val"
      ></Input>
    </div>
  </Group>
</template>

<style lang="scss" scoped>
.size-group {
  .label {
    flex: 1;
    margin-right: 8px;
  }
  .size-input {
    width: 90px;
    min-width: 90px;
    flex: none;
    transition: all .3s;

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
      opacity: .5;
      transition: all .5s;

      &.active {
        opacity: 1;
      }
    }
  }
}
</style>
