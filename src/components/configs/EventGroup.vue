<script setup lang="ts">
import Group from '../widgets/Group.vue'
import InputItem from '@/components/configs/items/InputItem.vue'
import { PageNode, isSomeBasicType, DefaultIconStyleLink } from '@/config'
import ImageItem from './items/ImageItem.vue'
import SelectItem from './items/SelectItem.vue'
import { usePageStore } from '@/stores/page'
import SliderItem from './items/SliderItem.vue'
import ColorItem from './items/ColorItem.vue'
import Tip from '../widgets/Tip.vue'
import TabsItem from './items/TabsItem.vue'
import SwitchItem from './items/SwitchItem.vue'

interface IEventGroupProps {
  node: PageNode
  event: IEvent
}
const { node, event } = defineProps<IEventGroupProps>()
</script>

<template>
  <Group title="Event" group-name="event" class="event-group" :default-collapsed="false" :can-advanced="true">
    <template #default="{ showAdvanced }">
      <SelectItem
        label="Trigger Type"
        :options="{ tap: 'Tap', mousedown: 'Mouse Down', touchstart: 'Touch Start' }"
        v-model="event.type"
      ></SelectItem>
      <TabsItem :data="{ link: 'Link', func: 'Function' }" v-model="event.action"></TabsItem>
      <template v-if="event.action === 'link'">
        <InputItem
          label="Link"
          type="textarea"
          :rows="2"
          :placeholder="'Enter a link here'"
          :model-value="event.link || ''"
          @update:model-value="(value: string) => event.link = value"
        ></InputItem>
      </template>
      <template v-if="event.action === 'func'">
        <InputItem
          label="Function"
          type="textarea"
          placeholder="Can use `event` to get the event"
          :model-value="event.execFunction || ''"
          @update:model-value="(value: string) => event.execFunction = value"
        ></InputItem>
      </template>
      <template v-if="showAdvanced">
        <SwitchItem label="Stop Propagation" v-model="event.stopPropagation"></SwitchItem>
        <SwitchItem
          v-if="event.action === 'link'"
          label="Open New Tab"
          v-model="event.openNewTab"
        ></SwitchItem>
      </template>
    </template>
  </Group>
</template>

<style lang="scss" scoped>
.event-group {
  .label {
    flex: 1;
    margin-right: 8px;
  }
}
</style>
