import { PageNode } from '@/config'
import { cloneDeep } from 'lodash-es'
import { v4 as uuidv4 } from 'uuid'

/** 生成唯一的节点 name */
const createUnitID = (): string => {
  return uuidv4()
}

/**
 * 将节点和子节点的名字设置为唯一的
 * @param node 节点
 * @param idMap 已存在的 id 映射
 */
export const formatNodeByUniqueName = (
  originNode: PageNode,
  idMap: { [key: string]: PageNode },
  /** 是否链接到原组件，适用于复制组件 */
  isLinkProp: boolean = false,
  removeChildren: boolean = false
): PageNode => {
  const newNode = cloneDeep(originNode)
  if (removeChildren) {
    newNode.children = []
  }
  let pendingNodeList = [newNode]

  // 全部的节点
  let allChildNode = []
  // 名字更新列表
  let idUpdateMap: { [originId: string]: string } = {}

  while (pendingNodeList.length) {
    const node = pendingNodeList.shift()!
    allChildNode.push(node)
    if (node.id in idMap) {
      const originId = node.id

      // 生成一个新的唯一名字，并记录新的名字
      node.id = createUnitID()
      idUpdateMap[originId] = node.id

      // 链接到原组件
      if (isLinkProp) {
        // 如果组件本身是链接组件，则继承特殊配置
        node.config = node.propLink && node.config ? node.config : ({ props: {} } as any)
        node.propLink = node.propLink || originId
      }

      // TODO: delete
      idMap[node.id] = node
    } else {
      node.id = createUnitID()
    }
    if (node.children) {
      pendingNodeList = pendingNodeList.concat(node.children)
    }
  }

  if (!isLinkProp) {
    allChildNode.forEach((node) => {
      if (node.propLink) {
        node.propLink = idUpdateMap[node.propLink] || node.propLink
      }
    })
  }

  return newNode
}

/**
 * 判断当前组件是否是容器组件
 * NOTE: isContainer 暂不支持自定义容器组件，后续支持可去掉 Block 的判断
 */
export const isContainerNode = (node: PageNode): boolean => {
  return node.component === 'Block' || !!node.isContainer
}
