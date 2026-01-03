import request from '@/utils/request'

/**
 * 用户登录
 * @param {string} provider - 登录提供商 (google)
 * @returns {Promise}
 */
export function loginWithOAuth(provider) {
  // 返回后端 OAuth 登录 URL
  return `${request.defaults.baseURL}/auth/${provider}/login`
}

/**
 * 获取当前用户信息
 * @returns {Promise}
 */
export function getUserInfo() {
  return request({
    url: '/user/get',
    method: 'get'
  })
}

/**
 * 退出登录
 * @returns {Promise}
 */
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}
