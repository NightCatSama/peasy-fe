/** 单个可配置的组件 */
interface CNode {
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
  component: string
  /** 参数 */
  props: any
  /** 包含的子组件 */
  children?: CNode[]
}

/** 支持的分组名 */
type GroupType = 'basic' | 'size' | 'layout' | 'font' | 'container' | 'position' | 'animation'

/** 尺寸信息 */
interface ISize {
  width?: string | 'auto' | 'stretch'
  height?: string | 'auto' | 'stretch'
  minWidth?: string | 'auto'
  minHeight?: string | 'auto'
  maxWidth?: string | 'none'
  maxHeight?: string | 'none'
}

/** 容器的布局信息 */
interface ILayout {
  direction: 'row' | 'column'
  justify: 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
  align: 'start' | 'end' | 'center' | 'stretch' | 'baseline'
}

/** 位置信息 */
interface IPosition {
  type: 'absolute' | 'relative' | 'fixed'
  left?: number
  top?: number
  right?: number
  bottom?: number
}

/** 容器信息 */
interface IContainer {
  type: 'color' | 'image'
  backgroundColor?: string
  backgroundImage?: string
  backgroundSize?: 'cover' | 'contain' | 'auto'
}

/** 单位 */
type UnitType = '%' | 'px' | 'rem'
/** 支持的全部选项 */
type SuffixType = UnitType | 'auto' | 'none' | 'stretch'
