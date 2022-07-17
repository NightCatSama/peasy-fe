<script setup lang="ts">
import Group from '../widgets/Group.vue'
import InputItem from '@/components/configs/items/InputItem.vue'
import SelectItem from '@/components/configs/items/SelectItem.vue'
import ColorItem from './items/ColorItem.vue';

interface IFontGroupProps {
  node: CNode
  font: IFont
}
const { font, node } = defineProps<IFontGroupProps>()

const isSection = $computed(() => node.type === 'section')

const fontSetting: any = $computed(() => ({
  fontSize: {
    name: 'Font Size',
    type: 'number',
    value: font.fontSize,
    setValue: (val: string) => (font.fontSize = val),
    suffix: ['px', 'rem'],
  },
  lineHeight: {
    name: 'Line Height',
    type: 'number',
    value: font.lineHeight,
    setValue: (val: string) => (font.lineHeight = val),
    suffix: ['px', 'rem', 'x'],
  }
}))

const fontWeightMap: { [key in IFont['fontWeight']]: string } = {
  normal: 'Normal',
  500: '500',
  600: '600',
  bold: 'Bold',
  800: '800',
  900: '900',
}

const fontStyleMap: { [key in IFont['fontStyle']]: string } = {
  normal: 'Normal',
  italic: 'Italic',
}
</script>

<template>
  <Group title="Size" class="size-group" :can-advanced="true">
    <template #default="{ showAdvanced }">
      <InputItem
        :label="fontSetting.fontSize.name"
        :model-value="fontSetting.fontSize.value"
        :suffix="fontSetting.fontSize.suffix"
        :type="fontSetting.fontSize.type"
        @update:model-value="fontSetting.fontSize.setValue"
      />
      <ColorItem label="Color" v-model="font.color"></ColorItem>
      <InputItem
        v-if="showAdvanced"
        :label="fontSetting.lineHeight.name"
        :model-value="fontSetting.lineHeight.value"
        :suffix="fontSetting.lineHeight.suffix"
        :type="fontSetting.lineHeight.type"
        @update:model-value="fontSetting.lineHeight.setValue"
      />
      <SelectItem v-if="showAdvanced" label="Font Weight" v-model="font.fontWeight" :options="fontWeightMap"></SelectItem>
      <SelectItem v-if="showAdvanced" label="Font Style" v-model="font.fontStyle" :options="fontStyleMap"></SelectItem>
    </template>
  </Group>
</template>

<style lang="scss" scoped>
.size-group {
  .label {
    flex: 1;
    margin-right: 8px;
  }
}
</style>
