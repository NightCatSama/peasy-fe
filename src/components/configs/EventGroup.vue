<script setup lang="ts">
import Group from '../widgets/Group.vue'
import InputItem from '@/components/configs/items/InputItem.vue'
import { PageNode, isSomeBasicType, DefaultIconStyleLink } from '@/config'
import SelectItem from './items/SelectItem.vue'
import Icon from '../widgets/Icon.vue'
import TabsItem from './items/TabsItem.vue'
import SwitchItem from './items/SwitchItem.vue'
import { useDisplayStore } from '@/stores/display'
import { storeToRefs } from 'pinia'
import { useDisplayStoreHelper } from '@/hooks/store'

interface IEventGroupProps {
  node: PageNode
  event: IEvent
}
const { node, event } = defineProps<IEventGroupProps>()
const { lockScriptTrigger, setLockScriptTrigger } = useDisplayStoreHelper()
</script>

<template>
  <Group group-name="event" class="event-group" :default-collapsed="false" :can-advanced="event.type !== 'none'">
    <template #default="{ showAdvanced }">
      <SelectItem
        :label="$t('eventTriggerType')"
        :options="{ none: $t('eventNone'), tap: $t('eventTap'), mousedown: $t('eventMouseDown'), touchstart: $t('eventTouchStart') }"
        v-model="event.type"
      ></SelectItem>
      <template v-if="event.type !== 'none'">
        <TabsItem :data="{ link: $t('link'), scrollTo: $t('scrollTo'), func: $t('function') }" v-model="event.action"></TabsItem>
        <template v-if="event.action === 'link'">
          <InputItem
            :label="$t('link')"
            type="textarea"
            :rows="2"
            :placeholder="$t('linkPlaceholder')"
            :model-value="event.link || ''"
            :tip="$t('eventLinkTip')"
            @update:model-value="(value: string) => event.link = value"
          ></InputItem>
        </template>
        <template v-if="event.action === 'scrollTo'">
          <InputItem
            :label="$t('scrollTo')"
            :placeholder="$t('scrollToPlaceholder')"
            type="textarea"
            :rows="2"
            :model-value="event.scrollTarget"
            @update:model-value="(value: string) => event.scrollTarget = value"
          ></InputItem>
        </template>
        <template v-if="event.action === 'func'">
          <InputItem
            :label="$t('function')"
            type="textarea"
            :tip="$t('functionTip')"
            :placeholder="$t('functionPlaceholder')"
            :model-value="event.execFunction || ''"
            @update:model-value="(value: string) => event.execFunction = value"
          >
            <template #label-suffix>
              <Icon
                :class="['lock-icon', { active: lockScriptTrigger }]"
                :name="lockScriptTrigger ? 'lock' : 'unlock'"
                :size="14"
                type="btn"
                :active="lockScriptTrigger"
                @click="setLockScriptTrigger(!lockScriptTrigger)"
              ></Icon>
            </template>
          </InputItem>
        </template>
        <SwitchItem
          v-if="event.action === 'link'"
          :label="$t('openNewTab')"
          v-model="event.openNewTab"
        ></SwitchItem>
        <template v-if="showAdvanced">
          <SwitchItem :label="$t('stopPropagation')" v-model="event.stopPropagation"></SwitchItem>
        </template>
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
