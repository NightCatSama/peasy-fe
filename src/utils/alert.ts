import { useToast, TYPE } from 'vue-toastification'

export const toast = useToast()

export const Alert = (msg: string) => toast(msg, { type: TYPE.INFO })
export const AlertError = (msg: string) => toast(msg, { type: TYPE.ERROR })
