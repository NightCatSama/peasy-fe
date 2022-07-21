import { useDisplayStore } from '@/stores/display'
import { computed, inject } from 'vue'
import { covertSize, fixedPointToNumber, getUnit } from './sizeHelper'

const getIsEditMode = () => !!inject('isEditMode')

export const useStyle = (styles: any) => {
  for (let key in styles) {
    if (!styles[key]) {
      delete styles[key]
    }
  }
  return styles
}

export const usePositionStyle = (position?: IPosition) => {
  if (!position) return {}

  const isAbsPosition = $computed(() => ['absolute', 'fixed'].includes(position.type))
  const isEditMode = getIsEditMode()

  return {
    position: isAbsPosition ? (isEditMode ? 'absolute' : position.type) : 'relative',
    top: isAbsPosition && position.top !== void 0 ? position.top : '',
    left: isAbsPosition && position.left !== void 0 ? position.left : '',
    right: isAbsPosition && position.top !== void 0 ? position.right : '',
    bottom: isAbsPosition && position.left !== void 0 ? position.bottom : '',
    marginLeft: !isAbsPosition && position.left !== void 0 ? position.left : '',
    marginTop: !isAbsPosition && position.top !== void 0 ? position.top : '',
    marginRight: !isAbsPosition && position.right !== void 0 ? position.right : '',
    marginBottom: !isAbsPosition && position.bottom !== void 0 ? position.bottom : '',
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

  const isEditMode = getIsEditMode()
  const isSection = !direction

  let width = covertSize(size.width, { isEditMode, isSection, isHeight: false })
  let height = covertSize(size.height, { isEditMode, isSection, isHeight: true })
  let minHeight = covertSize(size.minHeight, { isEditMode, isSection, isHeight: true })
  let maxHeight = covertSize(size.maxHeight, { isEditMode, isSection, isHeight: true })

  let flexStyles: any = {}
  if (width === 'stretch') {
    width = ''
    if (direction === 'row') {
      flexStyles.flexGrow = 1
      flexStyles.flexShrink = 1
    } else {
      flexStyles.alignSelf = 'stretch'
    }
  }
  if (height === 'stretch') {
    height = ''
    if (direction === 'column') {
      flexStyles.flexGrow = 1
      flexStyles.flexShrink = 1
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

  const getBorder = (data: string | any[], index: number) =>
    Array.isArray(data) ? data[index] : data

  const [borderTop, borderRight, borderBottom, borderLeft] = Array.from(new Array(4), (_, i) =>
    [
      getBorder(border.borderWidth, i),
      getBorder(border.borderStyle, i),
      getBorder(border.borderColor, i),
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
    fontSize:
      isEditMode && getUnit(font.fontSize) === 'rem'
        ? `${fixedPointToNumber(font.fontSize)}em`
        : font.fontSize,
    lineHeight: font.lineHeight,
    fontWeight: font.fontWeight,
    fontStyle: font.fontStyle,
    color: font.color,
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

export const useBackgroundStyle = (background: IBackground) => {
  if (!background) return {}

  if (background.backgroundType === 'color') {
    return {
      backgroundColor: background.backgroundColor,
    }
  } else if (background.backgroundType === 'image') {
    return {
      backgroundImage: background.backgroundImage ? `url(${background.backgroundImage})` : '',
      backgroundPosition: background.backgroundPosition,
      backgroundRepeat: background.backgroundRepeat,
      backgroundSize: background.backgroundSize,
    }
  } else if (background.backgroundType === 'gradient') {
    return {
      backgroundImage: `linear-gradient(${
        background.backgroundGradientAngle
      }deg, ${
        background.backgroundGradient.map(({ color, percentage }) => `${color} ${percentage}%`)
      })`,
    }
  }
}

export const useContainerStyle = (container: IContainer) => {
  if (!container) return {}

  return {
    opacity: container.opacity,
    overflow: container.overflow,
    boxShadow: container.boxShadow,
  }
}
