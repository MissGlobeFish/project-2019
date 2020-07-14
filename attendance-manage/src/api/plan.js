/*
 * @Description: 
 * @Author: rcq
 * @Date: 2019-11-04 14:14:20
 * @LastEditTime: 2019-11-15 09:46:33
 */
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

export function deletePlan(data) {
  return request({
    url: '/plan/delete',
    method: 'delete',
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
