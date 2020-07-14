import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/adminUser/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/adminUser/logout',
    method: 'get'
  })
}
