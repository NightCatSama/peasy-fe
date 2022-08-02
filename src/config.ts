/** 组件对应支持的配置分组 */
export const ComponentPropsGroup = {
  All: [
    'common',
    'basic',
    'size',
    'layout',
    'font',
    'spacing',
    'border',
    'background',
    'container',
    'position',
    'event',
    'effect',
    'animation',
    'custom',
  ],
  Block: [
    'common',
    'layout',
    'size',
    'spacing',
    'border',
    'background',
    'container',
    'position',
    'event',
    'effect',
    'animation',
  ] as const,
  Text: [
    'common',
    'basic',
    'font',
    'spacing',
    'border',
    'background',
    'container',
    'position',
    'event',
    'effect',
    'animation',
  ] as const,
  Image: [
    'common',
    'basic',
    'size',
    'spacing',
    'border',
    'container',
    'position',
    'event',
    'effect',
    'animation',
  ] as const,
  Icon: ['common', 'basic', 'spacing', 'border', 'event', 'effect'] as const,
} as const

/** 支持的配置分组名 */
export type GroupType =
  | 'common'
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
  | 'effect'
  | 'animation'
  | 'custom'

/** 配置对应约束类型 */
export interface GroupPropType<T extends ComponentName = any> {
  common: ICommonType,
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
  effect: IEffect
  animation: IAnimation
  custom: any
}

export type ComponentPropsGroupType = typeof ComponentPropsGroup
export type ComponentName = keyof ComponentPropsGroupType

/** 将配置分组名和约束类型相对应 */
export type PropsTypes<T extends ComponentName = 'All'> = Pick<
  GroupPropType<T>,
  ComponentPropsGroupType[T][number]
>

/** 单个可配置的组件 */
export interface PageNode<T extends ComponentName = 'All'> {
  /**
   * 组件类型
   * component: 最小粒度组件，无法添加 children
   * section: 块组件，可以添加 children
   * template: 模板组件
   */
  type: 'component' | 'section' | 'template'
  /** 组件名称 */
  name: string
  /** 标签 */
  tags: string[]
  /** 组件名称 */
  component: T
  /** 参数 */
  props: PropsTypes<T>
  /** 包含的子组件 */
  children?: PageNode[]
  /** 组件封面图，在物料栏里展示 */
  cover?: string
  /** 是否已封装成模块 */
  isModule?: boolean
  /** 模块设置 */
  moduleConfig?: IModuleConfigGroup[]
}

/** 组件配置 */
export interface INodePropMap<T extends ComponentName = 'All'> {
  /** 一个组件名对应一套配置 */
  [name: string]: PropsTypes<T>
}

/** 全部的组件 */
export interface IPageProp {
  desktop: INodePropMap
  mobile: INodePropMap
}

/** 模块配置支持类型 */
export const enum ModuleConfigType {
  /** 按钮 */
  // Btn = 'btn',
  /** 文本 */
  Text = 'text',
  /** 颜色 */
  Color = 'color',
  /** 字体大小 */
  FontSize = 'fontSize',
  /** 透明度 */
  Opacity = 'opacity',
  /** 图片 */
  Image = 'image',
  /** 提示 */
  Tip = 'tip',
  /** 一组数据 */
  // Group = 'group',
}
export interface IModuleConfigGroup {
  /** 配置名称 */
  title: string
  /** 分组数据 */
  data: IModuleConfigItem[]
  /** 图标 */
  icon?: string
  /** 是否默认展开 */
  defaultCollapsed?: boolean
}
/** 模块单项配置 */
export interface IModuleConfigItem {
  type: ModuleConfigType
  label?: string
  props?: any
  getValue?: (node: PageNode) => any
  setValue?: (value: any, node: PageNode) => void
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

export const DefaultColor = '#333'

export const getUniqueName = (name: string) => `_n_${name}_`
export const getTagClassName = (tag: string) => `_t_${tag}_`

export const variableColorSymbol = '$'
