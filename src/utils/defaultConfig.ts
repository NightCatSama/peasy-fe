import { ComponentName, DefaultIconStyleLink, GroupPropType, isSomeBasicType, PageNode } from '@/config'

export const getDefaultBasic = <
  T extends ComponentName = any,
  P extends Partial<GroupPropType<T>['basic']> = any
>(
  component: T,
  initConfig?: P
): GroupPropType<T>['basic'] => {
  let obj: any = {}
  if (isSomeBasicType(component, 'Text', obj)) {
    obj = {
      text: 'Title Text',
    }
  }
  if (isSomeBasicType(component, 'Image', obj)) {
    obj = {
      src: '',
      objectFit: 'fill'
    }
  }
  if (isSomeBasicType(component, 'Icon', obj)) {
    obj = {
      name: 'home',
      size: '2vw',
      color: '#000',
      prefixClass: 'fa-',
      extraClass: '',
      styleLink: DefaultIconStyleLink,
    }
  }
  return Object.assign(obj, initConfig)
}

export const getDefaultSize = (
  type: PageNode['type'] = 'component',
  initConfig?: Partial<ISize>
): ISize =>
  Object.assign(
    type === 'component'
      ? {
          width: 'auto',
          height: 'auto',
          minWidth: '50px',
          minHeight: '50px',
          maxHeight: 'none',
          maxWidth: 'none',
        }
      : {
          height: '100%',
          minHeight: '50px',
          maxHeight: 'none',
        },
    initConfig || null
  )

export const getDefaultLayout = (initConfig?: Partial<ILayout>): ILayout =>
  Object.assign(
    {
      direction: 'row',
      justify: 'center',
      align: 'center',
    },
    initConfig
  )

export const getDefaultFont = (initConfig?: Partial<IFont>): IFont =>
  Object.assign(
    {
      fontSize: '2vw',
      lineHeight: '126%',
      color: '#232323',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      textAlign: 'left',
    },
    initConfig
  )

export const getDefaultSpacing = (initConfig?: Partial<ISpacing>): ISpacing =>
  Object.assign(
    {
      margin: [0, 0, 0, 0],
      padding: [0, 0, 0, 0],
    },
    initConfig
  )

export const getDefaultBorder = (initConfig?: Partial<IBorder>): IBorder =>
  Object.assign(
    {
      borderWidth: new Array(4).fill('0px'),
      borderStyle: new Array(4).fill('solid'),
      borderColor: new Array(4).fill('#000'),
      borderRadius: '0px',
    },
    initConfig
  )

export const getDefaultBackground = (initConfig?: Partial<IBackground>): IBackground =>
  Object.assign(
    {
      backgroundType: 'none',
      backgroundColor: '#FFFFFF',
      backgroundImage: '',
      backgroundSize: 'auto',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundGradientAngle: 180,
      backgroundGradient: [],
    },
    initConfig
  )

export const getDefaultContainer = (initConfig?: Partial<IContainer>): IContainer =>
  Object.assign(
    {
      overflow: 'visible',
      boxShadow: '',
      opacity: 1,
    },
    initConfig
  )

export const getDefaultPosition = (initConfig?: Partial<IPosition>): IPosition =>
  Object.assign(
    {
      position: 'static',
      left: '0px',
      right: 'auto',
      top: '0px',
      bottom: 'auto',
      zIndex: 0,
    },
    initConfig
  )
