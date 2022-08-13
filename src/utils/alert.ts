import { useToast, TYPE } from 'vue-toastification'

export const toast = useToast()
export let curToastId = 1

export const Alert = (msg: string) => toast(msg, { type: TYPE.INFO })
export const AlertError = (msg: string) => toast(msg, { type: TYPE.ERROR })
export const AlertLoading = (msg: string) => {
  const id = toast(msg, { type: TYPE.INFO, timeout: false })
  return () => toast.dismiss(id)
}
