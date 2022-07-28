import mitt from 'mitt'

type Events = {
  location?: boolean
  switchMaterialsPanel?: boolean
  updateMoveable?: any
  focus: Event
  blur: Event
}

export const emitter = mitt<Events>()
