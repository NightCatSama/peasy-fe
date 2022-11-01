import { DataType, ModuleConfigType, PageNode, PropsTypes } from '@/config'
import {
  getDefaultCommon,
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
  getDefaultCode,
} from './defaultConfig'

export const getMockBlock = (initType?: PageNode['type'], name?: string): PageNode<'Block'> => {
  const type = initType || 'component'
  return {
    type: type,
    name: name || (type === 'component' ? 'Block' : 'Section'),
    component: 'Block',
    tags: [],
    config: {
      props: {
        common: getDefaultCommon(),
        basic: getDefaultBasic('Block'),
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
        code: getDefaultCode(),
      },
    },
    children: [],
  }
}

export const getMockModuleBlock = (): PageNode<'Block'> => {
  return {
    type: 'component',
    name: `Block`,
    component: 'Block',
    tags: [],
    isModule: true,
    moduleConfig: [
      {
        /** 配置名称 */
        title: '设置',
        titleEn: 'Setting',
        /** 图标 */
        icon: 'advanced',
        /** 是否折叠 */
        defaultCollapsed: true,
        /** 分组数据 */
        data: [
          {
            type: ModuleConfigType.Text,
            label: '文本',
            labelEn: 'Text',
            props: {},
            sourceValue: 'children[1].config.props.basic.text',
            targetValue: 'children[1].config.props.basic.text',
          },
          {
            type: ModuleConfigType.Color,
            label: '颜色',
            labelEn: 'Color',
            props: {},
            sourceValue: 'children[1].config.props.font.color',
            targetValue: [
              'children[1].config.props.font.color',
              'children[0].config.props.basic.color',
            ],
          },
          {
            type: ModuleConfigType.FontSize,
            label: '文字大小',
            labelEn: 'Font Size',
            props: {},
            sourceValue: 'children[1].config.props.font.fontSize',
            targetValue: [
              'children[1].config.props.font.fontSize',
              'children[0].config.props.basic.size',
            ],
          },
          {
            type: ModuleConfigType.Opacity,
            label: '透明度',
            labelEn: 'Opacity',
            props: {},
            sourceValue: 'config.props.container.opacity',
            targetValue: 'config.props.container.opacity',
          },
        ],
      },
      {
        title: '图片',
        titleEn: 'Image',
        icon: 'image',
        defaultCollapsed: false,
        data: [
          {
            type: ModuleConfigType.Tip,
            label: '',
            props: {
              type: 'warning',
              message: '可以直接输入图片地址，或点击 Upload 上传图片。',
              messageEn:
                'You can directly input the image address, or click Upload to upload images.',
            },
          },
          {
            type: ModuleConfigType.Image,
            label: '背景图片',
            labelEn: 'Background Image',
            props: {},
            sourceValue: 'config.props.background.backgroundImage',
            targetValue: 'config.props.background.backgroundImage',
          },
          {
            type: ModuleConfigType.BackgroundSize,
            label: '',
            props: {},
            sourceValue: 'config.props.background.backgroundSize',
            targetValue: 'config.props.background.backgroundSize',
          },
        ],
      },
    ],
    config: {
      props: {
        common: getDefaultCommon(),
        basic: getDefaultBasic('Block'),
        size: getDefaultSize(),
        layout: getDefaultLayout(),
        spacing: getDefaultSpacing(),
        border: getDefaultBorder(),
        container: getDefaultContainer(),
        background: getDefaultBackground(),
        position: getDefaultPosition(),
        event: getDefaultEvent(),
        effect: getDefaultEffect(),
        animation: getDefaultAnimation(),
        code: getDefaultCode(),
      },
    },
    children: [getMockIcon('apple'), getMockText(), getMockImage()],
  }
}

export const getMockText = (): PageNode<'Text'> => {
  return {
    type: 'component',
    name: 'Text',
    component: 'Text',
    tags: ['Text'],
    config: {
      props: {
        common: getDefaultCommon(),
        basic: getDefaultBasic('Text'),
        font: getDefaultFont(),
        spacing: getDefaultSpacing(),
        border: getDefaultBorder(),
        background: getDefaultBackground(),
        container: getDefaultContainer(),
        position: getDefaultPosition(),
        event: getDefaultEvent(),
        effect: getDefaultEffect(),
        animation: getDefaultAnimation(),
        code: getDefaultCode(),
      },
    },
  }
}

