import { getDefaultFont, getDefaultLayout, getDefaultSize } from './defaultConfig'

export const getMockBlock = (type?: CNode['type']): CNode => {
  const t = type || 'component'
  return {
    type: t,
    name: `${t}-${~~(Math.random() * 1000)}`,
    component: 'Block',
    props: {
      position: {
        type: 'relative',
      },
      size: getDefaultSize('section'),
      layout: getDefaultLayout(),
      container: {
        type: 'color',
        backgroundColor: 'transparent',
      },
    },
    children: [
      {
        type: 'component',
        name: `${t}-title-${~~(Math.random() * 1000)}`,
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
            name: `${t}-title-${~~(Math.random() * 1000)}`,
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
            name: `${t}-title-${~~(Math.random() * 1000)}`,
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
    name: `Text-${~~(Math.random() * 1000)}`,
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
