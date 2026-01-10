import request from '@/utils/request'

/**
 * 更新用户个人信息
 * @param {Object} data - 更新数据
 * @param {string} data.username - 用户名（1-50字符）
 * @param {string} data.avatar_url - 头像URL
 * @returns {Promise}
 */
export function updateUserInfo(data) {
  return request({
    url: '/user/update',
    method: 'put',
    data
  })
}

/**
 * 上传图片
 * @param {File} file - 图片文件
 * @returns {Promise} 返回包含 URL 的响应
 */
export function uploadImage(file) {
  const formData = new FormData()
  formData.append('file', file)

  return request({
    url: '/upload/image',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
