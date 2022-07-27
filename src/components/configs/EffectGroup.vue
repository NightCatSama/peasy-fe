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
import { getEffectMapByNode, getEffectShowItemByGroup, IEffectShowItemMap } from '@/utils/effect'
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'
import CollapseItem from './items/CollapseItem.vue'

interface IEffectGroupProps {
  node: PageNode
  effect: IEffect
}
const { effect, node } = defineProps<IEffectGroupProps>()

const pageStore = usePageStore()
const { getAllChildNode, nameMap } = pageStore
const { activeNodeGroups } = storeToRefs(pageStore)

let collapsedIndex = $ref(0)

const handleAddEffect = () => {
  effect.effectList.push(getDefaultEffectItem(node.name))
  collapsedIndex = effect.effectList.length - 1
}

/** 得到当前目标下可用的动画属性 */
const getEffectMap: (target: string) => IEffectShowItemMap =
  $computed(() => (target: string) => {
    const node = nameMap[target]
    return getEffectMapByNode(node) || {}
  })

const getEffectLabel = (target: string) => Object.fromEntries(
  Object.entries(getEffectMap(target)).map(([key, item]) => [key, item.label])
)

const handleNameChange = (val: string, item: IEffectItem) => {
  item.name = val
  handleSetStyle('hover', 'delete', item)
  handleSetStyle('active', 'delete', item)
}

const handleTargetChange = (target: string, item: IEffectItem) => {
  item.target = target
  item.name = ''
  handleSetStyle('hover', 'delete', item)
  handleSetStyle('active', 'delete', item)
}

const handleSetStyle = (
  styleType: 'hover' | 'active',
  operation: 'add' | 'delete',
  item: IEffectItem
) => {
  if (operation === 'add') {
    item.styles[styleType] = getEffectMap(item.target)[item.name].defaultValue
  } else {
    delete item.styles[styleType]
  }
}

const childrenNodeList = $computed(() => [node].concat(getAllChildNode(node)))

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
    :default-collapsed="false"
  >
    <CollapseItem
      v-for="(item, index) in effect.effectList"
      class="animation-item"
      :key="index"
      :collapsed="index === collapsedIndex || !item.name"
      :name="item.name || 'Choose a style'"
      :tag="index === collapsedIndex ? '' : Object.keys(item.styles).length ? Object.keys(item.styles) : ''"
      :tag-type="Object.keys(item.styles).length ? 'theme' : 'red'"
      @delete="() => effect.effectList.splice(index, 1)"
      @collapse="() => collapsedIndex = collapsedIndex === index ? -1 : index"
    >
      <template #default>
        <SelectItem
          v-if="childrenNodeList.length > 1"
          label="Target"
          :options="Object.fromEntries(childrenNodeList.map(item => [item.name, item.name]))"
          :model-value="item.target"
          @update:model-value="handleTargetChange($event, item)"
        ></SelectItem>
        <SelectItem
          label="Style"
          :options="getEffectLabel(item.target)"
          :model-value="item.name"
          @update:model-value="handleNameChange($event, item)"
        ></SelectItem>
        <template v-if="item.name">
          <SliderItem
            v-if="item.target == node.name"
            label="Duration"
            :min="0"
            :max="5"
            :interval="0.05"
            v-model="item.duration"
          ></SliderItem>
          <SelectItem
            v-if="item.target == node.name"
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
              :is="getEffectMap(item.target)[item.name].component"
              :model-value="item.styles[obj.name]"
              v-bind="getEffectMap(item.target)[item.name].handler"
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
    <div class="item">
      <Btn type="text" :is-block="true" icon="plus" @click="handleAddEffect">Add Effect</Btn>
    </div>
  </Group>
</template>

<style lang="scss" scoped>
.effect-group {
}
</style>
