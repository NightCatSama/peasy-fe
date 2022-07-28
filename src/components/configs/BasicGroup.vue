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

interface IBasicGroupProps {
  node: PageNode
  basic: any
}
const { node, basic } = defineProps<IBasicGroupProps>()
const pageStore = usePageStore()
const { deleteActiveNode } = pageStore

const isSection = $computed(() => node.type === 'section')

interface ShowItem {
  isAdvanced?: boolean
  component: any
  props: any
  setValue?: (val: any) => void
  hide?: boolean
}

const configs: ShowItem[] = $computed(() => {
  /** Text 组件 */
  if (isSomeBasicType(node.component, 'Text', basic)) {
    return [
      {
        component: InputItem,
        props: {
          label: 'Text',
          type: 'textarea',
          modelValue: basic.text,
          placeholder: 'Text nodes will be automatically removed when empty.',
          realTime: true,
          onBlur: () => {
            if (!basic.text) {
              deleteActiveNode()
            }
          },
        },
        setValue: (val: string) => {
          basic.text = val
        },
      },
    ]
  }
  /** Image 组件 */
  if (isSomeBasicType(node.component, 'Image', basic)) {
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
      },
    ]
  }
  /** Icon 组件 */
  if (isSomeBasicType(node.component, 'Icon', basic)) {
    const fontAwesomeItems: ShowItem[] = [
      {
        hide: basic.styleLink !== DefaultIconStyleLink,
        component: Tip,
        props: {
          type: 'warning',
          message:
            '默认使用第三方 CDN 加载图标，不保证稳定性。图标使用的是 FontAwesome，更多图标查阅：<a href="https://fontawesome.com/v4/icons/" target="_blank">https://fontawesome.com/v4/icons/</a>',
          style: { marginBottom: '12px' },
        },
      },
      {
        component: InputItem,
        props: {
          label: 'Name',
          type: 'text',
          modelValue: basic.name,
          placeholder: 'Font Awesome name',
        },
        setValue: (val: string) => {
          basic.name = val
        },
      },
      {
        component: InputItem,
        props: {
          label: 'Size',
          type: 'number',
          modelValue: basic.size,
          suffix: ['px', 'rem', 'vw'],
        },
        setValue: (val: string) => {
          basic.size = val
        },
      },
      {
        component: ColorItem,
        props: {
          label: 'Color',
          modelValue: basic.color,
        },
        setValue: (val: string) => {
          basic.color = val
        },
      },
      {
        isAdvanced: true,
        component: InputItem,
        props: {
          label: 'Prefix Class',
          type: 'text',
          modelValue: basic.prefixClass,
        },
        setValue: (val: string) => {
          basic.prefixClass = val
        },
      },
      {
        isAdvanced: true,
        component: InputItem,
        props: {
          label: 'Extra Class',
          type: 'text',
          modelValue: basic.extraClass,
          placeholder: "like 'fa-spin'",
        },
        setValue: (val: string) => {
          basic.extraClass = val
        },
      },
      {
        isAdvanced: true,
        component: InputItem,
        props: {
          label: 'CSS Link',
          type: 'text',
          modelValue: basic.styleLink,
        },
        setValue: (val: string) => {
          basic.styleLink = val
        },
      },
    ]
    return fontAwesomeItems
  }
  return []
})
</script>

<template>
  <Group
    title="Basic"
    group-name="basic"
    class="basic-group"
    :default-collapsed="true"
    :can-advanced="configs.some((item) => item.isAdvanced)"
  >
    <template #default="{ showAdvanced }">
      <template v-for="item in configs">
        <component
          v-if="!item.hide && (!item.isAdvanced || showAdvanced)"
          :is="item.component"
          v-bind="item.props"
          @update:model-value="item?.setValue"
        ></component>
      </template>
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
