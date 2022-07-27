import ColorItemVue from "@/components/configs/items/ColorItem.vue";
import InputItemVue from "@/components/configs/items/InputItem.vue";
import SliderItemVue from "@/components/configs/items/SliderItem.vue";
import { GroupType, isSomeBasicType, PageNode } from "@/config";

export interface IEffectShowItem {
  label: string
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
          component: ColorItemVue,
          handler: {
          },
          defaultValue: (node?.props?.font as IFont)?.color ?? '#000',
        },
        fontSize: {
          label: 'Font Size',
          component: InputItemVue,
          handler: {
            name: 'Font Size',
            type: 'number',
            suffix: ['px', 'rem', 'vw'],
          },
          defaultValue: (node?.props?.font as IFont)?.fontSize ?? '18px',
        }
      }
    case 'border': {
      return {
        borderColor: {
          label: 'Border Color',
          component: ColorItemVue,
          handler: {
          },
          defaultValue: (node?.props?.border as IBorder)?.borderColor ?? '#000',
        }
      }
    }
    case 'background': {
      const background = node?.props?.background as IBackground
      return background?.backgroundType === 'color' || background?.backgroundType === 'none' ? {
        backgroundColor: {
          label: 'Background Color',
          component: ColorItemVue,
          handler: {
          },
          defaultValue: background?.backgroundColor ?? '#000',
        }
      } : null
    }
    case 'container': {
      return {
        opacity: {
          label: 'Opacity',
          component: SliderItemVue,
          handler: {
            min: 0,
            max: 1,
            interval: 0.01
          },
          defaultValue: (node?.props?.container as IContainer)?.opacity ?? 1,
        }
      }
    }
    case 'basic': {
      if (isSomeBasicType('Icon', node.component, node?.props?.basic)) {
        const basic = node?.props?.basic as IIconBasicType
        return {
          fontSize: {
            label: 'Icon Size',
            component: InputItemVue,
            handler: {
              name: 'Font Size',
              type: 'number',
              suffix: ['px', 'rem', 'vw'],
            },
            defaultValue: basic?.size ?? '18px',
          },
          color: {
            label: 'Icon Color',
            component: ColorItemVue,
            handler: {
            },
            defaultValue: basic?.color ?? '#000',
          }
        }
      }
      return null
    }
    default:
      return null
  }
}