
export class GSNative {

	static gsNativeUserId() {
		let userId = window.localStorage.getItem('userId');
		return userId//"101508";
	}

	static gsNativeUserCode() {
		let usercode = window.localStorage.getItem('usercode');
		return usercode//"GS0863";
	}

	static gsNativeUserName() {
		let usercode = window.localStorage.getItem('username');
		return usercode
	}

	static gsNativeToken() {
		let token = window.localStorage.getItem('token');
		return token//"56310c74-1d3c-4ddf-8793-7ed7cb2b9e75"
	}
	static gsNativeVerify() {
		let verify = window.localStorage.getItem('Verify');
		return verify;
	}
	static goback(refresh) {
		var u = navigator.userAgent;
		var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
		var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
		if (isiOS) {
			window.webkit.messageHandlers.goback.postMessage(refresh);
		} else if (isAndroid) {
			window.native.goback(refresh);
		} else {
			window.history.back(-1);
		}

		
	}

}



