import { inject } from 'vue'

export const useEvent = (event: IEvent, el: HTMLDivElement): (() => void) | null => {
  if (!event) return null

  const isEditMode = !!inject('isEditMode')

  const handler = (e: Event) => {
    if (isEditMode && (window as any).displayMode !== 'preview') return
    if (event.stopPropagation) {
      e.preventDefault()
    }
    if (event.action === 'link') {
      if (!event.link) return
      const a = document.createElement('a')
      a.href = event.link
      a.target = event.openNewTab ? '_blank' : '_self'
      a.click()
      a.remove()
    } else if (event.action === 'func') {
      if (!event.execFunction) return
      const args = '...args'
      const fn = new Function(args, `var [event] = args;${event.execFunction}`)
      fn(e)
    }
  }

  let removeListenerList: (() => void)[] = []
  if (event.type === 'tap') {
    el.addEventListener('click', handler, false)
    removeListenerList.push(() => {
      el.removeEventListener('click', handler, false)
    })
  }
  if (event.type === 'mousedown') {
    el.addEventListener('mousedown', handler, false)
    removeListenerList.push(() => {
      el.removeEventListener('mousedown', handler, false)
    })
  }
  if (event.type === 'touchstart') {
    el.addEventListener('touchstart', handler, false)
    removeListenerList.push(() => {
      el.removeEventListener('touchstart', handler, false)
    })
  }

  return () => removeListenerList.forEach((fn) => fn())
}
