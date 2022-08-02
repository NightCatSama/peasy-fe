<script setup lang="ts">
import Slider from '@/components/widgets/Slider.vue'
import { emitter } from '@/utils/event'

type SliderPropType = Partial<InstanceType<typeof Slider>>

interface ISliderItemProps extends SliderPropType {
  label: string
  type?: 'text' | 'angle'
  modelValue: SliderPropType['modelValue']
}

const props = defineProps<ISliderItemProps>()
const { label, type = 'text', modelValue } = $(props)
const emit = defineEmits(['update:model-value'])

let value = $computed({
  get: () => modelValue,
  set: (val: SliderPropType['modelValue']) => {
    emit('update:model-value', val)
  },
})

const handleChange = (e: Event) => {
  const elem = e.target as HTMLInputElement
  if (elem.value.length > 4) {
    elem.value = elem.value.slice(0, 4)
  } else {
    value = parseFloat(elem.value) || 0
  }
}

const handleDragEnd = () => {
  emitter.emit('saveHistory')
}
</script>

<template>
  <div class="item">
    <div class="label">{{ label }}</div>
    <div :class="['value', `value-type-${type}`]">
      <div
        v-if="type === 'angle'"
        class="angle-point"
        :style="{ transform: `rotate(${(value as number) - 90}deg)` }"
      ></div>
      <input type="text" :value="value" @change="handleChange" />
    </div>
    <Slider
      class="slider"
      v-bind="$attrs"
      v-model="value"
      :contained="true"
      :max="Math.max($attrs.max as number || 0, value as number)"
      @drag-end="handleDragEnd"
    ></Slider>
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.item {
  .label {
    flex: none;
    margin-right: 10px;
    min-width: 60px;
  }

  .value {
    position: relative;
    width: 36px;
    padding: 2px 4px;
    font-size: 13px;
    border-radius: $normal-radius;
    color: $color;
    background: $panel-gradient;
    margin-right: 10px;
    text-align: center;

    $angleSize: 28px;

    > input {
      border: none;
      outline: none;
      width: 100%;
      color: $color;
      font-family: inherit;
      background-color: $tr;
      font-size: 12px;
      text-align: center;
    }

    &-type-angle {
      width: $angleSize;
      height: $angleSize;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      background: $bg-default;
      font-size: 12px;
      color: rgba($color, 30%);
    }

    .angle-point {
      position: absolute;
      left: 50%;
      top: 50%;
      width: $angleSize * 0.5;
      height: 4px;
      margin-top: -2px;
      transform-origin: center left;

      &::after {
        content: '';
        position: absolute;
        width: 4px;
        height: 4px;
        right: 0;
        top: 0;
        border-radius: 50%;
        background-color: $white;
      }
    }
  }

  .slider {
    flex: 1;
  }
}
</style>
