import request from '@/utils/request'

// 获取项目架构
export function getRuleTree() {
  return request({
    url: '/relation/getTreeNode',
    method: 'get'
  })
}

// 创建节点
export function creatNode(data) {
  return request({
    url: '/relation/save',
    method: 'post',
    data
  })
}

// 更新节点信息
export function updateNode(data) {
  return request({
    url: '/relation/updateRelationByRelationCode',
    method: 'post',
    data
  })
}

// 删除节点
export function deleteNode(nodeId) {
  return request({
    url: '/relation/delete',
    method: 'delete',
    params: { relationCode: nodeId }
  })
}

// 获取节点信息
export function getNodeInfo(nodeId) {
  return request({
    url: '/relationUser/getRelationDetail',
    method: 'get',
    params: { relationCode: nodeId }
  })
}

// 绑定平台门店
export function bindFactory(data) {
  return request({
    url: '/relation/bindStore',
    method: 'post',
    data
  })
}

// 解绑用户
export function untieUser(data) {
  return request({
    url: '/relationUser/untieUser',
    method: 'post',
    data
  })
}

// 绑定用户
export function bindUser(data) {
  return request({
    url: '/relationUser/bindUser',
    method: 'post',
    data
  })
}
