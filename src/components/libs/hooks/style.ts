import { getIsEditMode } from '@/utils/context'
import type { AnimationMapType } from './animation'
import { effectName2PropertyMap } from './effect'
import { getColor } from './color'
// import { covertSize as covertSizeUseStore } from '@/utils/sizeHelper'

// NOTE: vite 的 tree-shaking 不知道为啥不起左右，改用 window 调用去解决
export const covertSize = import.meta.env.VITE_IS_TEMPLATE === 'true'
  ? (s: string, options?: { isSection?: boolean; type?: 'width' | 'height' }) => (
    s.slice(-1) === '%' && options?.isSection
      ? `${s.slice(0, -1)}${options?.type === 'height' ? 'vh' : 'vw'}`
      : s
  )
  : (window as any)?.covertSize

export const useStyle = (styles: any) => {
  for (let key in styles) {
    if (!styles[key]) {
      delete styles[key]
    }
  }
  return styles
}

export const useImageBasicStyle = (basic: IImageBasicType) => {
  if (!basic) return {}

  return {
    objectFit: basic.objectFit,
  }
}

export const useIconBasicStyle = (basic: IIconBasicType) => {
  if (!basic) return {}

  return {
    color: getColor(basic.color),
    fontSize: basic.size,
  }
}

export const getPositionTransform = (position: IPosition) => {
  const isAbsPosition = ['absolute', 'fixed'].includes(position.position)
  let horizontal: { left?: string; right?: string; center?: boolean } = {}
  let vertical: { top?: string; bottom?: string; center?: boolean } = {}
  let transform = ''

  if (isAbsPosition) {
    horizontal =
      position.left === 'auto' && position.right === 'auto'
        ? { left: '50%', center: true }
        : position.left !== 'auto'
        ? { left: position.left }
        : { right: position.right }
    vertical =
      position.top === 'auto' && position.bottom === 'auto'
        ? { top: '50%', center: true }
        : position.top !== 'auto'
        ? { top: position.top }
        : { bottom: position.bottom }
    transform =
      horizontal.center && vertical.center
        ? 'translate(-50%, -50%)'
        : horizontal.center
        ? 'translateX(-50%)'
        : vertical.center
        ? 'translateY(-50%)'
        : ''
  }

  return {
    horizontal,
    vertical,
    transform,
  }
}

/** 定位样式 */
export const usePositionStyle = (position?: IPosition) => {
  if (!position) return {}

  const isAbsPosition = $computed(() => ['absolute', 'fixed'].includes(position.position))
  const isEditMode = getIsEditMode()

  let { horizontal, vertical, transform } = getPositionTransform(position)

  return {
    position: isAbsPosition ? (isEditMode ? 'absolute' : position.position) : 'relative',
    left: horizontal.left ? horizontal.left : 'auto',
    right: horizontal.right ? horizontal.right : 'auto',
    top: vertical.top ? vertical.top : 'auto',
    bottom: vertical.bottom ? vertical.bottom : 'auto',
    transform,
    zIndex: position.zIndex,
  }
}

/**
 *
 * @param size 尺寸信息
 * @param direction 所处容器的方向，row 或 column，为 Section 时没有容器则为空
 * @returns
 */
export const useSizeStyle = (size: ISize, direction?: string) => {
  if (!size) return {}

  const isSection = !direction

  let width = covertSize(size.width, { isSection, type: 'width' })
  let height = covertSize(size.height, { isSection, type: 'height' })
  let minHeight = covertSize(size.minHeight, { isSection, type: 'height' })
  let maxHeight = covertSize(size.maxHeight, { isSection, type: 'height' })

  let flexStyles: any = { 'flex-shrink': '0' }
  if (width === 'stretch') {
    width = ''
    if (direction === 'row') {
      flexStyles.flexGrow = 1
      flexStyles['flex-shrink'] = '1'
    } else {
      flexStyles.alignSelf = 'stretch'
    }
  }
  if (height === 'stretch') {
    height = ''
    if (direction === 'column') {
      flexStyles.flexGrow = 1
      flexStyles['flex-shrink'] = '1'
    } else {
      flexStyles.alignSelf = 'stretch'
    }
  }

  return {
    width,
    height,
    minWidth: size.minWidth,
    minHeight,
    maxWidth: size.maxWidth,
    maxHeight,
    ...flexStyles,
  }
}

