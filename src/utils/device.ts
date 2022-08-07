import type { IDeviceInfo } from '@/stores/display'

/** 根据屏幕宽度计算出最佳的模拟容器大小，尽量能全部在容器中 */
export const getDefaultDevice = (
  parent: { width: number; height: number },
  preset: number[][],
  type: 'desktop' | 'mobile' = 'desktop'
): IDeviceInfo => {
  const refer = (type === 'desktop' ? parent.width : parent.height) * 0.9 // 尽量不超过容器 90% 的大小)
  const referIndex = type === 'desktop' ? 0 : 1 // desktop 以宽度为参考，mobile 以高度为参考
  let size = preset[0]
  let zoom = 1
  // 如果比最小的设备宽度还小，则开启缩放
  if (refer < size[referIndex] * 0.6) {
    zoom = 0.5
  } else if (refer < size[referIndex] * 0.8) {
    zoom = 0.6
  } else if (refer < size[referIndex]) {
    zoom = 0.8
  } else {
    for (let i = 1; i < preset.length; i++) {
      if (refer >= preset[i][referIndex]) {
        size = preset[i]
      }
    }
  }
  return {
    width: size[0],
    height: size[1],
    zoom,
  }
}
