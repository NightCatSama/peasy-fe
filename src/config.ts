export const ComponentGroup: { [componentName: string]: GroupType[] } = {
  Block: ['layout', 'size', 'position', 'container'],
  Text: ['basic', 'position'],
}

export interface ITextBasicType {
  text: string
}
export const isTextBasicType = (node: CNode, basic: any): basic is ITextBasicType => {
  return node.component === 'Text' && !!basic
}
