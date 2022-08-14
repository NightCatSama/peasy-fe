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
  <Group group-name="event" class="event-group" :default-collapsed="false" :can-advanced="true">
    <template #default="{ showAdvanced }">
      <SelectItem
        :label="$t('eventTriggerType')"
        :options="{ tap: $t('eventTap'), mousedown: $t('eventMouseDown'), touchstart: $t('eventTouchStart') }"
        v-model="event.type"
      ></SelectItem>
      <TabsItem :data="{ link: $t('link'), func: $t('function') }" v-model="event.action"></TabsItem>
      <template v-if="event.action === 'link'">
        <InputItem
          :label="$t('link')"
          type="textarea"
          :rows="2"
          :placeholder="$t('linkPlaceholder')"
          :model-value="event.link || ''"
          @update:model-value="(value: string) => event.link = value"
        ></InputItem>
      </template>
      <template v-if="event.action === 'func'">
        <InputItem
          :label="$t('function')"
          type="textarea"
          :placeholder="$t('functionPlaceholder')"
          :model-value="event.execFunction || ''"
          @update:model-value="(value: string) => event.execFunction = value"
        ></InputItem>
      </template>
      <template v-if="showAdvanced">
        <SwitchItem :label="$t('stopPropagation')" v-model="event.stopPropagation"></SwitchItem>
        <SwitchItem
          v-if="event.action === 'link'"
          :label="$t('openNewTab')"
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
