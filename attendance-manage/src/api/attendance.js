/*
 * @Description: 
 * @Author: rcq
 * @Date: 2019-11-05 17:18:40
 * @LastEditTime: 2019-11-05 20:07:34
 */
import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/attendance/list',
    method: 'get',
    params: query
  })
}

export function updateAttendance(data) {
  return request({
    url: '/attendance/update',
    method: 'post',
    data
  })
}