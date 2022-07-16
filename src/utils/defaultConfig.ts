export const getDefaultSize = (
  type: 'component' | 'section' = 'component',
  initConfig?: any
): ISize => {
  return Object.assign(
    type === 'component'
      ? {
          width: '100%',
          height: '100%',
          minWidth: '0px',
          minHeight: '0px',
          maxHeight: 'none',
          maxWidth: 'none',
        }
      : {
          height: '100%',
          minHeight: '0px',
          maxHeight: 'none',
        },
    initConfig || null
  )
}

export const getDefaultLayout = (
  type: 'component' | 'section' = 'component',
  initConfig?: any
): ILayout => {
  return {
    direction: 'row',
    justify: 'center',
    align: 'center',
  }
}
