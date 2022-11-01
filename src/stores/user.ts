import { activeMemberApi, logtoMeApi } from '@/utils/mande'
import { IResponse } from '@@/types/response'
import { IUserProfile, MemberRole } from '@@/types/user'
import { defineStore } from 'pinia'

export interface IUserInfo {
  username: string
  avatar: string
  member?: MemberRole
  /** 会员过期时间 */
  expireTime?: number
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
    isVIP: (state) =>
      state.userInfo?.roleNames?.includes('admin') ||
      [MemberRole.Advanced, MemberRole.Professional].includes(state.userInfo?.member!),
    vipName: (state) => {
      if (state.userInfo?.roleNames?.includes('admin')) {
        return 'Admin'
      }
      if (state.userInfo?.member === MemberRole.Advanced) {
        return 'Advanced'
      }
      if (state.userInfo?.member === MemberRole.Professional) {
        return 'Professional'
      }
      return 'Basic'
    },
    member: (state) => state.userInfo?.member || MemberRole.Member,
    expireDate: (state) =>
      state.userInfo?.expireTime ? new Date(state.userInfo.expireTime).toLocaleDateString() : '',
  },
  actions: {
    async fetchUserInfo() {
      if (!this.isLogin) return

      const { data } = await logtoMeApi.get<any>('')
      this.userInfo = {
        ...this.userInfo!,
        avatar: data.avatar || '',
        member: data.member || MemberRole.Member,
        expireTime: data.expireTime,
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
    /** 激活会员 */
    async activeMember(code: string) {
      if (!this.isLogin) return

      const { data } = await activeMemberApi.post<IResponse<IUserProfile['customData']>>('', {
        code,
      })
      this.userInfo = {
        ...this.userInfo!,
        member: data.member || MemberRole.Member,
        expireTime: data.expireTime,
      }
    },
    setUserInfo(accessToken: string, userInfo: IUserInfo) {
      this.accessToken = accessToken
      this.userInfo = userInfo
    },
    clearUserInfo() {
      this.accessToken = ''
      this.userInfo = null
    },
  },
})
