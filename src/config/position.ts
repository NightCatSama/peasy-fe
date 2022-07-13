export const usePositionGroup = (node: CNode): ConfigGroup => {
  return {
    title: '位置',
    desc: '调整组件的位置信息，如果不是绝对定位，则按照父组件的位置进行计算',
    params: [
      {
        label: '定位方式',
        desc: '',
        type: 'select',
        options: Object.assign(
          {
            absolute: '绝对定位',
            relative: '相对定位',
          },
          node.type === 'section' ? { fixed: '固定定位' } : {}
        ),
        get: () => node.props.position.type,
        set: (val: string) => {
          node.props.position.type = val
        },
      },
      ...(node.type === 'component' ? useDistanceParams(node) : []),
    ],
  }
}

export const useDistanceParams = (node: CNode): ConfigNode[] => {
  return [
    {
      label: '左侧距离',
      desc: '绝对定位时基于容器，相对定位时则为相对于左侧距离',
      type: 'length',
      get: () => node.props.position.left,
      set: (val: string) => {
        node.props.position.left = val
      },
    },
    {
      label: '右侧距离',
      desc: '绝对定位时基于容器，相对定位时则为相对于右侧距离',
      type: 'length',
      get: () => node.props.position.right,
      set: (val: string) => {
        node.props.position.right = val
      },
    },
    {
      label: '顶部距离',
      desc: '绝对定位时基于容器，相对定位时则为相对于顶部距离',
      type: 'length',
      get: () => node.props.position.top,
      set: (val: string) => {
        node.props.position.top = val
      },
    },
    {
      label: '底部距离',
      desc: '绝对定位时基于容器，相对定位时则为相对于底部距离',
      type: 'length',
      get: () => node.props.position.bottom,
      set: (val: string) => {
        node.props.position.bottom = val
      },
    },
  ]
}
