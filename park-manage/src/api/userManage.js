import request from '@/utils/request'

// 用户列表
export function getList(params) {
  return request({
    url: '/user',
    method: 'GET',
    params
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/user',
    method: 'POST',
    data
  })
}

// 编辑用户
export function editUser(data) {
  return request({
    url: '/user',
    method: 'PUT',
    data
  })
}

// 删除用户
export function deleteUser(userID) {
  return request({
    url: `/user/${userID}`,
    method: 'DELETE'
  })
}
