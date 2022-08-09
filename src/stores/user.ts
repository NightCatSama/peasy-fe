import { PageNode } from '@/config'
import { defineStore } from 'pinia'

export const useDragStore = defineStore('user', {
  state: () => ({
    accessToken: '',
    userInfo: {}
  }),
  getters: {
  },
  actions: {
    getUserInfo() {

    }
  },
})
