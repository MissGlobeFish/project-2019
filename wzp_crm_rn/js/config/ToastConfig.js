/**
 * ToastConfig 弹框配置
 */

 import Toast from '../common/Toast'

 Toast.setDefaultOptions({
    showLoading: true,
    // backgroundColor: 'gray',
    opacity: 0.95,
    textColor: 'white',
    duration: 1000,//Toast.durations.SHORT,
    maskColor: '#000000'

    // setting image you like

    // imageLoading: require('xxxxxxxxxx'),
    // imageSuccess: require('xxxxxxxxxx'),
    // imageFail: require('xxxxxxxxxx'),
    // imageInfo: require('xxxxxxxxxx'),
    // imageWarn: require('xxxxxxxxxx'),
});