export const getMockImage = (src?: string): PageNode<'Image'> => {
  return {
    type: 'component',
    name: 'Image',
    component: 'Image',
    tags: ['Image'],
    config: {
      props: {
        common: getDefaultCommon(),
        basic: getDefaultBasic('Image'),
        size: getDefaultSize('component'),
        spacing: getDefaultSpacing(),
        border: getDefaultBorder(),
        container: getDefaultContainer(),
        position: getDefaultPosition(),
        event: getDefaultEvent(),
        effect: getDefaultEffect(),
        animation: getDefaultAnimation(),
        code: getDefaultCode(),
      },
    },
  }
}

export const getMockIcon = (name?: string): PageNode<'Icon'> => {
  return {
    type: 'component',
    name: 'Icon',
    component: 'Icon',
    tags: ['Icon'],
    config: {
      props: {
        common: getDefaultCommon(),
        basic: getDefaultBasic('Icon'),
        spacing: getDefaultSpacing(),
        border: getDefaultBorder(),
        background: getDefaultBackground(),
        container: getDefaultContainer(),
        position: getDefaultPosition(),
        event: getDefaultEvent(),
        effect: getDefaultEffect(),
        animation: getDefaultAnimation(),
        code: getDefaultCode(),
      },
    },
  }
}

export const getMockMedia = (): PageNode<'Media'> => {
  return {
    type: 'component',
    name: 'Media',
    component: 'Media',
    tags: ['Media'],
    config: {
      props: {
        common: getDefaultCommon(),
        basic: getDefaultBasic('Media'),
        size: getDefaultSize('component', {
          width: '450px',
          height: '300px',
        }),
        spacing: getDefaultSpacing(),
        border: getDefaultBorder(),
        background: getDefaultBackground(),
        container: getDefaultContainer(),
        position: getDefaultPosition(),
        event: getDefaultEvent(),
        effect: getDefaultEffect(),
        animation: getDefaultAnimation(),
        code: getDefaultCode(),
      },
    },
  }
}

export const getMockInputField = (): PageNode<'InputField'> => {
  return {
    type: 'component',
    name: 'InputField',
    component: 'InputField',
    tags: ['InputField'],
    config: {
      props: {
        common: getDefaultCommon(),
        basic: getDefaultBasic('InputField'),
        font: getDefaultFont({
          fontSize: '16px',
        }),
        size: getDefaultSize('component', {
          width: '120px',
          height: 'auto',
        }),
        spacing: getDefaultSpacing(),
        border: getDefaultBorder(),
        background: getDefaultBackground(),
        container: getDefaultContainer(),
        position: getDefaultPosition(),
        event: getDefaultEvent(),
        effect: getDefaultEffect(),
        animation: getDefaultAnimation(),
        code: getDefaultCode(),
      },
    },
  }
}

export const EmptySection = {
  name: '空白章节',
  enName: 'Empty Section',
  category: '基础',
  categoryEn: 'Basic',
  type: 'section',
  cover: '',
  dataType: DataType.Page,
  node: getMockBlock('section'),
}

export const EmptyBlock = {
  name: '容器',
  enName: 'Block',
  category: '基础',
  categoryEn: 'Basic',
  type: 'component',
  cover: '',
  dataType: DataType.Page,
  node: getMockBlock('component'),
}

export const EmptyText = {
  name: '文本',
  enName: 'Text',
  category: '基础',
  categoryEn: 'Basic',
  type: 'component',
  cover: '',
  dataType: DataType.Page,
  node: getMockText(),
}

export const EmptyImage = {
  name: '图片',
  enName: 'Image',
  category: '基础',
  categoryEn: 'Basic',
  type: 'component',
  cover: '',
  dataType: DataType.Page,
  node: getMockImage(),
}

export const EmptyIcon = {
  name: '图标',
  enName: 'Icon',
  category: '基础',
  categoryEn: 'Basic',
  type: 'component',
  cover: '',
  dataType: DataType.Page,
  node: getMockIcon(),
}

export const EmptyMedia = {
  name: '媒体',
  enName: 'Media',
  category: '基础',
  categoryEn: 'Basic',
  type: 'component',
  cover: '',
  dataType: DataType.Page,
  node: getMockMedia(),
}

export const EmptyInputField = {
  name: '输入框',
  enName: 'InputField',
  category: '基础',
  categoryEn: 'Basic',
  type: 'component',
  cover: '',
  dataType: DataType.Page,
  node: getMockInputField(),
}
