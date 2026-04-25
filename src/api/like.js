import request from '@/utils/request'

export function toggleLike(data) {
  return request({
    url: '/like/toggle',
    method: 'post',
    data
  })
}
