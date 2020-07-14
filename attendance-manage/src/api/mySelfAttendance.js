/*
 * @Description: 个人考勤记录
 * @Author: ep
 * @Date: 2019-11-07 16:31:54
 * @LastEditTime: 2019-11-07 16:33:18
 */
import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/mySelfAttendance/list',
    method: 'get',
    params: query
  })
}