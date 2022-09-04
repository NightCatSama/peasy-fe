export const inConfigMain = (node: HTMLElement | null): boolean => {
  return !!document.querySelector('.config-main')?.contains(node)
}
