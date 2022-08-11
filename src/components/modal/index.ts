import { createVNode, render } from "vue";
import ConfirmModal from './ConfirmModal.vue'

export class Modal {
  static id = 0;
  static confirm(msg: string, options?: any) {
    return new Promise((res) => {
      const id = '__modal__' + Modal.id++
      let vnode = createVNode(ConfirmModal, {
        msg,
        showClose: false,
        onOk: () => res(true),
        onCancel: () => res(false),
        ...options,
        modelValue: true,
        uniqId: id,
        'onUpdate:modelValue': () => destroy()
      }) as any

      render(vnode, document.body)

      const destroy = () => {
        const elem = document.getElementById(id)
        document.body.removeChild(elem!)
        vnode = null
      }
    })
  }
}
