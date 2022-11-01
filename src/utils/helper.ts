/** 是否为项目配置项中的编辑组件 */
export const inConfigMain = (node: HTMLElement | null): boolean => {
  if (!node) return false
  while (node && node.classList) {
    if (node.classList.contains('group-dropdown') || node.classList.contains('config-group'))
      return true
    node = node.parentElement
  }
  return false
}
