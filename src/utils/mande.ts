import { defaults, mande, MandeInstance } from 'mande'
import { useLogto } from '@logto/vue'
import { useUserStore } from '@/stores/user'

export function setToken(token: string) {
  defaults.headers.Authorization = 'Bearer ' + token
}

export function clearToken() {
  delete defaults.headers.Authorization
}

export async function persistToken() {
  const { getAccessToken, getIdTokenClaims } = useLogto()
  const token = (await getAccessToken?.(import.meta.env.VITE_LOGTO_RESOURCE)) || ''
  const userInfo = await getIdTokenClaims()
  if (token) setToken(token)
  if (token && userInfo) {
    useUserStore().setUserInfo(token, {
      username: userInfo.username || '',
      avatar: userInfo.avatar || '',
      roleNames: userInfo?.role_names || [],
      uId: userInfo.sub || '',
    })
  }
  return {
    token,
    userInfo,
  }
}

export const downloadApi = mande(import.meta.env.VITE_BE_HOST + '/api/data/download')
export const materialApi = mande(import.meta.env.VITE_BE_HOST + '/api/data/material')
export const projectApi = mande(import.meta.env.VITE_BE_HOST + '/api/data/project')
export const logtoMeApi = mande(import.meta.env.VITE_BE_HOST + '/api/users/me')
