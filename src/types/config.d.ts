/** 单位 */
type UnitType = '%' | 'px' | 'rem' | 'vw' | 'vh'
/** 支持的全部选项 */
type SuffixType = UnitType | 'auto' | 'none' | 'stretch' | 'circle' | 'refined'

/** 组件公共配置 */
interface ICommonType {
  /** 是否隐藏 */
  hide: boolean
}

/** Block 组件基础配置 */
interface IBlockBasicType {
  /** 容器标签 */
  tag: string
  /** 自定义属性 */
  attrs: string
}

/** Text 组件基础配置 */
interface ITextBasicType {
  text: string
  whiteSpace: 'normal' | 'nowrap' | 'pre' | 'pre-line' | 'pre-wrap'
  wordBreak?: 'normal' | 'break-all' | 'break-word' | 'keep-all'
  /** 是否为子 Text 组件 */
  isSonText?: boolean
}

/** Image 组件基础配置 */
interface IImageBasicType {
  src: string
  objectFit: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
}

interface IMediaBasicType {
  type: 'source' | 'youtube' | 'iframe'
  src: string
  youtubeId: string
  autoplay: boolean
}

/** 输入组件基础配置 */
interface IInputFieldBasicType {
  /** 组件类别 */
  type: 'input' | 'number' | 'textarea'
  /** 占位文本 */
  placeholder: string
  /** 是否可编辑 */
  disabled: boolean
  /** 最大输入长度 */
  maxLength: string
}

/** Icon 组件基础配置 */
interface IIconBasicType {
  name: string // 图标名字
  size: string // 图标大小
  color: string // 图标颜色
  prefixClass: string // 图标前缀
  extraClass: string // 图标额外属性
  styleLink: string // 图标字体的 css 链接
}

/** 尺寸信息 */
interface ISize {
  width: string | 'auto' | 'stretch'
  height: string | 'auto' | 'stretch'
  minWidth: string | 'auto'
  minHeight: string | 'auto'
  maxWidth: string | 'none'
  maxHeight: string | 'none'
}

/** 容器的布局信息 */
interface ILayout {
  direction: 'row' | 'column'
  justify: 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
  align: 'start' | 'end' | 'center' | 'stretch' | 'baseline'
  wrap: 'nowrap' | 'wrap' | 'wrap-reverse'
  reverse?: boolean
}

/** 字体样式 */
interface IFont {
  fontSize: string
  lineHeight: string
  color: string
  fontWeight: 'normal' | 'bold' | '500' | '600' | '800' | '900'
  fontStyle: 'normal' | 'italic'
  textDecoration: 'none' | 'underline' | 'line-through'
  textAlign: 'left' | 'right' | 'center' | 'justify'
  textShadow: string
  fontFamily: string
}

/** 间距信息，上右下左 */
interface ISpacing {
  margin: [number, number, number, number]
  padding: [number, number, number, number]
}

/** 位置信息 */
interface IPosition {
  position: 'static' | 'absolute' | 'fixed'
  left: string | 'auto'
  top: string | 'auto'
  right: string | 'auto'
  bottom: string | 'auto'
  zIndex: number
  /** 距离容器顶部一定距离时展示，仅 fixed 有效 */
  showByOffset?: string
}

/** 边框信息 */
type BorderStyle = 'solid' | 'dashed' | 'dotted' | 'double'
interface IBorder {
  borderWidth: [string, string, string, string]
  borderStyle: [BorderStyle, BorderStyle, BorderStyle, BorderStyle]
  borderColor: string | [string, string, string, string]
  borderRadius: string | 'circle' | [string, string, string, string]
}

interface IBackground {
  backgroundType: 'none' | 'color' | 'image' | 'gradient'
  /** 背景色 */
  backgroundColor: string
  /** 背景图 */
  backgroundImage: string
  backgroundSize: 'cover' | 'contain' | 'auto'
  backgroundPosition:
    | 'left top'
    | 'top'
    | 'right top'
    | 'left'
    | 'center'
    | 'right'
    | 'left bottom'
    | 'bottom'
    | 'right bottom'
  backgroundRepeat: 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat'
  backgroundAttachment: 'scroll' | 'fixed'
  /** 背景过渡色 */
  backgroundGradientAngle: number
  backgroundGradient: { color: string; percentage: number }[]
  /** 背景裁切 */
  backgroundClip: 'border-box' | 'padding-box' | 'content-box' | 'text'
}

