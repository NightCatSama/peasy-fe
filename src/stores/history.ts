import { cloneDeep } from 'lodash'
import { defineStore } from 'pinia'

import { PageNode } from '@/config'

/** 最长保留记录长度 */
const maxHistoryLen = 10

export const useHistoryStore = defineStore('history', {
  state: () => ({
    /** 历史记录 */
    history: [] as PageNode[][],
    /** 当前使用的历史记录 */
    currentIndex: 0,
    /** 上次记录的 */
    lastTime: 0,
    /** 是否已经进行保存 */
    isSave: true,
  }),
  getters: {
    /** 是否可撤回 */
    canUndoHistory: (state) => {
      return state.history.length > 0 && !!state.history[state.currentIndex + 1]
    },
    /** 是否可重做 */
    canRedoHistory: (state) => {
      return !!state.history[state.currentIndex - 1]
    },
  },
  actions: {
    /** 存储历史记录 */
    saveHistory(data: PageNode[]) {
      const cloneNode = cloneDeep(data)
      if (this.currentIndex > 0) {
        this.history.splice(0, this.currentIndex)
        this.currentIndex = 0
      }
      this.history.unshift(cloneNode)
      this.history.length = Math.min(this.history.length, maxHistoryLen)
      this.isSave = false
    },
    /** 撤回 */
    undoHistory() {
      this.currentIndex++
      this.isSave = false
      return cloneDeep(this.history[this.currentIndex])
    },
    /** 重做 */
    redoHistory() {
      this.currentIndex--
      this.isSave = false
      return cloneDeep(this.history[this.currentIndex])
    },
    setIsSave() {
      this.isSave = true
    }
  },
})

window.addEventListener('beforeunload', (event) => {
  const historyStore = useHistoryStore()
  if (historyStore && !historyStore.isSave) {
    event.preventDefault()
    event.returnValue = ''
  }
});