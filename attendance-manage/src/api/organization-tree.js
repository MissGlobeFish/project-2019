import request from '@/utils/request'

export function getDeptTree(data) {
  return request({
    url: '/dept/tree',
    method: 'post',
    data
  })
}
