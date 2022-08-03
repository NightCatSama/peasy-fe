import { PageNode } from '@/config'
import { useDisplayStore } from '@/stores/display'
import { usePageStore } from '@/stores/page'
import Moveable from 'moveable'
import { useConfig } from './config'
import { emitter } from './event'
import { covertPXToUnit, fixedPointToNumber, getUnit, isUnitType } from './sizeHelper'

/** 全局实例 */
let moveable: Moveable | null = null

let isResizing = false
let isDragging = false

/**
 * 获取 moveable 示例，首次调用会初始化
 * @returns Moveable 实例
 */
export const getMoveable = () => {
  if (moveable) return moveable
  const containerElement = document.querySelector('.edit-section') as HTMLDivElement
  if (!containerElement) return null

  moveable = new Moveable(containerElement, {
    draggable: false,
    snappable: true,
    origin: false,
    useResizeObserver: true,
    hideDefaultLines: true,
    ables: [
      {
        name: 'outline',
        props: {},
        events: {},
        render: (m, renderer) => {
          const rect = m.getRect()
          const elem = m.props.target as HTMLDivElement
          const name = elem?.getAttribute('data-name') || ''
          const zoom = useDisplayStore().device.zoom
          // 绘制激活态的边框、名称、拖拽时的宽高和距离等信息
          return renderer.createElement(
            'div',
            {
              class: 'moveable-outline',
              style: {
                width: `${rect.width}px`,
                height: `${rect.height}px`,
              },
            },
            name
              ? renderer.createElement(
                  'div',
                  {
                    class: 'moveable-outline-text right-top',
                    style: {},
                  },
                  name
                )
              : null,
            isResizing
              ? renderer.createElement(
                  'div',
                  {
                    class: 'moveable-outline-text left-bottom',
                    style: {},
                  },
                  `${elem.dataset.resizeWidth || elem.offsetWidth + 'px'} x ${
                    elem.dataset.resizeHeight || elem.offsetHeight + 'px'
                  }`
                )
              : null,
            isDragging && elem.dataset.leftMove
              ? renderer.createElement(
                  'div',
                  {
                    class: 'moveable-outline-line left',
                    style: {
                      width: `${parseFloat(elem.style.left) * zoom}px`,
                    },
                  },
                  renderer.createElement('div', {}, elem.dataset.leftMove)
                )
              : null,
            isDragging && elem.dataset.rightMove
              ? renderer.createElement(
                  'div',
                  {
                    class: 'moveable-outline-line right',
                    style: {
                      width: `${parseFloat(elem.style.right) * zoom}px`,
                    },
                  },
                  renderer.createElement('div', {}, elem.dataset.rightMove)
                )
              : null,
            isDragging && elem.dataset.topMove
              ? renderer.createElement(
                  'div',
                  {
                    class: 'moveable-outline-line top',
                    style: {
                      height: `${parseFloat(elem.style.top) * zoom}px`,
                    },
                  },
                  renderer.createElement('div', {}, elem.dataset.topMove)
                )
              : null,
            isDragging && elem.dataset.bottomMove
              ? renderer.createElement(
                  'div',
                  {
                    class: 'moveable-outline-line bottom',
                    style: {
                      height: `${parseFloat(elem.style.bottom) * zoom}px`,
                    },
                  },
                  renderer.createElement('div', {}, elem.dataset.bottomMove)
                )
              : null
          )
        },
      },
    ],
    props: {
      outline: true,
    },
  })

  emitter.on('updateMoveable', updateMoveableRect)

  const wrapperElement = document.querySelector('.edit-wrapper') as HTMLDivElement
  wrapperElement?.addEventListener('scroll', updateMoveableRect)

  return moveable
}

/** 同步更新 moveable 操作区域 */
export const updateMoveableRect = () => {
  moveable?.updateRect()
  ;(moveable?.draggable || moveable?.resizable) && setSnappableGuidelines()
}

/** 禁用 moveable */
export const disabledMoveable = () => {
  const moveable = getMoveable()
  if (!moveable) return

  moveable.resizable = false
  moveable.draggable = false
  moveable.target = null
  moveable.off()
}

export const updateDirection = (item: PageNode) => {
  const moveable = getMoveable()
  if (!moveable) return

  const props = useConfig(item)
  const disableWidth = item.type === 'section' || !isUnitType(getUnit(props.size?.width))
  const disableHeight = !isUnitType(getUnit(props.size?.height))
  const renderDirections =
    disableWidth && disableHeight
      ? []
      : disableWidth
      ? ['s', 'n']
      : disableHeight
      ? ['w', 'e']
      : ['n', 'nw', 'ne', 's', 'se', 'sw', 'e', 'w']

  moveable.renderDirections = renderDirections
}

