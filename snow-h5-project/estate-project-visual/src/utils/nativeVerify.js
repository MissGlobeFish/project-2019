
export class GSNative {

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



