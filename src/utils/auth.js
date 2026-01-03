const TOKEN_KEY = 'quba_token'
const TOKEN_EXPIRE_KEY = 'quba_token_expire'

export const auth = {
  /**
   * 保存 token
   * @param {string} token - sa-token
   * @param {number} expire - 过期时间（秒）
   */
  setToken(token, expire) {
    localStorage.setItem(TOKEN_KEY, token)
    if (expire) {
      // 计算过期时间戳（毫秒）
      const expireTime = Date.now() + parseInt(expire) * 1000
      localStorage.setItem(TOKEN_EXPIRE_KEY, expireTime.toString())
    }
  },

  /**
   * 获取 token
   * @returns {string|null}
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  },

  /**
   * 检查 token 是否有效
   * @returns {boolean}
   */
  isTokenValid() {
    const token = this.getToken()
    if (!token) {
      return false
    }

    const expireTime = localStorage.getItem(TOKEN_EXPIRE_KEY)
    if (expireTime) {
      // 检查是否过期
      const now = Date.now()
      return now < parseInt(expireTime)
    }

    return true
  },

  /**
   * 清除 token
   */
  clearToken() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(TOKEN_EXPIRE_KEY)
  },

  /**
   * 检查是否已登录
   * @returns {boolean}
   */
  isAuthenticated() {
    return this.isTokenValid()
  }
}
