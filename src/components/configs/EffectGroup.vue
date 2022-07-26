<script setup lang="ts">
import Group from '../widgets/Group.vue'
import SliderItem from '@/components/configs/items/SliderItem.vue'
import SelectItem from '@/components/configs/items/SelectItem.vue'
import { PageNode } from '@/config'
import { getDefaultAnimationItem, getDefaultAnimationSettings } from '@/utils/defaultConfig'
import PreviewItem from '@/components/configs/items/PreviewItem.vue'
import Icon from '../widgets/Icon.vue'
import Tip from '../widgets/Tip.vue'

interface IEffectGroupProps {
  node: PageNode
  effect: IEffect
}
const { effect, node } = defineProps<IEffectGroupProps>()

const handleAddAnimation = () => {
  // effect.effectList.push(getDefaultAnimationItem('fade'))
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
    <div class="item">
      <div class="full-btn" @click="handleAddAnimation">Add Effect</div>
    </div>
  </Group>
</template>

<style lang="scss" scoped>
.effect-group {
}
</style>
