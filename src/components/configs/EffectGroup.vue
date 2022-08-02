<script setup lang="ts">
import Group from '../widgets/Group.vue'
import SliderItem from '@/components/configs/items/SliderItem.vue'
import SelectItem from '@/components/configs/items/SelectItem.vue'
import { PageNode } from '@/config'
import { getDefaultEffectItem } from '@/utils/defaultConfig'
import Icon from '../widgets/Icon.vue'
import Tip from '../widgets/Tip.vue'
import Btn from '../widgets/Btn.vue'
import { getEffectMapByNode, IEffectShowItemMap, allEffectMap } from '@/utils/effect'
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'
import CollapseItem from './items/CollapseItem.vue'
import type { ISelectItem } from '../widgets/Select.vue'

interface IEffectGroupProps {
  node: PageNode
  effect: IEffect
}
const { effect, node } = defineProps<IEffectGroupProps>()

const pageStore = usePageStore()
const { getAllChildNode, getTagsByNode, nameMap } = pageStore
const { activeNodeGroups } = storeToRefs(pageStore)

let collapsedIndex = $ref(0)

const handleAddEffect = () => {
  effect.effectList.push(getDefaultEffectItem(node.name))
  collapsedIndex = effect.effectList.length - 1
}

/** 得到当前目标下可用的过渡属性 */
const getEffectMap = $computed(() => (target: string, targetType: string): IEffectShowItemMap => {
  const node = nameMap[target]
  return targetType === 'tag' ? allEffectMap : getEffectMapByNode(node, targetType === 'self') || {}
})

const getEffectLabel = (target: string, targetType: string) =>
  Object.fromEntries(
    Object.entries(getEffectMap(target, targetType)).map(([key, item]) => [key, item.label])
  )

const handleNameChange = (val: string, item: IEffectItem) => {
  item.name = val
  handleSetStyle('hover', 'delete', item)
  handleSetStyle('active', 'delete', item)
}

const handleTargetChange = (key: string, item: IEffectItem) => {
  const obj = effectTargetMap[key]
  item.target = obj.target
  item.targetType = obj.type
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
    item.styles[styleType] = getEffectMap(item.target, item.targetType)[item.name].defaultValue
  } else {
    delete item.styles[styleType]
  }
}

const effectTargetMap: { [key: string]: ISelectItem } = $computed(() => {
  let obj: { [key: string]: ISelectItem } = {
    // 加 % 避免和 tag 命名重复
    ['%' + node.name]: {
      target: node.name,
      title: node.name,
      type: 'self',
    },
  }
  getTagsByNode(node.children || []).forEach((tag) => {
    obj[tag] = {
      target: tag,
      title: tag,
      type: 'tag',
    }
  })
  getAllChildNode(node).forEach((child) => {
    obj['#' + child.name] = {
      target: child.name,
      title: child.name,
      type: 'name',
    }
  })
  return obj
})

const actionMap: { name: keyof IEffectItem['styles']; label: string }[] = $computed(() => [
  {
    name: 'hover',
    label: 'Hover',
  },
  {
    name: 'active',
    label: 'Active',
  },
])

const timingFunction = {
  ease: 'Ease',
  'ease-in': 'Ease In',
  'ease-out': 'Ease Out',
  'ease-in-out': 'Ease In Out',
  linear: 'Linear',
}
</script>

<template>
  <Group
    title="Effect"
    group-name="effect"
    class="effect-group"
    :can-advanced="false"
    :default-collapsed="false"
  >
    <CollapseItem
      v-for="(item, index) in effect.effectList"
      class="animation-item"
      :key="index"
      :collapsed="index === collapsedIndex || !item.name"
      :tag="
        index === collapsedIndex
          ? ''
          : Object.keys(item.styles).length
          ? Object.keys(item.styles)
          : ''
      "
      :tag-type="Object.keys(item.styles).length ? 'theme' : 'red'"
      @delete="() => effect.effectList.splice(index, 1)"
      @collapse="() => (collapsedIndex = collapsedIndex === index ? -1 : index)"
    >
      <template #name>
        <span v-if="!item.name">Choose a style</span>
        <span v-else-if="item.target && item.target !== node.name">
          <span class="highlight">{{ item.target }}<br /></span>
          <span>{{ item.name }}</span>
        </span>
        <span v-else>{{ item.name }}</span>
      </template>
      <template #default>
        <SelectItem
          v-if="Object.keys(effectTargetMap).length > 1"
          label="Target"
          :options="effectTargetMap"
          :model-value="item.target"
          @update:model-value="handleTargetChange($event, item)"
        >
          <template #item="data">
            <div :class="['select-target-item']">
              <div :class="['type-tag', (data.item as ISelectItem)?.type]">
                {{ (data.item as ISelectItem)?.type }}
              </div>
              {{ (data.item as ISelectItem).title }}
            </div>
          </template>
        </SelectItem>
        <SelectItem
          label="Style"
          :options="getEffectLabel(item.target, item.targetType)"
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
          <hr class="divider" data-text="Action" />
          <template v-for="obj in actionMap" :key="obj.name">
            <component
              v-if="item.styles[obj.name] !== void 0"
              :label="obj.label"
              :is="getEffectMap(item.target, item.targetType)[item.name].component"
              :model-value="item.styles[obj.name]"
              v-bind="getEffectMap(item.target, item.targetType)[item.name].props"
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
  .highlight {
    color: $orange;
    font-weight: bold;
    margin-bottom: 4px;
  }
}

.select-target-item {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;

  .type-tag {
    margin-left: -4px;
    padding: 2px 4px;
    min-width: 44px;
    text-align: center;
    font-size: 12px;
    color: $color;
    background: $theme;
    border-radius: $inner-radius;
    margin-right: 6px;
    transform-origin: left center;
    transform: scale(0.85);

    &.self {
      color: $panel-dark;
      background: $yellow-gradient;
    }

    &.group {
      background: $green-gradient;
    }

    &.tag {
      background: $purple-gradient;
    }
  }
}
</style>
