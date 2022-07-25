<script setup lang="ts">
import Group from '../widgets/Group.vue'
import InputItem from '@/components/configs/items/InputItem.vue'
import SelectItem from '@/components/configs/items/SelectItem.vue'
import ColorItem from './items/ColorItem.vue'
import { usePageStore } from '@/stores/page'
import { PageNode } from '@/config'
import TabsItem from './items/TabsItem.vue'
import PreviewItem from './items/PreviewItem.vue'

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

const fontTabs = $computed(() => [
  {
    key: 'bold',
    icon: 'bold',
    isActive: font.fontWeight === 'bold',
    setValue: (val: boolean) => (font.fontWeight = val ? 'bold' : 'normal'),
  },
  {
    key: 'italic',
    icon: 'italic',
    isActive: font.fontStyle === 'italic',
    setValue: (val: boolean) => (font.fontStyle = val ? 'italic' : 'normal'),
  },
  {
    key: 'underline',
    icon: 'underline',
    isActive: font.textDecoration === 'underline',
    setValue: (val: boolean) => (font.textDecoration = val ? 'underline' : 'none'),
  },
  {
    key: 'line-through',
    icon: 'line-through',
    isActive: font.textDecoration === 'line-through',
    setValue: (val: boolean) => (font.textDecoration = val ? 'line-through' : 'none'),
  },
])

const textShadowPreset = [
  '2px 4px 3px rgba(0,0,0,0.3)',
  '6px 6px 0px rgba(0,0,0,0.2)',
  '0px 4px 3px rgba(0,0,0,0.4), 0px 8px 13px rgba(0,0,0,0.1), 0px 18px 23px rgba(0,0,0,0.1)',
  '0 13.36px 8.896px #c4b59d, 0 -2px 1px #fff',
  '0px 10px 5px rgba(0,0,0,0.1), 10px 15px 5px rgba(0,0,0,0.05), -10px 15px 5px rgba(0,0,0,0.05)',
  '2px 8px 6px rgba(0,0,0,0.2), 0px -5px 35px rgba(255,255,255,0.3)',
]
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
      <TabsItem
        :data="['left', 'center', 'right', 'justify']"
        v-model="font.textAlign"
        :icon-map="{
          left: 'align-left',
          center: 'align-center',
          right: 'align-right',
          justify: 'align-justify',
        }"
      ></TabsItem>
      <template v-if="showAdvanced">
        <InputItem
          :label="fontSetting.lineHeight.name"
          :model-value="fontSetting.lineHeight.value"
          :suffix="fontSetting.lineHeight.suffix"
          :type="fontSetting.lineHeight.type"
          @update:model-value="fontSetting.lineHeight.setValue"
        />
        <TabsItem
          :data="
            fontTabs.map((item) => ({
              key: item.icon,
              value: item.icon,
              active: item.isActive,
              onClick: item.setValue,
            }))
          "
          :icon-map="Object.fromEntries(fontTabs.map((item) => [item.key, item.icon]))"
        ></TabsItem>
        <SelectItem
          label="Font Weight"
          v-model="font.fontWeight"
          :options="fontWeightMap"
        ></SelectItem>
        <PreviewItem
          label="Text Shadow"
          :options="textShadowPreset"
          v-model="font.textShadow"
        >
          <template #default="{ item: shadow, active }">
            <div :class="['inner', { active }]" :style="{ textShadow: shadow }">T</div>
          </template>
        </PreviewItem>
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

  .inner {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    font-size: 40px;
    font-weight: bold;
    color: $panel;
  }
}
</style>
