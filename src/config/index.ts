import { useBlockGroup } from './block'
import { usePositionGroup } from './position'
import { useTextGroup } from './text'

export const getConfig = (node: CNode): ConfigData => {
  switch (node.component) {
    case 'Block':
      return {
        node,
        name: node.name,
        desc: '容器组件，可以自由添加子组件',
        groups: [...useBlockGroup(node), usePositionGroup(node)],
      }
    case 'Text':
    default:
      return {
        node,
        name: node.name,
        desc: '文本组件',
        groups: [
          {
            title: '基础配置',
            desc: '',
            params: [
              {
                label: '文本',
                desc: '展示的文本内容',
                type: 'textarea',
                get: () => node.props.text,
                set: (val: string) => {
                  node.props.text = val
                },
              },
            ],
          },
          useTextGroup(node),
          usePositionGroup(node),
        ],
      }
  }
}
