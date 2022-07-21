export const ComponentGroup = {
  Block: ['layout', 'size', 'spacing', 'border', 'container'] as const,
  Text: ['basic', 'font', 'spacing', 'border'] as const,
} as const

/** 支持的分组名 */
export type GroupType =
  | 'basic'
  | 'size'
  | 'layout'
  | 'font'
  | 'spacing'
  | 'border'
  | 'container'
  | 'position'
  | 'animation'

export interface ITextBasicType {
  text: string
}

export interface GroupPropType<T extends ComponentName = any> {
  basic: {
    Text: ITextBasicType
    [key: string]: any
  }[T]
  size: ISize
  layout: ILayout
  font: IFont
  spacing: ISpacing
  border: IBorder
  container: IContainer
  position: IPosition
  animation: IAnimation
}

export type ComponentGroupType = typeof ComponentGroup
export type ComponentName = keyof ComponentGroupType
export type PropsTypes<T extends ComponentName> = Pick<
  GroupPropType<T>,
  ComponentGroupType[T][number]
>

/** 单个可配置的组件 */
export interface PageNode<T extends ComponentName = any> {
  /**
   * 组件类型
   * component: 最小粒度组件，无法添加 children
   * section: 块组件，可以添加 children
   * template: 模板组件，可以添加 children
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

export const isTextBasicType = (node: PageNode, basic: any): basic is ITextBasicType => {
  return node.component === 'Text' && !!basic
}
