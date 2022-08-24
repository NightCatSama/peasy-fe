import { inject } from 'vue'
import type { DisplayMode } from '@/stores/display'

export interface EditContext {
  isEditMode: boolean
  displayMode: DisplayMode
  lockScriptTrigger: boolean
}

export const getContext = () => inject<EditContext>('editContext')

export const getIsEditMode = () => !!inject<EditContext>('editContext')?.isEditMode

export const getSetLoading = () => inject<{ setGlobalLoading: (text: string) => () => void }>('globalLoading')?.setGlobalLoading!