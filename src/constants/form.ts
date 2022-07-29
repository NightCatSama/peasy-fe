import type { ModuleConfigType } from "@/config"
import ColorItemVue from "@/components/configs/items/ColorItem.vue";
import InputItemVue from "@/components/configs/items/InputItem.vue";
import SliderItemVue from "@/components/configs/items/SliderItem.vue";

export const getFormPropsByType = (type: ModuleConfigType | string) => {
  switch (type) {
    case 'text':
      return {
        component: InputItemVue,
        props: {
          type: 'textarea',
          realTime: true
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
          interval: 0.01
        }
      }
    default:
      return {
        component: null,
        props: {}
      }
  }
}