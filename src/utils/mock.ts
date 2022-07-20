import { PageNode } from '@/config'
import { getDefaultBorder, getDefaultFont, getDefaultLayout, getDefaultSize, getDefaultSpacing } from './defaultConfig'

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
    },
    children: type === 'component' ? [] : [
      {
        type: 'component',
        name: `${type}-Block`,
        component: 'Block',
        props: {
          size: getDefaultSize('component', { width: '50%' }),
          layout: getDefaultLayout(),
          spacing: getDefaultSpacing(),
          border: getDefaultBorder(),
        },
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
      basic: {
        text: text || 'Text',
      },
      font: getDefaultFont(),
      spacing: getDefaultSpacing(),
      border: getDefaultBorder(),
    }
  }
}
