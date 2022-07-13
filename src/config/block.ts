export const useBlockGroup = (node: CNode): ConfigGroup[] => {
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
              get: () => node.props.height,
              set: (val: string) => (node.props.height = val),
            },
            {
              label: '最小高度',
              desc: '容器的最小高度，当高度设置为 auto 时生效，<em>100%</em>时容器最小高度为屏幕高度',
              type: 'length',
              get: () => node.props.minHeight,
              set: (val: string) => (node.props.minHeight = val),
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
              desc: '容器宽度，为 <em>auto</em> 时由内容撑开，<em>100%</em>时容器高度为屏幕高度',
              type: 'length',
              get: () => node.props.width,
              set: (val: string) => (node.props.width = val),
            },
            {
              label: '高度',
              desc: '容器高度，为 <em>auto</em> 时由内容撑开，<em>100%</em>时容器高度为屏幕高度',
              type: 'length',
              get: () => node.props.height,
              set: (val: string) => (node.props.height = val),
            },
            {
              label: '最小高度',
              desc: '容器的最小高度，当高度设置为 auto 时生效，<em>100%</em>时容器最小高度为屏幕高度',
              type: 'length',
              get: () => node.props.minHeight,
              set: (val: string) => (node.props.minHeight = val),
            },
          ],
        },
      ]
}
