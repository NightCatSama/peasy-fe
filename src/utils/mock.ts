import { PageNode, PropsTypes } from '@/config'
import {
  getDefaultAnimation,
  getDefaultBackground,
  getDefaultBasic,
  getDefaultBorder,
  getDefaultContainer,
  getDefaultEffect,
  getDefaultEvent,
  getDefaultFont,
  getDefaultLayout,
  getDefaultPosition,
  getDefaultSize,
  getDefaultSpacing,
} from './defaultConfig'

export const getMockBlock = (initType?: PageNode['type'], name?: string): PageNode<'Block'> => {
  const type = initType || 'component'
  return {
    type: type,
    name: name || (type === 'component' ? 'Block' : 'Section'),
    component: 'Block',
    props: {
      size: getDefaultSize(type),
      layout: getDefaultLayout(),
      spacing: getDefaultSpacing(),
      border: getDefaultBorder(),
      container: getDefaultContainer(),
      background: getDefaultBackground({}),
      position: getDefaultPosition(),
      event: getDefaultEvent(),
      effect: getDefaultEffect(),
      animation: getDefaultAnimation(),
    },
    children:
      type === 'component'
        ? []
        : [
            {
              type: 'component',
              name: `${type}-Block`,
              component: 'Block',
              props: {
                size: getDefaultSize('component', { width: '50%', height: 'auto' }),
                layout: getDefaultLayout(),
                spacing: getDefaultSpacing(),
                border: getDefaultBorder(),
                container: getDefaultContainer(),
                background: getDefaultBackground({
                  // backgroundType: 'image',
                  // backgroundImage: 'https://avatars.githubusercontent.com/u/13888962?v=4',
                }),
                position: getDefaultPosition({
                  // position: 'absolute',
                  // left: 'auto',
                  // top: 'auto'
                }),
                event: getDefaultEvent(),
                effect: getDefaultEffect(),
                animation: getDefaultAnimation(),
              },
              children: [getMockIcon('apple'), getMockText(), getMockImage()],
            },
          ],
  }
}

export const getMockText = (): PageNode<'Text'> => {
  return {
    type: 'component',
    name: 'Text',
    component: 'Text',
    props: {
      basic: getDefaultBasic('Text'),
      font: getDefaultFont({ fontSize: '100px' }),
      spacing: getDefaultSpacing({ margin: [50, 50, 50, 50] }),
      border: getDefaultBorder(),
      background: getDefaultBackground(),
      container: getDefaultContainer(),
      position: getDefaultPosition(),
      event: getDefaultEvent(),
      effect: getDefaultEffect(),
      animation: getDefaultAnimation(),
    },
  }
}

export const getMockImage = (src?: string): PageNode<'Image'> => {
  return {
    type: 'component',
    name: 'Image',
    component: 'Image',
    props: {
      basic: getDefaultBasic('Image'),
      size: getDefaultSize('component', {
        minHeight: '100px',
        minWidth: '100px',
      }),
      spacing: getDefaultSpacing(),
      border: getDefaultBorder(),
      container: getDefaultContainer(),
      position: getDefaultPosition(),
      event: getDefaultEvent(),
      effect: getDefaultEffect(),
      animation: getDefaultAnimation(),
    },
  }
}

export const getMockIcon = (name?: string): PageNode<'Icon'> => {
  return {
    type: 'component',
    name: 'Icon',
    component: 'Icon',
    props: {
      basic: getDefaultBasic('Icon', { name: 'apple' }),
      spacing: getDefaultSpacing(),
      border: getDefaultBorder(),
      event: getDefaultEvent(),
      effect: getDefaultEffect(),
    },
  }
}
