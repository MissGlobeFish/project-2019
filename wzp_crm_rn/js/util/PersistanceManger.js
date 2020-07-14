/**
 * PersistanceManger 本地存储相关业务
 */

import { AsyncStorage } from 'react-native';

let instance = null;
// var name = '';
let CBG_Storage_Key = "com.guoshengtianfeng.CBG."


let storageKeyMap = [
    "appInfo",  //app信息
    "loginInfo",//登陆信息
    "userInfo", //用户信息
    /**
     *  销量分析
     **/
    "saleAnalyze_Authority",
    "saleAnalyze_Indexs",
    /**
     *  集五观记录次数
     **/
    "fiveViewpoint_TimesDic"
]

export default class PersistanceManger {
    //init
    constructor() {
        if (!instance) {
            instance = this;
        }
        return instance;
    }

    static ShareInstance() {
        let singleton = new PersistanceManger();
        return singleton;
    }

    //异步加载所有存储的数据
    loadLocalDatas() {
        a = this._getData("appInfo").then((value) => _appInfo = value ? value : {})
        b = this._getData("loginInfo").then((value) => _loginInfo = value ? value : {})
        c = this._getData("userInfo").then((value) => _userInfo = value ? value : {})
        return new Promise((resolve, reject) =>
            Promise.all([a, b, c]).then(function (res) {
                resolve('done')
            })
        )
    }

    //删除所有数据
    deleteAllDatas() {
        _userInfo = {}
        _loginInfo = {}
        let keys = storageKeyMap  //["appInfo", "loginInfo", "userInfo"]
        AsyncStorage.multiRemove(keys.map(key => CBG_Storage_Key + key), err => {
            if (err) {
                console.log("[PersistanceManger]" + "---------" + "Delete Data " + "ERROR: ", err)
            }
        });
    }


    //  查值/存储 方法
    _saveData(key, value) {
        console.log("[PersistanceManger]" + "---------" + "Save key: " + key + " --->", value)
        return AsyncStorage.setItem(CBG_Storage_Key + key, JSON.stringify(value), function (error) {
            if (error) {
                console.log("[PersistanceManger]" + "---------" + "Save key: " + key + "Faild!!!!!")
            }
        });
    }

    _getData(key) {
        return AsyncStorage.getItem(CBG_Storage_Key + key).then((v) => {
            const jsonValue = JSON.parse(v);
            console.log("[PersistanceManger]" + "---------" + "GET key: " + key + " --->", jsonValue)
            return jsonValue;
        });
    }

    _deleteData(key) {
        return AsyncStorage.removeItem(CBG_Storage_Key + key, function (error) {
            if (error) {
                console.log("[PersistanceManger]" + "---------" + "Delete key: " + key + "Faild!!!!!")
            }
        });
    }



    //存储容器（异步获取）, 初始化的时候会预先加载，保证其他值能同步获得
    _appInfo = {}
    get appInfo() {
        return _appInfo
    }
    set appInfo(value) {
        this._saveData("appInfo", value)
    }

    _loginInfo = {}
    get loginInfo() {
        return _loginInfo
    }
    set loginInfo(value) {
        this._saveData("loginInfo", value)
    }

    _userInfo = {}
    get userInfo() {
        return _userInfo
    }
    set userInfo(value) {
        this._saveData("userInfo", value)
    }

    //批量保存业务信息

    //登陆：
    saveLoginInfos(userName, psw, inf) {
        _loginInfo.loginName = userName
        _loginInfo.psw = psw
        _userInfo.empCode = inf.empCode
        _userInfo.userName = inf.empName
        _userInfo.token = inf.token
        _userInfo.kdSession = inf.kdSession
        _userInfo.userId = inf.userId
        this.loginInfo = _loginInfo
        this.userInfo = _userInfo
    }
    //个人信息
    saveUserInfo(inf) {
        _userInfo.empCode = inf.empCode
        _userInfo.userName = inf.empName
        _userInfo.deptNamePath = inf.deptNamePath
        _userInfo.jobDesc = inf.jobDesc
        _userInfo.photo = inf.photo
        if (inf.phoneNum) {
            _userInfo.phoneNum = inf.phoneNum.toString()
        }
        this.userInfo = _userInfo
    }


    //值信息，同步获取
    //_appInfo
    get version() {
        return _appInfo.version
    }
    set version(value) {
        _appInfo.version = value
        this.appInfo = _appInfo
    }


    //_loginInfo
    get isLogin() {
        return _loginInfo.isLogin
    }
    set isLogin(value) {
        _loginInfo.isLogin = value
        this.loginInfo = _loginInfo
    }

