<script setup lang="ts">
import Group from '../widgets/Group.vue'
import { fixedPoint, fixedPointToNumber } from '@/utils/sizeHelper'
import { PageNode } from '@/config'
import InputItem from './items/InputItem.vue'
import SelectItem from './items/SelectItem.vue'
import ColorItem from './items/ColorItem.vue'
import Tabs from '../widgets/Tabs.vue'
import Icon from '../widgets/Icon.vue'
import TabsItem from './items/TabsItem.vue'

interface IFontGroupProps {
  node: PageNode
  border: IBorder
}
const { border, node } = defineProps<IFontGroupProps>()

const isRefinedRadius = $computed(() => Array.isArray(border.borderRadius))

/** 当前编辑的边框，-1 为全局 */
const curShowBorderIndex = $ref(-1)

const showList: any = $computed(() => {
  return {
    borderWidth: {
      name: 'Border Width',
      type: 'number',
      value:
        curShowBorderIndex > -1 ? border.borderWidth[curShowBorderIndex] : border.borderWidth[0],
      setValue: (val: string) => {
        const value = fixedPoint(val)
        if (curShowBorderIndex === -1) {
          border.borderWidth = [value, value, value, value]
        } else {
          border.borderWidth.splice(curShowBorderIndex, 1, value)
        }
      },
      suffix: ['px'],
    },
    borderColor: {
      name: 'Border Color',
      type: 'color',
      value:
        curShowBorderIndex > -1 ? border.borderColor[curShowBorderIndex] : border.borderColor[0],
      setValue: (value: string) => {
        if (curShowBorderIndex === -1) {
          border.borderColor = value
        } else {
          Array.isArray(border.borderColor) ? border.borderColor.splice(curShowBorderIndex, 1, value) : (border.borderColor = value)
        }
      },
    },
    borderStyle: {
      name: 'Border Style',
      type: 'select',
      value:
        curShowBorderIndex > -1 ? border.borderStyle[curShowBorderIndex] : border.borderStyle[0],
      setValue: (value: BorderStyle) => {
        if (curShowBorderIndex === -1) {
          border.borderStyle = [value, value, value, value]
        } else {
          border.borderStyle.splice(curShowBorderIndex, 1, value)
        }
      },
      options: ['solid', 'dashed', 'dotted', 'double'],
    },
    borderRadius: {
      name: 'Corner Radius',
      type: 'number',
      value: isRefinedRadius ? 'refined' : border.borderRadius,
      setValue: (val: string) => {
        if (val === 'refined') {
          border.borderRadius = new Array(4).fill(
            border.borderRadius === 'circle' ? '0px' : border.borderRadius
          ) as any
        } else {
          border.borderRadius = val
        }
      },
      suffix: ['px', 'circle', 'refined'],
    },
  }
})

const handleInput = (e: InputEvent) => {
  const elem = e.target as HTMLInputElement
  const value = elem.value
  if (value.length > 4) {
    elem.value = value.slice(0, 4)
  } else if (!/\.|[0-9]/.test(value[value.length - 1])) {
    elem.value = value.slice(0, -1)
  }
}

const handleChange = (e: InputEvent, setValue: (val: string) => void) => {
  const elem = e.target as HTMLInputElement
  const value = elem.value
  setValue(fixedPointToNumber(value) + 'px')
}

const boxStyles = $computed(() => {
  const getBorderRadius = (radius: string) => (radius === 'circle' ? '50%' : radius)
  return {
    [curShowBorderIndex === -1
      ? 'borderColor'
      : ['borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor'][
          curShowBorderIndex
        ]]: curShowBorderIndex === -1 ? '#DDD' : '#3e7ce8',
    borderRadius: Array.isArray(border.borderRadius)
      ? border.borderRadius.map(getBorderRadius).join(' ')
      : getBorderRadius(border.borderRadius),
  }
})
</script>

