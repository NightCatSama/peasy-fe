import { defineStore } from 'pinia'
import { mande } from 'mande'
import { cloneDeep } from 'lodash'
import { getMockBlock, getMockText } from '@/utils/mock'
import { PageNode, ComponentPropsGroup, ComponentName } from '@/config'
import { useDragStore } from './drag'
import { formatNodeByUniqueName } from '@/utils/node'

const api = mande('http://localhost:3030/api/page')

type MaterialData = {
  [key in PageNode['type']]: PageNode[]
}

export const usePageStore = defineStore('page', {
  state: () => ({
    allPageData: [] as PageNode[],
    // 当前激活的节点
    activeNode: null as PageNode | null,
    // 当前激活的节点的父节点
    activeParentNode: null as PageNode | null,
    // 当前激活的节点到最顶层的节点链
    activeParentChain: [] as PageNode[],
    /** 物料数据 */
    materialData: {
      section: [],
      component: [],
      template: [],
    } as MaterialData,
    /** 当前展示的 Section，null 为全部 */
    activeSection: null as string | null,
  }),
  getters: {
    /** 当前激活节点对应的配置数据 */
    activeNodeGroups: (state) =>
      state.activeNode ? ComponentPropsGroup[state.activeNode.component as ComponentName] : null,
    isActiveAllSection: (state) => state.activeSection === null,
    /** 当前预览的展示数据 */
    pageData: (state): typeof state.allPageData => {
      if (!state.activeSection) return state.allPageData

      const pageData = state.allPageData.find((item) => item.name === state.activeSection)
      return pageData ? [pageData] : state.allPageData
    },
    /** 所有组件的命名列表 */
    nameMap: (state): { [key: string]: PageNode } => {
      const nameMap: { [key: string]: PageNode } = {}
      const dfs = (nodes: PageNode[]) => {
        nodes.forEach((item) => {
          nameMap[item.name] = item
          if (item.children) dfs(item.children)
        })
      }
      dfs(state.allPageData)
      return nameMap
    },
    getActiveNodeRound:
      (state) =>
      (change: number): PageNode | null => {
        if (!state.activeNode) return null
        const nodeList =
          state.activeNode.type === 'section' ? state.allPageData : state.activeParentNode?.children
        if (!nodeList || nodeList.length === 0) return null
        const index = nodeList?.indexOf(state.activeNode)!
        if (index === -1) return null
        const newIndex = index + change
        if (newIndex < 0 || newIndex >= nodeList!.length) return null
        return nodeList![newIndex]
      },
  },
  actions: {
    async getPageData() {
      // const { data } = await api.post<any>({})
      this.allPageData = [getMockBlock('section')]
    },
    async getAssetsData() {
      // const { data } = await api.post<any>({})
      const data = {
        section: [
          getMockBlock('section', 'Section-1'),
          getMockBlock('section', 'Section-2'),
          getMockBlock('section', 'Section-3'),
        ],
        component: [getMockText(), getMockBlock()],
        template: [],
      }
      this.materialData = data
    },
    async download() {
      const data = this.allPageData
      const res = await api.post<any>({
        data,
      })
      return res
    },
    /** 插入 Component 组件 */
    insertNode(dragNode: PageNode, parentNode: PageNode, index: number) {
      parentNode.children?.splice(index, 0, formatNodeByUniqueName(dragNode, this.nameMap))
    },
    /**
     * 拖拽交换两个 Component 组件的位置，放置的新位置为 DragStore 的 dropZone
     * @param parentNode 旧组件的父组件
     * @param index 旧组件的索引
     * @param targetIndex 组件的新索引
     */
    swapNode(parentNode: PageNode, index: number, targetIndex: number) {
      const dropZone = useDragStore().dropZone
      if (!parentNode?.children || !dropZone?.children) return

      const node = parentNode.children[index]
      if (!node) return

      parentNode.children.splice(index, 1)
      dropZone.children.splice(targetIndex, 0, node)
    },
    /** 添加 Section */
    addSection(node: PageNode, index?: number) {
      const insertIndex = index ?? this.allPageData.length
      this.allPageData.splice(insertIndex, 0, formatNodeByUniqueName(node, this.nameMap))
    },
    /** 移除 Section */
    removeSection(node: PageNode) {
      const index = this.allPageData.indexOf(node)
      this.allPageData.splice(index, 1)
    },
    /** 交换两个 Section 的位置 */
    swapSection(index: number, targetIndex: number) {
      const node = this.allPageData[index]
      this.allPageData.splice(index, 1)
      this.allPageData.splice(targetIndex, 0, node)
    },
    /** 设置当前激活节点 */
    setActiveNode(node?: PageNode | null, parent?: PageNode | null) {
      this.activeNode = node || null
      this.activeParentNode = parent || null
      this.activeParentChain.length = 0
    },
    /** 设置当前激活节点的父节点设置为激活节点 */
    setActiveParentNodeToActive() {
      if (!this.activeParentNode) return
      this.activeNode = this.activeParentNode
      this.activeParentChain.shift()
      this.activeParentNode = this.activeParentChain?.[0] || null
    },
    setActiveNodeToRound(change: number) {
      const node = this.getActiveNodeRound(change)
      if (node) {
        this.activeNode = node
      }
    },
    /** 添加节点链 */
    addActiveParentChain(node: PageNode) {
      this.activeParentChain.push(node)
    },
    /** 移除当前节点 */
    deleteActiveNode() {
      if (!this.activeNode) return
      if (this.activeNode.type === 'section') {
        if (this.activeNode.name === this.activeSection) {
          this.activeSection = null
        }
        this.removeSection(this.activeNode)
      } else {
        const index = this.activeParentNode?.children?.indexOf(this.activeNode)!
        this.activeParentNode?.children?.splice(index, 1)
        // 若仍存在同层节点，则自动切换过去
        if (this.activeParentNode?.children?.length) {
          this.activeNode = this.activeParentNode.children[Math.max(0, index - 1)]
          return
        }
      }
      this.activeNode = null
      this.activeParentNode = null
      this.activeParentChain = []
    },
    /** 复制当前激活节点 */
    copyActiveNode() {
      if (!this.activeNode) return
      if (this.activeNode.type === 'section') {
        this.addSection(this.activeNode)
      } else if (this.activeParentNode) {
        const index = this.activeParentNode?.children?.indexOf(this.activeNode)
        this.insertNode(
          this.activeNode,
          this.activeParentNode,
          index !== void 0 ? index + 1 : this.activeParentNode?.children?.length!
        )
      }
    },
    /** 设置当前展示的 Section */
    setActiveSection(node: PageNode | null) {
      this.activeSection = node ? node.name : null
    },
  },
})
