export const validNameReg = /[^0-9a-zA-Z\u4e00-\u9fa5_-]/g

/** 判断是否合法命名 */
export const isValidName = (name: string) => {
  return !validNameReg.test(name)
}

/** 获取不合法的字符 */
export const getUnValidChar = (name: string) => {
  const matchObj = name.match(validNameReg)
  return matchObj?.length ? [...new Set(matchObj)] : null
}
