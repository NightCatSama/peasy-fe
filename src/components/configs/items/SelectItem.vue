<script setup lang="ts">
import Select, { ISelectItem } from '@/components/widgets/Select.vue'
import { emitter } from '@/utils/event'
import Icon from '@/components/widgets/Icon.vue'

interface ISelectItemProps {
  label: string
  tip?: string
  modelValue: string
  wrapperClass?: string
  options: { [key: string]: string | ISelectItem }
}

const { label, tip, modelValue, options, wrapperClass } = defineProps<ISelectItemProps>()
const emit = defineEmits(['update:model-value'])

const value = $computed({
  get: () => modelValue,
  set: (val: string) => {
    emit('update:model-value', val)
    modelValue !== val && emitter.emit('saveHistory')
  },
})
</script>

<template>
  <div :class="['item', wrapperClass]">
    <span class="label" v-if="label">
      <slot name="label" :label="label">{{ label }}</slot>
      <Icon
        v-if="tip"
        name="question"
        class="question-icon"
        :size="13"
        v-tooltip="{
          content: tip
        }"
      ></Icon>
      <div class="label-suffix"><slot name="label-suffix"></slot></div>
    </span>
    <Select v-model="value" :options="options" v-bind="$attrs">
      <template #item="{ item }"><slot name="item" :item="item"></slot></template>
    </Select>
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.item {
  .label {
    flex: 1;
    display: flex;
    align-items: center;

    &-suffix {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
}
</style>
