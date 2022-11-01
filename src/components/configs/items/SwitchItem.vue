<script setup lang="ts">
import Switch from '@/components/widgets/Switch.vue'
import { emitter } from '@/utils/event'
import Icon from '@/components/widgets/Icon.vue'
import { inConfigMain } from '@/utils/helper'

interface ISwitchItemProps {
  label: string
  modelValue: boolean
  tip?: string
}

const { label, modelValue, tip } = defineProps<ISwitchItemProps>()
const emit = defineEmits(['update:model-value'])

const elem = $ref<HTMLElement | null>(null)

const value = $computed({
  get: () => modelValue,
  set: (val: boolean) => {
    emit('update:model-value', val)
    if (modelValue !== val && inConfigMain(elem)) {
      emitter.emit('saveHistory')
    }
  },
})
</script>

<template>
  <div ref="elem" class="item">
    <div class="label" v-if="label">
      <slot name="label" :label="label">{{ label }}</slot>
      <Icon
        v-if="tip"
        name="question"
        class="question-icon"
        :size="13"
        v-tooltip="{
          content: tip,
        }"
      ></Icon>
      <div class="label-suffix"><slot name="label-suffix"></slot></div>
    </div>
    <Switch v-model="value"></Switch>
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
