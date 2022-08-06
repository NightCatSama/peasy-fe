export const ShortcutKey = {
  /** 切换展示模式 */
  SwitchDisplayMode: 'meta.e',
  /** 切换物料栏 */
  SwitchMaterialPanel: 'meta.shift.a',
  /** 切换设置栏 */
  SwitchConfigPanel: 'meta.shift.g',
  /** 重新定位 */
  location: 'meta.l',
  /** 撤销 */
  undo: 'meta.z',
  /** 重做 */
  redo: 'meta.shift.z',
  /** 删除 */
  delete: 'meta.delete',
  /** 复制 */
  copy: 'meta.shift.c',
  /** 粘贴 */
  paste: 'meta.shift.v',
  /** 保存 */
  save: 'meta.shift.s',
  /** 全部折叠 */
  collapseAll: (e: KeyboardEvent) => e.metaKey && e.shiftKey && e.key === '.', // 'meta.shift.dot'
  /** 切换 Section */
  switchSection: (e: KeyboardEvent) => e.metaKey && e.shiftKey && /\d/.test(e.key), // 'meta.shift.number'
  /** 下一个 Section */
  nextSection: 'alt.tab',
  /** 上一个 Section */
  prevSection: 'alt.shift.tab',
  /** 切换设备模式 */
  switchDevice: (e: KeyboardEvent) => e.metaKey && e.key === '/', // 'meta + /'
}
