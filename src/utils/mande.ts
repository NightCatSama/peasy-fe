import { defaults, mande, MandeInstance } from 'mande'

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

export function persistToken() {
  const token = localStorage.getItem('access_token') || ''
  if (token) setToken(token)
  return token
}

/** BE 接口 */
export const downloadApi = mande(`${apiURL}/api/data/download`)
export const materialApi = mande(`${apiURL}/api/data/material`)
export const projectApi = mande(`${apiURL}/api/data/project`)
export const logtoMeApi = mande(`${apiURL}/api/users/me`)
export const activeMemberApi = mande(`${apiURL}/api/users/active-member`)
export const sendEmailApi = mande(`${apiURL}/api/users/send-email`)
export const fixApi = mande(`${apiURL}/api/data/fix`)

/** 前端模板预览链接 */
export const templatePreviewUrl = (templateId: string, hideHelper = false) =>
`${import.meta.env.VITE_URL_BASE}preview/${templateId}?hideHelper=${hideHelper}`

/** 前端项目预览链接 */
export const projectPreviewUrl = (projectId: string) =>
`${import.meta.env.VITE_URL_BASE}preview/p/${projectId}`

/** 获取模板预览链接 */
export const getTemplatePreview = (templateId: string) =>
  `${apiURL}/api/data/preview/template/${templateId}`

/** 获取项目预览链接 */
export const getProjectPreview = (projectId: string) =>
  `${apiURL}/api/data/preview/project/${projectId}`

/** 获取网站访问链接 */
export const getDomainURL = (domain: string, filename?: string) => `https://p.hzfe.org/${domain}${
  filename && filename !== 'index' ? `/${filename}.html` : ''
}`
