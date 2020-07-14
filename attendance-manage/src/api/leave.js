/*
 * @Description: 请假管理
 * @Author: rcq
 * @Date: 2019-11-05 17:18:40
 * @LastEditTime: 2019-11-06 11:39:01
 */
import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/leave/list',
    method: 'get',
    params: query
  })
}

export function createLeave(data) {
  return request({
    url: '/leave/create',
    method: 'post',
    data
  })
}

export function updateLeave(data) {
  return request({
    url: '/leave/update',
    method: 'post',
    data
  })
}