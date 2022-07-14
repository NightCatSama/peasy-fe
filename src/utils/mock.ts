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
      box: {
        height: '100%',
        isSection: type === 'section',
      },
      layout: {
        direction: 'row',
        justify: 'center',
        align: 'center',
      },
      container: {
        type: 'color',
        backgroundColor: 'pink',
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
          box: {
            width: '80%',
            height: '100%',
            stretch: true,
          },
          layout: {
            direction: 'row',
            justify: 'center',
            align: 'start',
          } as ILayout,
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
              text: 'Hello Child',
              color: `#${Math.random().toString(16).slice(2, 8)}`,
              position: {
                type: 'relative',
                left: '0',
                top: '0',
              },
            },
          },
        ],
      },
      {
        type: 'component',
        name: `${t}-title-${~~(Math.random() * 1000)}`,
        component: 'Text',
        props: {
          text: 'Hello',
          color: `#${Math.random().toString(16).slice(2, 8)}`,
          position: {
            type: 'absolute',
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
          text: 'Hello',
          color: `#${Math.random().toString(16).slice(2, 8)}`,
          position: {
            type: 'relative',
            left: '0',
            top: '0',
          },
        },
      },
    ],
  }
}
