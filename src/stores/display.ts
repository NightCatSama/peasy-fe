import { getDefaultDevice } from '@/utils/device'
import { defineStore } from 'pinia'

/** 当前模拟的设备宽高 */
export interface IDeviceInfo {
  width: number
  height: number
  zoom: number
  fontSize: number
}

/** 保存配置组的状态 */
export interface IGroupStatus {
  collapsed: boolean
  advanced: boolean
}

export const useDisplayStore = defineStore('display', {
  state: () => ({
    presetDevice: {
      desktop: [
        [1280, 720, 16],
        [1920, 1080, 20],
        [2560, 1440, 24],
      ],
      mobile: [
        [375, 667, 13],
        [375, 812, 13],
        [414, 896, 13],
      ],
    },
    deviceType: 'desktop' as 'desktop' | 'mobile',
    device: { width: 0, height: 0, zoom: 1, fontSize: 16 } as IDeviceInfo,
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
    },
    curPresetDeviceList(state) {
      return state.presetDevice[state.deviceType]
    },
    curFootSize(state) {
      return state.device.fontSize
    },
  },
  actions: {
    setDeviceByParent(parentWidth: number) {
      this.device = getDefaultDevice(parentWidth, this.presetDevice[this.deviceType])
    },
    setDevice(device: IDeviceInfo) {
      this.device = device
    },
    saveGroupStatus(name: string, status: IGroupStatus) {
      this.groupStatus[name] = status
    },
  },
})
