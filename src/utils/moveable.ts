import Moveable, { MoveableOptions } from 'moveable'
import { emitter } from './event'

/** 全局实例 */
let moveable: Moveable | null = null

export const getMoveable = () => {
  if (moveable) return moveable
  const containerElement = document.querySelector('.edit-section') as HTMLDivElement
  if (!containerElement) return null

  moveable = new Moveable(containerElement, {
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
