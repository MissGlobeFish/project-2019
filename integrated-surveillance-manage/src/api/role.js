import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/routes',
    method: 'get',
    baseURL: process.env.VUE_APP_MOCK_API
  })
}

export function getRoles() {
  return request({
    url: '/roles',
    method: 'get',
    baseURL: process.env.VUE_APP_MOCK_API
  })
}
