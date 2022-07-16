import { getDefaultDevice } from '@/utils/device'
import { defineStore } from 'pinia'

/** 当前模拟的设备宽高 */
export interface IDeviceInfo {
  width: number
  height: number
  zoom: number
}

/** 保存配置组的状态 */
export interface IGroupStatus { collapsed: boolean; advanced: boolean }

export const useDisplayStore = defineStore('display', {
  state: () => ({
    device: { width: 0, height: 0, zoom: 1 } as IDeviceInfo,
    groupStatus: {} as { [key: string]: IGroupStatus },
  }),
  getters: {
    realDeviceSize(state) {
      return {
        width: state.device.width * state.device.zoom,
        height: state.device.height * state.device.zoom,
      }
    },
    getGroupStatus(state) {
      return (group: string) => state.groupStatus[group]
    }
  },
  actions: {
    setDeviceByParent(parentWidth: number) {
      this.device = getDefaultDevice(parentWidth)
    },
    setDevice(device: IDeviceInfo) {
      this.device = device
    },
    saveGroupStatus(name: string, status: IGroupStatus) {
      this.groupStatus[name] = status
    }
  },
})
