import { getContext } from "@/utils/context"
import { onBeforeUnmount, onMounted } from "vue"

export const useScrollByOffset = (showByOffset: string, cb: (show: boolean) => void) => {
  const editContext = getContext()
  if (editContext?.isEditMode || !showByOffset || !parseFloat(showByOffset)) return
  const containerElement = document.body!

  const handleScroll = (e: Event) => {
    setShow((e.target as HTMLElement).scrollTop)
  }

  const setShow = (scrollTop: number) => {
    if (showByOffset.endsWith('px')) {
      cb(scrollTop > parseFloat(showByOffset))
    }
    if (showByOffset.endsWith('%')) {
      cb(scrollTop > parseFloat(showByOffset) * containerElement.clientHeight / 100)
    }
  }

  onMounted(() => {
    containerElement.addEventListener('scroll', handleScroll)
    setShow(containerElement.scrollTop)
  })

  onBeforeUnmount(() => containerElement.removeEventListener('scroll', handleScroll))
}