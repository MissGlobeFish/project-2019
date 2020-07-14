/*
 * @Description: 
 * @Author: ep
 * @Date: 2019-11-05 16:03:04
 * @LastEditTime: 2019-11-05 16:03:26
 */
import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/myScheduling/list',
    method: 'get',
    params: query
  })
}
