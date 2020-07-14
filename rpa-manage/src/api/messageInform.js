import request from '@/utils/request'

// 查询消息通知信息
export function getMessage(params) {
  return request({
    url: '/email',
    method: 'get',
    params
  })
}

// 编辑消息通知信息
export function editMessage(data) {
  return request({
    url: '/email',
    method: 'put',
    data
  })
}