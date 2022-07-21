import { defineStore } from 'pinia'
import { mande } from 'mande'
import { cloneDeep } from 'lodash'
import { getMockBlock, getMockText } from '@/utils/mock'
import { PageNode, ComponentGroup, ComponentName } from '@/config'
import { useDragStore } from './drag'
import { formatNodeByUniqueName } from '@/utils/node'

const api = mande('http://localhost:3030/api/page')

type ModelData = {
  [key in PageNode['type']]: PageNode[]
}

export const usePageStore = defineStore('page', {
  state: () => ({
    allPageData: [] as PageNode[],
    activeNode: null as PageNode | null,
    activeParentNode: null as PageNode | null,
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
      state.activeNode ? ComponentGroup[state.activeNode.component as ComponentName] : null,
    isActiveAllSection: (state) => state.activeSection === null,
    pageData: (state): typeof state.allPageData => {
      if (!state.activeSection) return state.allPageData

      const pageData = state.allPageData.find((item) => item.name === state.activeSection)
      return pageData ? [pageData] : state.allPageData
    },
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
      this.modelData = data
    },
    async download() {
      const data = this.allPageData
      const res = await api.post<any>({
        data,
      })
      return res
    },
    insertNode(dragNode: PageNode, parentNode: PageNode, index: number) {
      parentNode.children?.splice(index, 0, formatNodeByUniqueName(dragNode, this.nameMap))
    },
    swapNode(parentNode: PageNode, index: number, targetIndex: number) {
      const dropZone = useDragStore().dropZone
      if (!parentNode?.children || !dropZone?.children) return

      const node = parentNode.children[index]
      if (!node) return

      parentNode.children.splice(index, 1)
      dropZone.children.splice(targetIndex, 0, node)
    },
    addSection(node: PageNode, index?: number) {
      const insertIndex = index ?? this.allPageData.length
      this.allPageData.splice(insertIndex, 0, formatNodeByUniqueName(node, this.nameMap))
    },
    removeSection(node: PageNode) {
      const index = this.allPageData.indexOf(node)
      this.allPageData.splice(index, 1)
    },
    swapSection(index: number, targetIndex: number) {
      const node = this.allPageData[index]
      this.allPageData.splice(index, 1)
      this.allPageData.splice(targetIndex, 0, node)
    },
    setActiveNode(node?: PageNode | null, parent?: PageNode | null) {
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
        this.activeParentNode?.children?.splice(
          this.activeParentNode?.children?.indexOf(this.activeNode),
          1
        )
      }
      this.activeNode = null
    },
    copyActiveNode() {
      if (!this.activeNode) return
      if (this.activeNode.type === 'section') {
        this.addSection(this.activeNode)
      } else if (this.activeParentNode) {
        const index = this.activeParentNode?.children?.indexOf(this.activeNode)
        this.insertNode(
          this.activeNode,
          this.activeParentNode,
          index !== void 0 && index > -1 ? index : this.activeParentNode?.children?.length!
        )
      }
    },
    setActiveSection(node: PageNode | null) {
      this.activeSection = node ? node.name : null
    },
  },
})
