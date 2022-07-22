import { PageNode, PropsTypes } from '@/config'
import {
  getDefaultBackground,
  getDefaultBasic,
  getDefaultBorder,
  getDefaultContainer,
  getDefaultFont,
  getDefaultLayout,
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
                size: getDefaultSize('component', { width: '50%', height: '200px' }),
                layout: getDefaultLayout(),
                spacing: getDefaultSpacing(),
                border: getDefaultBorder(),
                container: getDefaultContainer(),
                background: getDefaultBackground({
                  backgroundType: 'image',
                  backgroundImage: 'https://avatars.githubusercontent.com/u/13888962?v=4',
                }),
              } as PropsTypes<'Block'>,
              children: [getMockText(name)],
            } as PageNode<'Block'>,
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
    },
  }
}
