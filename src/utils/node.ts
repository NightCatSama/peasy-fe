import { PageNode } from '@/config'
import { cloneDeep } from 'lodash'

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
  node: PageNode,
  nameMap: { [key: string]: PageNode }
): PageNode => {
  const newNode = cloneDeep(node)
  let pendingNodeList = [newNode]
  while (pendingNodeList.length) {
    const node = pendingNodeList.shift()!
    if (node.name in nameMap) {
      node.name = createUnitName(node.name, nameMap)
      nameMap[node.name] = node
    }
    if (node.children) {
      pendingNodeList = pendingNodeList.concat(node.children)
    }
  }
  return newNode
}
