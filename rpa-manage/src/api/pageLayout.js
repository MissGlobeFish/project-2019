import request from '@/utils/request'

// 查询页面列表
export function getList(params) {
  return request({
    url: '/websiteConfig',
    method: 'get',
    params
  })
}

// 新增页面
export function addPage(data) {
  return request({
    url: '/websiteConfig',
    method: 'post',
    data
  })
}

// 编辑页面
export function editPage(data) {
  return request({
    url: '/websiteConfig',
    method: 'put',
    data
  })
}

// 删除页面停车场
export function deletePage(pid) {
  return request({
    url: `/websiteConfig/${pid}`,
    method: 'delete',
  })
}
