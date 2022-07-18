import mitt from 'mitt'

type Events = {
  location?: boolean
  switchMaterialsPanel: boolean
  updateMoveable?: any
}

export const emitter = mitt<Events>()
