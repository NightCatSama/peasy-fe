export const useContainerGroup = (node: CNode): ConfigGroup => {
  return {
    title: '容器',
    desc: '',
    params: [
      {
        label: '背景颜色',
        desc: '容器的背景颜色',
        type: 'color',
        get: () => node.props.container.backgroundColor,
        set: (val: string) => {
          node.props.container.background = val
        },
      },
    ],
  }
}
