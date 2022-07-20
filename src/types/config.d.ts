/** 单位 */
type UnitType = '%' | 'px' | 'rem' | 'x'
/** 支持的全部选项 */
type SuffixType = UnitType | 'auto' | 'none' | 'stretch' | 'circle' | 'refined'

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

/** 字体样式 */
interface IFont {
  fontSize: string
  lineHeight: string
  color: string
  fontWeight: 'normal' | 'bold' | '500' | '600' | '800' | '900'
  fontStyle: 'normal' | 'italic'
}

/** 间距信息，上右下左 */
interface ISpacing {
  margin: [number, number, number, number]
  padding: [number, number, number, number]
}

/** TODO: 位置信息 */
interface IPosition {
  type: 'absolute' | 'relative' | 'fixed'
  left?: number
  top?: number
  right?: number
  bottom?: number
}

/** 容器信息 */
type BorderStyle = 'none' | 'solid' | 'dashed' | 'dotted' | 'double'
interface IBorder {
  borderWidth: [string, string, string, string]
  borderStyle: [BorderStyle, BorderStyle, BorderStyle, BorderStyle]
  borderColor: [string, string, string, string]
  borderRadius: string | 'circle' | [string, string, string, string]
}

interface IContainer {}

/** TODO: 动效 */
interface IAnimation {}