import { inject } from 'vue'
import type { DisplayMode } from '@/stores/display'

export interface EditContext {
  isEditMode: boolean
  displayMode: DisplayMode
}

export const getContext = () => inject<EditContext>('editContext')

export const getIsEditMode = () => !!inject<EditContext>('editContext')?.isEditMode
