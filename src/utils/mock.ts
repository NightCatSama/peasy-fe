import { ModuleConfigType, PageNode, PropsTypes } from '@/config'
import {
  getDefaultAnimation,
  getDefaultBackground,
  getDefaultBasic,
  getDefaultBorder,
  getDefaultContainer,
  getDefaultEffect,
  getDefaultEvent,
  getDefaultFont,
  getDefaultLayout,
  getDefaultPosition,
  getDefaultSize,
  getDefaultSpacing,
} from './defaultConfig'

export const getMockBlock = (initType?: PageNode['type'], name?: string): PageNode<'Block'> => {
  const type = initType || 'component'
  return {
    type: type,
    name: name || (type === 'component' ? 'Block' : 'Section'),
    component: 'Block',
    tags: [],
    props: {
      size: getDefaultSize(type),
      layout: getDefaultLayout(),
      spacing: getDefaultSpacing(),
      border: getDefaultBorder(),
      container: getDefaultContainer(),
      background: getDefaultBackground({}),
      position: getDefaultPosition(),
      event: getDefaultEvent(),
      effect: getDefaultEffect(),
      animation: getDefaultAnimation(),
    },
    children:
      type === 'component'
        ? []
        : [
            {
              type: 'component',
              name: `${type}-Block`,
              component: 'Block',
              tags: [],
              isModule: true,
              moduleConfig: [{
                /** 配置名称 */
                title: 'Text',
                /** 图标 */
                icon: 'font',
                /** 是否折叠 */
                defaultCollapsed: true,
                /** 分组数据 */
                data: [
                  {
                    type: ModuleConfigType.Text,
                    label: '文本',
                    props: {},
                    getValue: (node: PageNode) => {
                      return node?.children?.[1]?.props?.basic?.text
                    },
                    setValue: (value: string, node: PageNode) => {
                      if (node?.children?.[1]?.props?.basic?.text !== void 0) {
                        node.children[1].props.basic.text = value
                      }
                    }
                  },
                  {
                    type: ModuleConfigType.Color,
                    label: '颜色',
                    props: {},
                    getValue: (node: PageNode) => {
                      return node?.children?.[1]?.props?.font?.color
                    },
                    setValue: (value: string, node: PageNode) => {
                      if (node?.children?.[1]?.props?.font?.color !== void 0) {
                        node.children[1].props.font.color = value
                      }
                    }
                  },
                  {
                    type: ModuleConfigType.FontSize,
                    label: '文字大小',
                    props: {},
                    getValue: (node: PageNode) => {
                      return node?.children?.[1]?.props?.font?.fontSize
                    },
                    setValue: (value: string, node: PageNode) => {
                      if (node?.children?.[1]?.props?.font?.fontSize !== void 0) {
                        node.children[1].props.font.fontSize = value
                      }
                    }
                  },
                  {
                    type: ModuleConfigType.Opacity,
                    label: '透明度',
                    props: {},
                    getValue: (node: PageNode) => {
                      return node?.children?.[1]?.props?.container?.opacity
                    },
                    setValue: (value: string, node: PageNode) => {
                      if (node?.children?.[1]?.props?.container?.opacity !== void 0) {
                        node.children[1].props.container.opacity = value
                      }
                    }
                  },
                ],
              }, {
                /** 配置名称 */
                title: 'Icon',
                /** 图标 */
                icon: 'check',
                defaultCollapsed: true,
                /** 分组数据 */
                data: [
                  {
                    type: ModuleConfigType.FontSize,
                    label: '图标大小',
                    props: {},
                    getValue: (node: PageNode) => {
                      return node?.children?.[0]?.props?.basic?.size
                    },
                    setValue: (value: string, node: PageNode) => {
                      if (node?.children?.[0]?.props?.basic?.size !== void 0) {
                        node.children[0].props.basic.size = value
                      }
                    }
                  },
                  {
                    type: ModuleConfigType.Color,
                    label: '图标颜色',
                    props: {},
                    getValue: (node: PageNode) => {
                      return node?.children?.[0]?.props?.basic?.color
                    },
                    setValue: (value: string, node: PageNode) => {
                      if (node?.children?.[0]?.props?.basic?.color !== void 0) {
                        node.children[0].props.basic.color = value
                      }
                    }
                  },
                ],
              }, {
                /** 配置名称 */
                title: 'Image',
                /** 图标 */
                icon: 'background',
                /** 是否折叠 */
                defaultCollapsed: true,
                /** 分组数据 */
                data: [
                  {
                    type: ModuleConfigType.Image,
                    label: '图片',
                    props: {},
                    getValue: (node: PageNode) => {
                      return node?.children?.[2]?.props?.basic?.src
                    },
                    setValue: (value: string, node: PageNode) => {
                      if (node?.children?.[2]?.props?.basic?.src !== void 0) {
                        node.children[2].props.basic.src = value
                      }
                    }
                  },
                ],
              }],
              props: {
                size: getDefaultSize('component', { width: '80%', height: 'auto' }),
                layout: getDefaultLayout(),
                spacing: getDefaultSpacing(),
                border: getDefaultBorder(),
                container: getDefaultContainer(),
                background: getDefaultBackground({
                  // backgroundType: 'image',
                  // backgroundImage: 'https://avatars.githubusercontent.com/u/13888962?v=4',
                }),
                position: getDefaultPosition({
                  // position: 'absolute',
                  // left: 'auto',
                  // top: 'auto'
                }),
                event: getDefaultEvent(),
                effect: getDefaultEffect(),
                animation: getDefaultAnimation(),
              },
              children: [getMockIcon('apple'), getMockText(), getMockImage()],
            },
          ],
  }
}

export const getMockText = (): PageNode<'Text'> => {
  return {
    type: 'component',
    name: 'Text',
    component: 'Text',
    tags: ['Text'],
    props: {
      basic: getDefaultBasic('Text'),
      font: getDefaultFont({ fontSize: '30px' }),
      spacing: getDefaultSpacing({ margin: [50, 50, 50, 50] }),
      border: getDefaultBorder(),
      background: getDefaultBackground(),
      container: getDefaultContainer(),
      position: getDefaultPosition(),
      event: getDefaultEvent(),
      effect: getDefaultEffect(),
      animation: getDefaultAnimation(),
    },
  }
}

export const getMockImage = (src?: string): PageNode<'Image'> => {
  return {
    type: 'component',
    name: 'Image',
    component: 'Image',
    tags: ['Image'],
    props: {
      basic: getDefaultBasic('Image'),
      size: getDefaultSize('component', {
        minHeight: '100px',
        minWidth: '100px',
      }),
      spacing: getDefaultSpacing(),
      border: getDefaultBorder(),
      container: getDefaultContainer(),
      position: getDefaultPosition(),
      event: getDefaultEvent(),
      effect: getDefaultEffect(),
      animation: getDefaultAnimation(),
    },
  }
}

export const getMockIcon = (name?: string): PageNode<'Icon'> => {
  return {
    type: 'component',
    name: 'Icon',
    component: 'Icon',
    tags: ['Icon'],
    props: {
      basic: getDefaultBasic('Icon', { name: 'apple' }),
      spacing: getDefaultSpacing(),
      border: getDefaultBorder(),
      event: getDefaultEvent(),
      effect: getDefaultEffect(),
    },
  }
}
