<script setup lang="ts">
import Group from '../widgets/Group.vue'
import { fixedPointToNumber } from '@/utils/sizeHelper';
import { PageNode } from '@/config';

interface IFontGroupProps {
  node: PageNode
  spacing: ISpacing
}
const { spacing, node } = defineProps<IFontGroupProps>()

const handleInput = (e: InputEvent) => {
  const elem = (e.target as HTMLInputElement)
  const value = elem.value
  if (value.length > 4) {
    elem.value = value.slice(0, 4)
  } else if (!/\.|[0-9]/.test(value[value.length - 1])) {
    elem.value = value.slice(0, -1)
  }
}
const handleChange = (e: InputEvent, setValue: (val: number) => void) => {
  const elem = (e.target as HTMLInputElement)
  const value = elem.value
  setValue(fixedPointToNumber(value))
}
const allPadding = $computed({
  get: () => {
    const { padding } = spacing
    if (
      padding[0] === padding[1] &&
      padding[1] === padding[2] &&
      padding[2] === padding[3]
    ) {
      return padding[0]
    }
    return '-'
  },
  set: (val) => {
    const value = fixedPointToNumber(val)
    if (value === 0) {
      spacing.padding = [0, 0, 0, 0]
    } else {
      spacing.padding = [value, value, value, value]
    }
  }
})
</script>

<template>
  <Group title="Spacing" class="spacing-group" :can-advanced="false">
    <div class="spacing-block" data-text="MARGIN">
      <div class="margin-sign"></div>
      <div class="inner-block" data-text="PADDING">
        <div class="padding-sign"></div>
        <input
          v-for="(val, i) in spacing.padding"
          :key="i"
          :class="['spacing-input', `spacing-input-${i}`]"
          :value="val"
          @input="handleInput"
          @change="(e: InputEvent) => handleChange(e, val => spacing.padding.splice(i, 1, val))"
        />
        <input
          class="spacing-input spacing-input-all"
          :value="allPadding"
          @input="handleInput"
          @change="allPadding = $event.target.value"
        />
      </div>
      <input
        v-for="(val, i) in spacing.margin"
        :key="i"
        :class="['spacing-input', `spacing-input-${i}`]"
        :value="val"
        @input="handleInput"
        @change="(e: InputEvent) => handleChange(e, val => spacing.margin.splice(i, 1, val))"
      />
    </div>
  </Group>
</template>

<style lang="scss" scoped>
@mixin spacing-tip {
  content: attr(data-text);
  position: absolute;
  color: rgba($panel-light, 70%);
  font-size: 14px;
  transform: scale(.8);
}
$gapX: 44px;
$gapY: 30px;
$inputW: 40px;
$inputH: 14px;
.spacing-group {
  .spacing-block {
    position: relative;
    margin: 6px 0;
    width: 100%;
    height: 150px;
    padding: $gapY $gapX;
    border-radius: $normal-radius;
    border: 1px dashed lighten($panel, 12%);

    &::after {
      @include spacing-tip;
      left: 5px;
      top: 5px;
      transform-origin: left top;
    }
  }
  .inner-block {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: $normal-radius;
    border: 1px solid lighten($theme, 12%);

    &::after {
      @include spacing-tip;
      right: 5px;
      bottom: 5px;
      transform-origin: right bottom;
    }
  }

  .margin-sign {
    width: 0;
    height: 0;
    border-radius: 50%;
    background: $tr;
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    box-shadow:
      (268px * 0.5 - 2px) 0 0 4px $panel-light,
      (268px * 0.5 - 2px) (150px - 2px) 0 4px $panel-light,
      0 (150px * 0.5 - 2px) 0 4px $panel-light,
      (268px - 2px) (150px * 0.5 - 2px) 0 4px $panel-light;
  }

  .padding-sign {
    position: absolute;
    width: 2px;
    height: 2px;
    border-radius: 50%;
    background: $tr;
    margin: auto;
    top: -1px;
    left: -1px;
    box-shadow:
      (178px * 0.5 - 2px) 0 0 2px $theme,
      (178px * 0.5 - 2px) (88px - 2px) 0 2px $theme,
      0 (88px * 0.5 - 2px) 0 2px $theme,
      (178px - 2px) (88px * 0.5 - 2px) 0 2px $theme;
  }

  .spacing-input {
    position: absolute;
    width: $inputW;
    border-radius: $inner-radius;
    background: $tr;
    color: $color;
    font-size: 12px;
    line-height: $inputH;
    padding: 0 7px;
    transform-origin: center;
    text-align: center;

    &, &:focus, &:active {
      outline: none;
      border: none;
    }

    &-0 {
      left: 50%;
      top: 8px;
      transform: translateX(-50%);
    }

    &-1 {
      right: 4px;
      top: 50%;
      transform: translateY(-50%);
    }

    &-2 {
      left: 50%;
      bottom: 8px;
      transform: translateX(-50%);
    }

    &-3 {
      left: 4px;
      top: 50%;
      transform: translateY(-50%);
    }

    &-all {
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      padding: 4px 6px;
      background: $panel-light-gradient;
      width: 64px;
    }
  }
}
</style>
