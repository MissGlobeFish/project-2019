import request from '@/utils/request'

// 查询任务时间
export function getList(params) {
  return request({
    url: '/cronConfig',
    method: 'get',
    params
  })
}

//修改任务时间
export function editTask(data) {
  return request({
    url: '/cronConfig',
    method: 'put',
    data
  })
}

//手动启用
export function manualTask(params) {
  return request({
    url: '/execute',
    method: 'get',
    params
  })
}

//任务轨迹列表
export function missionLocusList(params) {
  return request({
    url: '/jobTrace',
    method: 'get',
    params
  })
}

// 轨迹详情
export function missionLocusDetails(jid) {
  return request({
    url: `/jobTrace/${jid}`,
    method: 'get',
  })
}