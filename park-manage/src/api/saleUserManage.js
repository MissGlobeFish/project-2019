import request from '@/utils/request'

// 优惠用户列表
export function getList(params) {
  return request({
    url: '/discount',
    method: 'GET',
    params
  })
}

// 新增优惠用户
export function addDiscountsUser(data) {
  return request({
    url: '/discount',
    method: 'POST',
    data
  })
}

// 编辑优惠用户
export function editDiscountsUser(data) {
  return request({
    url: '/discount',
    method: 'PUT',
    data
  })
}

// 删除优惠用户
export function deleteDiscountsUser(userID) {
  return request({
    url: `/discount/${userID}`,
    method: 'DELETE'
  })
}

// 根据ID 查询优惠用户
export function itemDiscounts(pid) {
  return request({
    url: `/discount/${pid}`,
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

//车辆类型枚举
export function getCarType(params) {
  return request({
    url: '/base-enum/base-code',
    method: 'get',
    params
  })
}
