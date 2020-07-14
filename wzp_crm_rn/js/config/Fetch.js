/**
 * fetch轻量级封装
 * 为什么要封装Fetch?
 * 1.代码复用
 * 2.高内聚低耦合
 * 3.便于项目的扩展和后期的维护
 */
import NavigatorUtil from '../util/NavigationUtil';
import URLS from './Api';
import PersistanceManger from '../util/PersistanceManger'
import { DeviceEventEmitter, Alert } from 'react-native';
import Toast from '../common/Toast'


export default class HttpUtils {

  /**
   * GET 请求
   *
   * @static
   * @param {String} url
   * @param {Object} params
   * @param {boolean} [retry=true]
   * @param {boolean} [isRetryRquest=false]
   * @returns
   * @memberof HttpUtils
   */
  static get(url, params, retry = true, isRetryRquest = false) {
    return new Promise((resolve, reject) => {
      fetch(`${URLS[url]}?${NavigatorUtil.serialize(params)}`, {
        credentials: 'include',
        headers: {
          "token": PersistanceManger.ShareInstance().token,
          "kdservice-sessionid": PersistanceManger.ShareInstance().kdSession,
          "Authorization": PersistanceManger.ShareInstance().token
        },
      })
        .then((response) => {
          console.log("[Fetch] --- GET --- " + "URL:" + url + "\n Response:", response)
          return HttpUtils.responseFilter(response, retry, () => HttpUtils.get(url, params, false, true))
        })
        .then(result => {
          console.log(result,result.code)
          //重试的请求
          if (isRetryRquest) {
            resolve(result)
            return;
          }
          //登陆失效判断
          if (result.code && result.code === -1001) {
            DeviceEventEmitter.emit(global.NotificationIdentify.loginNotice, "logout");
            return;
          }
          //基础返回结构校验
          if (result.code && result.code == 1) {
            resolve(result.data)
            return;
          } else if (result.code && result.code != 1) {
            reject({ msg: result.msg, code: result.code })
            return
          } else {
            reject({ msg: "返回值格式校验失败", code: "" })
          }
          // resolve(result)
        })
        .catch(error => {
          console.log(error)
          Toast.showFail(' 网络错误加载失败 ')
          reject(error)
        })
    })
  }



  /**
   * POST 请求
   *
   * @static
   * @param {String} url
   * @param {Object} data
   * @param {boolean} [retry=true]
   * @param {boolean} [isRetryRquest=false]
   * @returns
   * @memberof HttpUtils
   */
  static post(url, data, retry = true, isRetryRquest = false) {
    let formData = new FormData();
    for (let key in data) {
      formData.append(key, data[key]);
    }
    return new Promise((resolve, reject) => {
      fetch(URLS[url], {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "token": PersistanceManger.ShareInstance().token,
          "kdservice-sessionid": PersistanceManger.ShareInstance().kdSession,
          "Authorization": PersistanceManger.ShareInstance().token
        },
        body: JSON.stringify(data)
      })
        .then(response => {
          console.log("[Fetch] --- POST --- " + "URL:" + url + "\n Response:", response)
          return HttpUtils.responseFilter(response, retry, () => HttpUtils.post(url, data, false, true))
        })
        .then(result => {
          //重试的请求
          if (isRetryRquest) {
            resolve(result)
            return;
          }
          //单独处理登陆接口，因为登陆接口返回值格式不同
          if (url == 'login') {
            resolve(result)
            return;
          }
          //基础返回结构校验
          if (result.code && result.code == 1) {
            resolve(result.data)
            return;
          } else if (result.code && result.code != 1) {
            reject({ msg: result.msg, code: result.code })
            return
          } else {
            reject({ msg: "返回值格式校验失败", code: "" })
          }
        })
        .catch(error => {
          console.log(error)
          Toast.showFail(' 网络错误加载失败 ')
          reject(error)
        })
    })
  }

