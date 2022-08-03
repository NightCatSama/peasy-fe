import {
  ComponentName,
  ComponentPropsGroup,
  DefaultColor,
  GroupType,
  isSomeBasicType,
  PageNode,
} from '@/config'
import { getFormPropsByType } from '@/constants/form'
import { useConfig } from './config'

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

export const getEffectMapByNode = (node: PageNode, isSelf?: boolean): IEffectShowItemMap | null => {
  const nodeGroups = ComponentPropsGroup[node.component as ComponentName]
  let map = {}
  ;(nodeGroups || [])
    .map((group) => getEffectShowItemByGroup(group, node))
    .filter(Boolean)
    .forEach((obj) => {
      map = { ...map, ...obj }
    })
  map = !isSelf
    ? {
        ...map,
        hide: allEffectMap['hide'],
      }
    : map
  return map
}

export const allEffectMap: IEffectShowItemMap = {
  color: {
    label: 'Font Color',
    ...getFormPropsByType('color'),
    defaultValue: DefaultColor,
  },
  fontSize: {
    label: 'Font Size',
    ...getFormPropsByType('fontSize'),
    defaultValue: '16px',
  },
  borderColor: {
    label: 'Border Color',
    ...getFormPropsByType('borderColor'),
    defaultValue: DefaultColor,
  },
  backgroundColor: {
    label: 'Background Color',
    ...getFormPropsByType('backgroundColor'),
    defaultValue: DefaultColor,
  },
  opacity: {
    label: 'Opacity',
    ...getFormPropsByType('opacity'),
    defaultValue: 1,
  },
  hide: {
    label: 'Hidden',
    ...getFormPropsByType('hide'),
    defaultValue: true,
  },
}

export const getEffectShowItemByGroup = (
  groupType: GroupType,
  node: PageNode
): IEffectShowItemMap | null => {
  const props = useConfig(node)
  switch (groupType) {
    case 'font':
      return {
        color: Object.assign(allEffectMap['color'], {
          defaultValue: (props.font as IFont)?.color ?? DefaultColor,
        }),
        fontSize: Object.assign(allEffectMap['fontSize'], {
          defaultValue: (props.font as IFont)?.fontSize ?? '18px',
        }),
      }
    case 'border': {
      const border = props.border as IBorder
      return {
        borderColor: Object.assign(allEffectMap['borderColor'], {
          defaultValue: Array.isArray(border?.borderColor)
            ? border?.borderColor[0]
            : border?.borderColor || DefaultColor,
        }),
      }
    }
    case 'background': {
      const background = props.background as IBackground
      return background?.backgroundType === 'color' || background?.backgroundType === 'none'
        ? {
            backgroundColor: Object.assign(allEffectMap['backgroundColor'], {
              defaultValue: background?.backgroundColor ?? DefaultColor,
            }),
          }
        : null
    }
    case 'container': {
      return {
        opacity: Object.assign(allEffectMap['opacity'], {
          defaultValue: (props.container as IContainer)?.opacity ?? 1,
        }),
      }
    }
    case 'basic': {
      if (isSomeBasicType('Icon', node.component, props.basic)) {
        const basic = props.basic as IIconBasicType
        return {
          fontSize: Object.assign(allEffectMap['fontSize'], {
            label: 'Icon Size',
            defaultValue: basic?.size ?? '18px',
          }),
          color: Object.assign(allEffectMap['color'], {
            label: 'Icon Color',
            defaultValue: basic?.color ?? DefaultColor,
          }),
        }
      }
      return null
    }
    default:
      return null
  }
}
