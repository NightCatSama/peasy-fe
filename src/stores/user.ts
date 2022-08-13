import { PageNode } from '@/config'
import { logtoMeApi } from '@/utils/mande'
import { defineStore } from 'pinia'

export interface IUserInfo {
  username: string
  avatar: string
  roleNames: string[]
  uId: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    accessToken: '',
    userInfo: null as IUserInfo | null,
  }),
  getters: {
    userName: (state) => state.userInfo?.username || '',
    avatar: (state) => state.userInfo?.avatar || '',
    isLogin: (state) => !!state.accessToken,
    isAdmin: (state) => state.userInfo?.roleNames?.includes('admin'),
  },
  actions: {
    async fetchUserInfo() {
      if (!this.isLogin) return

      const { data } = await logtoMeApi.get<any>('')
      this.userInfo = {
        ...this.userInfo!,
        avatar: data.avatar || '',
      }
    },
    async updateAvatar(img: string) {
      if (!this.isLogin) return

      await logtoMeApi.patch<any>('', {
        avatar: img,
      })
      this.userInfo = {
        ...this.userInfo!,
        avatar: img,
      }
    },
    setUserInfo(accessToken: string, userInfo: IUserInfo) {
      this.accessToken = accessToken
      this.userInfo = userInfo
    },
  },
})
