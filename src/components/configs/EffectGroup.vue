<script setup lang="ts">
import Group from '../widgets/Group.vue'
import SliderItem from '@/components/configs/items/SliderItem.vue'
import SelectItem from '@/components/configs/items/SelectItem.vue'
import { PageNode } from '@/config'
import { getDefaultAnimationItem, getDefaultAnimationSettings, getDefaultEffectItem } from '@/utils/defaultConfig'
import PreviewItem from '@/components/configs/items/PreviewItem.vue'
import Icon from '../widgets/Icon.vue'
import Tip from '../widgets/Tip.vue'
import Btn from '../widgets/Btn.vue'
import { getEffectShowItemByGroup, IEffectShowItemMap } from '@/utils/effect'
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'
import CollapseItem from './items/CollapseItem.vue'

interface IEffectGroupProps {
  node: PageNode
  effect: IEffect
}
const { effect, node } = defineProps<IEffectGroupProps>()

const pageStore = usePageStore()
const { activeNodeGroups } = storeToRefs(pageStore)

let collapsedIndex = $ref(0)

const handleAddEffect = () => {
  effect.effectList.push(getDefaultEffectItem())
  collapsedIndex = effect.effectList.length - 1
}

/** 当前设置的组件类别下的，可设置动效 */
const effectMap: IEffectShowItemMap = $computed(() => {
  let map = {}
  ;(activeNodeGroups.value || [])
    .map(group => getEffectShowItemByGroup(group, node))
    .filter(Boolean)
    .forEach(obj => {
      map = { ...map, ...obj }
    })
  return map
})

/** 已经设置了的动效名称列表 */
const existEffectName = $computed(() => effect.effectList.map(item => item.name))

/** 过滤掉已存在的 */
const showEffectNameMap: { [name: string]: string } = $computed(() => Object.fromEntries(
  Object.entries(effectMap)
    .filter(([name]) => !existEffectName.includes(name))
    .map(
      ([name, obj]) => [name, obj.label]
    )
))

const handleNameChange = (val: string, item: IEffectItem) => {
  item.name = val
  handleSetStyle('hover', 'delete', item)
  handleSetStyle('active', 'delete', item)
}

const handleSetStyle = (
  styleType: 'hover' | 'active',
  operation: 'add' | 'delete',
  item: IEffectItem
) => {
  if (operation === 'add') {
    item.styles[styleType] = effectMap[item.name].defaultValue
  } else {
    delete item.styles[styleType]
  }
}

const actionMap: { name: keyof IEffectItem['styles'], label: string }[] = $computed(() => [{
  name: 'hover',
  label: 'Hover'
}, {
  name: 'active',
  label: 'Active'
}])

const timingFunction = {
  'ease': 'Ease',
  'ease-in': 'Ease In',
  'ease-out': 'Ease Out',
  'ease-in-out': 'Ease In Out',
  'linear': 'Linear'
}
</script>

<template>
  <Group
    title="Effect"
    class="effect-group"
    :can-advanced="false"
    :default-collapsed="true"
  >
    <div class="item">
      <Tip type="warning" message="只可在 Preview 模式下能预览动效效果" :block="true"></Tip>
    </div>

    <CollapseItem
      v-for="(item, index) in effect.effectList"
      class="animation-item"
      :key="index"
      :collapsed="index === collapsedIndex || !item.name"
      :name="item.name"
      :tag="index === collapsedIndex ? '' : Object.keys(item.styles).length ? Object.keys(item.styles) : 'Need Action'"
      :tag-type="Object.keys(item.styles).length ? 'theme' : 'red'"
      @delete="() => effect.effectList.splice(index, 1)"
      @collapse="() => collapsedIndex = collapsedIndex === index ? -1 : index"
    >
      <template #default>
        <SelectItem
          label="Property"
          :options="showEffectNameMap"
          :model-value="item.name"
          :disabled="Object.keys(showEffectNameMap).length === 0"
          @update:model-value="handleNameChange($event, item)"
        ></SelectItem>
        <template v-if="item.name">
          <SliderItem
            label="Duration"
            :min="0"
            :max="5"
            :interval="0.05"
            v-model="item.duration"
          ></SliderItem>
          <SelectItem
            label="Timing"
            :options="timingFunction"
            v-model="item.timingFunction"
          ></SelectItem>
          <hr class="divider" data-text="Action">
          <template
            v-for="obj in actionMap"
            :key="obj.name"
          >
            <component
              v-if="item.styles[obj.name] !== void 0"
              :label="obj.label"
              :is="effectMap[item.name].component"
              :model-value="item.styles[obj.name]"
              v-bind="effectMap[item.name].handler"
              @update:model-value="item.styles[obj.name] = $event"
            >
              <Icon
                :class="['delete-btn']"
                type="circle"
                name="line"
                :size="8"
                @click="handleSetStyle(obj.name, 'delete', item)"
              ></Icon>
            </component>
            <div v-else class="item" @click="handleSetStyle(obj.name, 'add', item)">
              <div class="label">{{ obj.label }}</div>
              <Icon class="add-btn" name="plus" :size="16" type="circle"></Icon>
            </div>
          </template>
        </template>
      </template>
    </CollapseItem>
    <div class="item" v-show="Object.keys(showEffectNameMap).length && existEffectName.every(Boolean)">
      <Btn type="text" :is-block="true" icon="plus" @click="handleAddEffect">Add Effect</Btn>
    </div>
  </Group>
</template>

<style lang="scss" scoped>
.effect-group {
}
</style>
