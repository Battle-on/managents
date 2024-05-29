
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function validateInput(str) {
  // 手机号码验证正则，这里使用一个简单的示例，适用于中国大陆手机号
  const phoneRegex = /^1[3-9]\d{9}$/
  // 邮箱验证正则，匹配常见的邮箱格式
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  str = str.trim()

  // 检查是否为手机号
  if (phoneRegex.test(str)) {
    return true
  }
  // 检查是否为邮箱
  if (emailRegex.test(str)) {
    return true
  }
  return false // 都不匹配则返回false
}
