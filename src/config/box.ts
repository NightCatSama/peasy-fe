export const useBoxStyle = (node: CNode): ConfigGroup[] => {
  return node.type === 'section'
    ? [
        {
          title: '尺寸',
          desc: '支持组件的尺寸',
          params: [
            {
              label: '高度',
              desc: '容器高度，为 <em>auto</em> 时由内容撑开，<em>100%</em>时容器高度为屏幕高度',
              type: 'length',
              get: () => node.props.box.height,
              set: (val: string) => (node.props.box.height = val),
            },
            {
              label: '最小高度',
              desc: '容器的最小高度，当高度设置为 auto 时生效，<em>100%</em>时容器最小高度为屏幕高度',
              type: 'length',
              get: () => node.props.box.minHeight,
              set: (val: string) => (node.props.box.minHeight = val),
            },
          ],
        },
      ]
    : [
        {
          title: '尺寸',
          desc: '支持组件的尺寸',
          params: [
            {
              label: '宽度',
              desc: '',
              type: 'length',
              get: () => node.props.box.width,
              set: (val: string) => (node.props.box.width = val),
            },
            {
              label: '最小宽度',
              desc: '',
              type: 'length',
              get: () => node.props.box.minWidth,
              set: (val: string) => (node.props.box.minWidth = val),
            },
            {
              label: '高度',
              desc: '',
              type: 'length',
              get: () => node.props.box.height,
              set: (val: string) => (node.props.box.height = val),
            },
            {
              label: '最小高度',
              desc: '',
              type: 'length',
              get: () => node.props.box.minHeight,
              set: (val: string) => (node.props.box.minHeight = val),
            },
          ],
        },
      ]
}