<template>
  <Group title="Border" class="border-group" :can-advanced="false" :default-collapsed="false">
    <div class="spacing-block" data-text="Preview">
      <div class="inner-block" :style="boxStyles">
        <Icon
          v-for="(dir, i) in ['top', 'right', 'bottom', 'left']"
          name="caret-down"
          :size="14"
          :class="['border-btn', 'border-btn-' + dir, { active: curShowBorderIndex === i }]"
          @click="curShowBorderIndex = i"
        ></Icon>
        <div
          :class="['all-btn', { active: curShowBorderIndex === -1 }]"
          @click="curShowBorderIndex = -1"
        >
          {{
            curShowBorderIndex === -1
              ? 'All'
              : ['Top', 'Right', 'Bottom', 'Left'][curShowBorderIndex]
          }}
        </div>
      </div>
      <input
        v-for="(val, i) in border.borderRadius"
        v-if="isRefinedRadius"
        :key="i"
        :class="['spacing-input', `spacing-input-${i}`]"
        :value="parseFloat(val)"
        @input="handleInput"
        @change="(e: InputEvent) => handleChange(e, val => Array.isArray(border.borderRadius) && border.borderRadius.splice(i, 1, val))"
      />
    </div>
    <template v-for="(item, key) in showList" :key="key">
      <InputItem
        v-if="item.type === 'number'"
        :label="item.name"
        :type="'number'"
        :model-value="item.value"
        :suffix="item.suffix"
        @update:model-value="item.setValue"
      ></InputItem>
      <TabsItem
        v-else-if="item.type === 'select'"
        :label="item.name"
        :data="Object.fromEntries(item.options.map((key: string) => [key, key]))"
        :model-value="item.value"
        @update:model-value="item.setValue"
      >
        <template #option="{ key }">
          <Icon v-if="key === 'solid'" name="line" :size="16"></Icon>
          <Icon v-if="key === 'dashed'" name="dashed" :size="16"></Icon>
          <Icon v-if="key === 'dotted'" name="dotted" :size="16"></Icon>
          <Icon v-if="key === 'double'" name="line-double" :size="16"></Icon>
        </template>
      </TabsItem>
      <ColorItem
        v-else-if="item.type === 'color'"
        :label="item.name"
        :model-value="item.value"
        @update:model-value="item.setValue"
      ></ColorItem>
    </template>
  </Group>
</template>

<style lang="scss" scoped>
@mixin spacing-tip {
  content: attr(data-text);
  position: absolute;
  color: rgba($panel-light, 70%);
  font-size: 14px;
  transform: scale(0.8);
}
$gapX: 44px;
$gapY: 30px;
.border-group {
  .spacing-block {
    position: relative;
    margin: 6px 0;
    width: 100%;
    height: 150px;
    padding: $gapY $gapX;
    border-radius: $normal-radius;
    border: 1px dashed lighten($panel, 12%);
    margin-bottom: 10px;

    &::after {
      @include spacing-tip;
      left: 50%;
      top: 5px;
      transform-origin: left top;
      transform: translateX(-50%);
    }
  }
  .inner-block {
    position: relative;
    width: 100%;
    height: 100%;
    opacity: 0.8;
    border-width: 3px;
    border-style: solid;
  }

  .spacing-input {
    position: absolute;
    width: 40px;
    border-radius: $inner-radius;
    background: $tr;
    color: $color;
    font-size: 12px;
    line-height: 14px;
    padding: 0 7px;
    transform-origin: center;
    text-align: center;

    &,
    &:focus,
    &:active {
      outline: none;
      border: none;
    }

    &-0 {
      left: 8px;
      top: 16px;
    }

    &-1 {
      right: 8px;
      top: 16px;
    }

    &-2 {
      right: 8px;
      bottom: 16px;
    }

    &-3 {
      left: 8px;
      bottom: 16px;
    }
  }

  .border-btn {
    position: absolute;
    color: $color;
    transform-origin: center;
    cursor: pointer;

    &-top {
      top: 4px;
      left: 50%;
      transform: translateX(-50%) rotate(180deg);
    }
    &-right {
      top: 50%;
      right: 10px;
      transform: translateY(-50%) rotate(-90deg);
    }
    &-bottom {
      bottom: 4px;
      left: 50%;
      transform: translateX(-50%);
    }
    &-left {
      top: 50%;
      left: 10px;
      transform: translateY(-50%) rotate(90deg);
    }

    &.active {
      color: $theme;
    }
  }

  .all-btn {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 28px;
    background: $panel-light-gradient;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $color;
    border-radius: $inner-radius;

    &.active {
      color: $white;
      background: $theme-gradient;
    }
  }
}
</style>
