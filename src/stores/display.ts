import { getDefaultDevice } from '@/utils/device'
import { defineStore } from 'pinia'

/** 当前模拟的设备宽高 */
export interface IDeviceInfo {
  width: number
  height: number
  zoom: number
}

export const useDisplayStore = defineStore('display', {
  state: () => ({
    device: { width: 0, height: 0, zoom: 1 } as IDeviceInfo,
  }),
  getters: {},
  actions: {
    setDeviceByParent(parentWidth: number) {
      this.device = getDefaultDevice(parentWidth)
    },
    setDevice(device: IDeviceInfo) {
      this.device = device
    },
  },
})
