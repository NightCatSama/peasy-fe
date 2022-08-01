import mitt from 'mitt'

type Events = {
  location?: boolean
  switchMaterialsPanel?: boolean
  updateMoveable?: any
  saveHistory?: any
  collapseGroup?: any
}

export const emitter = mitt<Events>()
