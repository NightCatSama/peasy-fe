import { PageNode } from '@/config'
import { activeMemberApi, clearToken, logtoMeApi, setToken } from '@/utils/mande'
import { defineStore } from 'pinia'
import { IUserProfile, MemberRole } from '@@/types/user'
import { IResponse } from '@@/types/response'

export const useUserStore = defineStore('user', {
  state: () => ({
    accessToken: '',
    userProfile: null as IUserProfile | null,
  }),
  getters: {
    userName: (state) => state.userProfile?.userInfo?.userName || '',
    avatar: (state) => state.userProfile?.userInfo?.avatar || '',
    uid: (state) => state.userProfile?.id || '',
    isLogin: (state) => !!state.accessToken,
    isAdmin: (state) => state.userProfile?.isAdmin,
    isVIP: (state) => state.userProfile?.isAdmin || [MemberRole.Advanced, MemberRole.Professional].includes(state.userProfile?.customData?.member!),
    vipName: (state) => {
      if (state.userProfile?.isAdmin) {
        return 'Admin'
      }
      if (state.userProfile?.customData?.member === MemberRole.Advanced) {
        return 'Advanced'
      }
      if (state.userProfile?.customData?.member === MemberRole.Professional) {
        return 'Professional'
      }
      return 'Basic'
    },
    member: (state) => state.userProfile?.customData?.member || MemberRole.Member,
    expireDate: (state) => state.userProfile?.customData?.expireTime ? new Date(state.userProfile.customData.expireTime).toLocaleDateString() : '',
  },
  actions: {
    async fetchUserInfo() {
      if (!this.isLogin) return

      const { data } = await logtoMeApi.get<any>('')
      this.userProfile = data
    },
    async updateAvatar(img: string) {
      if (!this.isLogin) return

      const { data } = await logtoMeApi.patch<any>('', {
        avatar: img,
      })
      this.userProfile = data
    },
    /** 激活会员 */
    async activeMember(code: string) {
      if (!this.isLogin) return

      const { data } = await activeMemberApi.post<IResponse<IUserProfile>>('', { code })
      this.userProfile = data
    },
    setAccessToken(token: string) {
      this.accessToken = token
      setToken(token)
    },
    setUserInfo(userProfile: IUserProfile) {
      this.userProfile = userProfile
    },
    clearUserInfo() {
      this.accessToken = ''
      clearToken()
      this.userProfile = null
    }
  },
})
