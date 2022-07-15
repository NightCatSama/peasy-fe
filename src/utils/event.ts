import mitt from 'mitt'

type Events = {
  location: void
  switchNodePanel: boolean
}

export const emitter = mitt<Events>()
