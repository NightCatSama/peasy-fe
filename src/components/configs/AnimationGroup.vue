<script setup lang="ts">
import Group from '../widgets/Group.vue'
import InputItem from '@/components/configs/items/InputItem.vue'
import SelectItem from '@/components/configs/items/SelectItem.vue'
import { PageNode } from '@/config'
import Icon from '../widgets/Icon.vue'

interface IAnimationGroupProps {
  node: PageNode
  animation: IAnimation
}
const { animation, node } = defineProps<IAnimationGroupProps>()

</script>

<template>
  <Group
    title="Animation"
    class="animation-group"
    :can-advanced="false"
    :default-collapsed="true"
  >
    <div class="item">
      <div class="full-btn">Add Animation</div>
    </div>
  </Group>
</template>

<style lang="scss" scoped>
.animation-group {
}
</style>
