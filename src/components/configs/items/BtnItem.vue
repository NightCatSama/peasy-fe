<script setup lang="ts">
import { emitter } from '@/utils/event'
import Icon from '@/components/widgets/Icon.vue'
import Btn from '@/components/widgets/Btn.vue'

interface IBtnItemProps {
  label: string
  tip?: string
  btnColor?: InstanceType<typeof Btn>['color']
  modelValue: string
  canDelete?: boolean
  wrapperClass?: string
  onClick: () => void
  onDelete?: () => void
}

const { label, tip, btnColor = 'primary', canDelete, modelValue, wrapperClass, onClick, onDelete } = defineProps<IBtnItemProps>()
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
    <slot>
      <Btn type="inner" :color="btnColor" size="sm" @click="() => onClick?.()">{{ modelValue }}</Btn>
    </slot>
    <Icon v-if="canDelete" name="close" type="btn" color="red" :size="16" @click="() => onDelete?.()"></Icon>
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