/** 背景信息 */
interface IContainer {
  overflow: 'visible' | 'hidden' | 'scroll' | 'auto'
  boxShadow: string
  opacity: number
  filter: string
  cursor:
    | 'inherit'
    | 'auto'
    | 'default'
    | 'pointer'
    | 'move'
    | 'text'
    | 'wait'
    | 'help'
    | 'not-allowed'
}

/** 事件处理 */
interface IEvent {
  /** 事件类型 */
  type: 'none' | 'tap' | 'mousedown' | 'touchstart'
  action: 'link' | 'func' | 'scrollTo'
  stopPropagation: boolean
  link: string
  openNewTab: boolean
  execFunction: string
  scrollTarget: string
}

/** 动效 */
interface IAnimationItem {
  /**
   * 动画触发类型
   * scrollIntoView: 滚动进入触发
   * hover: 鼠标移上去触发
   * click: 点击触发
   * always: 总是执行
   */
  trigger: 'scrollIntoView' | 'always' | 'hover' | 'click'
  /** 动画时长 */
  duration: number
  /** 动画延迟 */
  delay: number
  /** 动画缓动 */
  timingFunction: string | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'
  /** 内置动画类型 */
  name:
    | 'fade'
    | 'slide-up'
    | 'slide-down'
    | 'slide-left'
    | 'slide-right'
    | 'zoom-in'
    | 'zoom-out'
    | 'rotate-x'
    | 'rotate-y'
  /** 动画结束状态 */
  fillMode: 'forwards' | 'backwards' | 'both' | 'none'
  /** 动画播放方向 */
  direction: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'
  /** 内置动画配置 */
  settings: IAnimationSettings
}
type IAnimationSettings = {
  fade?: {
    opacity: number
  }
} & {
  slide?: {
    offset: number
    opacity: number
  }
} & {
  zoom?: {
    zoom: number
    opacity: number
  }
} & {
  rotate?: {
    angle: number
    opacity: number
  }
}
interface IAnimation {
  animationList: IAnimationItem[]
}

/** 过渡设置 */
interface IEffectItem {
  /** 过渡目标（子元素） */
  target: string
  /**
   * 过渡目标选择器类型
   * self: 选择自身
   * name: 通过 name 选择子元素
   * tag: 通过标签选择子元素
   */
  targetType: 'self' | 'name' | 'tag'
  /** 名称 */
  name: string
  /** 过渡时长 */
  duration: number
  /** 过渡曲线 */
  timingFunction: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'
  /** 过渡样式 */
  styles: {
    hover?: any
    active?: any
    focus?: any
  }
}
interface IEffect {
  effectList: IEffectItem[]
}

/** 自定义代码设置 */
interface ICode {
  /** 自定义脚本 */
  script: string
  /** 自定义样式 */
  style: string
}

/** 颜色变量 */
interface IColorVarItem {
  /** 颜色变量名 */
  name: string
  /** 颜色值 */
  color: string
}

/** 字体设置 */
interface IFontSetting {
  /** 全局字体 */
  fontFamily: string
  /** 全局字体大小 */
  fontSize: number
  /** 媒体查询字体，key 是媒体查询宽度，value 是 fontSize */
  mediaFontSize: { [minWidth: string]: number }
  /** 自定义字体 */
  customFontFace: (
    | string
    | {
        fontFamily: string
        url: string
        fontStyle: IFont['fontStyle']
        fontWeight: IFont['fontWeight']
      }
  )[]
}

/** 全局页面设置 */
interface IPageSetting {
  /** 页面标题 */
  title: string
  /** 页面图标 */
  favicon: string
  /** 网站描述，用于 SEO 优化 */
  description: string
  /** 网站支持的客户端 */
  client: 'desktop' | 'mobile' | 'both'
  /** Google Analytics */
  googleAnalytics?: string
  /** 自定义脚本 */
  customCode?: string
}

/** 项目数据 */
interface IProject {
  name: string
  cover: string
  isPublic: boolean
  domain: string
  host: string
}
