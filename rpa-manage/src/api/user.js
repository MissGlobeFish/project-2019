import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    baseURL: process.env.VUE_APP_MOCK_API,
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post',
    baseURL: process.env.VUE_APP_MOCK_API
  })
}

export function changePass(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}
