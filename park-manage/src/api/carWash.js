import request from '@/utils/request'

// 查询洗车优惠用户记录列表
export function getList(params) {
  return request({
    url: '/park/preferential-time',
    method: 'get',
    params
  })
}

// 新增洗车优惠用户
export function addCarWash(data) {
  return request({
    url: '/park/preferential-time',
    method: 'post',
    data
  })
}

// 修改洗车优惠用户
export function modifyCarWash(data) {
  return request({
    url: '/park/preferential-time',
    method: 'put',
    data
  })
}

// 删除洗车优惠用户
export function deleteCarWash(pid) {
  return request({
    url: `/park/preferential-time/${pid}`,
    method: 'delete'
  })
}

// 根据ID 查询洗车优惠用户
export function itemCarWash(pid) {
  return request({
    url: `/park/preferential-time/${pid}`,
    method: 'get',
  })
}

// 远程查询停车场
export function getParking(params) {
  return request({
    url: '/lot/list',
    method: 'get',
    params
  })
}

// 判断是否在场
export function getIsInpark(params) {
  return request({
    url: '/park/preferential-time/check',
    method: 'get',
    params
  })
}