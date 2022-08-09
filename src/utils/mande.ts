import { defaults, mande, MandeInstance } from 'mande'
import { useLogto } from '@logto/vue'

export function setToken(token: string) {
  defaults.headers.Authorization = 'Bearer ' + token
}

export function clearToken() {
  delete defaults.headers.Authorization
}

export async function persistToken() {
  const { getAccessToken } = useLogto()
  const token = await getAccessToken?.() || ''
  if (token) setToken(token)
}

export const downloadApi = mande(import.meta.env.VITE_BE_HOST + '/api/data/download')
export const saveApi = mande(import.meta.env.VITE_BE_HOST + '/api/data/save')
export const materialApi = mande(import.meta.env.VITE_BE_HOST + '/api/data/material')
