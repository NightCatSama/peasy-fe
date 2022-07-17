export const getDefaultSize = (
  type: 'component' | 'section' = 'component',
  initConfig?: Partial<ISize>
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
  initConfig?: Partial<ILayout>
): ILayout => {
  return Object.assign(
    {
      direction: 'row',
      justify: 'center',
      align: 'center',
    },
    initConfig
  )
}

export const getDefaultFont = (
  initConfig?: Partial<IFont>
): IFont => {
  return Object.assign(
    {
      fontSize: '2rem',
      lineHeight: '1.16x',
      color: '#333',
      fontWeight: 'normal',
      fontStyle: 'normal'
    },
    initConfig
  )
}

