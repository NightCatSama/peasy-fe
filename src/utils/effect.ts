import ColorItemVue from "@/components/configs/items/ColorItem.vue";
import InputItemVue from "@/components/configs/items/InputItem.vue";
import { GroupType, PageNode } from "@/config";

export interface IEffectShowItem {
  label: string
  property: string
  component: any
  handler: any
  defaultValue: any
}

export type IEffectShowItemMap = {
  [name: string]: IEffectShowItem
}

export const getEffectShowItemByGroup = (groupType: GroupType, node: PageNode): IEffectShowItemMap | null => {
  switch (groupType) {
    case 'font':
      return {
        color: {
          label: 'Font Color',
          property: 'color',
          component: ColorItemVue,
          handler: {
          },
          defaultValue: node?.props?.font?.color ?? '#000',
        },
        fontSize: {
          label: 'Font Size',
          property: 'font-size',
          component: InputItemVue,
          handler: {
            name: 'Font Size',
            type: 'number',
            suffix: ['px', 'rem', 'vw'],
          },
          defaultValue: node?.props?.font?.fontSize ?? '18px',
        }
      }
    default:
      return null
    // case 'border':
    //   return {
    //     borderWidth: {
    //       property: 'border-width',
    //       handler: 'color',
    //       name: '字体颜色',
    //       defaultValue: '#000',
    //     },
    //     borderColor: {
    //       property: 'border-width',
    //       handler: 'color',
    //       name: '字体颜色',
    //       defaultValue: '#000',
    //     }
    //   }
  }
}