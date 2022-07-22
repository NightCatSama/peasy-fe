<script setup lang="ts">
import Group from '../widgets/Group.vue'
import InputItem from '@/components/configs/items/InputItem.vue'
import SelectItem from '@/components/configs/items/SelectItem.vue'
import ColorItem from './items/ColorItem.vue'
import { usePageStore } from '@/stores/page'
import { PageNode } from '@/config'
import TabsItem from './items/TabsItem.vue'

interface IFontGroupProps {
  node: PageNode
  font: IFont
}
const { font, node } = defineProps<IFontGroupProps>()
const { deleteActiveNode } = usePageStore()

const fontSetting: any = $computed(() => ({
  fontSize: {
    name: 'Font Size',
    type: 'number',
    value: font.fontSize,
    setValue: (val: string) => {
      if (val === '') {
        deleteActiveNode()
        return
      }
      font.fontSize = val
    },
    suffix: ['px', 'rem', 'vw'],
  },
  lineHeight: {
    name: 'Line Height',
    type: 'number',
    value: font.lineHeight,
    setValue: (val: string) => (font.lineHeight = val),
    suffix: ['px', 'rem', 'vw', '%'],
  },
}))

const fontWeightMap: { [key in IFont['fontWeight']]: string } = {
  normal: 'Normal',
  500: '500',
  600: '600',
  bold: 'Bold',
  800: '800',
  900: '900',
}

const fontTabs = $computed(() => [{
  key: 'bold',
  icon: 'bold',
  isActive: font.fontWeight === 'bold',
  setValue: (val: boolean) => font.fontWeight = val ? 'bold' : 'normal'
}, {
  key: 'italic',
  icon: 'italic',
  isActive: font.fontStyle === 'italic',
  setValue: (val: boolean) => font.fontStyle = val ? 'italic' : 'normal'
}, {
  key: 'underline',
  icon: 'underline',
  isActive: font.textDecoration === 'underline',
  setValue: (val: boolean) => font.textDecoration = val ? 'underline' : 'none'
}, {
  key: 'line-through',
  icon: 'line-through',
  isActive: font.textDecoration === 'line-through',
  setValue: (val: boolean) => font.textDecoration = val ? 'line-through' : 'none'
}])
</script>

<template>
  <Group title="Font" class="size-group" :can-advanced="true" :default-collapsed="false">
    <template #default="{ showAdvanced }">
      <InputItem
        :label="fontSetting.fontSize.name"
        :model-value="fontSetting.fontSize.value"
        :suffix="fontSetting.fontSize.suffix"
        :type="fontSetting.fontSize.type"
        @update:model-value="fontSetting.fontSize.setValue"
      />
      <ColorItem label="Color" v-model="font.color"></ColorItem>
      <template v-if="showAdvanced">
        <TabsItem
          :data="['left', 'center', 'right', 'justify']"
          v-model="font.textAlign"
          :icon-map="{ left: 'align-left', center: 'align-center', right: 'align-right', justify: 'align-justify' }"
        ></TabsItem>
        <TabsItem
          :data="fontTabs.map(item => ({
            key: item.icon,
            value: item.icon,
            active: item.isActive,
            onClick: item.setValue
          }))"
          :icon-map="Object.fromEntries(fontTabs.map(item => [item.key, item.icon]))"
        ></TabsItem>
        <InputItem
          :label="fontSetting.lineHeight.name"
          :model-value="fontSetting.lineHeight.value"
          :suffix="fontSetting.lineHeight.suffix"
          :type="fontSetting.lineHeight.type"
          @update:model-value="fontSetting.lineHeight.setValue"
        />
        <SelectItem
          label="Font Weight"
          v-model="font.fontWeight"
          :options="fontWeightMap"
        ></SelectItem>
       </template>
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
