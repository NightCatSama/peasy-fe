import { useDisplayStore } from "@/stores/display"
import { useDragStore } from "@/stores/drag"
import { useHistoryStore } from "@/stores/history"
import { usePageStore } from "@/stores/page"
import { useUserStore } from "@/stores/user"
import { storeToRefs } from "pinia"

/**
 * 简化 store 数据的获取
 */

export const usePageStoreHelper = () => {
  const pageStore = usePageStore()
  const storeRefs = storeToRefs(pageStore)
  return {
    pageStore,
    ...pageStore,
    ...storeRefs,
  }
}

export const useUserStoreHelper = () => {
  const userStore = useUserStore()
  const storeRefs = storeToRefs(userStore)
  return {
    userStore,
    ...userStore,
    ...storeRefs,
  }
}

export const useDragStoreHelper = () => {
  const dragStore = useDragStore()
  const storeRefs = storeToRefs(dragStore)
  return {
    dragStore,
    ...dragStore,
    ...storeRefs,
  }
}

export const useHistoryStoreHelper = () => {
  const historyStore = useHistoryStore()
  const storeRefs = storeToRefs(historyStore)
  return {
    historyStore,
    ...historyStore,
    ...storeRefs,
  }
}

export const useDisplayStoreHelper = () => {
  const displayStore = useDisplayStore()
  const storeRefs = storeToRefs(displayStore)
  return {
    displayStore,
    ...displayStore,
    ...storeRefs,
  }
}
