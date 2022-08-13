import {
  ComponentName,
  ComponentPropsGroup,
  GroupType,
  IPropConfig,
  PageNode,
  PropsTypes,
} from '@/config'
import { useDisplayStore } from '@/stores/display'
import { usePageStore } from '@/stores/page'
import { merge } from 'lodash'

/** 当前是否为移动端特化样式处理中 */
export const useMobileConfig = () =>
  usePageStore().setting.client === 'both' && useDisplayStore().deviceType === 'mobile'

/** 获得原始组件 */
export const useSourceNode = <T extends ComponentName = any>(node: PageNode<T>): PageNode<T> => {
  const linkNode = (node.propLink && usePageStore().nameMap[node.propLink]) as PageNode<T> | null
  return linkNode || node
}

/** 获得组件 Config，可能为链接组件的 Config */
export const useConfig = <T extends ComponentName = any>(node: PageNode<T>): IPropConfig<T> => {
  return useSourceNode(node).config
}

/** 获得组件在对应设备场景下的全量配置 */
export const useConfigProps = <T extends ComponentName = any>(
  node: PageNode<T> | null
): PropsTypes<T> => {
  if (!node) return { common: { hide: false } } as unknown as PropsTypes<T>
  const groupTypeList = ComponentPropsGroup[node.component]
  let obj: PropsTypes<T> = {} as any
  for (let i = 0; i < groupTypeList.length; i++) {
    const groupType = groupTypeList[i]
    const group = useGroupConfig(node, groupType)
    if (group) {
      ;(obj as any)[groupType] = group
    }
  }
  return obj
}

/** 获得组件在对应设备场景下的单个配置组的配置 */
export const useGroupConfig = (node: PageNode | null, groupType: GroupType) => {
  if (!node) return null
  const linkNode = (node.propLink && usePageStore().nameMap[node.propLink]) as PageNode | null
  // 先从自身取，若自身取不到，则去 propLink 链接元素取
  return useGroupConfigByNode(node, groupType) || useGroupConfigByNode(linkNode, groupType)
}

/** 从节点中去获取单个配置组 */
export const useGroupConfigByNode = (node: PageNode | null, groupType: GroupType) => {
  if (!node) return null
  if (useMobileConfig() && node.config?.mobile?.[groupType]) {
    return node.config?.mobile?.[groupType]
  }
  if (node.config?.props?.[groupType]) {
    return node.config.props[groupType]
  }
  return null
}

/** 是否已开启 mobile 样式 */
export const isMobileGroupConfig = (node: PageNode | null, groupType?: GroupType): boolean => {
  if (!node || !groupType) return false
  const configBySelf = useGroupConfigByNode(node, groupType)
  // 如果以及取消关联或者无关联情况下，只用自身的该组配置判断，是否已开启 mobile 样式
  if (configBySelf) {
    return !!node.config?.mobile?.[groupType]
  }
  // 否则拿链接组件的样式来判断
  const config = useConfig(node)
  if (useMobileConfig() && config?.mobile?.[groupType]) {
    return true
  }
  return false
}
