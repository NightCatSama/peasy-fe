<script setup lang="ts">
import Tabs, { ITabItem } from '@/components/widgets/Tabs.vue'

interface ITabsItemProps {
  label?: string
  modelValue?: string
  data: { [key: string]: string } | string[] | ITabItem[]
  iconMap?: { [key: string]: any }
}

const { label, modelValue, data, iconMap } = defineProps<ITabsItemProps>()
const emit = defineEmits(['update:modelValue'])

const handleChange = (val: string) => {
  emit('update:modelValue', val)
}
</script>

<template>
  <div class="item">
    <div class="label">{{ label }}</div>
    <Tabs :data="data" :model-value="modelValue" :icon-map="iconMap" @update:model-value="(key) => handleChange(key)">
      <template #option="props"><slot name="option" v-bind="props"></slot></template>
    </Tabs>
  </div>
</template>

<style lang="scss" scoped>
.item {
  flex-direction: column;
  align-items: stretch;

  .label {
    display: none;
    margin-bottom: 10px;
  }
}
</style>
