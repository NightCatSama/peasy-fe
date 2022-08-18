import html2canvas from 'html2canvas'

const maxSnapshotWidth = 1200
const maxSnapshotHeight = 800

/** 生成截图 */
export const createMaterialSnapshot = (el: HTMLElement, options?: any) => {
  let { width, height } = el.getBoundingClientRect()
  let scale = 1
  if (width > height && width > maxSnapshotWidth) {
    scale = maxSnapshotWidth / width
  }
  if (height > width && height > maxSnapshotHeight) {
    scale = maxSnapshotHeight / height
  }
  return html2canvas(el, {
    scale,
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

