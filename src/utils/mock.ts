import { PageNode, PropsTypes } from '@/config'
import {
  getDefaultBackground,
  getDefaultBasic,
  getDefaultBorder,
  getDefaultContainer,
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
                position: getDefaultPosition(),
                event: getDefaultEvent(),
              },
              children: [getMockIcon('apple'), getMockText(name), getMockImage()],
            },
          ],
  }
}

export const getMockText = (text?: string): PageNode<'Text'> => {
  return {
    type: 'component',
    name: 'Text',
    component: 'Text',
    props: {
      basic: getDefaultBasic('Text'),
      font: getDefaultFont(),
      spacing: getDefaultSpacing(),
      border: getDefaultBorder(),
      background: getDefaultBackground(),
      container: getDefaultContainer(),
      position: getDefaultPosition(),
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
    },
  }
}