import { useDisplayStore } from '@/stores/display'
import { inject } from 'vue'

const getIsEditMode = () => !!inject('isEditMode')

export const usePositionStyle = (position?: IPosition) => {
  if (!position) return {}

  const isAbsPosition = $computed(() => ['absolute', 'fixed'].includes(position.type))
  const isEditMode = getIsEditMode()

  return {
    position: isAbsPosition ? (isEditMode ? 'absolute' : position.type) : 'relative',
    top: isAbsPosition && position.top !== void 0 ? position.top : 'auto',
    left: isAbsPosition && position.left !== void 0 ? position.left : 'auto',
    right: isAbsPosition && position.top !== void 0 ? position.right : 'auto',
    bottom: isAbsPosition && position.left !== void 0 ? position.bottom : 'auto',
    marginLeft: !isAbsPosition && position.left !== void 0 ? position.left : '0',
    marginTop: !isAbsPosition && position.top !== void 0 ? position.top : '0',
    marginRight: !isAbsPosition && position.right !== void 0 ? position.right : '0',
    marginBottom: !isAbsPosition && position.bottom !== void 0 ? position.bottom : '0',
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
    backgroundImage: container.type === 'image' ? `url(${container.backgroundColor})` : 'none',
    backgroundSize: container.backgroundSize,
  }
}
