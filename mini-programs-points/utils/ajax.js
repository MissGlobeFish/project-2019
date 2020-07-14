/*
 * @Description: 网络层
 * @Author: rcq
 * @Date: 2019-10-15 16:04:36
 * @LastEditTime: 2019-10-15 16:50:37
 */
import api from 'api.js'
const methods = ['get','post','put','delete'];
const ajax = {};
for (let item of methods) {
  ajax[item] = ({url,data,subUrl}) => {
    console.log(url,data,subUrl)
    if (subUrl) {
      url = `${api.host}${url}/${subUrl}`
    } else {
      url = `${api.host}${url}`
    }
    return new Promise((resolve, reject)=>{
      wx.request({
        url: url,
        data: data,
        header: {'content-type':'application/json'},
        method: item,
        success: (response)=>{

        },
        fail: ()=>{},
        complete: ()=>{}
      });
    })
  }
}
export default ajax