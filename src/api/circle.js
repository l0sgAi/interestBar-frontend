import request from '@/utils/request'

/**
 * 获取分类列表
 * @returns {Promise} 返回分类列表
 */
export function getCategories() {
  return request({
    url: '/category/get',
    method: 'get'
  })
}

/**
 * 创建兴趣圈
 * @param {Object} data - 兴趣圈数据
 * @param {string} data.name - 兴趣圈名称
 * @param {string} data.slug - 唯一标识符（用于URL SEO）
 * @param {string} data.avatar_url - 兴趣圈头像URL
 * @param {string} data.cover_url - 背景图URL
 * @param {string} data.description - 描述信息
 * @param {string} data.rule - 圈子规则/公告
 * @param {number} data.category_id - 分类ID
 * @param {number} data.join_type - 加入方式 0=直接加入 1=需要审核 2=私密圈子
 * @returns {Promise}
 */
export function createCircle(data) {
  return request({
    url: '/circle/create',
    method: 'post',
    data
  })
}
