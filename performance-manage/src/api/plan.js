import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/plan/list',
    method: 'get',
    params: query
  })
}

export function createPlan(data) {
  return request({
    url: '/plan/create',
    method: 'post',
    data
  })
}

export function updatePlan(data) {
  return request({
    url: '/plan/update',
    method: 'post',
    data
  })
}

export function changePlanStatus(data) {
  return request({
    url: '/plan/changeStatus',
    method: 'post',
    data
  })
}
