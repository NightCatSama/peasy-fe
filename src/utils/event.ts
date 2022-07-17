import mitt from 'mitt'

type Events = {
  location?: boolean
  switchNodePanel: boolean
  updateMoveable?: any
}

export const emitter = mitt<Events>()
