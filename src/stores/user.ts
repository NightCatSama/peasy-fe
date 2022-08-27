import { PageNode } from '@/config'
import { logtoMeApi } from '@/utils/mande'
import { defineStore } from 'pinia'
import { MemberRole } from '@@/types/user'

export interface IUserInfo {
  username: string
  avatar: string
  member?: MemberRole
  roleNames: string[]
  uid: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    accessToken: '',
    userInfo: null as IUserInfo | null,
  }),
  getters: {
    userName: (state) => state.userInfo?.username || '',
    avatar: (state) => state.userInfo?.avatar || '',
    uid: (state) => state.userInfo?.uid || '',
    isLogin: (state) => !!state.accessToken,
    isAdmin: (state) => state.userInfo?.roleNames?.includes('admin'),
    isVIP: (state) => state.userInfo?.roleNames?.includes('admin') || [MemberRole.Advanced, MemberRole.Professional].includes(state.userInfo?.member!),
    vipName: (state) => {
      if (state.userInfo?.roleNames?.includes('admin')) {
        return 'Admin'
      }
      if (state.userInfo?.member === MemberRole.Advanced) {
        return 'Adv'
      }
      if (state.userInfo?.member === MemberRole.Professional) {
        return 'Pro'
      }
      return ''
    }
  },
  actions: {
    async fetchUserInfo() {
      if (!this.isLogin) return

      const { data } = await logtoMeApi.get<any>('')
      this.userInfo = {
        ...this.userInfo!,
        avatar: data.avatar || '',
        member: data.member || MemberRole.Member,
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
    clearUserInfo() {
      this.accessToken = ''
      this.userInfo = null
    }
  },
})
