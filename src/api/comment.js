import request from '@/utils/request'

/**
 * 发表评论
 * @param {Object} data - 评论数据
 * @param {number} data.post_id - 帖子ID
 * @param {string} data.content - 评论内容
 * @returns {Promise}
 */
export function createComment(data) {
  return request({
    url: '/comment/create',
    method: 'post',
    data
  })
}
