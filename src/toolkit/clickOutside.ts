import { App, DirectiveBinding, VNode } from 'vue'

function validate(binding: DirectiveBinding<any>) {
  if (typeof binding.value !== 'function') {
    console.warn('[Vue-click-outside:] provided expression', binding.value, 'is not a function.')
    return false
  }

  return true
}

export const ClickOutsideDirective = {
  install(app: App) {
    app.directive('click-outsize', {
      created(el, binding) {
        if (!validate(binding)) return

        const { value } = binding
        el.__clickOutside_cb__ = typeof value === 'function' ? value : value.handler
        const extraSelectors = value.extraSelectors || []

        function handleClick(e: Event) {
          const target = e.target as HTMLElement
          if (
            el.contains(target) ||
            extraSelectors.some((selector: string) => document.querySelector(selector)?.contains(target))
          ) return

          el.__clickOutside_cb__(e)
        }
        const clickHandler = 'ontouchstart' in document.documentElement ? 'touchstart' : 'click';
        document.addEventListener(clickHandler, handleClick)
        el.__clickOutside_rm__ = () => document.removeEventListener(clickHandler, handleClick)
      },
      updated(el, binding) {
        el.__clickOutside_cb__ = typeof binding.value === 'function' ? binding.value : binding.value.handler
      },
      beforeUnmount(el) {
        el.__clickOutside_cb__ = null
        delete el.__clickOutside_cb__
        el.__clickOutside_rm__?.();
        delete el.__clickOutside_rm__
      }
    })
  },
}
