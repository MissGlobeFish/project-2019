import request from '@/utils/request'

export function seachProjecByName(name) {
  return request({
    url: '/relation/listProjectByRelationName',
    // baseURL: process.env.VUE_APP_MOCK_API,
    method: 'get',
    params: { storeName: name }
  })
}

export function getDeviceByProject(projectId) {
  return request({
    url: '/hik/queryHikDevices',
    method: 'get',
    params: { storeId: projectId }
  })
}
