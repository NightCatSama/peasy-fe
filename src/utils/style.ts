import { useDisplayStore } from '@/stores/display'
import { computed, inject } from 'vue'

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

export const useSizeStyle = (size: ISize, direction?: string) => {
  if (!size) return {}

  const isEditMode = getIsEditMode()

  let flexStyles: any = {}

  let width = size.width
  if (size.width === 'stretch') {
    size.width = ''
    if (direction === 'row') {
      flexStyles.flexGrow = 1
      flexStyles.flexShrink = 1
    } else {
      flexStyles.alignSelf = 'stretch'
    }
  }

  let height = size.height
  let minHeight = size.minHeight
  let maxHeight = size.maxHeight
  // 不存在则证明是 section
  if (!direction) {
    if (size.height?.slice?.(-1) === '%') {
      const n = parseFloat(size.height)
      height = isEditMode ? `${useDisplayStore().device.height * (n / 100)}px` : `${n}vh`
    }
    if (size.minHeight?.slice?.(-1) === '%') {
      const n = parseFloat(size.minHeight)
      minHeight = isEditMode ? `${useDisplayStore().device.height * (n / 100)}px` : `${n}vh`
    }
    if (size.maxHeight?.slice?.(-1) === '%') {
      const n = parseFloat(size.maxHeight)
      maxHeight = isEditMode ? `${useDisplayStore().device.height * (n / 100)}px` : `${n}vh`
    }
  } else if (size.height === 'stretch') {
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

export const useLayoutStyle = (layout: ILayout) => {
  if (!layout) return {}

  return {
    display: 'flex',
    flexDirection: layout.direction,
    justifyContent: layout.justify,
    alignItems: layout.align,
  }
}

export const useContainerStyle = (container: IContainer) => {
  if (!container) return {}

  return {
    backgroundColor: container.type === 'color' ? container.backgroundColor : 'transparent',
    backgroundImage: container.type === 'image' ? `url(${container.backgroundColor})` : '',
    backgroundSize: container.backgroundSize,
  }
}
