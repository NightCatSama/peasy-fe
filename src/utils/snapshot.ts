import html2canvas from 'html2canvas'

export const createMaterialSnapshot = (el: HTMLElement, options?: any) => {
  return html2canvas(el, {
    scale: 1,
    ignoreElements: (elem: any) => {
      if (elem.classList.contains('moveable-control-box')) {
        return true
      }
      if (elem.classList.contains('active')) {
        elem.classList.remove('active')
      }
      return false
    },
    onclone: (dom: any) => {
      const activeElements = dom.querySelector('.edit-content')
      activeElements.style.transform = ''
    },
    ...options,
  }).then((canvas) => {
    return canvas.toDataURL('image/png', 0.8)
  })
}
