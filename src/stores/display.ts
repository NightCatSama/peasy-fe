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

export type DisplayMode = 'preview' | 'drag' | 'edit' | 'grid'

export const useDisplayStore = defineStore('display', {
  state: () => ({
    /** 预设 */
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
    /** 设备模式 */
    deviceType: 'desktop' as 'desktop' | 'mobile',
    /** 当前模拟设备信息 */
    device: { width: 0, height: 0, zoom: 1, fontSize: 16 } as IDeviceInfo,
    /** 编辑组的状态保存，避免每次切换都恢复 */
    groupStatus: {} as { [key: string]: IGroupStatus },
    /**
     * 当前页面展示模式
     * edit: 编辑模式
     * preview: 预览模式
     * drag: 拖拽模式
     * grid: 布局模式
     */
    displayMode: 'edit' as DisplayMode,
    /** 锁定拖拽修改 position */
    lockDragSetPosition: false,
  }),
  getters: {
    /** 当前展示的宽高（缩放后） */
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
    setDisplayMode(mode: DisplayMode) {
      this.displayMode = mode
    },
    setLockDragSetPosition(lock: boolean) {
      this.lockDragSetPosition = lock
    },
  },
})
