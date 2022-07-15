import { defineStore } from 'pinia'
import { mande } from 'mande'
import { cloneDeep } from 'lodash'
import { getMockBlock } from '@/utils/mock'
import { getConfig } from '@/config'

const api = mande('http://192.168.2.161:3030/api/page')

type ModelData = {
  [key in CNode['type']]: CNode[]
}

export const usePageStore = defineStore('page', {
  state: () => ({
    allPageData: [] as CNode[],
    activeNode: null as CNode | null,
    modelData: {
      section: [],
      component: [],
      template: [],
    } as ModelData,
    /** 当前展示的 Section，null 为全部 */
    activeSection: null as string | null,
  }),
  getters: {
    activeConfigData: (state) => (state.activeNode ? getConfig(state.activeNode) : null),
    isActiveAllSection: (state) => state.activeSection === null,
    pageData: (state): typeof state.allPageData => {
      if (!state.activeSection) return state.allPageData

      const pageData = state.allPageData.find((item) => item.name === state.activeSection)
      return pageData ? [pageData] : state.allPageData
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
        component: [],
        template: [],
      }
      this.modelData = data
    },
    addSection(node: CNode, index?: number) {
      const insertIndex = index ?? this.allPageData.length
      this.allPageData.splice(insertIndex, 0, cloneDeep(node))
    },
    removeSection(node: CNode) {
      const index = this.allPageData.indexOf(node)
      this.allPageData.splice(index, 1)
    },
    setActiveNode(node: CNode) {
      this.activeNode = node
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
