import { defineStore } from 'pinia'
import { mande } from 'mande'
import { cloneDeep } from 'lodash'
import { getMockBlock, getMockText } from '@/utils/mock'
import { ComponentGroup } from '@/config'
import { useDragStore } from './drag'
import { formatNodeByUniqueName } from '@/utils/node'

const api = mande('http://localhost:3030/api/page')

type ModelData = {
  [key in CNode['type']]: CNode[]
}

export const usePageStore = defineStore('page', {
  state: () => ({
    allPageData: [] as CNode[],
    activeNode: null as CNode | null,
    activeParentNode: null as CNode | null,
    modelData: {
      section: [],
      component: [],
      template: [],
    } as ModelData,
    /** 当前展示的 Section，null 为全部 */
    activeSection: null as string | null,
  }),
  getters: {
    activeNodeGroups: (state) =>
      state.activeNode ? ComponentGroup[state.activeNode.component] : null,
    isActiveAllSection: (state) => state.activeSection === null,
    pageData: (state): typeof state.allPageData => {
      if (!state.activeSection) return state.allPageData

      const pageData = state.allPageData.find((item) => item.name === state.activeSection)
      return pageData ? [pageData] : state.allPageData
    },
    nameMap: (state): { [key: string]: CNode } => {
      const nameMap: { [key: string]: CNode } = {}
      const dfs = (nodes: CNode[]) => {
        nodes.forEach((item) => {
          nameMap[item.name] = item
          if (item.children) dfs(item.children)
        })
      }
      dfs(state.allPageData)
      return nameMap
    }
  },
  actions: {
    async getPageData() {
      // const { data } = await api.post<any>({})
      this.allPageData = []
    },
    async getAssetsData() {
      // const { data } = await api.post<any>({})
      const data = {
        section: [getMockBlock('section', 'Section-1'), getMockBlock('section', 'Section-2'), getMockBlock('section', 'Section-3')],
        component: [getMockText(), getMockBlock()],
        template: [],
      }
      this.modelData = data
    },
    async download() {
      const data = this.allPageData
      const res = await api.post<any>({
        data,
      })
      return res
    },
    insertDragNode(dragNode: CNode, parentNode: CNode, index: number) {
      parentNode.children?.splice(index, 0, formatNodeByUniqueName(dragNode, this.nameMap))
    },
    swapNode(parentNode: CNode, index: number, targetIndex: number) {
      const dropZone = useDragStore().dropZone
      if (!parentNode?.children || !dropZone?.children) return

      const node = parentNode.children[index]
      if (!node) return

      parentNode.children.splice(index, 1)
      dropZone.children.splice(targetIndex, 0, node)
    },
    addSection(node: CNode, index?: number) {
      const insertIndex = index ?? this.allPageData.length
      this.allPageData.splice(insertIndex, 0, formatNodeByUniqueName(node, this.nameMap))
    },
    removeSection(node: CNode) {
      const index = this.allPageData.indexOf(node)
      this.allPageData.splice(index, 1)
    },
    swapSection(index: number, targetIndex: number) {
      const node = this.allPageData[index]
      this.allPageData.splice(index, 1)
      this.allPageData.splice(targetIndex, 0, node)
    },
    setActiveNode(node?: CNode | null, parent?: CNode | null) {
      this.activeNode = node || null
      this.activeParentNode = parent || null
    },
    deleteActiveNode() {
      if (!this.activeNode) return
      if (this.activeNode.type === 'section') {
        if (this.activeNode.name === this.activeSection) {
          this.activeSection = null
        }
        this.removeSection(this.activeNode)
      } else {
        this.activeParentNode?.children?.splice(this.activeParentNode?.children?.indexOf(this.activeNode), 1)
        this.activeNode = null
      }
    },
    setActiveSection(node: CNode | null) {
      this.activeSection = node ? node.name : null
    },
  },
})
