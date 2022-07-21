<script setup lang="ts">
import Slider from '@/components/widgets/Slider.vue'

type SliderPropType = Partial<InstanceType<typeof Slider>>

interface ISliderItemProps extends SliderPropType {
  label: string
  modelValue: SliderPropType['modelValue']
}

const props = defineProps<ISliderItemProps>()
const { label, modelValue } = props
const emit = defineEmits(['update:modelValue'])

const value = $computed({
  get: () => modelValue,
  set: (val: SliderPropType['modelValue']) => {
    emit('update:modelValue', val)
  },
})
</script>

<template>
  <div class="item">
    <div class="label">{{ label }}</div>
    <Slider class="slider" v-model="value" :contained="true" v-bind="$attrs"></Slider>
  </div>
</template>

<style lang="scss" scoped>
.item {
  .label {
    flex: none;
    margin-right: 10px;
  }

  .slider {
    flex: 1;
  }
}
</style>
