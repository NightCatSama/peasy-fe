import { createPinia } from 'pinia'
import { useRoute } from 'vue-router'

const pinia = createPinia()

/** 存储未保存的历史状态 */
export const saveStoragePageState = (id: string) => {
  try {
    const pageStore = pinia.state.value['page']
    sessionStorage.setItem('__page_store_state_id__', id)
    sessionStorage.setItem(
      '__page_store_state__',
      JSON.stringify({
        allPageData: pageStore.allPageData,
        project: pageStore.project,
        template: pageStore.template,
        colorVars: pageStore.colorVars,
        font: pageStore.font,
        setting: pageStore.setting,
      })
    )
  } catch (e: any) {
    console.error('Cache Error', e)
  }
}

/** 使用未保存的历史状态 */
export const getStoragePageState = <T extends any>(id: string, state: T): T => {
  let initState = null as any
  const route = useRoute()
  const paramId = route?.params?.id || id
  try {
    const stateId = sessionStorage.getItem('__page_store_state_id__') || ''
    if (stateId === paramId && sessionStorage.getItem('__page_store_state__')) {
      initState = JSON.parse(sessionStorage.getItem('__page_store_state__')!)
    }
    if (initState) return Object.assign(state as any, initState)
  } catch (e: any) {
    console.error('Cache Error', e)
  }
  return state
}

/** 是否有未保存的历史状态 */
export const haveStoragePageState = (id: string) => {
  const stateId = sessionStorage.getItem('__page_store_state_id__') || ''
  const state = sessionStorage.getItem('__page_store_state__')
  return state && id === stateId
}

/** 清除未保存的历史状态 */
export const clearStoragePageState = () => {
  sessionStorage.removeItem('__page_store_state_id__')
  sessionStorage.removeItem('__page_store_state__')
}

export { pinia }
