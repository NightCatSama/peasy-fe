import { ComponentName, ComponentPropsGroup, GroupType, isSomeBasicType, PageNode } from "@/config";
import { getFormPropsByType } from "@/constants/form";

export interface IEffectShowItem {
  label: string
  component: any
  props: any
  defaultValue: any
  setValue?: (value: any) => any
}

export type IEffectShowItemMap = {
  [name: string]: IEffectShowItem
}

export const getEffectMapByNode = (node: PageNode): IEffectShowItemMap | null => {
  const nodeGroups = ComponentPropsGroup[node.component as ComponentName]
  let map = {}
  ;(nodeGroups || [])
    .map(group => getEffectShowItemByGroup(group, node))
    .filter(Boolean)
    .forEach(obj => {
      map = { ...map, ...obj }
    })
  return map
}

export const getEffectShowItemByGroup = (groupType: GroupType, node: PageNode): IEffectShowItemMap | null => {
  switch (groupType) {
    case 'font':
      return {
        color: {
          label: 'Font Color',
          ...getFormPropsByType('color'),
          defaultValue: (node?.props?.font as IFont)?.color ?? '#000',
        },
        fontSize: {
          label: 'Font Size',
          ...getFormPropsByType('fontSize'),
          defaultValue: (node?.props?.font as IFont)?.fontSize ?? '18px',
        }
      }
    case 'border': {
      const border = node?.props?.border as IBorder
      return {
        borderColor: {
          label: 'Border Color',
          ...getFormPropsByType('borderColor'),
          defaultValue: Array.isArray(border?.borderColor) ? border?.borderColor[0] : (border?.borderColor || '#000'),
          setValue: (value: any) => [value, value, value, value]
        }
      }
    }
    case 'background': {
      const background = node?.props?.background as IBackground
      return background?.backgroundType === 'color' || background?.backgroundType === 'none' ? {
        backgroundColor: {
          label: 'Background Color',
          ...getFormPropsByType('backgroundColor'),
          defaultValue: background?.backgroundColor ?? '#000',
        }
      } : null
    }
    case 'container': {
      return {
        opacity: {
          label: 'Opacity',
          ...getFormPropsByType('opacity'),
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
            ...getFormPropsByType('fontSize'),
            defaultValue: basic?.size ?? '18px',
          },
          color: {
            label: 'Icon Color',
            ...getFormPropsByType('color'),
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