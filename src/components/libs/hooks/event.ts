import { getTagClassName, getUniqueName } from '@/config'
import { getContext } from '@/utils/context'
import { watch, onBeforeMount, onMounted, Ref } from 'vue'
import type { IProps } from './common'

export const useEvent = (propsRef: IProps, el: Ref<HTMLDivElement | null>) => {
  let stop = $ref<(() => void) | null>(null)
  const event = $computed(() => propsRef.event)

  const editContext = getContext()

  onMounted(() => {
    if (!el.value) return
    stop = eventHandler(event, el.value)
  })
  onBeforeMount(() => stop?.())

  watch(
    () => event,
    () => {
      stop?.()
      if (!el.value) return
      stop = eventHandler(event, el.value)
    }
  )

  const eventHandler = (event: IEvent, el: HTMLDivElement): (() => void) | null => {
    if (!event) return null

    const handler = (e: Event) => {
      if (editContext?.isEditMode && editContext?.displayMode !== 'preview') return
      if (event.stopPropagation) {
        e.stopPropagation()
      }
      if (event.action === 'link') {
        if (!event.link) return
        const a = document.createElement('a')
        a.href = event.link
        a.target = event.openNewTab ? '_blank' : '_self'
        a.click()
        a.remove()
      } else if (event.action === 'func' && !editContext?.lockScriptTrigger) {
        if (!event.execFunction) return
        const args = '...args'
        const fn = new Function(args, `var [
          event,
          data,
          name,
          tag,
          getDataByName,
          getDataByTag
        ] = args;${event.execFunction}`)
        fn(
          e,
          propsRef,
          (name: string) => (document.body.querySelector('#' + getUniqueName(name)) as any),
          (tagName: string) => Array.from(document.body.querySelectorAll('.' + getTagClassName(tagName)) || []),
          (name: string) => (document.body.querySelector('#' + getUniqueName(name)) as any)?.__node__,
          (tagName: string) => Array.from(document.body.querySelectorAll('.' + getTagClassName(tagName)) || []).map((el) => (el as any).__node__),
        )
      } else if (event.action === 'scrollTo') {
        if (event.scrollTarget) {
          if (+event.scrollTarget >= 0) {
            const wrap = editContext?.isEditMode ? document.querySelector('.edit-wrapper') : document.body
            wrap?.scrollTo({
              top: +event.scrollTarget,
              behavior: 'smooth'
            })
          } else {
            const elem = document.querySelector(`[data-name="${event.scrollTarget}"]`) as HTMLElement
            elem?.scrollIntoView({
              behavior: 'smooth'
            })
          }
        }
      }
    }

    let removeListenerList: (() => void)[] = []
    if (event.type === 'tap') {
      el.addEventListener('click', handler, false)
      removeListenerList.forEach((fn) => fn())
      removeListenerList.push(() => {
        el.removeEventListener('click', handler, false)
      })
    }
    if (event.type === 'mousedown') {
      el.addEventListener('mousedown', handler, false)
      removeListenerList.forEach((fn) => fn())
      removeListenerList.push(() => {
        el.removeEventListener('mousedown', handler, false)
      })
    }
    if (event.type === 'touchstart') {
      el.addEventListener('touchstart', handler, false)
      removeListenerList.forEach((fn) => fn())
      removeListenerList.push(() => {
        el.removeEventListener('touchstart', handler, false)
      })
    }

    return () => removeListenerList.forEach((fn) => fn())
  }
}
