import { $t } from "@/constants/i18n"
import { ShortcutKey } from "@/constants/shortcut"
import { useHistoryStore } from "@/stores/history"
import { usePageStore } from "@/stores/page"
import { Alert } from "@/utils/alert"
import { emitter } from "@/utils/event"
import { useKeyPress } from "ahooks-vue"
import { storeToRefs } from 'pinia'
import { nextTick } from "vue"

export const useShortCut = () => {
  const pageStore = usePageStore()
  const {
    allPageData,
    activeSection,
    activeNode,
    activeNodeIsSonText,
  } = storeToRefs(pageStore)
  const {
    setActiveNode,
    setActiveSection,
    updateAllPageNode,
    pasteClipboardNode,
    copyActiveNodeToClipboard,
  } = pageStore

  const historyStore = useHistoryStore()
  const { canUndoHistory, canRedoHistory, isSave } = storeToRefs(historyStore)
  const { saveHistory, undoHistory, redoHistory, setIsSave } = historyStore

  let showKeyboard = $ref(false)

  // 快捷键 - 重做
  useKeyPress(ShortcutKey.undo, (e) => {
    if (e.shiftKey) return
    if (!canUndoHistory.value) return
    e.preventDefault()
    updateAllPageNode(undoHistory())
  })

  // 快捷键 - 撤销
  useKeyPress(ShortcutKey.redo, (e) => {
    if (!canRedoHistory.value) return
    e.preventDefault()
    updateAllPageNode(redoHistory())
  })

  // 快捷键 - 折叠/展开全部
  useKeyPress(ShortcutKey.collapseAll, (e) => {
    e.preventDefault()
    emitter.emit('collapseGroup')
  })

  // 快捷键 - 切换 Section
  useKeyPress(ShortcutKey.switchSection, (e) => {
    e.preventDefault()
    if (e.key === '0') {
      switchSectionToIndex(-1)
    } else if (+e.key > 0) {
      switchSectionToIndex(+e.key - 1)
    }
  })

  // 快捷键 - 切换下一个 Section
  useKeyPress(ShortcutKey.nextSection, (e) => {
    if (e.shiftKey) return
    e.preventDefault()
    switchSectionByRound(1)
  })

  // 快捷键 - 切换上一个 Section
  useKeyPress(ShortcutKey.prevSection, (e) => {
    e.preventDefault()
    switchSectionByRound(-1)
  })

  // 快捷键 - 切换快捷键是否展示
  useKeyPress(ShortcutKey.switchShortcut, (e) => {
    e.preventDefault()
    showKeyboard = !showKeyboard
  })

  // 剪切
  useKeyPress(ShortcutKey.cut, async (e) => {
    if (!activeNode.value) return
    e.preventDefault()
    await copyActiveNodeToClipboard(true)
    Alert($t('cutSuccess'))
  })

  // 复制到粘贴板
  useKeyPress(ShortcutKey.copyToClipboard, async (e) => {
    const selectText = document.getSelection()?.toString()
    if (!activeNode.value || selectText || activeNodeIsSonText.value) return
    e.preventDefault()
    await copyActiveNodeToClipboard()
    Alert($t('copySuccess'))
  })

  // 粘贴到选中组件内
  useKeyPress(ShortcutKey.pasteToInside, async (e) => {
    e.preventDefault()
    handlePasteNode(true)
  })

  // 粘贴到当前组件的下一个组件
  useKeyPress(ShortcutKey.paste, async (e) => {
    if (e.shiftKey) return
    e.preventDefault()
    handlePasteNode(false)
  })

  // 处理粘贴
  const handlePasteNode = async(pasteToInside?: boolean) => {
    if (!activeNode.value) return
    if (await pasteClipboardNode(pasteToInside)) {
      Alert($t('pasteSuccess'))
    }
  }

  // 处理上下切换 Section
  const switchSectionByRound = $computed(() => (change: number) => {
    const index = allPageData.value.findIndex((item) => item === activeSection.value)
    switchSectionToIndex(index + change)
  })

  // 切换 Section 到指定的 index
  const switchSectionToIndex = $computed(() => (index: number) => {
    if (index === -1) {
      setActiveSection(null)
    } else if (allPageData.value[index]) {
      setActiveSection(allPageData.value[index])
      setActiveNode(allPageData.value[index])
    }
    nextTick(() => emitter.emit('location'))
  })

  return {
    showKeyboard: $$(showKeyboard)
  }
}