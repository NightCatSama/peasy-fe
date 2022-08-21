import type { ModuleConfigType } from '@/config'
import ColorItemVue from '@/components/configs/items/ColorItem.vue'
import InputItemVue from '@/components/configs/items/InputItem.vue'
import SliderItemVue from '@/components/configs/items/SliderItem.vue'
import ImageItemVue from '@/components/configs/items/ImageItem.vue'
import SwitchItemVue from '@/components/configs/items/SwitchItem.vue'
import TabsItemVue from '@/components/configs/items/TabsItem.vue'
import TipVue from '@/components/widgets/Tip.vue'

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
          suffix: ['px', 'rem', 'vw'],
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
          suffix: ['px', '%', 'rem', 'vw', 'auto', 'stretch'],
        }
      }
    default:
      return {
        component: null,
        props: {},
      }
  }
}
