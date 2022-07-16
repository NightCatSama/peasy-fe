import { App, nextTick } from 'vue'

export const CollapseDirective = {
  install(app: App) {
    app.directive('collapse', (el, binding) => {
      if (binding.value === true) {
        if (el.dataset.originHeight) {
          el.style.paddingTop = ''
          el.style.paddingBottom = ''
          el.style.height = el.dataset.originHeight + 'px'
          delete el.dataset.originHeight
          function onTransitionEnd() {
            el.style.height = ''
            el.removeEventListener('transitionend', onTransitionEnd)
          }
          el.addEventListener('transitionend', onTransitionEnd)
        }
      } else {
        const height = el.getBoundingClientRect().height
        el.style.height = height + 'px'
        el.style.paddingTop = '0'
        el.style.paddingBottom = '0'
        el.dataset.originHeight = height
        el.offsetWidth // force reflow
        el.style.height = '0'
      }
    })
  },
}
