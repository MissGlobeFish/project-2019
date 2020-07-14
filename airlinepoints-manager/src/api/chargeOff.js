import request from '@/utils/request'

// 查询停车记录列表
export function getList(params) {
  return request({
    url: '/device',
    method: 'get',
    params
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

//新增设备
export function addFacility(data) {
  return request({
    url: '/device',
    method: 'post',
    data
  })
}

//修改设备
export function modifyFacility(data) {
  return request({
    url: '/device',
    method: 'put',
    data
  })
}

//根据ID查询设备
export function searchFacility(did) {
  return request({
    url: `/device/${did}`,
    method: 'get',
  })
}

//注册连接
export function registerLink(params) {
  return request({
    url: '/device/registered',
    method: 'post',
    params
  })
}

//连接相机
export function connectCamera(params) {
  return request({
    url: 'device/conn',
    method: 'get',
    params
  })
}