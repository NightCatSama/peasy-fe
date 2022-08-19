import {
  ComponentName,
  DefaultIconStyleLink,
  GroupPropType,
  isSomeBasicType,
  PageNode,
} from '@/config'

export const getDefaultCommon = (initConfig?: Partial<ICommonType>): ICommonType =>
  Object.assign(
    {
      hide: false,
    },
    initConfig
  )

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
      text: 'Sample Text',
    }
  }
  if (isSomeBasicType(component, 'Image', obj)) {
    obj = {
      src: '',
      objectFit: 'fill',
    }
  }
  if (isSomeBasicType(component, 'Icon', obj)) {
    obj = {
      name: 'home',
      size: '1rem',
      color: '$primary',
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
          width: '10vw',
          height: '10vw',
          minWidth: 'auto',
          minHeight: 'auto',
          maxHeight: 'none',
          maxWidth: 'none',
        }
      : {
          width: '',
          height: '100%',
          minWidth: '',
          minHeight: '50px',
          maxHeight: 'none',
          maxWidth: '',
        },
    initConfig || null
  )

export const getDefaultLayout = (initConfig?: Partial<ILayout>): ILayout =>
  Object.assign(
    {
      direction: 'row',
      justify: 'center',
      align: 'center',
      wrap: 'nowrap',
    },
    initConfig
  )

export const getDefaultFont = (initConfig?: Partial<IFont>): IFont =>
  Object.assign(
    {
      fontSize: '1rem',
      lineHeight: '126%',
      color: '$primary',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      textAlign: 'left',
      textShadow: '',
      fontFamily: '',
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
      borderColor: new Array(4).fill('$primary'),
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
      backgroundAttachment: 'scroll',
    },
    initConfig
  )

export const getDefaultContainer = (initConfig?: Partial<IContainer>): IContainer =>
  Object.assign(
    {
      overflow: 'visible',
      boxShadow: '',
      opacity: 1,
      cursor: 'inherit',
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

export const getDefaultEvent = (initConfig?: Partial<IEvent>): IEvent =>
  Object.assign(
    {
      type: 'tap',
      action: 'link',
      stopPropagation: true,
      link: '',
      openNewTab: true,
      execFunction: '',
      scrollTarget: ''
    },
    initConfig
  )

export const getDefaultAnimation = (initConfig?: Partial<IAnimation>): IAnimation =>
  Object.assign(
    {
      animationList: [],
    },
    initConfig
  )

export const getDefaultAnimationItem = (
  name: IAnimationItem['name'],
  initConfig?: Partial<IAnimationItem>
): IAnimationItem => {
  return {
    name,
    trigger: 'scrollIntoView',
    duration: 1,
    delay: 0,
    timingFunction: 'ease',
    fillMode: 'both',
    direction: 'alternate',
    settings: getDefaultAnimationSettings(name),
    ...initConfig,
  }
}

export const getDefaultAnimationSettings = (name: IAnimationItem['name']): IAnimationSettings => {
  if (name === 'fade') {
    return {
      fade: {
        opacity: .5,
      },
    }
  }
  if (name.startsWith('slide')) {
    return {
      slide: {
        offset: 20,
        opacity: 1,
      },
    }
  }
  if (name.startsWith('zoom')) {
    return {
      zoom: {
        zoom: 0.5,
        opacity: 1,
      },
    }
  }
  if (name.startsWith('rotate')) {
    return {
      rotate: {
        angle: 180,
        opacity: 1,
      },
    }
  }
  return {}
}

export const getDefaultEffect = (initConfig?: Partial<IEffect>): IEffect =>
  Object.assign(
    {
      effectList: [],
    },
    initConfig
  )

export const getDefaultEffectItem = (target: string): IEffectItem => {
  return {
    target,
    targetType: 'self',
    name: '',
    duration: 0.5,
    timingFunction: 'ease',
    styles: {},
  }
}
