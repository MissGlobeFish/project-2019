import request from '@/utils/request'

// 用户车辆
export function getList(params) {
  return request({
    url: '/car',
    method: 'GET',
    params
  })
}

// 新增车辆
export function addCar(data) {
  return request({
    url: '/car',
    method: 'POST',
    data
  })
}

// 编辑车辆
export function editCar(data) {
  return request({
    url: '/car',
    method: 'PUT',
    data
  })
}

// 删除车辆
export function deleteCar(cid) {
  return request({
    url: `/car/${cid}`,
    method: 'DELETE'
  })
}
