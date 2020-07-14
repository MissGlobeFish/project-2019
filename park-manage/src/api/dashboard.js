import request from '@/utils/request'

// 基础统计
export function basicsStats(params) {
  return request({
    url: '/statistics/base/summary',
    method: 'get',
    params
  })
}

// 当日趋势详情
export function todayStats(params) {
  return request({
    url: '/statistics/base/summary/for-day',
    method: 'get',
    params
  })
}

// 历史统计
export function historyRecord(params) {
  return request({
    url: '/statistics/history',
    method: 'get',
    params
  })
}

