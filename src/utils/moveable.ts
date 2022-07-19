import { useDisplayStore } from '@/stores/display'
import Moveable, { MoveableOptions } from 'moveable'
import { emitter } from './event'
import { covertPXToUnit, fixedPointToNumber, getUnit, isUnitType } from './sizeHelper'

/** 全局实例 */
let moveable: Moveable | null = null

export const getMoveable = () => {
  if (moveable) return moveable
  const containerElement = document.querySelector('.edit-section') as HTMLDivElement
  if (!containerElement) return null

  moveable = new Moveable(containerElement, {
    draggable: false,
    origin: false,
    useResizeObserver: true,
    hideDefaultLines: true,
  })

  emitter.on('updateMoveable', updateMoveableRect)

  const wrapperElement = document.querySelector('.edit-wrapper') as HTMLDivElement
  wrapperElement?.addEventListener('scroll', updateMoveableRect)

  return moveable
}

export const setMoveableOptions = (options: MoveableOptions) => {
  if (!moveable) return
  for (let key in options) {
    ;(moveable as any)[key] = (options as any)[key]
  }
}

export const updateMoveableRect = () => moveable?.updateRect()

export const useMoveable = (elem: HTMLDivElement, item: CNode, parent?: CNode) => {
  const moveable = getMoveable()
  if (!moveable) return

  const disableWidth = item.type === 'section' || !isUnitType(getUnit(item.props.size?.width))
  const disableHeight = !isUnitType(getUnit(item.props.size?.height))

  if (disableWidth && disableHeight) return

  /** 记录原先的单位 */
  let units: { width?: string; height?: string } = {}

  const renderDirections = disableWidth
    ? ['s', 'n']
    : disableHeight
    ? ['w', 'e']
    : ['n', 'nw', 'ne', 's', 'se', 'sw', 'e', 'w']

  moveable.resizable = true
  moveable.target = elem
  moveable.renderDirections = renderDirections

  moveable.off()
  moveable.on('resizeStart', (e) => {
    if (!disableWidth) units.width = getUnit(item.props.size.width)
    if (!disableHeight) units.height = getUnit(item.props.size.height)
  })
  moveable.on('resize', (e) => {
    console.log('e', e.width, e.height);
    if (units?.width) elem.style.width = fixedPointToNumber(e.width) + 'px'
    if (units?.height) elem.style.height = fixedPointToNumber(e.height) + 'px'
  })
  moveable.on('resizeEnd', (e) => {
    console.log('end', e, elem.style.width)
    if (units.width)
      item.props.size.width = covertPXToUnit(
        elem.style.width,
        units.width,
        parent && elem.parentElement
          ? elem.parentElement.clientWidth
          : useDisplayStore().device.width
      )
    if (units.height)
      item.props.size.height = covertPXToUnit(
        elem.style.height,
        units.height,
        parent && elem.parentElement
          ? elem.parentElement.clientHeight
          : useDisplayStore().device.height
      )
  })
}
