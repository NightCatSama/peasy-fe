import { GroupType, PageNode } from "@/config";

export const getEffectPropertyByGroup = (groupType: GroupType, node: PageNode) => {
  switch (groupType) {
    case 'font':
      return {
        color: {
          property: 'color',
          handler: 'color',
          label: '字体颜色',
          defaultValue: node?.props?.font?.color ?? '#000',
        },
        fontSize: {
          property: 'font-size',
          handler: {
            name: 'Font Size',
            type: 'number',
            suffix: ['px', 'rem', 'vw'],
          },
          label: '字体大小',
          defaultValue: node?.props?.font?.fontSize ?? '18px',
        }
      }
    // case 'border':
    //   return {
    //     borderWidth: {
    //       property: 'border-width',
    //       handler: 'color',
    //       name: '字体颜色',
    //       defaultValue: '#000',
    //     },
    //     borderColor: {
    //       property: 'border-width',
    //       handler: 'color',
    //       name: '字体颜色',
    //       defaultValue: '#000',
    //     }
    //   }
  }
}