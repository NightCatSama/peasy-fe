export const useTextGroup = (node: CNode): ConfigGroup => {
  return {
    title: '字体',
    desc: '',
    params: [
      {
        label: '字体颜色',
        desc: '展示的字体颜色',
        type: 'color',
        get: () => node.props.color,
        set: (val: string) => {
          node.props.color = val
        },
      },
    ],
  }
}
