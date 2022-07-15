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

export const useBoxStyle = (box: IBox) => {
  if (!box) return {}

  const isEditMode = getIsEditMode()

  let height = box.height
  if (box.isSection && box.height?.slice(-1) === '%') {
    const n = parseFloat(box.height)
    height = isEditMode ? `${useDisplayStore().device.height * (n / 100)}px` : `${n}vh`
  }

  return {
    width: box.width,
    height,
    minWidth: box.minWidth,
    minHeight: box.minHeight,
    flex: box.stretch ? 1 : 'none',
    flexShrink: box.stretch ? 1 : 0,
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
