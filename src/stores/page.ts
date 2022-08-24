import { defineStore } from 'pinia'
import { getMockBlock, getMockImage, getMockText, getMockIcon } from '@/utils/mock'
import {
  PageNode,
  ComponentPropsGroup,
  ComponentName,
  GroupType,
  IPage,
  IMaterialItem,
  DataType,
} from '@/config'
import { useDragStore } from './drag'
import { formatNodeByUniqueName } from '@/utils/node'
import {
  useConfig,
  useGroupConfig,
  isMobileGroupConfig,
  useMobileConfig,
  useGroupConfigByNode,
} from '@/utils/config'
import { nextTick } from 'vue'
import { cloneDeep, merge } from 'lodash-es'
import { downloadApi, materialApi, projectApi } from '@/utils/mande'
import { SaveProjectDto } from '@@/dto/data.dto'
import { Project } from '@@/entities/project.entity'
import { IResponse } from '@@/types/response'
import { getStoragePageState } from '.'
import { Alert } from '@/utils/alert'
import { $t } from '@/constants/i18n'
import { copyToClipboard, getClipboardText } from '@/utils/clipboard'
import { Modal } from '@/components/modal'

type MaterialData = {
  [key in PageNode['type']]: IMaterialItem[]
}

let prevCutNode: PageNode | null = null

