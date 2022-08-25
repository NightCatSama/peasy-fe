/** 数据列表 */
export enum DataType {
  Page = 'page',
  Resume = 'resume',
}

/** 组件对应支持的配置分组 */
export const ComponentPropsGroup = {
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
  Icon: [
    'common',
    'basic',
    'spacing',
    'border',
    'background',
    'container',
    'position',
    'event',
    'effect',
    'animation',
  ] as const,
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
  common: ICommonType
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

type IsAny<T> = 0 extends 1 & T ? true : false

/** 将配置分组名和约束类型相对应 */
export type PropsTypes<T extends ComponentName = any> = IsAny<T> extends false
  ? Pick<GroupPropType<T>, ComponentPropsGroupType[T][number]>
  : Partial<{
      [key in GroupType]: GroupPropType[key]
    }> &
      Pick<GroupPropType<'Block'>, 'common' | 'effect' | 'event' | 'border' | 'spacing'>

export interface IPropConfig<T extends ComponentName = any> {
  /** 配置参数 */
  props: PropsTypes<T>
  /** 当客户端支持 Desktop & Mobile 时，可以单独配置 mobile 配置 */
  mobile?: Partial<PropsTypes<T>>
}

/** 一份页面的完整数据 */
export interface IPage {
  /** 页面数据 */
  pageData: PageNode[]
  /** 颜色变量 */
  colorVars: IColorVarItem[]
  /** 页面配置 */
  setting: IPageSetting
  /** 字体配置 */
  font: IFontSetting
}

export type PageNodeType = 'component' | 'section' | 'template'

/** 单个可配置的组件 */
export interface PageNode<T extends ComponentName = any> {
  /**
   * 组件类型
   * component: 最小粒度组件，无法添加 children
   * section: 块组件，可以添加 children
   * template: 模板组件
   */
  type: PageNodeType
  /** 组件名称 */
  name: string
  /** 标签 */
  tags: string[]
  /** 组件名称 */
  component: T
  /** 参数 */
  props?: PropsTypes<T>
  /** 组件配置 */
  config: IPropConfig<T>
  /** 配置参数链接到其他组件 */
  propLink?: string
  /** 包含的子组件 */
  children?: PageNode[]
  /** 组件封面图，在物料栏里展示 */
  cover?: string
  /** 是否已封装成模块 */
  isModule?: boolean
  /** 模块设置 */
  moduleConfig?: IModuleConfigGroup[]
  /** 模块依赖项 */
  moduleDependence?: {
    /** 字体依赖 */
    customFontFace?: IFontSetting['customFontFace'][0]
    /** 颜色变量依赖 */
    colorVars?: IColorVarItem[]
  }
  /** 物料来源 */
  materialId?: string
}

/** 模块配置支持类型 */
export enum ModuleConfigType {
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
  /** 背景图片尺寸 */
  BackgroundSize = 'backgroundSize',
  /** 提示 */
  Tip = 'tip',
  /** 尺寸 */
  Size = 'size',
  /** 一组数据 */
  // Group = 'group',
}
export interface IModuleConfigGroup {
  /** 配置名称 */
  title: string
  /** 配置名称（英文） */
  titleEn?: string
  /** 分组数据 */
  data: IModuleConfigItem[]
  /** 图标 */
  icon?: string
  /** 是否默认展开 */
  defaultCollapsed?: boolean
}
/** 模块单项配置 */
export interface IModuleConfigItem {
  /** 配置类型 */
  type: ModuleConfigType
  /** label */
  label?: string
  /** 配置名称（英文） */
  labelEn?: string
  /** 配置组件传参参数 */
  props?: any
  /** 获取值 */
  sourceValue?: string
  /** 设置值 */
  targetValue?: string | string[]
}

/** 数据状态 */
export enum DataStatus {
  /** 正常显示 */
  Normal = 1,
  /** 隐藏 */
  Hidden = 2,
}

/** 物料数据 */
export interface IMaterialItem {
  /** 物料名称 */
  name: string
  enName?: string
  /** 组件数据，type 为 component/section 时存在 */
  node?: PageNode
  /** 页面数据，type 为 template 时存在 */
  page?: IPage
  /** 数据类别，以使用场景区分 */
  dataType?: DataType
  /** 类型，有 component/section/template */
  type: PageNodeType
  /** 分组 */
  category?: string
  categoryEn?: string
  /** 缩略图 */
  cover?: string
  id?: string
  uid?: string
  /** 数据状态 */
  status?: DataStatus
  createDate?: Date
  updateDate?: Date
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
  'https://netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'

export const imgErrorFallback = 'data:image/png;base64,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'

export const DefaultColor = '#333333'

export const getUniqueName = (name: string) => `_name_${name}_`
export const getTagClassName = (tag: string) => `_tag_${tag}_`
