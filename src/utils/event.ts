import mitt from 'mitt'

type Events = {
  location: void
}

export const emitter = mitt<Events>()
