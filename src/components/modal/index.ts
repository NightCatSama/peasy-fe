import { createVNode, render } from 'vue'
import ConfirmModal from './ConfirmModal.vue'
import GuideModal from './GuideModal.vue'

export class Modal {
  static id = 0
  static confirm(msg: string, options?: any) {
    return new Promise((res) => {
      const id = '__modal__' + Modal.id++
      let vnode = createVNode(ConfirmModal, {
        msg,
        showClose: true,
        onOk: () => res(true),
        onCancel: () => res(false),
        ...options,
        modelValue: true,
        uniqId: id,
        'onUpdate:modelValue': () => destroy(),
      }) as any

      render(vnode, document.body)

      const destroy = () => {
        const elem = document.getElementById(id)
        document.body.removeChild(elem!)
        render(null, document.body)
        vnode = null
      }
    })
  }

  static guide(options: { title: string, tips: { image: string, msg: string }[], [key: string]: any }) {
    const { title, tips, ...restProps } = options

    return new Promise((res) => {
      const id = '__modal__' + Modal.id++
      let vnode = createVNode(GuideModal, {
        title,
        tips,
        showClose: true,
        closeOnClickMask: true,
        ...restProps,
        onOk: () => res(true),
        onCancel: () => res(false),
        modelValue: true,
        uniqId: id,
        'onUpdate:modelValue': () => destroy(),
      }) as any

      render(vnode, document.body)

      const destroy = () => {
        const elem = document.getElementById(id)
        document.body.removeChild(elem!)
        render(null, document.body)
        vnode = null
      }
    })
  }
}
