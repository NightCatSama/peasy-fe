import type { ComponentName, PageNode, PropsTypes } from "@/config";

export const useConfig = <T extends ComponentName = any>(node: PageNode<T> | null): PropsTypes<T> => {
  if (!node) return { common: { hide: false } } as unknown as PropsTypes<T>
  const { props, mobile } = node.config
  return mobile ?? props;
}
