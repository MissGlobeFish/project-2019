import request from '@/utils/request'

export function getGradeList(data) {
  return request({
    url: '/grade',
    method: 'post',
    data
  })
}
