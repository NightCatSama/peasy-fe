import { IMaterialItem, PageNode } from '@/config'
import { cloneDeep } from 'lodash-es'

/** 生成唯一的节点 name */
const createUnitName = (originName: string, nameMap: { [key: string]: PageNode }): string => {
  const matchObj = /(?<name>.*)-(?<index>\d+)$/.exec(originName)
  let baseName = matchObj?.groups?.name ?? originName
  let i = matchObj?.groups?.index ? parseInt(matchObj?.groups?.index) + 1 : 1
  let name = `${baseName}-${i}`
  while (nameMap[name]) {
    name = `${baseName}-${++i}`
  }
  return name
}

/**
 * 将节点和子节点的名字设置为唯一的
 * @param node 节点
 * @param nameMap 已存在的名字映射
 */
export const formatNodeByUniqueName = (
  originNode: PageNode,
  nameMap: { [key: string]: PageNode },
  /** 是否链接到原组件，适用于复制组件 */
  isLinkProp: boolean = false
): PageNode => {
  const newNode = cloneDeep(originNode)
  let pendingNodeList = [newNode]

  // 全部的节点
  let allChildNode = []
  // 名字更新列表
  let nameUpdatedMap: { [originName: string]: string } = {}

  while (pendingNodeList.length) {
    const node = pendingNodeList.shift()!
    allChildNode.push(node)
    if (node.name in nameMap) {
      const originName = node.name
      node.name = createUnitName(originName, nameMap)
      nameUpdatedMap[originName] = node.name
      // 链接到原组件
      if (isLinkProp) {
        // 如果组件本身是链接组件，则继承特殊配置
        node.config = node.propLink && node.config ? node.config : { props: {} } as any
        node.propLink = node.propLink || originName
      }
      nameMap[node.name] = node
    }
    if (node.children) {
      pendingNodeList = pendingNodeList.concat(node.children)
    }
  }

  if (!isLinkProp) {
    allChildNode.forEach(node => {
      if (node.propLink) {
        node.propLink = nameUpdatedMap[node.propLink] || node.propLink
      }
    })
  }
  return newNode
}
