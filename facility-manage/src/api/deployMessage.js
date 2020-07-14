import request from '@/utils/request'

// 查询停车场列表
export function getList(params) {
  return request({
    url: '/lot',
    method: 'get',
    params
  })
}

// 新增停车场
export function addParking(data) {
  return request({
    url: '/lot',
    method: 'post',
    data
  })
}

// 编辑停车场
export function editParking(data) {
  return request({
    url: '/lot',
    method: 'put',
    data
  })
}

// 删除停车场
export function deleteParking(pid) {
  return request({
    url: `/lot/${pid}`,
    method: 'delete',
  })
}

//查询单条停车场
export function getItemParking(pid) {
  return request({
    url: `/lot/${pid}`,
    method: 'get',
  })
}
