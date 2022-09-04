import { $t } from "./i18n";

export const isMacOS = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

export const ShortcutMap = {
  /** 切换展示模式 */
  SwitchDisplayMode: {
    key: isMacOS ? 'meta.e' : 'ctrl.shift.e',
    title: $t('SwitchDisplayMode'),
    value: isMacOS ? '⌘ + E' : 'Ctrl + Shift + E',
  },
  /** 切换物料栏 */
  SwitchMaterialPanel: {
    key: isMacOS ? 'meta.b' : 'ctrl.b',
    title: $t('SwitchMaterialPanel'),
    value: isMacOS ? '⌘ + B' : 'Ctrl + B',
  },
  /** 切换设置栏 */
  SwitchConfigPanel: {
    key: isMacOS ? 'meta.shift.g' : 'ctrl.shift.g',
    title: $t('SwitchConfigPanel'),
    value: isMacOS ? '⌘ + Shift + G' : 'Ctrl + Shift + G',
  },
  /** 重新定位 */
  location: {
    key: isMacOS ? 'meta.l' : 'ctrl.l',
    title: $t('location'),
    value: isMacOS ? '⌘ + L' : 'Ctrl + L',
  },
  /** 撤销 */
  undo: {
    key: isMacOS ? 'meta.z' : 'ctrl.z',
    title: $t('undo'),
    value: isMacOS ? '⌘ + Z' : 'Ctrl + Z',
  },
  /** 重做 */
  redo: {
    key: isMacOS ? 'meta.shift.z' : 'ctrl.shift.z',
    title: $t('redo'),
    value: isMacOS ? '⌘ + Shift + Z' : 'Ctrl + Shift + Z',
  },
  /** 删除 */
  delete: {
    key: isMacOS ? 'meta.delete' : 'ctrl.delete',
    title: $t('delete'),
    value: isMacOS ? '⌘ + Delete' : 'Ctrl + Delete',
  },
  /** 复制当前组件 */
  copyComponent: {
    key: isMacOS ? 'meta.shift.c' : 'ctrl.shift.c',
    title: $t('copyComponent'),
    value: isMacOS ? '⌘ + Shift + C' : 'Ctrl + Shift + C',
  },
  /** 保存项目 */
  saveProject: {
    key: isMacOS ? 'meta.s' : 'ctrl.s',
    title: $t('saveProject'),
    value: isMacOS ? '⌘ + S' : 'Ctrl + S',
  },
  cut: {
    key: isMacOS ? 'meta.x' : 'ctrl.x',
    title: $t('cut'),
    value: isMacOS ? '⌘ + X' : 'Ctrl + X',
  },
  copyToClipboard: {
    key: isMacOS ? 'meta.c' : 'ctrl.c',
    title: $t('copyToClipboard'),
    value: isMacOS ? '⌘ + C' : 'Ctrl + C',
  },
  paste: {
    key: isMacOS ? 'meta.v' : 'ctrl.v',
    title: $t('paste'),
    value: isMacOS ? '⌘ + V' : 'Ctrl + V',
  },
  pasteToInside: {
    key: isMacOS ? 'meta.shift.v' : 'ctrl.shift.v',
    title: $t('pasteToInside'),
    value: isMacOS ? '⌘ + Shift + V' : 'Ctrl + Shift + V',
  },
  /** 保存组件 */
  saveMaterial: {
    key: isMacOS ? 'meta.shift.s' : 'ctrl.shift.s',
    title: $t('saveMaterial'),
    value: isMacOS ? '⌘ + Shift + S' : 'Ctrl + Shift + S',
  },
  /** 切换设备模式 */
  switchDevice: {
    key: (e: KeyboardEvent) => (isMacOS ? e.metaKey : e.ctrlKey) && e.key === '/',
    title: $t('switchDevice'),
    value: isMacOS ? '⌘ + /' : 'Ctrl + /',
  },
  /** 切换到下一个尺寸的设备模拟器 */
  nextDeviceIndex: {
    key: isMacOS ? 'meta.\'' : 'ctrl.\'',
    title: $t('nextDeviceSize'),
    value: isMacOS ? '⌘ + \'' : 'Ctrl + \'',
  },
  /** 切换到下一个尺寸的设备模拟器 */
  prevDeviceIndex: {
    key: isMacOS ? 'meta.;' : 'ctrl.;',
    title: $t('prevDeviceSize'),
    value: isMacOS ? '⌘ + ;' : 'Ctrl + ;',
  },
  /** 全部折叠 */
  collapseAll: {
    key: (e: KeyboardEvent) => (isMacOS ? e.metaKey : e.ctrlKey) && (isMacOS ? e.shiftKey : e.altKey) && e.key === '.',
    title: $t('collapseAll'),
    value: isMacOS ? '⌘ + Shift + .' : 'Ctrl + Alt + .',
  },
  /** 切换 Section */
  switchSection: {
    key: (e: KeyboardEvent) => (isMacOS ? e.metaKey : e.ctrlKey) && (isMacOS ? e.shiftKey : e.altKey) && /\d/.test(e.key),
    title: $t('switchSection'),
    value: isMacOS ? '⌘ + Shift + {数字键}' : 'Ctrl + Alt + {数字键}',
  },
  /** 下一个 Section */
  nextSection: {
    key: isMacOS ? 'alt.down' : 'alt.down',
    title: $t('nextSection'),
    value: isMacOS ? '⌥ + ↓' : 'Alt + ↓',
  },
  /** 上一个 Section */
  prevSection: {
    key: isMacOS ? 'alt.up' : 'alt.up',
    title: $t('prevSection'),
    value: isMacOS ? '⌥ + ↑' : 'Alt + ↑',
  },
  /** 切换到下一个同级组件 */
  nextComponent: {
    key: isMacOS ? 'meta.shift.right' : 'ctrl.shift.right',
    title: $t('nextComponent'),
    value: isMacOS ? '⌘ + Shift + →' : 'Ctrl + Shift + →',
  },
  /** 切换到上一个同级组件 */
  prevComponent: {
    key: isMacOS ? 'meta.shift.left' : 'ctrl.shift.left',
    title: $t('prevComponent'),
    value: isMacOS ? '⌘ + Shift + ←' : 'Ctrl + Shift + ←',
  },
  /** 切换到父级组件 */
  parentComponent: {
    key: isMacOS ? 'meta.shift.up' : 'ctrl.shift.up',
    title: $t('parentComponent'),
    value: isMacOS ? '⌘ + Shift + ↑' : 'Ctrl + Shift + ↑',
  },
  /** 切换到子级组件 */
  childrenComponent: {
    key: isMacOS ? 'meta.shift.down' : 'ctrl.shift.down',
    title: $t('childrenComponent'),
    value: isMacOS ? '⌘ + Shift + ↓' : 'Ctrl + Shift + ↓',
  },
  /** 快捷键展示 */
  switchShortcut: {
    key: isMacOS ? 'meta.shift.p' : 'ctrl.shift.p',
    title: $t('switchShortcut'),
    value: isMacOS ? '⌘ + Shift + P' : 'Ctrl + Shift + P',
  },
  /** 页面列表 */
  switchPageList: {
    key: isMacOS ? 'meta.shift.o' : 'ctrl.shift.o',
    title: $t('switchPageList'),
    value: isMacOS ? '⌘ + Shift + O' : 'Ctrl + Shift + O',
  },
}

export const ShortcutKey = Object.fromEntries(
  Object.entries(ShortcutMap).map(([key, map]) => [key, map.key])
)
