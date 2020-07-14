import request from '@/utils/request'

// 查询优惠卡记录列表
export function getList(params) {
  return request({
    url: '/park-card',
    method: 'get',
    params
  })
}

// 新增优惠卡记录
export function addMonthCard(data) {
  return request({
    url: '/park-card',
    method: 'post',
    data
  })
}

// 编辑优惠卡记录
export function editMonthCard(data) {
  return request({
    url: '/park-card',
    method: 'put',
    data
  })
}

// 删除优惠卡记录
export function deleteMonthCard(pid) {
  return request({
    url: `/park-card/${pid}`,
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

// 查询单条优惠卡记录
export function getItemMonthCard(pid) {
  return request({
    url: `/park-card/${pid}`,
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