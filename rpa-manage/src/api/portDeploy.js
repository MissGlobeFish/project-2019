import request from '@/utils/request'

// 获取接口
export function getPort(params) {
  return request({
    url: '/apiConfig',
    method: 'get',
    params
  })
}

// 编辑接口
export function editPort(data) {
    return request({
      url: '/apiConfig',
      method: 'post',
      data
    })
  }