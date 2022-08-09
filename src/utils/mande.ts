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
  const token = await getAccessToken?.() || ''
  const userInfo = await getIdTokenClaims()
  if (token) setToken(token)
  if (token && userInfo) {
    useUserStore().setUserInfo(token, {
      username: userInfo.username || '',
      avatar: userInfo.avatar || '',
      roleNames: userInfo?.role_names || [],
    })
  }
}

export const downloadApi = mande(import.meta.env.VITE_BE_HOST + '/api/data/download')
export const saveApi = mande(import.meta.env.VITE_BE_HOST + '/api/data/save')
export const materialApi = mande(import.meta.env.VITE_BE_HOST + '/api/data/material')