/**
   * PUT 请求
   *
   * @static
   * @param {String} url
   * @param {Object} data
   * @param {boolean} [retry=true]
   * @param {boolean} [isRetryRquest=false]
   * @returns
   * @memberof HttpUtils
   */
  static put(url, data, retry = true, isRetryRquest = false) {
    let formData = new FormData();
    for (let key in data) {
      formData.append(key, data[key]);
    }
    return new Promise((resolve, reject) => {
      fetch(URLS[url], {
        method: 'PUT',
        credentials: 'include',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "token": PersistanceManger.ShareInstance().token,
          "kdservice-sessionid": PersistanceManger.ShareInstance().kdSession
        },
        body: JSON.stringify(data)
      })
        .then(response => {
          console.log("[Fetch] --- POST --- " + "URL:" + url + "\n Response:", response)
          return HttpUtils.responseFilter(response, retry, () => HttpUtils.post(url, data, false, true))
        })
        .then(result => {
          console.log(result,'123132')
          //重试的请求
          if (isRetryRquest) {
            resolve(result)
            return;
          }
          //单独处理登陆接口，因为登陆接口返回值格式不同
          if (url == 'login') {
            resolve(result)
            return;
          }
          //基础返回结构校验
          if (result.code && result.code == 1) {
            resolve(result.data)
            return;
          } else if (result.code && result.code != 1) {
            reject({ msg: result.msg, code: result.code })
            return
          } else {
            reject({ msg: "返回值格式校验失败", code: "" })
          }
        })
        .catch(error => {
          console.log(error)
          Toast.showFail(' 网络错误加载失败 ')
          reject(error)
        })
    })
  }


  /**
   * 特殊的 Get 传参方法
   *
   * @static
   * @param {*} url
   * @param {*} suburl
   * @param {*} params
   * @param {boolean} [retry=true]
   * @param {boolean} [isRetryRquest=false]
   * @returns
   * @memberof HttpUtils
   */
  static getOther(url, suburl, params, retry = true, isRetryRquest = false) {
    return new Promise((resolve, reject) => {
      console.log(`${URLS[url]}/${suburl}?${NavigatorUtil.serialize(params)}`)
      fetch(`${URLS[url]}/${suburl}?${NavigatorUtil.serialize(params)}`, {
        credentials: 'include',
        headers: {
          "token": PersistanceManger.ShareInstance().token,
          "kdservice-sessionid": PersistanceManger.ShareInstance().kdSession,
          "Authorization": PersistanceManger.ShareInstance().token
        },
      })
        .then((response) => {
          console.log("[Fetch] --- GET(other) --- " + "URL:" + url + "\n Response:", response)
          return HttpUtils.responseFilter(response, retry, () => HttpUtils.getOther(url, suburl, params, false, true))
        })
        .then(result => {
          // console.log(result);
          //重试的请求
          if (isRetryRquest) {
            resolve(result)
            return;
          }
          //基础返回结构校验
          if (result.code && result.code == 1) {
            resolve(result.data)
            return;
          } else if (result.code && result.code != 1) {
            reject({ msg: result.msg, code: result.code })
            return
          } else {
            reject({ msg: "返回值格式校验失败", code: "" })
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  }



  /**
   * Delete方法
   *
   * @static
   * @param {*} url
   * @param {*} suburl
   * @param {*} params
   * @param {boolean} [retry=true]
   * @param {boolean} [isRetryRquest=false]
   * @returns
   * @memberof HttpUtils
   */
  static delete(url, suburl, params, retry = true, isRetryRquest = false) {
    return new Promise((resolve, reject) => {
      fetch(`${URLS[url]}/${suburl}?${NavigatorUtil.serialize(params)}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "token": PersistanceManger.ShareInstance().token,
          "kdservice-sessionid": PersistanceManger.ShareInstance().kdSession
        },
      })
        .then((response) => {
          console.log("[Fetch] --- DELETE(other) --- " + "URL:" + url + "\n Response:", response)
          return HttpUtils.responseFilter(response, retry, () => HttpUtils.delete(url, suburl, params, false, true))
        })
        .then(result => {
          console.log(result);
          //重试的请求
          if (isRetryRquest) {
            resolve(result)
            return;
          }
          //基础返回结构校验
          if (result.code && result.code == 1) {
            resolve(result.data)
            return;
          } else if (result.code && result.code != 1) {
            reject({ msg: result.msg, code: result.code })
            return
          } else {
            reject({ msg: "返回值格式校验失败", code: "" })
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  }



  /**
   * 上传文件
   *
   * @static
   * @param {*} params
   * @param {*} filePath
   * @returns
   * @memberof HttpUtils
   */
  static upload(params, filePath) {
    return new Promise(function (resolve, reject) {
      let formData = new FormData();
      for (var key in params) {
        formData.append(key, params[key]);
      }
      let date = new Date()
      let name = date.getTime() + '.jpg'
      let file = { uri: filePath, type: 'image/jpeg', name: name };
      console.log("fileUri: ", filePath, "\n file: ", file)
      formData.append("file", file);
      console.log('上传接口')
      fetch(URLS['fileUpload'], {
        method: 'POST',
        headers: {
          "token": PersistanceManger.ShareInstance().token
        },
        body: formData,
      }).then((response) => response.json())
        .then((result) => {
          console.log('[Fetch] --- Upload(Image) ---', result);
          resolve(result);
        })
        .catch((err) => {
          console.log('err', err);
          reject(err);
        });
    });
  }




  /**
   * 登陆方法，执行部分本地数据保存
   *
   * @static
   * @param {String} userName
   * @param {String} psw
   * @returns
   * @memberof HttpUtils
   */
  static login(userName, psw) {
    return new Promise((resolve, reject) => {
      HttpUtils.post('login', { userName: userName, password: psw, resource: "intranet", systemCode: URLS['systemCode'] }, false).then((res) => {
        if (res.flag) {
          PersistanceManger.ShareInstance().saveLoginInfos(userName, psw, res.data)
        }
        resolve(res.data);
      }).catch(e => reject(e))
    })

  }

  
  /**
   * 处理 response 中的错误
   *
   * @static
   * @param {*} response
   * @param {*} retry
   * @param {*} retryRquest
   * @returns
   * @memberof HttpUtils
   */
  static async responseFilter(response, retry, retryRquest) {
    switch (response.status) {
      //成功
      case 200:
        if (response.headers.get('content-type').match(/application\/json/)) {
          return response.json();
        }
        if (response.headers.get('content-type').match(/text\/plain/)) {
          return response.text();
        }
        return response;
        break;
      //身份验证错误
      case 401:
        //Relogin
        if (!retry) {
          return null
        }
        let name = PersistanceManger.ShareInstance().loginName
        let psw = PersistanceManger.ShareInstance().psw

        await this.login(name, psw)
          .then((res) => {
            if (res.msg) {
              Toast.showFail("登录过期，请重新登录！")
              console.log("[Fetch] --- ReLogin ---  自动重新登录失败")
              DeviceEventEmitter.emit(global.NotificationIdentify.loginNotice, "logout");
            } else {
              console.log("[Fetch] --- ReLogin ---  自动重新登录成功")
            }
          })
          .catch(e => console.log(e))

        return retryRquest()
        break;

      default:
        throw new Error("HTTP ERROR :", response.status)
        break;
    }
  }

}



