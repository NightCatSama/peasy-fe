export const usePositionStyle = (position?: IPosition, isEditMode: boolean = false) => {
  if (!position) return {}

  const isAbsPosition = $computed(() => ['absolute', 'fixed'].includes(position.type))
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

export const useBoxStyle = (box: IBox, isEditMode = false) => {
  return {
    width: box.width,
    height: box.height,
    flex: box.stretch ? 1 : 'none',
    flexShrink: box.stretch ? 1 : 0,
  }
}

export const useLayoutStyle = (layout: ILayout, isEditMode = false) => {
  return {
    display: 'flex',
    flexDirection: layout.direction,
    justifyContent: layout.justify,
    alignItems: layout.align,
  }
}
