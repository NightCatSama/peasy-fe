import { App } from "vue"

export const HoverDirective = {
  install(app: App) {
    app.directive('hover', {
      mounted(el, binding) {
        const setValue = (value: boolean) => binding.value(value)
        const handleMouseEnter = () => setValue(true)
        const handleMouseLeave = () => setValue(false)
        el.addEventListener('mouseenter', handleMouseEnter)
        el.addEventListener('mouseleave', handleMouseLeave)
        el.__hover_directive__ = () => {
          el.removeEventListener('mouseenter', handleMouseEnter)
          el.removeEventListener('mouseleave', handleMouseLeave)
        }
      },
      beforeMount(el) {
        el.__hover_directive__?.()
      }
    })
  }
}