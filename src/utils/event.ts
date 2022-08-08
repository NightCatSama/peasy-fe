import mitt from 'mitt'

type Events = {
  location?: boolean
  switchMaterialsPanel?: boolean
  updateMoveable?: any
  saveHistory?: any
  collapseGroup?: any
  saveColorVars: string
}

export const emitter = mitt<Events>()
