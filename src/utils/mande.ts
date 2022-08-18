import { defaults, mande, MandeInstance } from 'mande'
import { useLogto } from '@logto/vue'
import { useUserStore } from '@/stores/user'

export const apiURL = (import.meta.env.VITE_BE_HOST || '') + (import.meta.env.VITE_BE_PREFIX || '')

export function setLang(lang: 'zh' | 'en') {
  defaults.headers['x-language'] = lang
}

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
      username: userInfo.username || userInfo.name || '',
      avatar: userInfo.avatar || '',
      roleNames: userInfo?.role_names || [],
      uid: userInfo.sub || '',
    })
  }
  return {
    token,
    userInfo,
  }
}

export const downloadApi = mande(apiURL + '/api/data/download')
export const materialApi = mande(apiURL + '/api/data/material')
export const projectApi = mande(apiURL + '/api/data/project')
export const logtoMeApi = mande(apiURL + '/api/users/me')
