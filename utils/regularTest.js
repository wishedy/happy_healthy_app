export const testPhoneNum = (val) => {
  // 判断手机号 包含16、17号段
  // return (/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/).test(val);
  return (/^1\d{10}$/).test(val)
}
export const testEmail = (str) => {
  const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
  return reg.test(str)
}
