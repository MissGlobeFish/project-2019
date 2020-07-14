import request from '@/utils/request'

// 查询收费标准列表
export function getList(params) {
  return request({
    url: '/charging-standard',
    method: 'get',
    params
  })
}

// 新增收费标准
export function addRates(data) {
  return request({
    url: '/charging-standard',
    method: 'post',
    data
  })
}

// 编辑收费标准
export function editRates(data) {
  return request({
    url: '/charging-standard',
    method: 'put',
    data
  })
}

// 删除收费标准
export function deleteRates(pid) {
  return request({
    url: `/charging-standard/${pid}`,
    method: 'delete',
  })
}

// 修改状态
export function editState(params) {
  return request({
    url: '/park-card/state',
    method: 'get',
    params
  })
}

// 查询单条收费标准
export function getItemRates(pid) {
  return request({
    url: `/charging-standard/${pid}`,
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