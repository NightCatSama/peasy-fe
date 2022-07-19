import { getDefaultFont, getDefaultLayout, getDefaultSize, getDefaultSpacing } from './defaultConfig'

export const getMockBlock = (initType?: CNode['type'], name?: string): CNode => {
  const type = initType || 'component'
  return {
    type: type,
    name: name || (type === 'component' ? 'Block' : 'Section'),
    component: 'Block',
    props: {
      position: {
        type: 'relative',
      },
      size: getDefaultSize(type),
      layout: getDefaultLayout(),
      spacing: getDefaultSpacing(),
      container: {
        type: 'color',
        backgroundColor: type === 'component' ? '#CCC' : '#FFF',
      },
    },
    children: type === 'component' ? [] : [
      {
        type: 'component',
        name: `${type}-Block`,
        component: 'Block',
        props: {
          position: {
            type: 'relative',
            left: '0',
            top: '0',
          },
          size: getDefaultSize('component', { width: '50%' }),
          layout: getDefaultLayout(),
          spacing: getDefaultSpacing(),
          container: {
            type: 'color',
            backgroundColor: 'pink',
          },
        },
        children: [getMockText(name)],
      },
    ],
  }
}

export const getMockText = (text?: string): CNode => {
  return {
    type: 'component',
    name: 'Text',
    component: 'Text',
    props: {
      basic: {
        text: text || 'Text',
      },
      font: getDefaultFont(),
      position: {
        type: 'relative',
        left: '0',
        top: '0',
      },
    }
  }
}
