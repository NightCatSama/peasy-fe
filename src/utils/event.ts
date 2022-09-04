import mitt from 'mitt'

type Events = {
  location?: boolean
  switchMaterialsPanel?: boolean
  switchPageList?: boolean
  updateMoveable?: any
  saveHistory?: any
  collapseGroup?: any
  saveColorVars: string
  saveProject?: any
}

export const emitter = mitt<Events>()
