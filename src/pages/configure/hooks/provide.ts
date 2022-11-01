import { useDisplayStoreHelper } from "@/hooks/store"
import { provide, reactive, watch } from "vue"

export const useProvide = () => {
  const { displayMode, lockScriptTrigger } = useDisplayStoreHelper()

  // 向子组件传递当前编辑模式，在 lib/ 下的组件中使用
// 为啥使用 provide，因为需要保持 lib/ 下的依赖干净，在纯页面生成时是不需要 store 相关数据引用的
  let context = reactive({ isEditMode: true, displayMode: displayMode.value, lockScriptTrigger: lockScriptTrigger.value })
  provide('editContext', context)

  // 更新 provide
  watch(
    () => [displayMode.value, lockScriptTrigger.value],
    () => {
      context.displayMode = displayMode.value
      context.lockScriptTrigger = lockScriptTrigger.value
    },
    { immediate: true, flush: 'sync' }
  )

  return {
    context
  }
}