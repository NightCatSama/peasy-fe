/** 判断是否合法命名 */
export const isValidName = (name: string) => {
  return !/[^0-9a-zA-Z\u4e00-\u9fa5_-]/.test(name)
}

export const getUnValidChar = (name: string) => {
  const matchObj = name.match(/[^0-9a-zA-Z\u4e00-\u9fa5_-]/g)
  return matchObj?.length ? [...new Set(matchObj)] : null
}