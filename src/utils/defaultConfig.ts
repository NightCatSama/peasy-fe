export const getDefaultSize = (
  type: CNode['type'] = 'component',
  initConfig?: Partial<ISize>
): ISize => Object.assign(
  type === 'component'
    ? {
      width: 'auto',
      height: 'auto',
      minWidth: '100px',
      minHeight: '100px',
      maxHeight: 'none',
      maxWidth: 'none',
    }
    : {
      height: '100%',
      minHeight: '100px',
      maxHeight: 'none',
    },
  initConfig || null
)


export const getDefaultLayout = (
  initConfig?: Partial<ILayout>
): ILayout => Object.assign(
  {
    direction: 'row',
    justify: 'center',
    align: 'center',
  },
  initConfig
)


export const getDefaultFont = (
  initConfig?: Partial<IFont>
): IFont => Object.assign(
  {
    fontSize: '2rem',
    lineHeight: '1.26x',
    color: '#232323',
    fontWeight: 'normal',
    fontStyle: 'normal'
  },
  initConfig
)

export const getDefaultSpacing = (
  initConfig?: Partial<ISpacing>
): ISpacing => Object.assign({
  margin: [0, 0, 0, 0],
  padding: [0, 0, 0, 0],
}, initConfig)
