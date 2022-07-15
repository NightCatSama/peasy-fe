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

/** 当前配置中的组件 */
interface ConfigData {
  /** 组件名称 */
  name: string
  /** 组件描述 */
  desc?: string
  /** 组件配置数据 */
  node: CNode
  groups: ConfigGroup[]
}

/** 组件 - 组配置参数 */
interface ConfigGroup {
  /** 配置组标题 */
  title: string
  /** 配置组描述 */
  desc?: string
  /** 配置参数 */
  params: ConfigNode[]
}

/** 组件 - 单项配置参数 */
interface ConfigNode {
  /** 参数名称 */
  label: string
  /** 参数描述 */
  desc?: string
  /** 参数类型 */
  type: 'string' | 'textarea' | 'number' | 'color' | 'length' | 'position' | 'select'
  /** select 类型时的可选值 */
  options?: {
    [key: string]: label
  }
  /** 数值限制 */
  min?: number
  max?: number
  /** 验证 */
  validator?: (value: string) => boolean
  get: () => any
  set: (val: any) => any
}

/** 尺寸信息 */
interface IBox {
  width?: string | 'auto'
  height?: string | 'auto'
  minWidth?: string
  minHeight?: string
  stretch?: boolean
  isSection?: boolean
}

/** 容器的布局信息 */
interface ILayout {
  direction: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  justify: 'start' | 'end' | 'center' | 'space-between' | 'space-around'
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