/** 布局样式 */
export const useLayoutStyle = (layout: ILayout) => {
  if (!layout) return {}

  return {
    display: 'flex',
    flexDirection: layout.direction,
    justifyContent: layout.justify,
    alignItems: layout.align,
  }
}

/** 容器样式 */
export const useBorderStyle = (border: IBorder) => {
  if (!border) return {}

  const getBorder = (data: string | any[], index: number, isColor?: boolean) =>
    isColor
      ? Array.isArray(data)
        ? getColor(data[index])
        : getColor(data)
      : Array.isArray(data)
      ? data[index]
      : data

  const [borderTop, borderRight, borderBottom, borderLeft] = Array.from(new Array(4), (_, i) =>
    [
      getBorder(border.borderWidth, i),
      getBorder(border.borderStyle, i),
      getBorder(border.borderColor, i, true),
    ].join(' ')
  )

  const getBorderRadius = (radius: string) => (radius === 'circle' ? '50%' : radius)

  return {
    borderTop,
    borderRight,
    borderBottom,
    borderLeft,
    borderRadius: Array.isArray(border.borderRadius)
      ? border.borderRadius.map(getBorderRadius).join(' ')
      : getBorderRadius(border.borderRadius),
  }
}

/** 字体样式 */
export const useFontStyle = (font: IFont) => {
  if (!font) return {}

  const isEditMode = getIsEditMode()

  return {
    fontSize: covertSize(font.fontSize),
    lineHeight: covertSize(font.lineHeight),
    fontWeight: font.fontWeight,
    fontStyle: font.fontStyle,
    textDecoration: font.textDecoration,
    textAlign: font.textAlign,
    color: getColor(font.color),
    textShadow: font.textShadow,
    fontFamily: font.fontFamily,
  }
}

/** 字体样式 */
export const useSpacingStyle = (spacing: ISpacing) => {
  if (!spacing) return {}

  return {
    margin: spacing.margin.map((n: number) => `${n}px`).join(' '),
    padding: spacing.padding.map((n: number) => `${n}px`).join(' '),
  }
}

/** 背景样式 */
export const useBackgroundStyle = (background: IBackground) => {
  if (!background) return {}

  if (background.backgroundType === 'color') {
    return {
      backgroundColor: getColor(background.backgroundColor),
    }
  } else if (background.backgroundType === 'image') {
    return {
      backgroundImage: background.backgroundImage ? `url(${background.backgroundImage})` : '',
      backgroundPosition: background.backgroundPosition,
      backgroundRepeat: background.backgroundRepeat,
      backgroundSize: background.backgroundSize,
      backgroundAttachment: background.backgroundAttachment,
    }
  } else if (background.backgroundType === 'gradient') {
    return {
      backgroundImage: `linear-gradient(${
        background.backgroundGradientAngle
      }deg, ${background.backgroundGradient.map(
        ({ color, percentage }) => `${color} ${percentage}%`
      )})`,
    }
  }
}

/** 容器样式 */
export const useContainerStyle = (container: IContainer) => {
  if (!container) return {}

  return {
    opacity: container.opacity,
    overflow: container.overflow,
    boxShadow: container.boxShadow,
    cursor: container.cursor,
  }
}

export const useAnimationStyle = (animationMap: AnimationMapType) => {
  if (!animationMap || !animationMap.size) return {}

  const animationList: string[] = []
  animationMap.forEach((item, anim) => {
    if (item.disabled) return
    const iteration = ['always', 'hover'].includes(anim.trigger) ? 'infinite' : 1
    animationList.push(
      `${item.animationName} ${anim.duration}s ${anim.timingFunction} ${anim.delay}s ${iteration} ${anim.direction} ${anim.fillMode} running`
    )
  })

  return {
    animation: animationList.join(', '),
  }
}

export const useEffectStyle = (effect: IEffect, name: string) => {
  if (!effect) return {}

  return {
    transition: effect.effectList
      .map((item: IEffectItem) =>
        item.name && item.targetType === 'self'
          ? `${effectName2PropertyMap[item.name]} ${item.duration}s ${item.timingFunction}`
          : ''
      )
      .filter(Boolean)
      .join(', '),
  }
}
