export const isMacOS = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

export const ShortcutMap = {
  /** 切换展示模式 */
  SwitchDisplayMode: {
    key: isMacOS ? 'meta.e' : 'ctrl.shift.e',
    title: '切换展示模式',
    value: isMacOS ? '⌘ + E' : 'Ctrl + Shift + E',
  },
  /** 切换物料栏 */
  SwitchMaterialPanel: {
    key: isMacOS ? 'meta.b' : 'ctrl.b',
    title: '切换物料栏',
    value: isMacOS ? '⌘ + B' : 'Ctrl + B',
  },
  /** 切换设置栏 */
  SwitchConfigPanel: {
    key: isMacOS ? 'meta.shift.g' : 'ctrl.shift.g',
    title: '切换设置栏',
    value: isMacOS ? '⌘ + Shift + G' : 'Ctrl + Shift + G',
  },
  /** 重新定位 */
  location: {
    key: isMacOS ? 'meta.l' : 'ctrl.l',
    title: '重新定位',
    value: isMacOS ? '⌘ + L' : 'Ctrl + L',
  },
  /** 撤销 */
  undo: {
    key: isMacOS ? 'meta.z' : 'ctrl.z',
    title: '撤销',
    value: isMacOS ? '⌘ + Z' : 'Ctrl + Z',
  },
  /** 重做 */
  redo: {
    key: isMacOS ? 'meta.shift.z' : 'ctrl.shift.z',
    title: '重做',
    value: isMacOS ? '⌘ + Shift + Z' : 'Ctrl + Shift + Z',
  },
  /** 删除 */
  delete: {
    key: isMacOS ? 'meta.delete' : 'ctrl.delete',
    title: '删除',
    value: isMacOS ? '⌘ + Delete' : 'Ctrl + Delete',
  },
  /** 复制当前组件 */
  copyComponent: {
    key: isMacOS ? 'meta.shift.c' : 'ctrl.shift.c',
    title: '复制当前组件',
    value: isMacOS ? '⌘ + Shift + C' : 'Ctrl + Shift + C',
  },
  /** 保存项目 */
  saveProject: {
    key: isMacOS ? 'meta.s' : 'ctrl.s',
    title: '保存项目',
    value: isMacOS ? '⌘ + S' : 'Ctrl + S',
  },
  /** 保存组件 */
  saveMaterial: {
    key: isMacOS ? 'meta.shift.s' : 'ctrl.shift.s',
    title: '保存组件',
    value: isMacOS ? '⌘ + Shift + S' : 'Ctrl + Shift + S',
  },
  /** 切换设备模式 */
  switchDevice: {
    key: (e: KeyboardEvent) => (isMacOS ? e.metaKey : e.ctrlKey) && e.key === '/',
    title: '切换设备模式',
    value: isMacOS ? '⌘ + /' : 'Ctrl + /',
  },
  /** 全部折叠 */
  collapseAll: {
    key: (e: KeyboardEvent) => (isMacOS ? e.metaKey : e.ctrlKey) && (isMacOS ? e.shiftKey : e.altKey) && e.key === '.',
    title: '折叠全部配置项',
    value: isMacOS ? '⌘ + Shift + .' : 'Ctrl + Alt + .',
  },
  /** 切换 Section */
  switchSection: {
    key: (e: KeyboardEvent) => (isMacOS ? e.metaKey : e.ctrlKey) && (isMacOS ? e.shiftKey : e.altKey) && /\d/.test(e.key),
    title: '切换到指定 Section',
    value: isMacOS ? '⌘ + Shift + {数字键}' : 'Ctrl + Alt + {数字键}',
  },
  /** 下一个 Section */
  nextSection: {
    key: isMacOS ? 'alt.down' : 'alt.down',
    title: '下一个 Section',
    value: isMacOS ? '⌥ + ↓' : 'Alt + ↓',
  },
  /** 上一个 Section */
  prevSection: {
    key: isMacOS ? 'alt.up' : 'alt.up',
    title: '上一个 Section',
    value: isMacOS ? '⌥ + ↑' : 'Alt + ↑',
  },
  /** 切换到下一个同级组件 */
  nextComponent: {
    key: isMacOS ? 'meta.shift.right' : 'ctrl.shift.right',
    title: '切换到下一个同级组件',
    value: isMacOS ? '⌘ + Shift + →' : 'Ctrl + Shift + →',
  },
  /** 切换到上一个同级组件 */
  prevComponent: {
    key: isMacOS ? 'meta.shift.left' : 'ctrl.shift.left',
    title: '切换到上一个同级组件',
    value: isMacOS ? '⌘ + Shift + ←' : 'Ctrl + Shift + ←',
  },
  /** 切换到父级组件 */
  parentComponent: {
    key: isMacOS ? 'meta.shift.up' : 'ctrl.shift.up',
    title: '切换到父级组件',
    value: isMacOS ? '⌘ + Shift + ↑' : 'Ctrl + Shift + ↑',
  },
  /** 切换到子级组件 */
  childrenComponent: {
    key: isMacOS ? 'meta.shift.down' : 'ctrl.shift.down',
    title: '切换到子级组件',
    value: isMacOS ? '⌘ + Shift + ↓' : 'Ctrl + Shift + ↓',
  },
  /** 快捷键展示 */
  switchShortcut: {
    key: isMacOS ? 'meta.shift.p' : 'ctrl.shift.p',
    title: '快捷键展示',
    value: isMacOS ? '⌘ + Shift + P' : 'Ctrl + Shift + P',
  },
}

export const ShortcutKey = Object.fromEntries(
  Object.entries(ShortcutMap).map(([key, map]) => [key, map.key])
)
