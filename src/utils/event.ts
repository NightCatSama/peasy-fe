import mitt from 'mitt'

type Events = {
  location?: boolean
  switchMaterialsPanel?: boolean
  switchPageList?: boolean
  updateMoveable?: any
  saveHistory?: boolean
  collapseGroup?: any
  saveColorVars: string
  saveProject?: any
  openChat?: any
}

export const emitter = mitt<Events>()
