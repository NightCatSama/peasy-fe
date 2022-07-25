/** 组件对应支持的配置分组 */
export const ComponentPropsGroup = {
  Block: [
    'layout',
    'size',
    'spacing',
    'border',
    'background',
    'container',
    'position',
    'event',
    'animation',
  ] as const,
  Text: [
    'basic',
    'font',
    'spacing',
    'border',
    'background',
    'container',
    'position',
    'event',
  ] as const,
  Image: ['basic', 'size', 'spacing', 'border', 'container', 'position', 'event'] as const,
  Icon: ['basic', 'spacing', 'border', 'event'] as const,
} as const

/** 支持的配置分组名 */
export type GroupType =
  | 'basic'
  | 'size'
  | 'layout'
  | 'font'
  | 'spacing'
  | 'border'
  | 'background'
  | 'container'
  | 'position'
  | 'event'
  | 'animation'

/** 配置对应约束类型 */
export interface GroupPropType<T extends ComponentName = any> {
  basic: {
    Text: ITextBasicType
    Image: IImageBasicType
    Icon: IIconBasicType
    [key: string]: any
  }[T]
  size: ISize
  layout: ILayout
  font: IFont
  spacing: ISpacing
  border: IBorder
  background: IBackground
  container: IContainer
  position: IPosition
  event: IEvent
  animation: IAnimation
}

export type ComponentPropsGroupType = typeof ComponentPropsGroup
export type ComponentName = keyof ComponentPropsGroupType

/** 将配置分组名和约束类型相对应 */
export type PropsTypes<T extends ComponentName> = Pick<
  GroupPropType<T>,
  ComponentPropsGroupType[T][number]
>

/** 单个可配置的组件 */
export interface PageNode<T extends ComponentName = any> {
  /**
   * 组件类型
   * component: 最小粒度组件，无法添加 children
   * section: 块组件，可以添加 children
   * template: 模板组件
   */
  type: 'component' | 'section' | 'template'
  /** 组件名称 */
  name: string
  /** 组件名称 */
  component: T
  /** 参数 */
  props: PropsTypes<T>
  /** 包含的子组件 */
  children?: PageNode[]
  /** 组件封面图，在物料栏里展示 */
  cover?: string
}

/** 判断是否某个基础类型 */
export const isSomeBasicType = <T extends ComponentName, P extends GroupPropType<T>['basic']>(
  name: string,
  compare: T,
  basic: any
): basic is P => {
  return name === compare && !!basic
}

export const DefaultIconStyleLink =
  '//netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
