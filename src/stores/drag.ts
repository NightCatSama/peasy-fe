import { PageNode } from '@/config'
import { defineStore } from 'pinia'

export const useDragStore = defineStore('drag', {
  state: () => ({
    /** 当前拖拽中的组件，如果是 move 模式，则只为拖拽元素的父节点 */
    dragNode: null as (PageNode | null),
    dragParentNode: null as (PageNode | null),
    /**
     * 当前拖拽的类型
     * clone: 从物料库拖拽出来
     * move: 从页面拖拽出来
     */
    dragType: 'clone' as 'clone' | 'move',
    /** 当前所处的拖拽空间 */
    dropZone: null as PageNode | null,
    /** 是否取消拖拽 */
    isCancelDrag: false,
  }),
  getters: {
    /** 当前拖拽组件的类型 */
    dragNodeType: (state) => state.dragNode?.type,
    /** 当前拖拽组件的组件名列表（包含子组件） */
    dragNodeChildNameMap: (state): { [key: string]: PageNode } => {
      if (state.dragNode === null || state.dragType !== 'move') return {}
      const nameMap: { [key: string]: PageNode } = {
        [state.dragNode.name]: state.dragNode,
      }
      const dfs = (nodes: PageNode[]) => {
        nodes.forEach((item) => {
          nameMap[item.name] = item
          if (item.children) dfs(item.children)
        })
      }
      dfs(state.dragNode.children || [])
      return nameMap
    },
    /** 判断该组件名是否在拖拽组件中 */
    getIsInDragNode: function() {
      return (name: string) => this.dragNodeChildNameMap[name]
    }
  },
  actions: {
    setDragNode(node: PageNode | null, dragType?: 'clone' | 'move') {
      this.dragNode = node
      this.dragType = dragType || 'clone'
      this.dropZone = null
      this.isCancelDrag = false
    },
    setDropZone(node: PageNode | null) {
      this.dropZone = node
    },
    setIsCancelDrag(isCancelDrag: boolean) {
      this.isCancelDrag = isCancelDrag
    }
  },
})
