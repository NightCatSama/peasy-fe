import { PageNode } from '@/config'
import { defineStore } from 'pinia'

export interface IUserInfo {
  username: string
  avatar: string
  roleNames: string[]
}

export const useUserStore = defineStore('user', {
  state: () => ({
    accessToken: '',
    userInfo: null as IUserInfo | null,
  }),
  getters: {
    userName: (state) => state.userInfo?.username || '',
    isLogin: (state) => !!state.accessToken,
    isAdmin: (state) => state.userInfo?.roleNames?.includes('admin'),
  },
  actions: {
    setUserInfo(accessToken: string, userInfo: IUserInfo) {
      this.accessToken = accessToken
      this.userInfo = userInfo
    }
  },
})
