import request from '@/utils/request'

// 查询优惠卡记录列表
export function getList(params) {
  return request({
    url: '/park-card',
    method: 'get',
    params
  })
}