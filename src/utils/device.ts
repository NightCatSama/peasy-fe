import type { IDeviceInfo } from '@/stores/display'

/** 根据屏幕宽度计算出最佳的模拟容器大小，尽量能全部在容器中 */
export const getDefaultDevice = (parentWidth: number, preset: number[][]): IDeviceInfo => {
  const w = parentWidth * 0.9 // 尽量不超过容器 90% 的大小)
  let size = preset[0]
  let zoom = 1
  // 如果比最小的设备宽度还小，则开启缩放
  if (w < size[0] * 0.6) {
    zoom = 0.5
  } else if (w < size[0] * 0.8) {
    zoom = 0.6
  } else if (w < size[0]) {
    zoom = 0.8
  } else {
    for (let i = 1; i < preset.length; i++) {
      if (w >= preset[i][0]) {
        size = preset[i]
      }
    }
  }
  return {
    width: size[0],
    height: size[1],
    zoom,
    fontSize: size[2],
  }
}