    get loginName() {
        return _loginInfo.loginName
    }
    set loginName(value) {
        _loginInfo.loginName = value
        this.loginInfo = _loginInfo
    }

    get psw() {
        return _loginInfo.psw
    }
    set psw(value) {
        _loginInfo.psw = value
        this.loginInfo = _loginInfo
    }

    get isGuest() {
        if (this.empCode == null) {
            return true
        }
        if (this.empCode.slice(0, 2) == 'LS') {
            return true
        } else if (this.empCode.slice(0, 2) == 'GS') {
            return false
        }
    }

    //_userInfo
    //token
    get token() {
        return _userInfo.token ? _userInfo.token : ""
    }
    set token(value) {
        _userInfo.token = value
        this.userInfo = _userInfo
    }

    //kdSession 金蝶Session
    get kdSession() {
        return _userInfo.kdSession ? _userInfo.kdSession : ""
    }
    set kdSession(value) {
        _userInfo.kdSession = value
        this.userInfo = _userInfo
    }

    //userId
    get userId() {
        return _userInfo.userId ? _userInfo.userId : ""
    }
    set userId(value) {
        _userInfo.userId = value
        this.userInfo = _userInfo
    }


    //用户名
    get userName() {
        return _userInfo.userName
    }
    set userName(value) {
        _userInfo.userName = value
        this.userInfo = _userInfo
    }

    //empCode
    get empCode() {
        return _userInfo.empCode
    }
    set empCode(value) {
        _userInfo.empCode = value
        this.userInfo = _userInfo
    }

    //deptNamePath
    get deptNamePath() {
        return _userInfo.deptNamePath
    }
    set deptNamePath(value) {
        _userInfo.deptNamePath = value
        this.userInfo = _userInfo
    }

    //jobDesc
    get jobDesc() {
        return _userInfo.jobDesc
    }
    set jobDesc(value) {
        _userInfo.jobDesc = value
        this.userInfo = _userInfo
    }

    //photo
    get photo() {
        return _userInfo.photo
    }
    set photo(value) {
        _userInfo.photo = value
        this.userInfo = _userInfo
    }

    //phone
    get phoneNum() {
        return _userInfo.phoneNum
    }
    set phoneNum(value) {
        _userInfo.phoneNum = value
        this.userInfo = _userInfo
    }




    /**
     * 销量分析权限
     *
     * @memberof PersistanceManger
     */
    get saleAnalyzeAuthority() {
        if (this._saleAnalyzeAuthority && this._saleAnalyzeAuthority != null) {
            new Promise((resolve, reject) => { resolve(this._saleAnalyzeAuthority) })
        }
        return this._getData("saleAnalyze_Authority")
    }
    set saleAnalyzeAuthority(value) {
        this._saleAnalyzeAuthority = value
        this._saveData("saleAnalyze_Authority", value)
    }


    /**
     * 销量分析指数
     *
     * @memberof PersistanceManger
     */
    get saleAnalyzeIndexs() {
        if (this._saleAnalyzeIndexs && this._saleAnalyzeIndexs != null) {
            new Promise((resolve, reject) => { resolve(this._saleAnalyzeIndexs) })
        }
        return this._getData("saleAnalyze_Indexs")
    }
    set saleAnalyzeIndexs(value) {
        this._saleAnalyzeIndexs = value
        this._saveData("saleAnalyze_Indexs", value)
    }

    /**
     * 销量分析饼状图指数
     *
     * @memberof PersistanceManger
     */
    get salePieAnalyzeIndexs() {
        if (this._saleAnalyzeIndexs && this._saleAnalyzeIndexs != null) {
            new Promise((resolve, reject) => { resolve(this._saleAnalyzeIndexs) })
        }
        return this._getData("saleAnalyze_PieIndexs")
    }
    set salePieAnalyzeIndexs(value) {
        this._saleAnalyzeIndexs = value
        this._saveData("saleAnalyze_PieIndexs", value)
    }





    /**
     * 集五观活动，摇一摇使用次数记录表
     *
     * @memberof PersistanceManger
     */
    get shakeTimesDictionary() {
        if (this._shakeTimesDictionary && this._shakeTimesDictionary != null) {
            new Promise((resolve, reject) => { resolve(this._shakeTimesDictionary) })
        }
        return this._getData("fiveViewpoint_TimesDic")
    }
    set shakeTimesDictionary(value) {
        this._shakeTimesDictionary = value
        this._saveData("fiveViewpoint_TimesDic", value)
    }

}
