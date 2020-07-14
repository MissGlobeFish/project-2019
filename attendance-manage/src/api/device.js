/*
 * @Description: 设备管理
 * @Author: ep
 * @Date: 2019-11-07 10:40:27
 * @LastEditTime: 2019-11-07 11:56:39
 */
import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/device/list',
    method: 'get',
    params: query
  })
}

export function createDevice(data) {
  return request({
    url: '/device/create',
    method: 'post',
    data
  })
}

export function updateDevice(data) {
  return request({
    url: '/device/update',
    method: 'post',
    data
  })
}

export function deleteDevice(data) {
  return request({
    url: '/device/delete',
    method: 'delete',
    data
  })
}


