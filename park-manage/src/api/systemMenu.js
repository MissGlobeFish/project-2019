import request from '@/utils/request'

// 查询一级菜单列表
export function getList(params) {
  return request({
    url: '/sys/menu',
    method: 'get',
    params
  })
}
// 查询下一级菜单列表
export function getChildList(params) {
  return request({
    url: '/sys/menu/next',
    method: 'get',
    params
  })
}

// 新增系统菜单
export function addSystemUser(data) {
  return request({
    url: '/sys/menu',
    method: 'post',
    data
  })
}

// 编辑系统菜单
export function editSystemUser(data) {
  return request({
    url: '/sys/menu',
    method: 'put',
    data
  })
}

// 删除系统菜单
export function deleteSystemUser(pid) {
  return request({
    url: `/sys/menu/${pid}`,
    method: 'delete',
  })
}

// 查询单条系统菜单
export function getItemSystemUser(pid) {
  return request({
    url: `/sys/menu/${pid}`,
    method: 'get',
  })
}

// 修改状态
export function editState(params) {
  return request({
    url: '/sys/menu/state',
    method: 'get',
    params
  })
}