export const usePageStore = defineStore('page', {
  state: () =>
    getStoragePageState('', {
      project: { name: '', cover: '' } as IProject,
      /** 所有页面数据 */
      allPageData: [] as PageNode<any>[],
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
      colorVars: [{ name: '$primary', color: '#3e7ce8' }] as IColorVarItem[],
      /** 全局设置 */
      setting: {
        client: 'both',
        /** 页面标题 */
        title: 'Page Title',
        /** 页面图标 */
        favicon: '',
        /** meta 标签展示，用于 SEO 优化 */
        description: '',
      } as IPageSetting,
      /** 全局的字体设置 */
      font: {
        fontFamily: `'Lato', -apple-system, PingFang SC, "Helvetica Neue", sans-serif`,
        /** 自定义字体 */
        customFontFace: ['https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&display=swap'],
        /** 全局的字体大小 */
        fontSize: 20,
        mediaFontSize: {},
      } as IFontSetting,
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
    /** 获取组件的 Tag 列表（包含子组件） */
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
    /** 获取页面的全部 Tag */
    getAllTags: function (state) {
      return () => this.getTagsByNode(state.allPageData)
    },
    /** 当前激活组件的邻组件 */
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
    /** 获得传入组件的所有子组件 */
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
    /** 当前激活组件的父组件 */
    activeParentNode: (state) => state.activeParentChain?.[0] || null,
    /** 当前激活组件是否隐藏 */
    activeNodeHide: (state) =>
      state.activeNode ? useGroupConfig(state.activeNode, 'common').hide || false : false,
    getMaterialByMaterialId: (state) => (materialId: string): IMaterialItem | void => {
      const { section, component, template } = state.materialData
      return [
        ...(section || []),
        ...(component || []),
        ...(template || [])
      ].find((item) => item.id === materialId)
    }
  },
  actions: {
    /** 获取项目数据 */
    async getProjectData(id: string) {
      const { data } = await projectApi.get<IResponse<Project>>('' + id)
      const pageData = data.page
      this.project.name = data.name
      this.project.cover = data.cover
      this.allPageData = pageData.pageData
      this.colorVars = pageData.colorVars
      this.font = pageData.font
      this.setting = pageData.setting
    },
    /** 保存项目数据 */
    async saveProjectData(id: string, params: IProject) {
      const body: SaveProjectDto = {
        name: params.name,
        cover: params.cover,
        page: {
          pageData: this.allPageData,
          /** 颜色变量 */
          colorVars: this.colorVars,
          /** 页面配置 */
          setting: this.setting,
          /** 字体配置 */
          font: this.font,
        },
      }
      const { data } = await projectApi.patch<IResponse<Project>>(id, body)
      this.project.name = data.name
      this.project.cover = data.cover
      return data
    },
    /** 加载物料资源 */
    async getAssetsData() {
      const res = await materialApi.get<any>('', {
        query: { section: true, component: true, template: false },
      })
      this.materialData = res.data
    },
    /** 下载页面 */
    async download() {
      const data = this.allPageData
      const res = await downloadApi.post<any>({
        data: {
          pageData: this.allPageData,
          colorVars: this.colorVars,
          font: this.font,
          setting: this.setting,
        } as IPage,
      })
      return res
    },
    /** 保存物料数据 */
    async fetchSaveMaterial(params: IMaterialItem) {
      const originNode = params.node
      const material = this.covertMaterialNode(params)
      const res = await materialApi.patch<IResponse<IMaterialItem>>(material)
      const list = this.materialData?.[material.type]
      if (list) {
        if (material.id) {
          this.materialData[material.type] = list.map((item) => {
            // 更新物料数据
            if (item.id === material.id) {
              return res.data
            }
            return item
          })
        } else {
          this.materialData[material.type].push(res.data)
        }
      }
      return res.data
    },
    /** 删除单个物料数据 */
    async deleteMaterial(id: string) {
      await materialApi.delete(id)
      Object.values(this.materialData).forEach((list: IMaterialItem[]) => {
        const index = list?.findIndex((item) => item.id === id)
        if (index > -1) {
          list.splice(index, 1)
        }
      })
    },
    /** 载入模板数据 */
    async loadTemplateData(materialId: string) {
      const res = await materialApi.get<IResponse<IMaterialItem>>(materialId)
      const { page } = res.data
      if (page) {
        this.allPageData = page.pageData
        this.colorVars = page.colorVars
        this.font = page.font
        this.setting = page.setting
      }
    },
    /** 插入 Component 组件 */
    insertNode(dragNode: PageNode, parentNode: PageNode, index: number, isLinkProp = false) {
      const newNode = this.handleInsertNode(formatNodeByUniqueName(dragNode, this.nameMap, isLinkProp))
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
      const newSection = this.handleInsertNode(formatNodeByUniqueName(node, this.nameMap))
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
    /** 设置当前激活节点的子节点设置为激活节点 */
    setActiveNodeChildrenToActive() {
      if (!this.activeNode || !this.activeNode?.children?.length) return
      this.activeParentChain.unshift(this.activeNode)
      this.activeNode = this.activeNode.children[0]
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
        this.removeNode(this.activeNode)
        this.removeSection(this.activeNode)
      } else {
        const index = this.activeParentNode?.children?.indexOf(this.activeNode)!
        this.removeNode(this.activeNode)
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
    /** 移除一个组件 */
    removeNode(node: PageNode) {
      const children = [node].concat(this.getAllChildNode(node))
      // 当移除的组件有其他组件链接，则移除链接关系
      Object.values(this.nameMap).forEach((obj: PageNode) => {
        const deleteNode = children.find((c) => c.name === obj.propLink)
        if (deleteNode) {
          obj.propLink = ''
          obj.config = merge({}, cloneDeep(deleteNode.config), obj.config)
        }
      })
    },
    /** 复制当前激活节点 */
    copyActiveNode() {
      if (!this.activeNode) return
      const node = this.activeNode
      const parentNode = this.activeParentNode
      const index =
        node.type === 'section'
          ? this.allPageData?.indexOf(node)
          : parentNode?.children?.indexOf(node)
      this.copyNode(node, parentNode, index)
    },
    /** 复制节点 */
    copyNode(node: PageNode, parentNode?: PageNode, index?: number, isLinkProp?: boolean) {
      if (node.type === 'section') {
        this.addSection(node, index !== void 0 ? index + 1 : this.allPageData.length)
      } else if (parentNode) {
        const newNode = this.insertNode(
          node,
          parentNode,
          index !== void 0 ? index + 1 : parentNode?.children?.length!,
          isLinkProp ? !node.isModule : false
        )
        nextTick(() => (this.activeNode = newNode))
      }
    },
    /** 设置当前展示的 Section */
    setActiveSection(node: PageNode | null) {
      this.activeSection = node
    },
    /** 去除 module 化 */
    separateActiveNode() {
      if (!this.activeNode) return
      this.activeNode.isModule = false
      // 不移除 moduleConfig，方便编辑
      // delete this.activeNode.moduleConfig
      Alert($t('ungroupTip'))
    },
    /** 更新所有页面数据 */
    updateAllPageNode(pageNode: PageNode[]) {
      // 先直接更新 allPageData 去更新 nameMap
      this.allPageData = pageNode
      const newNameMap = this.nameMap
      // 之后根据 name 去同步更新 activeNode 等节点
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
    /** 设置当前激活组件隐藏 */
    setActiveNodeHide(hide: boolean) {
      if (!this.activeNode) return
      if (useMobileConfig()) {
        if (!this.activeNode.config?.mobile) this.activeNode.config.mobile = {}
        if (!this.activeNode.config.mobile.common) this.activeNode.config.mobile.common = { hide }
        this.activeNode.config.mobile.common.hide = hide
      }
      if (!useMobileConfig()) {
        if (!this.activeNode.config.props.common) this.activeNode.config.props.common = { hide }
        this.activeNode.config.props.common.hide = hide
      }
    },
    /** 切换激活组件的配置模式，open 时则开启 mobile 单独配置 */
    switchActiveNodeConfigMode(groupType: GroupType) {
      if (!this.activeNode) return
      const currentOpen = isMobileGroupConfig(this.activeNode, groupType)
      const isLink =
        !!this.activeNode.propLink && groupType && !useGroupConfigByNode(this.activeNode, groupType)
      let config = isLink ? useConfig(this.activeNode) : this.activeNode.config
      if (!currentOpen) {
        if (!config.mobile) config.mobile = {} as any
        ;(config.mobile as any)[groupType] = cloneDeep(config.props[groupType])
      } else {
        delete config.mobile?.[groupType]
      }
    },
    /** 取消关联组件 */
    unlinkActiveNodeProp(includeChildren = false) {
      if (!this.activeNode) return
      const list: PageNode[] = [this.activeNode]
      while (list.length) {
        const node = list.shift()!
        const linkName = node.propLink
        if (!linkName) break
        const linkNode = this.nameMap[linkName]
        const linkNodeConfig = cloneDeep(linkNode.config)
        node.config = merge(linkNodeConfig, node.config)
        node.propLink = ''
        if (includeChildren && Array.isArray(node.children) && node.children.length > 0) {
          list.push(...node.children!)
        }
      }
    },
    /** 取消关联组件的某组配置 */
    unlinkActiveNodePropGroup(groupType: GroupType) {
      if (!this.activeNode) return
      const node = this.activeNode
      const linkName = node.propLink
      if (!linkName) return
      const linkNode = this.nameMap[linkName]
      if (!linkNode) return
      if (linkNode.config.mobile?.[groupType]) {
        if (!node.config.mobile) node.config.mobile = {} as any
        ;(node.config.mobile as any)[groupType] = cloneDeep(linkNode.config.mobile[groupType])
      }
      if (linkNode.config.props?.[groupType]) {
        ;(node.config.props as any)[groupType] = cloneDeep(linkNode.config.props[groupType])
      }
    },
    /** 设置媒体查询字号 */
    setMediaFontSize(width: number, fontSize: number) {
      if (this.font.mediaFontSize[width] && fontSize === 0) {
        delete this.font.mediaFontSize[width]
      }
      if (fontSize > 0) {
        this.font.mediaFontSize[width] = fontSize
      }
    },
    /** 转换物料组件，保存为物料时需要处理一下 propLink 等转换 */
    covertMaterialNode(material: IMaterialItem) {
      if (material.type === 'template') return material
      const node = this.covertNodeLinkToClear(material.node as PageNode)
      if (node.materialId) {
        node.materialId = ''
      }
      material.node = node
      return material
    },
    /** 将组件 propLink 清除 */
    covertNodeLinkToClear(originNode: PageNode): PageNode {
      const node = cloneDeep(originNode)
      const nodeList = [node, ...this.getAllChildNode(node)]
      const nodeNameMap: { [name: string]: PageNode } = {}
      const allNameMap = this.nameMap
      nodeList.forEach(n => nodeNameMap[n.name] = n)
      nodeList.forEach(n => {
        // 如果非链接组件，或链接组件在物料中，则不需要处理
        if (!n.propLink || nodeNameMap[n.propLink]) return
        // 否则需要解除链接，并将链接组件的配置合并到当前组件中
        if (allNameMap[n.propLink]) {
          n.config = merge({}, allNameMap[n.propLink].config, n.config)
          n.propLink = ''
        }
      })
      return node
    },
    /** 处理插入的组件 */
    handleInsertNode(node: PageNode) {
      // 若有依赖，则将依赖引入
      if (node.moduleDependence) {
        if (node.moduleDependence.customFontFace && !this.font.customFontFace.includes(node.moduleDependence.customFontFace)) {
          this.font.customFontFace.push(node.moduleDependence.customFontFace)
          Alert($t('fontFaceImportTip'))
        }
        if (node.moduleDependence.colorVars && node.moduleDependence.colorVars?.length > 0) {
          const addColorVars = node.moduleDependence.colorVars.filter(c1 =>
            !this.colorVars.find(c2 => c1.name === c2.name)
          )
          if (addColorVars.length > 0) {
            this.colorVars.push(...addColorVars)
            Alert($t('colorVarImportTip'))
          }
        }
        // 不移除依赖，以便于后续修复保留
        // delete node.moduleDependence
      }
      return node
    },
    /** 修改组件名称，若有组件链接此组件，则需要同步修改 */
    changeNodeName(node: PageNode, name: string) {
      if (!node) return
      for (let n in this.nameMap) {
        if (n !== node.name && this.nameMap[n].propLink === node.name) {
          this.nameMap[n].propLink = name
        }
      }
      node.name = name
    },
    /** 同步组件 Module 配置 */
    syncNodeModuleConfig() {
      if (!this.activeNode) return
      const node = this.activeNode
      const config = node.config
      if (!config || node.propLink || !node.materialId) return
      const material = this.getMaterialByMaterialId(node.materialId) as IMaterialItem
      if (material && material.node) {
        node.isModule = material.node.isModule
        node.moduleConfig = material.node.moduleConfig
      }
    },
    async copyActiveNodeToClipboard(cut?: boolean) {
      if (!this.activeNode) return
      const node = this.covertNodeLinkToClear(this.activeNode)
      const nodeText = JSON.stringify(node)
      await copyToClipboard(nodeText)
      if (cut) {
        prevCutNode = this.activeNode
        this.deleteActiveNode()
      }
    },
    async pasteClipboardNode(pasteToInside?: boolean) {
      if (!this.activeNode) return

      let node = this.activeNode
      let parentNode = this.activeParentNode
      let index
      // 粘贴到组件内部, 若当前选中组件不是容器组件，则按相邻组件粘贴处理
      if (pasteToInside && (node.component === 'Block' && node.children)) {
        parentNode = node
        index = node.children?.length
      } else {
        index =
          node.type === 'section'
            ? this.allPageData?.indexOf(node)
            : parentNode?.children?.indexOf(node)
      }
      try {
        const text = await getClipboardText()
        if (text) {
          let pasteNode = JSON.parse(text) as PageNode
          if (pasteNode.name && pasteNode.component) {
            if (
              // 不允许将普通组件当 section 插入
              (pasteNode.type === 'component' && !parentNode) ||
              // 不允许在 Module 中插入组件
              parentNode?.isModule
            ) return
            // 若粘贴的组件已经在项目中，则提示是否要链接到原组件
            const originNode = this.nameMap[pasteNode.name]
            let isLink = false
            if (
              originNode &&
              originNode.type === pasteNode.type &&
              originNode.component === pasteNode.component &&
              !originNode.isModule
              // await Modal.confirm($t('linkTipMsg'), { title: $t('linkTip') })
            ) {
              pasteNode = originNode
              isLink = true
            } else if (
              // 若粘贴的组件是被剪切的组件，且 name 一致，则直接移动
              prevCutNode &&
              !this.nameMap[prevCutNode.name] &&
              prevCutNode.name === pasteNode.name &&
              prevCutNode.component === pasteNode.component &&
              prevCutNode.type === pasteNode.type
            ) {
              pasteNode = prevCutNode
              isLink = true
            }
            this.copyNode(pasteNode, parentNode, index, isLink)
            prevCutNode = null
            return true
          }
        }
      } catch(e) {
      }
    }
  },
})
