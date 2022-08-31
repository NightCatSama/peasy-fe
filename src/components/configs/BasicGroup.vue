<script setup lang="ts">
import Group from '../widgets/Group.vue'
import InputItem from '@/components/configs/items/InputItem.vue'
import { PageNode, isSomeBasicType, DefaultIconStyleLink } from '@/config'
import ImageItem from './items/ImageItem.vue'
import SelectItem from './items/SelectItem.vue'
import SwitchItem from './items/SwitchItem.vue'
import { usePageStore } from '@/stores/page'
import BtnItem from './items/BtnItem.vue'
import ColorItem from './items/ColorItem.vue'
import Tip from '../widgets/Tip.vue'
import { $t } from '@/constants/i18n'
import Btn from '../widgets/Btn.vue'
import { getDefaultBackground, getDefaultBasic, getDefaultBorder, getDefaultSpacing } from '@/utils/defaultConfig'
import { emitter } from '@/utils/event'

interface IBasicGroupProps {
  node: PageNode
  basic: any
}
const { node, basic } = defineProps<IBasicGroupProps>()
const pageStore = usePageStore()
const { deleteActiveNode, insertNode, setActiveNode } = pageStore

interface ShowItem {
  isAdvanced?: boolean
  component: any
  props: any
  setValue?: (val: any) => void
  hide?: boolean
  labelSuffix?: string
  labelSuffixClick?: () => void
}

const configs: ShowItem[] = $computed(() => {
  /** Text 组件 */
  if (isSomeBasicType(node.component, 'Text', basic)) {
    return [
      {
        component: InputItem,
        props: {
          label: $t('text'),
          type: 'textarea',
          modelValue: basic.text,
          placeholder: $t('textEmptyTip'),
          realTime: true,
          onBlur: () => {
            if (!basic.text) {
              deleteActiveNode()
            }
          },
          tip: !basic.isSonText ? $t('subTextTip') : ''
        },
        setValue: (val: string) => {
          basic.text = val
          setTimeout(() => emitter.emit('updateMoveable'))
        },
        labelSuffix: !basic.isSonText ? $t('addSubText') : '',
        labelSuffixClick: () => {
          if (basic.isSonText) return
          if (!node.children) node.children = []
          const newSonNode = insertNode(
            node,
            node,
            node.children.length || 0,
            true,
            true,
          )
          newSonNode.config.props.basic = getDefaultBasic('Text', { isSonText: true })
          emitter.emit('saveHistory')
        },
      },
      ...(node.children || []).map((n, i) => ({
        component: BtnItem,
        props: {
          label: `{{${i + 1}}}`,
          modelValue: $t('edit'),
          canDelete: true,
          onClick: () => {
            setActiveNode(n)
          },
          onDelete: () => {
            node.children?.splice(i, 1)
            emitter.emit('saveHistory')
          }
        },
      })),
      {
        component: SelectItem,
        props: {
          label: $t('whiteSpace'),
          modelValue: basic.whiteSpace || '',
          options: {
            normal: $t('whiteSpaceNormal'),
            nowrap: $t('whiteSpaceNowrap'),
            pre: $t('whiteSpacePre'),
            'pre-wrap': $t('whiteSpacePreWrap'),
            'pre-line': $t('whiteSpacePreLine'),
          },
        },
        setValue: (val: ITextBasicType['whiteSpace']) => {
          basic.whiteSpace = val
        },
      },
      {
        component: SelectItem,
        props: {
          label: $t('wordBreak'),
          modelValue: basic.wordBreak || '',
          options: {
            normal: $t('wordBreakNormal'),
            'break-word': $t('wordBreakBreakWord'),
            'break-all': $t('wordBreakBreakAll'),
            'keep-all': $t('wordBreakKeepAll'),
          },
        },
        setValue: (val: ITextBasicType['wordBreak']) => {
          basic.wordBreak = val
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
          label: $t('imgSrc'),
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
          label: $t('objectFit'),
          modelValue: basic.objectFit,
          options: {
            contain: $t('objectFitContain'),
            cover: $t('objectFitCover'),
            fill: $t('objectFitFill'),
            none: $t('objectFitNone'),
            scaleDown: $t('objectFitScaleDown'),
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
          message: $t('iconTip'),
          style: { marginBottom: '12px' },
        },
      },
      {
        component: InputItem,
        props: {
          label: $t('iconName'),
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
          label: $t('iconSize'),
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
          label: $t('iconColor'),
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
          label: $t('prefixClass'),
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
          label: $t('extraClass'),
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
          label: $t('cssLink'),
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
  /** Media 组件 */
  if (isSomeBasicType(node.component, 'Media', basic)) {
    return [
      {
        component: SelectItem,
        props: {
          label: $t('mediaType'),
          modelValue: basic.type,
          options: {
            source: $t('source'),
            youtube: $t('youtube'),
            iframe: $t('iframe'),
          },
        },
        setValue: (val: IMediaBasicType['type']) => {
          basic.type = val
        },
      },
      {
        hide: basic.type !== 'source',
        component: InputItem,
        props: {
          label: $t('source'),
          type: 'textarea',
          modelValue: basic.src,
          placeholder: $t('sourcePlaceholder'),
          realTime: true,
          onBlur: () => {
            if (!basic.src) {
              deleteActiveNode()
            }
          },
        },
        setValue: (val: string) => {
          basic.src = val
        },
      },
      {
        hide: basic.type !== 'youtube',
        component: InputItem,
        props: {
          label: $t('youtube'),
          modelValue: basic.youtubeId,
          placeholder: $t('youtubePlaceholder'),
          tip: $t('youtubeTip'),
        },
        setValue: (val: string) => {
          basic.youtubeId = val
        },
      },
      {
        hide: basic.type !== 'iframe',
        component: InputItem,
        props: {
          label: $t('iframe'),
          type: 'textarea',
          modelValue: basic.src,
          placeholder: $t('iframePlaceholder'),
        },
        setValue: (val: string) => {
          basic.src = val
        },
      },
      {
        hide: basic.type !== 'source',
        component: SwitchItem,
        props: {
          label: $t('autoplay'),
          modelValue: !!basic.autoplay,
        },
        setValue: (val: IMediaBasicType['autoplay']) => {
          basic.autoplay = val
        },
      },
    ]
  }
  return []
})
</script>

<template>
  <Group
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
        >
          <template v-if="item.labelSuffix && item.labelSuffixClick" #label-suffix>
            <Btn type="text" @click="() => item.labelSuffixClick?.()" size="sm">{{ item.labelSuffix }}</Btn>
          </template>
        </component>
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
