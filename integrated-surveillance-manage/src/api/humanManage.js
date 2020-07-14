import request from '@/utils/request'

export function getHumanList() {
  return request({
    url: '/qyWechat/listQyChatUser',
    // baseURL: process.env.VUE_APP_MOCK_API,
    method: 'get'
  })
}
