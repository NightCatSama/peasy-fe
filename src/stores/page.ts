import { defineStore } from 'pinia'
import { mande } from 'mande'
import { getMockBlock, getMockIcon, getMockImage, getMockText } from '@/utils/mock'
import { PageNode, ComponentPropsGroup, ComponentName } from '@/config'
import { useDragStore } from './drag'
import { formatNodeByUniqueName } from '@/utils/node'
import { nextTick } from 'vue'

const api = mande('http://localhost:3030/api/page')

type MaterialData = {
  [key in PageNode['type']]: PageNode<any>[]
}

/** 模拟后端返回的页面数据 */
const MockPageData = {
  /** 页面数据 */
  pageData: [getMockBlock('section')],
  /** 颜色变量 */
  colorVars: [
    { name: '$primary', color: '#00a8ff' },
    { name: '$error', color: 'red' },
  ],
  /** 全局设置 */
  setting: {
    /** 页面标题 */
    title: 'Your Page Title',
    /** 页面图标 */
    favicon: '',
    /** meta 标签展示，用于 SEO 优化 */
    description: '',
  },
  /** 全局的字体设置 */
  font: {
    fontFamily: `'ZCOOL XiaoWei', PingFang SC, sans-serif`,
    /** 自定义字体 */
    customFontFace: [
      'https://fonts.googleapis.com/css2?family=ZCOOL+XiaoWei&display=swap',
      // {
      //   fontFamily: 'Lobster',
      //   url: 'https://fonts.gstatic.com/s/lobster/v28/neILzCirqoswsqX9zo-mM4MwWJXNqA.woff2',
      //   fontStyle: 'normal',
      //   fontWeight: 'normal',
      // }
    ],
    /** 全局的字体大小 */
    // fontSize: '14px',
    fontSize: {
      '980': '12px',
      '1920': '16px',
      '2560': '20px',
    },
  },
}

