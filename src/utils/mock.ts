import { getDefaultFont, getDefaultLayout, getDefaultSize } from './defaultConfig'

export const getMockBlock = (initType?: CNode['type']): CNode => {
  const type = initType || 'component'
  return {
    type: type,
    name: type === 'component' ? 'Block' : 'Section',
    component: 'Block',
    props: {
      position: {
        type: 'relative',
      },
      size: getDefaultSize(type),
      layout: getDefaultLayout(),
      container: {
        type: 'color',
        backgroundColor: '#CCC',
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
          container: {
            type: 'color',
            backgroundColor: '#fff',
          },
        },
        children: [
          {
            type: 'component',
            name: `${type}-Text`,
            component: 'Text',
            props: {
              basic: {
                text: 'Hello World',
              },
              font: getDefaultFont(),
              position: {
                type: 'relative',
                left: '0',
                top: '0',
              },
            },
          },
          {
            type: 'component',
            name: `${type}-Text-2`,
            component: 'Text',
            props: {
              basic: {
                text: 'Hello Next World',
              },
              font: getDefaultFont(),
              position: {
                type: 'relative',
                left: '0',
                top: '0',
              },
            },
          },
        ],
      },
    ],
  }
}

export const getMockText = (): CNode => {
  return {
    type: 'component',
    name: 'Text',
    component: 'Text',
    props: {
      basic: {
        text: 'Hello Next World',
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
