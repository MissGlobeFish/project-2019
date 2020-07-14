/*
 * @Description: 
 * @Author: rcq
 * @Date: 2019-09-17 10:59:57
 * @LastEditTime: 2019-09-17 11:18:06
 */
import axios from 'axios'
import './components/common/constant.js'
// 1.登录
const loginEventReq =  new Promise((resolve, reject)=>{
  let data = {
    userName: 'yanglin',
    password: '888888',
    systemCode: '5f038fce16724cebbf6ffcf86c9c7e74'
    // systemCode: global.SYS_CODE
  };
  axios.post(global.AUTH_URL +"/auth/sso/login",data)
    .then(({data})=>{
      resolve(data)
      if (data.flag) {
        localStorage.setItem('userVer',JSON.stringify(data.data))
        axios.defaults.headers.common['Authorization'] = data.data.token; 
      }else {
        console.log("登录失败")
      }
    })
    .catch(error=>{
      reject(error)
      console.log(error)
    })
})


const loginEvent = function () {
  // 2.请求用户信息
  return new Promise((resolve, reject)=>{
    loginEventReq.then((data)=>{
      axios.get(global.AUTH_URL +"/auth/userInfo/findUserInfo/"+ JSON.parse(localStorage.getItem('userVer')).userName)
        .then(({data})=>{
          resolve(data)
          localStorage.setItem('ms_empCode',data.userInfo.empCode);
          localStorage.setItem('ms_deptCode',data.userInfo.deptCode);
        })
    })
  })
}
export default loginEvent;