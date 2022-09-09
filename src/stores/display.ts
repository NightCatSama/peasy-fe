import { PageNode } from '@/config'
import { getDefaultEditorSetting } from '@/utils/defaultConfig'
import { getDefaultDevice } from '@/utils/device'
import { defineStore } from 'pinia'
import { usePageStore } from './page'

/** 当前模拟的设备宽高 */
export interface IDeviceInfo {
  width: number
  height: number
  zoom: number
}

/** 保存配置组的状态 */
export interface IGroupStatus {
  collapsed: boolean
  advanced: boolean
}

/** 编辑器配置 */
export interface IEditorSetting {
  /** 背景色 */
  backgroundColor: string
  /** 选中颜色 */
  selectColor: string
  /** 组件轮廓 */
  contoursColor: string
}

export type DisplayMode = 'preview' | 'drag' | 'edit'

export const useDisplayStore = defineStore('display', {
  persist: {
    key: '__display_store__',
    paths: ['editorSettings', 'minimize']
  },
  state: () => ({
    /** 预设 */
    presetDevice: {
      desktop: [
        [1366, 768],
        [1920, 1080],
        [2560, 1440],
      ],
      mobile: [
        [375, 667],
        [414, 896],
        [768, 1024],
      ],
    },
    /** 设备模式 */
    deviceType: 'desktop' as 'desktop' | 'mobile',
    /** 当前模拟设备信息 */
    device: { width: 0, height: 0, zoom: 1 } as IDeviceInfo,
    /** 编辑组的状态保存，避免每次切换都恢复 */
    groupStatus: {} as { [component: string]: { [key: string]: IGroupStatus } },
    /** Layers 的状态保存，避免每次切换都恢复 */
    layerStatus: new WeakMap() as WeakMap<PageNode, boolean>,
    /**
     * 当前页面展示模式
     * edit: 编辑模式
     * preview: 预览模式
     * drag: 拖拽模式
     * grid: 布局模式
     */
    displayMode: 'edit' as DisplayMode,
    /** 手动锁定拖拽修改 position */
    lockDragSetPosition: false,
    /** 锁定脚本事件触发 */
    lockScriptTrigger: true,
    /** 是否右侧设置栏收起状态 */
    minimize: true,
    /** 当前展示的颜色类型 */
    colorType: 'variable' as 'variable' | 'recent',
    /** 编辑器设置 */
    editorSettings: getDefaultEditorSetting(),
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
      return (componentName: string, group: string) => state.groupStatus?.[componentName]?.[group]
    },
    curPresetDeviceList(state) {
      return state.presetDevice[state.deviceType]
    },
    curWidthFootSize(state) {
      return usePageStore().font.mediaFontSize?.[state.device.width] || 0
    },
    curFootSize(state) {
      const curWidthFootSize = usePageStore().font.mediaFontSize?.[state.device.width]
      if (curWidthFootSize) return curWidthFootSize
      let fontSize = usePageStore().font.fontSize
      Object.entries(usePageStore().font.mediaFontSize)
        .sort((a, b) => +a[0] - +b[0])
        .forEach(([width, size]) => {
          if (state.device.width >= +width) {
            fontSize = size
          }
        })
      return fontSize
    },
    lockDrag(state) {
      return state.lockDragSetPosition || state.displayMode !== 'edit'
    },
  },
  actions: {
    setDeviceByParent(parentWidth: number, parentHeight: number) {
      this.device = getDefaultDevice(
        { width: parentWidth, height: parentHeight },
        this.presetDevice[this.deviceType],
        this.deviceType
      )
    },
    setDevice(index: number = 0) {
      const size = this.presetDevice[this.deviceType][index]
      this.device = {
        width: size[0],
        height: size[1],
        zoom: this.device.zoom,
      }
    },
    saveGroupStatus(componentName: string, name: string, status: IGroupStatus) {
      if (!this.groupStatus[componentName]) this.groupStatus[componentName] = {}
      this.groupStatus[componentName][name] = status
    },
    setDisplayMode(mode: DisplayMode) {
      this.displayMode = mode
    },
    setLockDragSetPosition(lock: boolean) {
      this.lockDragSetPosition = lock
    },
    setMinimize(minimize: boolean) {
      this.minimize = minimize
    },
    setLockScriptTrigger(lock: boolean) {
      this.lockScriptTrigger = lock
    },
  },
})
