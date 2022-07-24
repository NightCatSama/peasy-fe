<script setup lang="ts">
import Group from '../widgets/Group.vue'
import InputItem from '@/components/configs/items/InputItem.vue'
import { PageNode, isTextBasicType, isImageBasicType, IImageBasicType } from '@/config'
import ImageItem from './items/ImageItem.vue';
import SelectItem from './items/SelectItem.vue';

interface IBasicGroupProps {
  node: PageNode
  basic: any
}
const { node, basic } = defineProps<IBasicGroupProps>()

const isSection = $computed(() => node.type === 'section')

const configs: {
  component: any
  props: any
  setValue: (val: any) => void
  hide?: boolean
}[] = $computed(() => {
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
  if (isImageBasicType(node, basic)) {
    return [
      {
        component: ImageItem,
        props: {
          label: 'Image Src',
          modelValue: basic.src,
        },
        setValue: (val: string) => {
          basic.src = val
        },
      },
      {
        hide: !basic.src,
        component: SelectItem,
        props: {
          label: 'Object Fit',
          modelValue: basic.objectFit,
          options: {
            contain: 'Contain',
            cover: 'Cover',
            fill: 'Fill',
            none: 'None',
            scaleDown: 'Scale Down',
          },
        },
        setValue: (val: IImageBasicType['objectFit']) => {
          basic.objectFit = val
        },
      }
    ]
  }
  return []
})
</script>

<template>
  <Group title="Basic" class="basic-group" :default-collapsed="true">
    <template v-for="item in configs">
      <component
        v-if="!item.hide"
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
