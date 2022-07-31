<script lang="ts">
initRecentColors()
</script>
<script setup lang="ts">
import { Chrome } from '@ckpack/vue-color'
import InputItem from './InputItem.vue'
import Dropdown from '@/components/widgets/Dropdown.vue'
import { initRecentColors, getRecentColors, isColor, pushRecentColor } from '@/utils/color';
import { getColor } from '@/components/libs/hooks/color';
import Tabs from '@/components/widgets/Tabs.vue';
import Select from '@/components/widgets/Select.vue';
import { usePageStore } from '@/stores/page';
import { useDisplayStore } from '@/stores/display';
import { storeToRefs } from 'pinia';
import { variableColorSymbol } from '@/config';

interface IColorItemProps {
  label: string
  modelValue: string
  hideVariable?: boolean
}

const { label, modelValue, hideVariable } = defineProps<IColorItemProps>()
const emit = defineEmits(['update:model-value'])

const pageStore = usePageStore()
const { colorVars } = storeToRefs(pageStore)

const displayStore = useDisplayStore()
const { colorType } = storeToRefs(displayStore)

let recentColors = $ref<string[]>(getRecentColors())

const value = $computed({
  get: () => modelValue,
  set: (val: any) => {
    const newColor = val.hex8 ? (val.hex8.slice(-2) === 'FF' ? val.hex : val.hex8) : val
    if (!isColor(newColor)) {
      val = modelValue
      return
    }
    emit('update:model-value', newColor)
  },
})

const saveRecentColor = (val: string) => {
  const value = val || modelValue
  if (value.slice(0, 1) !== variableColorSymbol) {
    recentColors = pushRecentColor(value);
  }
}

const handleInputChange = (e: Event) => {
  const value = (e.target as HTMLInputElement).value;
  if (value && value !== modelValue) {
    saveRecentColor(value)
  }
}

const showValue = $computed(() => getColor(modelValue))
</script>

<template>
  <InputItem type="text" :label="label" v-model="value" @change="handleInputChange">
    <template #suffix>
      <Dropdown
        type="color-picker"
        popper-class="color-dropdown"
        :skidding="20"
        :distance="10"
        @apply-hide="saveRecentColor"
      >
        <div class="color-preview" :style="{ background: showValue }"></div>
        <template #content="{ hide }">
          <Chrome v-model="value"></Chrome>
          <div class="color-plus">
            <Select
              display="text"
              :disabled="hideVariable"
              :model-value="hideVariable ? 'recent' : colorType"
              placement="bottom-start"
              container=".color-dropdown"
              :options="hideVariable ? { recent: 'Recent Color' } : {
                variable: 'Variable',
                recent: 'Recent Color',
              }"
              @update:model-value="val => colorType = val"
            ></Select>
            <div v-if="!hideVariable && colorType === 'variable'" class="color-wrapper">
              <div
                class="color-var-item"
                v-for="c in colorVars"
                :key="c.name"
                @click="value = c.name; hide()"
              >
                <div
                  class="color-box"
                  :style="{ background: c.color }"
                ></div>
                <div class="color-var-name">{{ c.name }}</div>
              </div>
            </div>
            <div v-if="hideVariable || colorType === 'recent'" class="color-wrapper">
              <div
                class="color-box"
                v-for="c in recentColors"
                :key="c"
                :style="{ background: c }"
                @click="value = c; hide()"
              ></div>
            </div>
          </div>
        </template>
      </Dropdown>
    </template>
    <slot></slot>
  </InputItem>
</template>

<style lang="scss" scoped>
.item {
  display: flex;
  align-items: center;
  .label {
    flex: 1;
  }

  .color-preview {
    width: 26px;
    height: 100%;
    cursor: pointer;
    border-radius: 4px;
    white-space: nowrap;
    transition: all 0.3s;
    border: 1px solid rgba($white, 0.4);
  }
}
</style>

<style lang="scss">
.color-dropdown {
  .v-popper__inner > div > div {
    border-radius: $inner-radius;
    box-shadow: 0 0 2px rgb(0 0 0 / 30%), 0 4px 8px rgb(0 0 0 / 30%);
  }
  .vc-chrome,
  .vc-chrome-body {
    background-color: $panel-dark;
    border-radius: $inner-radius;
    box-shadow: none;
    border-radius: 0;
  }
  .vc-chrome-active-color {
    border-radius: 50%;
    border: 1px solid rgba($white, 0.5);
  }
  .vc-hue,
  .vc-alpha,
  .vc-alpha-checkboard-wrap,
  .vc-alpha-gradient {
    border-radius: $normal-radius !important;
  }
  .vc-input__input {
    height: 24px;
    font-size: 12px;
    color: darken($color, 20%);
    background-color: $panel-dark;
    box-shadow: none;
    background: $panel-gradient;
    border-radius: $inner-radius;
  }
  .vc-chrome-fields .vc-input__label {
    color: darken($color, 20%);
  }
  .vc-chrome-toggle-icon path {
    fill: darken($color, 20%);
  }
  .vc-chrome-toggle-icon-highlight {
    background-color: transparent;
  }
  .vc-chrome-color-wrap {
    width: 45px;
  }
  .vc-hue-picker,
  .vc-alpha-picker {
    background-color: $tr;
    border: 2px solid $white;
    box-shadow: 0 0 1px 2px rgba($black, 0.1);
  }
}
.color-plus {
  background: $panel-dark;
  border-top: 1px solid $border;
  font-size: 12px;
  padding: 4px 0 8px;
}
.color-wrapper {
  display: flex;
  flex-wrap: wrap;
  padding: 0 12px 0;

  .color-var-item {
    display: flex;
    width: 100%;
    border-radius: $inner-radius;
    padding: 3px;
    cursor: pointer;
    user-select: none;
    color: darken($color, 18%);

    &:not(:last-child) {
      margin-bottom: 5px;
    }

    &:hover {
      color: $theme;
      background: rgba($theme, 8%);
    }

    .color-box {
      margin: 0 8px 0 0;
    }

    .color-var-name {
      font-size: 12px;
      letter-spacing: 0.3px;
    }
  }

  .color-box {
    width: 17px;
    height: 17px;
    margin: 0 4px 8px 4px;
    border-radius: $inner-radius;
    border: 1px solid rgba($white, 40%);
    cursor: pointer;
  }
}
</style>
