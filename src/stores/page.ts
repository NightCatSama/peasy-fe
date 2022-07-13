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
    pageData: [] as CNode[],
    activeNode: null as CNode | null,
    modelData: {
      section: [],
      component: [],
      template: [],
    } as ModelData,
  }),
  getters: {
    activeConfigData: (state) => (state.activeNode ? getConfig(state.activeNode) : null),
  },
  actions: {
    async getPageData() {
      // const { data } = await api.post<any>({})
      this.pageData = []
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
      const insertIndex = index ?? this.pageData.length
      this.pageData.splice(insertIndex, 0, cloneDeep(node))
    },
    setActiveNode(node: CNode) {
      this.activeNode = node
    },
    async download() {
      const data = this.pageData
      const res = await api.post<any>({
        data,
      })
      return res
    },
  },
})
