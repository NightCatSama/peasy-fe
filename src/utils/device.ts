import type { IDeviceInfo } from '@/stores/display'

const preset = {
  desktop: [
    [1280, 720],
    [1920, 1080],
    [2560, 1440],
    [3840, 2160],
  ],
  mobile: [
    [375, 667],
    [375, 812],
    [414, 896],
  ],
  zoom: [0.8, 0.6],
}

/** 根据屏幕宽度计算出最佳的模拟容器大小，尽量能全部在容器中 */
export const getDefaultDevice = (parentWidth: number): IDeviceInfo => {
  const w = parentWidth * 0.8 // 尽量不超过容器 80% 的大小)
  let size = preset.desktop[0]
  let zoom = 1
  // 如果比最小的设备宽度还小，则开启缩放
  if (w < size[0] * 0.8) {
    zoom = 0.6
  } else if (w < size[0]) {
    zoom = 0.8
  } else {
    for (let i = 1; i < preset.desktop.length; i++) {
      if (w >= preset.desktop[i][0]) {
        size = preset.desktop[i]
      }
    }
  }
  return {
    width: size[0],
    height: size[1],
    zoom,
  }
}
