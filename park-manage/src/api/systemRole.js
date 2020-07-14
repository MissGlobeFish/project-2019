import request from '@/utils/request'

// 查询角色列表
export function getList(params) {
  return request({
    url: '/sys/role',
    method: 'get',
    params
  })
}

// 新增角色
export function addSystemRole(data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}

// 编辑角色
export function editSystemRole(data) {
  return request({
    url: '/sys/role',
    method: 'put',
    data
  })
}

// 删除角色
export function deleteSystemRole(pid) {
  return request({
    url: `/sys/role/${pid}`,
    method: 'delete',
  })
}

// 查询单条角色
export function getItemSystemRole(pid) {
  return request({
    url: `/sys/role/${pid}`,
    method: 'get',
  })
}

// 修改状态
export function editState(params) {
  return request({
    url: '/sys/role/state',
    method: 'get',
    params
  })
}

// 查询一级菜单列表
export function getTreeList(params) {
  return request({
    url: '/sys/menu/all-nodes',
    method: 'get',
    params
  })
}