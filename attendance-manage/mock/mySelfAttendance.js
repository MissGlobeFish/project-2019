/*
 * @Description: 考勤记录详情
 * @Author: ep
 * @Date: 2019-10-29 15:56:54
 * @LastEditTime: 2019-11-08 10:28:30
 */
import Mock from 'mockjs'

// import { attendanceList, } from './dataCenter.js'


const List = []
const count = 31

for (let i = 0; i < count; i++) {
  List.push(Mock.mock(
    {
      punch: [Mock.mock('@datetime'),Mock.mock('@datetime')],
      "status|1": true
    }
  ))
}

export default [
  {
    url: '/mySelfAttendance/list',
    type: 'get',
    response: config => {
      // console.log(pageList[0])

      return {
        code: 20000,
        data: {
          total: List.length,
          items: List
        }
      }
    }
  }
]

