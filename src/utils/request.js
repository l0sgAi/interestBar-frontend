import axios from 'axios'

// 创建 axios 实例
const request = axios.create({
  // 从环境变量读取 API 基础 URL
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://undeclared-porsha-nonformatively.ngrok-free.dev',
  timeout: 10000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('quba_token')
    if (token) {
      // 设置 sa-token 的请求头
      config.headers['satoken'] = token
    }
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data

    // 如果 code 不是 200，判断为错误
    if (res.code !== 200) {
      console.error('业务错误:', res.message)

      // 处理特定错误码
      if (res.code === 401) {
        // token 无效或过期，清除本地存储并跳转到登录页
        localStorage.removeItem('quba_token')
        window.location.href = '/'
      }

      return Promise.reject(new Error(res.message || '请求失败'))
    }

    return res
  },
  error => {
    console.error('响应错误:', error)

    // 处理 HTTP 错误状态码
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('quba_token')
          window.location.href = '/'
          break
        case 403:
          console.error('没有权限访问')
          break
        case 404:
          console.error('请求的资源不存在')
          break
        case 500:
          console.error('服务器错误')
          break
        default:
          console.error('请求失败:', error.response.data?.message || '网络错误')
      }
    }

    return Promise.reject(error)
  }
)

export default request
