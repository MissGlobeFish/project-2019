/**
 * XGPushManager 推送相关业务
 */
import { Platform, Alert} from 'react-native';
import XGPush from '../../nativeModules/XGPush/XGPush';
import NavigationService from '../navigations/NavigationService';

export default class XGPushManager {

    static debugLog(message?: any, ...optionalParams: any[]) {
        true ? console.log(message, optionalParams) : 0
    }

    // 启动并设置相关参数及各类事件
    static configXG() {
        //注册 Token
        XGPush.listenXGPushDidRegisterDeviceTokenEvent(
            // (reminder) => (this.setState({ token: 'token =' + reminder.deviceToken }))
            (reminder) => {this.debugLog("[XGPushManager] --------- listenXGPushDidRegisterDeviceTokenEvent", reminder)}
        )
        
        //收到推送
        XGPush.listenDidReceiveRemoteNotification(
            (info) => {this.debugLog("[XGPushManager] --------- listenDidReceiveRemoteNotification", info)}
        );

        //点击进入
        XGPush.listenDidLaunchAppByOpenNotification(
             (info) => {
                 this.debugLog("[XGPushManager] --------- listenDidLaunchAppByOpenNotification", info)
                 //跳转到指定页面
                 NavigationService.navigate('MessageCenter')
                }
         );

        //信鸽服务情况
        XGPush.listenXGPushDidFinishStartEvent(
            // (reminder) => (this.setState({ xgStartMs: '信鸽启动状态' + reminder.isSuccess }))
            // (reminder) => (alert('信鸽启动状态' + reminder.isSuccess))
            (cd) => {this.debugLog("[XGPushManager] --------- listenXGPushDidFinishStartEvent", cd)}
        );

        //注册成功回调
        XGPush.listenDidRegisterForRemoteNotification(
            // (deviceToken) => (this.setState({ token: 'token =' + deviceToken }))
            (token) => {this.debugLog("[XGPushManager] --------- listenDidRegisterForRemoteNotification", token)}
        );
        //注册失败回调
        XGPush.listenDidFailToRegisterForRemoteNotification(
            (error) => {
                this.debugLog("[XGPushManager] --------- listenDidFailToRegisterForRemoteNotification", error)
        });

        //信鸽绑定用户成功事件
        XGPush.listenXGPushDidBindSuccessEvent(
            // (deviceToken) => (this.setState({ token: 'token =' + deviceToken }))
            (token) => {this.debugLog("[XGPushManager] --------- listenXGPushDidBindSuccessEvent", token)}
        );

        XGPush.enableDebug(true);//开启信鸽Debug日志
        
        if (Platform.OS == "android") {
            XGPush.registerPush();//注册信鸽推送
        }
        if (Platform.OS == "ios") {
            XGPush.starXG(2200313183, 'I8752RFUF4CF');//设置信鸽参数
            XGPush.setBadge(0);
        }

        
    }

    // 绑定信鸽账号
    static bindXGAccount(account: string) {
        XGPush.bindXGAccount(account);
    }

    // 设置角标
    static setBadge(badgeNumber: number) {
        if (Platform.OS == "ios") {
            XGPush.setBadge(badgeNumber);
        }
    }

    // 关闭
    static stopXG() {
        XGPush.removeAllListener();
    }


}



/** 
 * 藏宝阁推送带参数信息格式
 * 
 * 
 * Android：
 * 
 * listenDidLaunchAppByOpenNotification 
 * 
 * {CustomContent: "{"type":"message"}", NActionType: 1, NotificationId: 0, MsgId: 301370739, Title: "藏宝阁", …}
 * 
 * 
 * iOS：
 * 
 * listenDidLaunchAppByOpenNotification
 * 
 * {aps: {…}, xg: {…}, type: "message"}
 * 
 * */