/**
 * FormUpload --- 表单上传
 */
import React, { Component } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements'
import ImagePicker from 'react-native-image-picker';
import ajax from '../../config/Fetch';
import PropTypes from 'prop-types'
import FastImage from 'react-native-fast-image'

export default class FormUpload extends Component {


  static propTypes = {
    onValueChanged: PropTypes.func,
    value: PropTypes.array,
    keyName: PropTypes.string,
    editEnable: PropTypes.bool,
  }
  static defaultProps = {
    onValueChanged: (value, keyName, sender) => { },
    value: [],
    keyName: "file",
    editEnable: true,
  };


  constructor(props) {
    super(props)
    this.state = Object.assign({
      // inputvalue: props.value
      uploading: false,
    }, this.state)
  }

  selectPhototapped() {
    const options = {
      title: '上传图片',
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照',
      chooseFromLibraryButtonTitle: '相册图片',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      // console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        // const source = { uri: response.uri};
        this.setState({
          uploading: true
        })
        let date = new Date();
        let name = date.getTime() + '.jpg'
        let sourceArr = this.props.value
        ajax.upload({
          type: "FormImageUpload",
          fileName: name
        }, response.uri).then((res) => {

          let fileObj = {
            fileName: name,
            fileType: 'jpg',
            url: res.datas,
          }
          sourceArr.push(fileObj)

          this.setState({
            // imageSource: sourceArr,
            uploading: false
          })
        }).catch((error) => {
          this.setState({
            uploading: false
          })
          console.log(error)
        })
      }
    });
  }

  // 上传图片列表
  imageList() {
    const { value, keyName, onValueChanged, editEnable } = this.props;
    let imageComponent = []
    value.map((item, index) => {
      imageComponent.push(<View styles={styles.imageItem} key={index}>
        {/* <Image source={item} style={styles.uploadItem}></Image> */}
        <FastImage
          style={styles.uploadItem}
          source={{
            uri: item.url,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
          onError={(e) => {
            console.log(item)
          }}
        />
        {editEnable &&
          <TouchableOpacity style={styles.cancleIcon}
            onPress={() => {
              value.splice(index, 1)
              onValueChanged(value, keyName, null)
            }}
            >

            <Icon
              //iconStyle={styles.cancleIcon}
              name="cancel"
              size={20}
              onPress={() => {
                value.splice(index, 1)
                onValueChanged(value, keyName, null)
              }}
              color="#8B8B8B" />
          </TouchableOpacity>
        }

      </View>)
    })
    return imageComponent;
  }


  render() {
    const { value, editEnable } = this.props;
    const { uploading } = this.state
    return (

      <View style={[styles.uploadWrap]}>
        {editEnable && uploading &&
          <View
            style={[styles.uploadItem, styles.upLoadingBox]}
          >
            <ActivityIndicator animating={true} />
            <Text style={styles.uploadText} >正在上传</Text>
          </View>
        }

        {editEnable && !uploading &&
          <TouchableOpacity
            style={styles.uploadItem}
            onPress={() => {
              this.selectPhototapped()
            }}
          >
            <Image source={require('../../res/imgs/uploadIcon.png')} style={{ width: 75, height: 75 }} />
          </TouchableOpacity>}

        {value.length > 0 &&
          this.imageList()
        }
      </View>
    )
  }
}
const styles = StyleSheet.create({
  uploadWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
    // backgroundColor: '#992211'
  },
  uploadItem: {
    width: 75,
    height: 75,
    marginHorizontal: 5,
    marginTop: 10,
  },
  upLoadingBox: {
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  uploadText: {
    fontFamily: "PingFangSC-Regular",
    fontSize: 14,
    color: "#808080",
    marginTop: 10
  },
  imageItem: {
    position: 'relative',
  },
  cancleIcon: {
    position: 'absolute',
    width: 20,
    height: 20,
    top: -5,
    right: -10,
    // top: -85,
    // right: -10,
  }
})