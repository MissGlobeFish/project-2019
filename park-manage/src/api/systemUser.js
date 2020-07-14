import request from '@/utils/request'

// 查询系统用户列表
export function getList(params) {
  return request({
    url: '/sys/user',
    method: 'get',
    params
  })
}

// 新增系统用户
export function addSystemUser(data) {
  return request({
    url: '/sys/user',
    method: 'post',
    data
  })
}

// 编辑系统用户
export function editSystemUser(data) {
  return request({
    url: '/sys/user',
    method: 'put',
    data
  })
}

// 删除系统用户
export function deleteSystemUser(pid) {
  return request({
    url: `/sys/user/${pid}`,
    method: 'delete',
  })
}

// 重置密码
export function resetPasswords(data) {
  return request({
    url: '/sys/user',
    method: 'put',
    data
  })
}

// 查询单条系统用户
export function getItemSystemUser(pid) {
  return request({
    url: `/sys/user/${pid}`,
    method: 'get',
  })
}

// 修改状态
export function editState(params) {
  return request({
    url: '/sys/user/state',
    method: 'get',
    params
  })
}

// 查询角色列表
export function findRoleId(params) {
  return request({
    url: '/sys/role/search',
    method: 'get',
    params
  })
}