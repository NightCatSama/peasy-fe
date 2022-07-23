import { App } from 'vue'

export default {
  install(app: App) {
    /**
     * 折叠指令
     * <div v-collapse="bool">
     */
    app.directive('collapse', {
      mounted(el, binding) {
        if (binding.value === false) {
          const height = el.getBoundingClientRect().height
          el.style.transition = 'none'
          el.dataset.originHeight = height
          el.style.paddingTop = '0'
          el.style.paddingBottom = '0'
          el.style.overflow = 'hidden'
          el.style.height = '0'
          el.offsetWidth // force reflow
          el.style.transition = ''
        }
      },
      updated(el, binding) {
        if (binding.value === true) {
          if (el.dataset.originHeight) {
            el.style.paddingTop = ''
            el.style.paddingBottom = ''
            el.style.height = el.dataset.originHeight + 'px'
            delete el.dataset.originHeight
            function onTransitionEnd() {
              el.style.height = ''
              el.style.overflow = ''
              el.style.transition = ''
              el.removeEventListener('transitionend', onTransitionEnd)
            }
            el.addEventListener('transitionend', onTransitionEnd)
          }
        } else {
          const height = el.getBoundingClientRect().height
          el.style.transition = 'all .15s ease-out'
          el.style.height = height + 'px'
          el.style.paddingTop = '0'
          el.style.paddingBottom = '0'
          el.style.overflow = 'hidden'
          el.dataset.originHeight = height
          el.offsetWidth // force reflow
          el.style.height = '0'
        }
      },
    })

    /**
     * 判断是否点击到元素外的指令
     * e.g.
     * <div v-click-outside="fn">
     * <div v-click-outside="{ handler: fn, parent: true extraSelectors: ['.trigger'] }">
     */
    app.directive('click-outside', {
      created(el, binding) {
        if (typeof binding.value !== 'function' && typeof binding.value.handler !== 'function') {
          console.warn(
            '[Vue-click-outside:] provided expression',
            binding.value,
            'is not a function.'
          )
          return
        }

        const { value } = binding
        el.__clickOutside_cb__ = typeof value === 'function' ? value : value.handler
        const extraSelectors = value.extraSelectors || []
        const includeParent = value.parent || true

        function handleClick(e: Event) {
          const target = e.target as HTMLElement
          if (
            el.contains(target) ||
            (includeParent ? el.parentElement?.contains(target) : false) ||
            extraSelectors.some((selector: string) =>
              document.querySelector(selector)?.contains(target)
            )
          )
            return

          el.__clickOutside_cb__(e)
        }
        const clickHandler = 'ontouchstart' in document.documentElement ? 'touchstart' : 'click'
        document.addEventListener(clickHandler, handleClick)
        el.__clickOutside_rm__ = () => document.removeEventListener(clickHandler, handleClick)
      },
      updated(el, binding) {
        el.__clickOutside_cb__ =
          typeof binding.value === 'function' ? binding.value : binding.value.handler
      },
      beforeUnmount(el) {
        el.__clickOutside_cb__ = null
        delete el.__clickOutside_cb__
        el.__clickOutside_rm__?.()
        delete el.__clickOutside_rm__
      },
    })

    /**
     * 判断是否鼠标移进元素内的指令
     * e.g.
     * <div v-hover="(inside: boolean) => null">
     */
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
      },
    })

    /** 判断元素是否被快速点击（300ms） */
    app.directive('tap', {
      mounted(el, binding) {
        let mousedownTime = 0
        el.__tap_cb__ = binding.value
        const isStop = binding.modifiers?.stop
        const handleMousedown = () => (mousedownTime = Date.now())
        const handleClick = (e: any) => {
          if (Date.now() - mousedownTime < 300) {
            isStop && e?.stopPropagation()
            el.__tap_cb__?.(e)
          }
        }
        el.addEventListener('mousedown', handleMousedown, false)
        el.addEventListener('click', handleClick)
        el.__tap_rm__ = () => {
          el.removeEventListener('mousedown', handleMousedown)
          el.removeEventListener('click', handleClick)
        }
      },
      updated(el, binding) {
        el.__tap_cb__ = binding.value
      },
      beforeUnmount(el) {
        el.__tap_rm__?.()
        delete el.__tap_rm__
        delete el.__tap_cb__
      },
    })
  },
}