/** 启用 moveable */
export const useMoveable = (elem: HTMLDivElement, item: PageNode, parent?: PageNode) => {
  const moveable = getMoveable()
  if (!moveable) return

  const props = useConfig(item)
  const disableMove = !['absolute', 'fixed'].includes(props?.position?.position || '')

  /** 记录原先的单位 */
  let units: {
    width?: string
    height?: string
    widthReferSize?: number
    heightReferSize?: number
  } = {}

  moveable.resizable = true
  moveable.target = elem

  moveable.off()

  updateDirection(item)
  setSnappableGuidelines(elem)
  moveable.on('beforeResize', (e) => {
    const shiftKey = e?.inputEvent.shiftKey
    moveable.keepRatio = !!shiftKey
  })
  moveable.on('resizeStart', (e) => {
    elem.scrollLeft = 0
    elem.scrollTop = 0

    units.width = getUnit(props.size?.width)
    units.widthReferSize =
      parent && elem.parentElement ? elem.parentElement.clientWidth : useDisplayStore().device.width

    units.height = getUnit(props.size?.height)
    units.heightReferSize =
      parent && elem.parentElement
        ? elem.parentElement.clientHeight
        : useDisplayStore().device.height

    isResizing = true
  })
  moveable.on('resize', (e) => {
    if (units?.width) {
      elem.style.width = fixedPointToNumber(e.width) + 'px'
      elem.dataset.resizeWidth = covertPXToUnit(elem.style.width, units.width, units.widthReferSize)
    }
    if (units?.height) {
      elem.style.height = fixedPointToNumber(e.height) + 'px'
      elem.dataset.resizeHeight = covertPXToUnit(
        elem.style.height,
        units.height,
        units.heightReferSize
      )
    }
  })
  moveable.on('resizeEnd', (e) => {
    if (props.size && units.width && elem.dataset.resizeWidth) {
      props.size.width = elem.dataset.resizeWidth
      delete elem.dataset.resizeWidth
    }
    if (props.size && units.height && elem.dataset.resizeHeight) {
      props.size.height = elem.dataset.resizeHeight
      delete elem.dataset.resizeHeight
    }
    isResizing = false
  })

  if (!disableMove) {
    openDragMode(elem)
  } else {
    closeDragMode()
  }
}

/** 开启拖拽定位模式 */
export const openDragMode = (activeElem?: HTMLDivElement) => {
  const moveable = getMoveable()
  if (!moveable || useDisplayStore().lockDrag) return
  moveable.draggable = true
  const elem = activeElem || (moveable.target as HTMLDivElement)
  setSnappableGuidelines(elem)
  const item = usePageStore().activeNode
  const props = useConfig(item)
  const positionMap = ['left', 'right', 'top', 'bottom'] as const
  let units: {
    left?: string
    top?: string
    right?: string
    bottom?: string
    widthReferSize?: number
    heightReferSize?: number
  } = {}
  moveable.on('dragStart', (e) => {
    units = {
      widthReferSize:
        parent && elem.parentElement
          ? elem.parentElement.clientWidth
          : useDisplayStore().device.width,
      heightReferSize:
        parent && elem.parentElement
          ? elem.parentElement.clientHeight
          : useDisplayStore().device.height,
    }
    isDragging = true
    positionMap.forEach((key) => {
      if (props.position?.[key] !== 'auto') {
        units[key] = getUnit(props.position?.[key]!)
      }
    })
  })
  moveable.on('drag', (e) => {
    positionMap.forEach((key) => {
      if (units[key]) {
        elem.style[key] = fixedPointToNumber(e[key]) + 'px'
        elem.dataset[`${key}Move`] = covertPXToUnit(
          elem.style[key],
          units[key]!,
          ['top', 'bottom'].includes(key) ? units.heightReferSize : units.widthReferSize
        )
      }
    })
  })
  moveable.on('dragEnd', (e) => {
    const elem = e.target as HTMLDivElement
    isDragging = false
    positionMap.forEach((key) => {
      if (units[key] && elem.dataset[`${key}Move`] && props.position) {
        props.position[key] = elem.dataset[`${key}Move`]!
        delete elem.dataset[`${key}Move`]
      }
    })
  })
}

/** 关闭拖拽定位模式 */
export const closeDragMode = () => {
  const moveable = getMoveable()
  if (!moveable) return
  moveable.draggable = false
}

/** 设置参考线 */
export const setSnappableGuidelines = (activeElement?: HTMLDivElement) => {
  const moveable = getMoveable()
  const editSection = document.querySelector('.edit-section') as HTMLElement
  if (!moveable || !editSection) return

  const activeElem = activeElement || (moveable.target as HTMLDivElement)
  let horizontalGuidelines: number[] = []
  let verticalGuidelines: number[] = []
  // 需要参考的组件列表
  const referElemList = []
  const parentElement = activeElem.parentElement!

  if (!parentElement) return

  const zoom = useDisplayStore().device.zoom

  const siblingElement = Array.from(parentElement?.children || []).filter(
    (elem) => elem !== activeElem
  ) as HTMLDivElement[]
  if (parentElement && parentElement.classList.contains('lib-component')) {
    referElemList.push(parentElement)
  }
  referElemList.push(...siblingElement)

  if (referElemList.length > 0) {
    referElemList.forEach((elem) => {
      const wrapperOffset = getElementOffsetByWrapper(elem, editSection)
      verticalGuidelines.push(wrapperOffset.left, elem.offsetWidth * zoom + wrapperOffset.left)
      horizontalGuidelines.push(wrapperOffset.top, elem.offsetHeight * zoom + wrapperOffset.top)
    })
  }

  moveable.horizontalGuidelines = horizontalGuidelines
  moveable.verticalGuidelines = verticalGuidelines
}

/** 获取两个元素相对于视口的距离 */
export const getElementOffsetByWrapper = (elem: HTMLElement, wrapperElement: HTMLElement) => {
  const rect = elem.getBoundingClientRect()
  const editSectionRect = wrapperElement.getBoundingClientRect()
  return {
    top: rect.top - editSectionRect.top,
    left: rect.left - editSectionRect.left,
  }
}
