import request from '@/utils/request'

export function fetchReviewList(query) {
  return request({
    url: '/review/list',
    method: 'get',
    params: query
  })
}

export function createReview(data) {
  return request({
    url: '/review/create',
    method: 'post',
    data
  })
}

export function updateReview(data) {
  return request({
    url: '/review/update',
    method: 'post',
    data
  })
}
