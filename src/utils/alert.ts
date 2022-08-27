import { useToast, TYPE } from 'vue-toastification'

export const toast = useToast()
export let curToastId = 1

export const Alert = (msg: string) => toast(msg, { type: TYPE.INFO })
export const AlertSuccess = (msg: string) => toast(msg, { type: TYPE.SUCCESS })
export const AlertError = (msg: string) => toast(msg, { type: TYPE.ERROR })
export const AlertProcess = (msg: string): [(text: string) => void, () => void] => {
  const id = toast(msg, { type: TYPE.INFO, timeout: false })
  return [(text: string) => toast.update(id, {
    content: text,
    options: { type: TYPE.SUCCESS, timeout: 2000 }
  }), () => toast.dismiss(id)]
}
export const AlertLoading = (msg: string) => {
  const id = toast(msg, { type: TYPE.INFO, timeout: false })
  return () => toast.dismiss(id)
}
