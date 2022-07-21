<script setup lang="ts">
import Group from '../widgets/Group.vue'
import InputItem from '@/components/configs/items/InputItem.vue'
import { PageNode, isTextBasicType } from '@/config'

interface IBasicGroupProps {
  node: PageNode
  basic: any
}
const { node, basic } = defineProps<IBasicGroupProps>()

const isSection = $computed(() => node.type === 'section')

const configs = $computed(() => {
  /** Text 组件 */
  if (isTextBasicType(node, basic)) {
    return [
      {
        component: InputItem,
        props: {
          label: 'Text',
          type: 'textarea',
          modelValue: basic.text,
          placeholder: 'Text nodes will be automatically removed when empty.',
          realTime: true,
        },
        setValue: (val: string) => {
          basic.text = val
        },
      },
    ]
  }
})
</script>

<template>
  <Group title="Basic" class="basic-group" :default-collapsed="true">
    <template v-for="item in configs">
      <component
        :is="item.component"
        v-bind="item.props"
        @update:model-value="item?.setValue"
      ></component>
    </template>
  </Group>
</template>

<style lang="scss" scoped>
.basic-group {
  .label {
    flex: 1;
    margin-right: 8px;
  }
}
</style>
