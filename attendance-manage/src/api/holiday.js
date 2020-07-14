/*
 * @Description: 假期
 * @Author: ep
 * @Date: 2019-11-05 17:18:40
 * @LastEditTime: 2019-11-13 10:16:44
 */
import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'holiday',
    method: 'get',
    params: query,
    baseURL: process.env.VUE_APP_HOLIDAY_API
  })
}