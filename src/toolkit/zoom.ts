import { App } from "vue"

export const ZoomDirective = {
  install(app: App) {
    app.directive('zoom', {
      updated(el: HTMLElement) {

      },
      mounted(el, binding) {
        const handleWheel = (event: WheelEvent) => {
          const { onChange, velocity = 0.001 } = binding.value
          event.preventDefault();
          const rect = el.getBoundingClientRect()
          const clientX = event.clientX - rect.left
          const clientY = event.clientY - rect.top
          const factor = 1 - event.deltaY * velocity;
          onChange(factor, clientX, clientY)
        }
        el.addEventListener('wheel', handleWheel)
        el.__hover_directive__ = () => {
          el.removeEventListener('wheel', handleWheel)
        }
      },
      beforeMount(el) {
        el.__hover_directive__?.()
      }
    })
  }
}