import request from '@/utils/request'

// 查询项目列表
export function getList(params) {
  return request({
    url: '/project',
    method: 'get',
    params
  })
}

// 新增项目
export function addProject(data) {
  return request({
    url: '/project',
    method: 'post',
    data
  })
}

// 编辑项目
export function editProject(data) {
  return request({
    url: '/project',
    method: 'put',
    data
  })
}

// 删除项目
export function deleteProject(pid) {
  return request({
    url: `/project/${pid}`,
    method: 'delete',
  })
}