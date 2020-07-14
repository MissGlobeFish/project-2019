const login = function() {
    let userInfo =  window.localStorage.getItem('userVer');
    if(userInfo && userInfo != 'undefined'){
        userInfo = JSON.parse(userInfo);
    }
    let url = window.location.href;
    let userVer = {};
    if( url.indexOf('?') !=-1)  {
        let data = url.substring(url.indexOf('?')+1).split('&');
        data.forEach(e => {
            let n = e.split('=');
            userVer[n[0]] = n[1];
        });
    }
    if(!userInfo || userInfo.token !=userVer.token ){
        isLogin(userVer)
    }
}


function isLogin(userVer) {
    if(userVer.token){
        let data = {"systemCode":global.SYS_CODE,"token":userVer.token};
        $.ajax({
            type: "POST",
            async: false,
            url: global.AUTH_URL +"/auth/sso/isLogin",
            data: JSON.stringify(data),
            contentType: 'application/json;charset=UTF-8',
            success: function(data){
                window.localStorage.setItem('userVer', data.info);
                //获取员工信息
                $.ajax({
                    type:"GET",
                    async:false,
                    url : global.AUTH_URL +"/auth/userInfo/findUserInfo/"+userVer.userName,
                    success: function(data){
                        if(data.userInfo.empCode == 'GS0303'){
                        localStorage.setItem('authority','1,2,3');
                        }else{
                        localStorage.setItem('authority','1');
                        }
                    localStorage.setItem('ms_empCode',data.userInfo.empCode);
                    localStorage.setItem('ms_deptCode',data.userInfo.deptCode);
                    }
                })
            },
            error: function(error){
            }
        });
    }
}

export default login;
