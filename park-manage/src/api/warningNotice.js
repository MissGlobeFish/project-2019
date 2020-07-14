import request from '@/utils/request'

// 查询通知人员列表
export function getList(params) {
  return request({
    url: '/lot',
    method: 'get',
    params
  })
}

// 新增通知人员
export function addNotice(data) {
  return request({
    url: '/lot',
    method: 'post',
    data
  })
}

// 编辑通知人员
export function editNotice(data) {
  return request({
    url: '/lot',
    method: 'put',
    data
  })
}

// 删除通知人员
export function deleteNotice(pid) {
  return request({
    url: `/lot/${pid}`,
    method: 'delete',
  })
}

//查询单条通知人员
export function getItemNotice(pid) {
  return request({
    url: `/lot/${pid}`,
    method: 'get',
  })
}

//改变状态
export function noticeState(pid) {
  return request({
    url: '',
    method: 'get',
  })
}
