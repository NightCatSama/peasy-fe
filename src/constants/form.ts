import ColorItemVue from '@/components/configs/items/ColorItem.vue'
import ImageItemVue from '@/components/configs/items/ImageItem.vue'
import InputItemVue from '@/components/configs/items/InputItem.vue'
import SelectItemVue from '@/components/configs/items/SelectItem.vue'
import SliderItemVue from '@/components/configs/items/SliderItem.vue'
import SwitchItemVue from '@/components/configs/items/SwitchItem.vue'
import TabsItemVue from '@/components/configs/items/TabsItem.vue'
import TipVue from '@/components/widgets/Tip.vue'
import type { ModuleConfigType } from '@/config'
import { $t } from './i18n'

export const getFormPropsByType = (type: ModuleConfigType | string) => {
  switch (type) {
    case 'text':
      return {
        component: InputItemVue,
        props: {
          type: 'textarea',
          realTime: true,
        },
      }
    case 'color':
    case 'borderColor':
    case 'backgroundColor':
      return {
        component: ColorItemVue,
        props: {
          type: 'color',
        },
      }
    case 'fontSize':
      return {
        component: InputItemVue,
        props: {
          type: 'number',
          suffix: ['px', 'rem', 'vw', 'inherit'],
        },
      }
    case 'opacity':
      return {
        component: SliderItemVue,
        props: {
          min: 0,
          max: 1,
          interval: 0.01,
        },
      }
    case 'image':
      return {
        component: ImageItemVue,
        props: {},
      }
    case 'hide':
      return {
        component: SwitchItemVue,
        props: {},
      }
    case 'tip':
      return {
        component: TipVue,
        props: {},
      }
    case 'backgroundSize':
      return {
        component: TabsItemVue,
        props: {
          data: { cover: 'Cover', contain: 'Contain', auto: 'Auto' },
        },
      }
    case 'size':
      return {
        component: InputItemVue,
        props: {
          type: 'number',
          suffix: ['px', '%', 'rem', 'vw', 'auto', 'stretch'],
        },
      }
    case 'height':
      return {
        component: InputItemVue,
        props: {
          type: 'number',
          suffix: ['px', '%', 'rem', 'vh', 'vw', 'auto', 'stretch'],
        },
      }
    case 'duration':
    case 'delay':
      return {
        component: SliderItemVue,
        props: {
          min: 0,
          max: 5,
          interval: 0.05,
        },
      }
    case 'blur':
      return {
        component: SliderItemVue,
        props: {
          min: 0,
          max: 20,
          interval: 1,
        },
      }
    case 'transform':
      return {
        component: InputItemVue,
        props: {
          type: 'text',
          placeholder: 'scale(1.1)',
          tip: $t('transformTip'),
        },
      }
    case 'custom':
      return {
        component: InputItemVue,
        props: {
          type: 'text',
          placeholder: 'key: value',
        },
      }
    case 'select':
      return {
        component: SelectItemVue,
        props: {
        },
      }
    default:
      return {
        component: null,
        props: {},
      }
  }
}
