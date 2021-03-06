import request from '@/utils/request'

export function searchUser(name) {
  return request({
    url: '/search/user',
    method: 'get',
    baseURL: process.env.VUE_APP_MOCK_API,
    params: { name }
  })
}

export function transactionList(query) {
  return request({
    url: '/transaction/list',
    method: 'get',
    baseURL: process.env.VUE_APP_MOCK_API,
    params: query
  })
}
