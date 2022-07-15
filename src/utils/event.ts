import mitt from 'mitt'

type Events = {
  location?: boolean
  switchNodePanel: boolean
}

export const emitter = mitt<Events>()
