/*
 * @Description: api 请求路径列表
 * @Author: rcq
 * @Date: 2019-06-26 18:30:21
 * @LastEditTime: 2019-10-15 15:45:32
 */
/**
 * 接口api
 */
let EnvEnum = {
  dev: 0,
  develop: 1,
  release: 2
} 

// 👇 这里修改环境
let env = EnvEnum.dev;


let host;
switch (env) {
  case EnvEnum.dev:
    host = "https://16ddu.com/pomegranate/api"
    break;
  case EnvEnum.develop:

    break;
  case EnvEnum.release:
    break;
}


export default {
  host,
  apiPath:{
    
  } 
}