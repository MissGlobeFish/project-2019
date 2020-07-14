/*
 * @Description: 我的排班
 * @Author: ep
 * @Date: 2019-10-29 15:56:54
 * @LastEditTime: 2019-11-05 16:03:49
 */
import Mock from 'mockjs'

import { planList, reviewList } from './dataCenter.js'


const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    date: +Mock.Random.date('T'),
    name: '@cname',
    startTime: +Mock.Random.date('T'),
    endTime: +Mock.Random.date('T')
  }))
}


export default [
  {
    url: '/myScheduling/list',
    type: 'get',
    response: config => {
      const { name,date, page = 1, limit = 20 } = config.query

      // const mockList = []

      // 处理搜索逻辑
      const mockList = List.filter(item => {
        if (name && item.name.indexOf(name) < 0) return false
        // if (date && date) return false 
        return true
      })

      // const realList = []
      
      const sortList = mockList
      const pageList = sortList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      console.log(pageList[0])

      return {
        code: 20000,
        data: {
          total: pageList.length,
          items: pageList
        }
      }
    }
  }
]
