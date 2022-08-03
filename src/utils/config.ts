import type { ComponentName, GroupType, IPropConfig, PageNode, PropsTypes } from "@/config";
import { useDisplayStore } from "@/stores/display";
import { usePageStore } from "@/stores/page";

/** 获得组件 Config */
export const useConfig = <T extends ComponentName = any>(node: PageNode<T>): IPropConfig<T> => {
  const linkNode = (node.propLink && usePageStore().nameMap[node.propLink]) as PageNode<T> | null
  return linkNode?.config || node.config
}

/** 获得组件在对应设备场景下的全量配置 */
export const useConfigProps = <T extends ComponentName = any>(node: PageNode<T> | null): PropsTypes<T> => {
  if (!node) return { common: { hide: false } } as unknown as PropsTypes<T>
  const config = useConfig(node)
  const { props, mobile } = config
  if (mobile && useDisplayStore().deviceType === 'mobile') {
    return mobile
  }
  return props;
}

/**
 * 获得组件在对应设备场景下的单个配置组的配置
 * 为了支持在组件在 propLink 其他组件的情况下，也允许自己单独设置特化样式
 * TODO: 后续优化
 */
export const useGroupConfig = (node: PageNode | null, groupType: GroupType) => {
  if (!node) return null
  if (
    useDisplayStore().deviceType === 'mobile' &&
    node.config?.mobile?.[groupType]
  ) {
    return node.config?.mobile?.[groupType]
  }
  if (node.config?.props?.[groupType]) {
    return node.config.props[groupType]
  }
  return useConfigProps(node)[groupType]
}
