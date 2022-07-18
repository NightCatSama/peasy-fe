import { defineStore } from 'pinia'
import { mande } from 'mande'
import { cloneDeep } from 'lodash'
import { getMockBlock, getMockText } from '@/utils/mock'
import { ComponentGroup } from '@/config'

const api = mande('http://localhost:3030/api/page')

type ModelData = {
  [key in CNode['type']]: CNode[]
}

const getUnitName = (originName: string, nameMap: { [key: string]: CNode }): string => {
  let name = originName
  let i = 1
  while (nameMap[name]) {
    name = `${originName}-${i}`
    i++
  }
  return name
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
    /** 当前拖拽中的组件 */
    dragNode: null as CNode | null,
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
        section: [getMockBlock('section'), getMockBlock('section'), getMockBlock('section')],
        component: [getMockText(), getMockBlock()],
        template: [],
      }
      this.modelData = data
    },
    setDragNode(node: CNode | null) {
      this.dragNode = node
    },
    insertDragNode(parentNode: CNode, index: number) {
      if (!this.dragNode) return
      console.log('this.dragNode => ', this.dragNode)
      let name = getUnitName(this.dragNode.name, this.nameMap)
      parentNode.children?.splice(index, 0, cloneDeep({ ...this.dragNode, name }))
      this.dragNode = null
    },
    swapNode(parentNode: CNode, index: number, targetIndex: number) {
      if (!parentNode.children) return
      const node = parentNode.children[index]
      parentNode.children.splice(index, 1)
      parentNode.children.splice(targetIndex, 0, node)
    },
    addSection(node: CNode, index?: number) {
      const insertIndex = index ?? this.allPageData.length
      let name = getUnitName(node.name, this.nameMap)
      this.allPageData.splice(insertIndex, 0, cloneDeep({ ...node, name }))
    },
    addComponent(node: CNode) {
    },
    removeSection(node: CNode) {
      const index = this.allPageData.indexOf(node)
      this.allPageData.splice(index, 1)
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
    async download() {
      const data = this.allPageData
      const res = await api.post<any>({
        data,
      })
      return res
    },
    setActiveSection(node: CNode | null) {
      this.activeSection = node ? node.name : null
    },
  },
})