export const usePageStore = defineStore('page', {
  state: () => ({
    /** 所有页面数据 */
    allPageData: [] as PageNode<any>[],
    /** 每个节点对应的参数配置 */
    // propData: {},
    /** 当前激活的节点 */
    activeNode: null as PageNode | null,
    /** 当前激活的节点到最顶层的节点链 */
    activeParentChain: [] as PageNode[],
    /** 物料数据 */
    materialData: {
      section: [],
      component: [],
      template: [],
    } as MaterialData,
    /** 当前展示的 Section，null 为全部 */
    activeSection: null as PageNode | null,
    /** 颜色变量 */
    colorVars: [] as IColorVarItem[],
    /** 全局字体配置 */
    font: MockPageData.font as IFontSetting,
    setting: MockPageData.setting as IPageSetting,
  }),
  getters: {
    /** 当前激活节点对应的配置数据 */
    activeNodeGroups: (state) =>
      state.activeNode
        ? state.activeNode.isModule
          ? new Array(state.activeNode?.moduleConfig?.length || 0).fill('custom')
          : ComponentPropsGroup[state.activeNode.component as ComponentName]
        : null,
    isActiveAllSection: (state) => state.activeSection === null,
    /** 当前预览的展示数据 */
    pageData: (state): typeof state.allPageData => {
      if (!state.activeSection) return state.allPageData

      const pageData = state.allPageData.find((item) => item === state.activeSection)
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
    getTagsByNode:
      (state): ((node: PageNode[]) => string[]) =>
      (node: PageNode[]) => {
        const tagList: string[] = []
        const dfs = (nodes: PageNode[]) => {
          nodes.forEach((item) => {
            tagList.push(...item.tags)
            if (item.children) dfs(item.children)
          })
        }
        dfs(node)
        return Array.from(new Set(tagList))
      },
    getAllTags: function (state) {
      return () => this.getTagsByNode(state.allPageData)
    },
    getActiveNodeRound: function (state) {
      return (change: number): PageNode | null => {
        if (!state.activeNode) return null
        const nodeList =
          state.activeNode.type === 'section' ? state.allPageData : this.activeParentNode?.children
        if (!nodeList || nodeList.length === 0) return null
        const index = nodeList?.indexOf(state.activeNode)!
        if (index === -1) return null
        const newIndex = index + change
        if (newIndex < 0 || newIndex >= nodeList!.length) return null
        return nodeList![newIndex]
      }
    },
    getAllChildNode:
      (state) =>
      (node: PageNode): PageNode[] => {
        if (!node.children) return []
        const children = [...node.children]
        let i = 0
        while (i < children.length) {
          if (children[i]?.children?.length) {
            children.push(...children[i]?.children!)
          }
          i++
        }
        return children
      },
    activeParentNode: (state) => state.activeParentChain?.[0] || null,
    activeNodeHide: (state) => state.activeNode?.props.common.hide || false,
  },
  actions: {
    async getPageData() {
      // const { data } = await api.post<any>({})
      this.allPageData = MockPageData.pageData
      this.colorVars = MockPageData.colorVars
    },
    async getAssetsData() {
      // const { data } = await api.post<any>({})
      const data = {
        section: [
          getMockBlock('section', 'Section-1'),
          getMockBlock('section', 'Section-2'),
          getMockBlock('section', 'Section-3'),
        ],
        component: [getMockText(), getMockBlock(), getMockImage(), getMockIcon()],
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
      const newNode = formatNodeByUniqueName(dragNode, this.nameMap)
      parentNode.children?.splice(index, 0, newNode)
      return newNode
    },
    /**
     * 拖拽交换两个 Component 组件的位置，放置的新位置为 DragStore 的 dropZone
     * @param parentNode 旧组件的父组件
     * @param index 旧组件的索引
     * @param targetIndex 组件的新索引
     */
    swapNode(parentNode: PageNode, index: number, targetIndex: number) {
      const dropZone = useDragStore().dropZone
      if (!parentNode?.children || !dropZone?.children || dropZone.isModule) return

      const node = parentNode.children[index]
      if (!node) return

      parentNode.children.splice(index, 1)
      dropZone.children.splice(targetIndex, 0, node)
    },
    /** 添加 Section */
    addSection(node: PageNode, index?: number) {
      const insertIndex = index ?? this.allPageData.length
      const newSection = formatNodeByUniqueName(node, this.nameMap)
      this.allPageData.splice(insertIndex, 0, newSection)
      return newSection
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
      if (this.activeNode === node) return
      this.activeNode = node || null
      this.activeParentChain.length = 0
    },
    /** 设置当前激活节点的父节点设置为激活节点 */
    setActiveParentNodeToActive() {
      if (!this.activeParentNode) return
      this.activeNode = this.activeParentNode
      this.activeParentChain.shift()
    },
    setActiveNodeToRound(change: number) {
      const node = this.getActiveNodeRound(change)
      if (node) {
        if (this.activeSection === this.activeNode) {
          this.activeSection = node
          nextTick(() => (this.activeNode = node))
        } else {
          this.activeNode = node
        }
      }
    },
    /** 添加节点链 */
    addActiveParentChain(node: PageNode) {
      // 如果激活的是 Module 内的子节点，则将设置为激活 Module 节点
      if (node.isModule && !this.activeNode?.isModule) {
        this.activeNode = node
        this.activeParentChain.length = 0
      } else {
        !this.activeParentChain.includes(node) && this.activeParentChain.push(node)
      }
    },
    /** 移除当前节点 */
    deleteActiveNode() {
      if (!this.activeNode) return
      if (this.activeNode.type === 'section') {
        if (this.activeNode === this.activeSection) {
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
      this.activeParentChain = []
    },
    /** 复制当前激活节点 */
    copyActiveNode() {
      if (!this.activeNode) return
      if (this.activeNode.type === 'section') {
        this.addSection(this.activeNode)
      } else if (this.activeParentNode) {
        const index = this.activeParentNode?.children?.indexOf(this.activeNode)
        const newNode = this.insertNode(
          this.activeNode,
          this.activeParentNode,
          index !== void 0 ? index + 1 : this.activeParentNode?.children?.length!
        )
        nextTick(() => (this.activeNode = newNode))
      }
    },
    /** 设置当前展示的 Section */
    setActiveSection(node: PageNode | null) {
      this.activeSection = node
    },
    separateActiveNode() {
      if (!this.activeNode) return
      this.activeNode.isModule = false
      delete this.activeNode.moduleConfig
    },
    updateAllPageNode(pageNode: PageNode[]) {
      this.allPageData = pageNode
      const newNameMap = this.nameMap
      if (this.activeNode) {
        this.activeNode = newNameMap[this.activeNode.name]
      }
      if (this.activeSection) {
        this.activeSection = newNameMap[this.activeSection.name]
      }
      if (this.activeParentChain.length) {
        this.activeParentChain = this.activeParentChain.map((node) => newNameMap[node.name])
      }
    },
    setActiveNodeHide(hide: boolean) {
      if (!this.activeNode) return
      this.activeNode.props.common.hide = hide
    }
  },
})
