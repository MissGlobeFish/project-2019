/**
 * PortraitCamera 人像采集
 */

import React, { Component } from 'react';
import {
    Animated,
    Easing,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    Dimensions,
    DeviceEventEmitter,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Icon } from 'react-native-elements'
import Toast from '../../common/Toast'
import ajax from '../../config/Fetch';
import PersistanceManger from '../../util/PersistanceManger';
const { width, height } = Dimensions.get('window');
import '../../config/GlobalContants';

export default class PortraitCamera extends Component {

    static defaultProps = {

    };


    static navigationOptions = {
        title: '人脸采集',
        headerBackTitle: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            backCameraType: false,
            picPath: null,
        }
    }

    componentDidMount() {

    }


    // /**
    //  * 人像蒙版
    //  *
    //  * @memberof PortraitCamera
    //  */
    // cameraMaskComponent() {
    //     console.log()
    //     return (
    //         <View style={styles.maskBox}>
    //             <Image
    //                 resizeMode='contain'
    //                 source={require('../res/imgs/PortraitShape.png')}
    //                 style={{ width: '100%', height: width * (920 / 750), top: 0 }}
    //             />
    //         </View>
    //     )
    // }

    /**
     * 控制板
     *
     * @returns
     * @memberof PortraitCamera
     */
    cameraControlComponent() {
        const { backCameraType, picPath } = this.state;
        return (
            <View style={styles.controlPad}>
                {/* Mask Image */}
                {/* <View style={styles.maskBox}> */}
                    <Image
                        resizeMode='contain'
                        source={require('../../res/imgs/PortraitShape.png')}
                        style={{ width: '100%', height: width * (920 / 750), top: 0 }}
                    />
                {/* </View> */}
                {/* take Pic Button */}
                <TouchableOpacity
                    style={styles.takePicButtonStyle}
                    onPress={this.handelCameraBtn.bind(this)}>
                    <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 60 }}>
                        <Image
                            source={require('../../res/imgs/CameraShutter.png')}
                            style={{ width: 66, height: 66 }}
                        />
                    </View>
                </TouchableOpacity>
                {/* change Camera Button */}
                <TouchableOpacity
                    style={styles.changeCameraStyle}
                    onPress={this.changeCameraType.bind(this)}>
                    <Icon
                        name='refresh'
                        type='simple-line-icon'
                        color='#ffffff'
                        size={30}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    /**
     * 照片上传操作板
     *
     * @returns
     * @memberof PortraitCamera
     */
    uploadComponent() {
        const { backCameraType, picPath } = this.state;
        return (
            <View style={[styles.uploadBox, {}]} >
                <Image
                    source={{ uri: picPath }}
                    style={[
                        { top: '5%', left: '15%', position: 'absolute', width: '70%', height: '70%' }
                        //, { transform: [{ scaleX: backCameraType ? 1 : -1 }] }
                    ]}
                />
                {/* OK Button */}
                <TouchableOpacity
                    style={styles.okButtonStyle}
                    onPress={this.handelUploadBtn.bind(this)}>
                    <Text style={styles.uploadPadText} > 使用 </Text>
                    {/* <Icon name='cloud-upload' type='simple-line-icon' color='#ffffff' size={30} /> */}
                </TouchableOpacity>

                {/* Cancel Button */}
                <TouchableOpacity
                    style={styles.cancelButtonStyle}
                    onPress={this.handleCancelBtn.bind(this)}>
                    <Text style={styles.uploadPadText} > 重拍 </Text>
                    {/* <Icon name='arrow-left' type='simple-line-icon' color='#ffffff' size={30} /> */}
                </TouchableOpacity>
            </View>
        )
    }


    render() {
        const { navigate } = this.props.navigation;
        const { backCameraType, picPath } = this.state;
        return (
            <View style={styles.container}>
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={styles.preview}
                    type={backCameraType ? RNCamera.Constants.Type.back : RNCamera.Constants.Type.front}
                >
                    {this.cameraControlComponent()}
                </RNCamera>

                {picPath && this.uploadComponent()}

            </View >
        );
    }


    /**
     * 点击拍照按钮
     *
     * @memberof PortraitCamera
     */
    async handelCameraBtn() {
        var path = await this.takePicture()
        if (!path) {
            Toast.showFail("拍照异常")
            return
        }
        this.setState({
            picPath: path
        })


    }


    /**
     * 确定上传
     *
     * @memberof PortraitCamera
     */
    handelUploadBtn() {
        const { getParam, goBack } = this.props.navigation;

        Toast.showLoading("上传中...", { mask: true })
        this.uploadImage(this.state.picPath)
            .then((res) => {
                url = getParam("isNew") ? 'user/face/add' : 'user/face/update';
                param = {
                    url: res.datas,
                    empCode: PersistanceManger.ShareInstance().empCode,
                }
                Toast.showLoading("验证中...", { mask: true })
                console.log("图片上传成功： ", res.datas);
                return ajax.post(url, param)

            }).then((res) => {
                // if (res.code != 200) {
                //     return null
                // }

                switch (res.code) {
                    case 50001:
                        Toast.showFail("错误 :\n " + "未能识别有效人脸，请重试")
                        return null;
                        break;
                    case 30002:
                        Toast.showFail("错误 :\n " + "已存在当前人脸")
                        return null;
                        break;
                    case 200:
                        Toast.showFail("录入成功！")
                        break;
                    default:
                        Toast.showFail("错误 :\n " + res.code.toString())
                        return null;
                        break;
                }

                Toast.showSuccess("录入成功！")

                DeviceEventEmitter.emit(global.NotificationIdentify.userPortaitDidUpdate, true)
                goBack()

            }).catch((e) => {
                Toast.showFail("错误 :\n " + "请求已超时")
                console.log("Upload Error : ", e)
            })
    }

    /**
     * 取消重新拍照
     *
     * @memberof PortraitCamera
     */
    handleCancelBtn() {
        this.setState({
            picPath: null,
        })
    }


    /**
     * 拍照
     *
     * @memberof PortraitCamera
     */
    takePicture = async function () {
        if (this.camera) {
            const options = {
                quality: 0.1,
                base64: true,
                mirrorImage: this.state.backCameraType == false,
                fixOrientation: true,
                forceUpOrientation: true
            };
            const data = await this.camera.takePictureAsync(options)
            // this.setState({
            //     picPath: data.uri
            // })
            return data.uri
        } else {
            return null
        }
    }

    /**
     * 切换摄像头
     *
     * @memberof PortraitCamera
     */
    changeCameraType() {
        this.setState({
            backCameraType: !this.state.backCameraType,
        })
    }


    /**
     * 上传照片
     *
     * @memberof PortraitCamera
     */
    uploadImage(picUri) {
        let date = new Date()
        let name = date.getTime() + '.jpg'
        return ajax.upload({
            type: "RecognitionPortrait",
            fileName: name
        }, picUri)
    }






}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    preview: {
        flex: 1,
        padding: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },


    maskBox: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
    },


    controlPad: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },
    takePicButtonStyle: {
        position: 'absolute',
        bottom: 50,
    },
    changeCameraStyle: {
        position: 'absolute',
        left: 30,
        bottom: 50,
    },




    uploadBox: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#000000',
    },
    uploadPadText: {
        fontFamily: 'PingFangSC-Regular',
        fontSize: 18,
        color: '#FFFFFF',
        lineHeight: 24
    },
    okButtonStyle: {
        position: 'absolute',
        bottom: '10%',
        right: '15%',
    },
    cancelButtonStyle: {
        position: 'absolute',
        bottom: '10%',
        left: '15%',
    },

});
