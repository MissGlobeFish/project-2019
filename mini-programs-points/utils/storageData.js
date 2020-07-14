/**
 * 本地存储
 */

let store = {};

function debugLog(...values) {
  if (false) {
    console.log(...values)
  }
}

//存储值前缀
var Storage_Key = "ShiLiu_"

//存时间自定义的标识
var redis = "_Redis"


/**
 * 存值
 * @key 标示 {String} 存储值的 key
 * 
 */
store.set = (key, value, time) => {
  if (value === undefined) {
    return store.remove(Storage_Key + key)
  };

  //时间处理
  var seconds = parseInt(time)
  if (seconds > 0) {
    // newtime 到期时间
    var newtime = Date.parse(new Date())
    newtime = newtime / 1000 + seconds;
    wx.setStorageSync(Storage_Key + key + redis, newtime + "")
  } else {
    store.remove(Storage_Key + key + redis)
  }
  wx.setStorageSync(Storage_Key + key, JSON.stringify(value))
  debugLog("[ StorageData ]" + " ----- " + "Set Value To " + key + " ---> ", value)
};

/**
 * 获取存储值
 * @key 标示 {String} 存储值的 key
 * 
 */
store.get = (key) => {
  var deadtime = parseInt(wx.getStorageSync(Storage_Key + key + redis))
  if (deadtime) {
    //比较现在的时间，如果大于现在的时间，说明还没过期，然后返回key对应的value，如果小于现在的时间，说明过期了，删除key对应的数据，返回nul
    if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
      debugLog("[ StorageData ]" + " ----- " + "Get Value Of " + key + " ---> " + " 数据过期")
      store.remove(Storage_Key + key)
      return null
    }
  }
  let jsonValue = wx.getStorageSync(Storage_Key + key)
  if (jsonValue == '') {
    debugLog("[ StorageData ]" + " ----- " + "Get Value Of " + key + " ---> " + " 没有查到该 Key")
    return null
  } else {
    let value = JSON.parse(jsonValue)
    debugLog("[ StorageData ]" + " ----- " + "Get Value Of " + key + " ---> ", value)
    return value
  }
}


/**
 * 删除存储值
 * @key 标示 {String} 存储值的 key
 * 
 */
store.remove = (key) => {
  var error
  try {
    wx.removeStorageSync(Storage_Key + key)
  } catch (e) {
    error == e
  }
  debugLog("[ StorageData ]" + " ----- " + "Remove Key " + key + " ---> " + error ? error : "Success")
}

/**
 * 删除所有存储值
 * 
 */
store.clearAll = () => {
  var error
  try {
    wx.clearStorageSync()
  } catch (e) {
    error == e
  }
  debugLog("[ StorageData ]" + " ----- " + "Clear All " + " ---> " + error ? error : "Success")
}


export default {
  store
}