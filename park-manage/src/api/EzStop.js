import request from '@/utils/request'

// 查询停车记录列表
export function getList(params) {
  return request({
    url: '/record',
    method: 'get',
    params
  })
}

// 查询支付记录
export function getPay(params) {
  return request({
    url: '/order',
    method: 'get',
    params
  })
}

// 新增停车记录
export function addParking(data) {
  return request({
    url: '/record',
    method: 'post',
    data
  })
}

// 修改停车记录
export function modifyParking(data) {
  return request({
    url: '/record',
    method: 'put',
    data
  })
}

// 删除停车记录
export function deleteParking(pid) {
  return request({
    url: `/record/${pid}`,
    method: 'delete'
  })
}

// 枚举
export function enumeration(data) {
  return request({
    url: '/m/code/query',
    method: 'post',
    data
  })
}

// 根据ID 查询停车记录
export function itemParking(pid) {
  return request({
    url: `/record/${pid}`,
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