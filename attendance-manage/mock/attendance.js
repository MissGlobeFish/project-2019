/*
 * @Description: 考勤记录详情
 * @Author: ep
 * @Date: 2019-10-29 15:56:54
 * @LastEditTime: 2019-11-14 10:20:40
 */
import Mock from 'mockjs'

// import { attendanceList, } from './dataCenter.js'


const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    name: '@cname',
    date: Mock.mock('@date("yyyy-MM-dd")'),
    startTime: Mock.mock('@time("HH:mm")'),
    endTime:  Mock.mock('@time("HH:mm")'),
    "startDevice|1": ["1219考勤机", "官方考勤机","销售考勤机","餐饮团队考勤机","GS12WIFI考勤机","外勤人员考勤机","地产团队考勤机"],
    "endDevice|1": ["1219考勤机", "官方考勤机","销售考勤机","餐饮团队考勤机","GS12WIFI考勤机","外勤人员考勤机","地产团队考勤机"],
    'workHour|0-20': 8,
    "status|1": ["success","exception"],
    "department|1": ["人力行政部","研发部","产品部","销售部"]
  }))
}

export default [
  {
    url: '/attendance/list',
    type: 'get',
    response: config => {
      const { name, status, page = 1, limit = 20 } = config.query

      // 处理搜索逻辑
      const mockList = List.filter(item => {
        if (name && item.name.indexOf(name) < 0) return false
        if (status && item.status != status) return false

        return true
      })
      const sortList = mockList;
      const pageList = sortList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      // console.log(pageList[0])

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/attendance/update',
    type: 'post',
    response: config => {
      // console.log('修改数据', config.body)
      var index = List.findIndex( (item) =>{
        return item.id == config.body.id
      })
      if (index != null) {
        List[index] =  config.body
      }
  
      console.log(index)
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
]

