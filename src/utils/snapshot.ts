import html2canvas from 'html2canvas'

/** 生成截图 */
export const createMaterialSnapshot = (el: HTMLElement, options?: any) => {
  return html2canvas(el, {
    scale: 1,
    useCORS: true,
    ignoreElements: (elem: any) => {
      if (elem.classList.contains('moveable-control-box')) {
        return true
      }
      return false
    },
    onclone: (document: any) => {
      const activeElements = document.querySelector('.edit-content')
      activeElements.style.transform = ''
    },
    ...options,
  }).then((canvas) => {
    return canvas.toDataURL('image/png', 1)
  })
}

;(window as any).createMaterialSnapshot = createMaterialSnapshot