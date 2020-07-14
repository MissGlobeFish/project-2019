
/**
 * FormTextarea --- 多行文本封装
 */
import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Keyboard, Dimensions, TextInput } from 'react-native';
import { Icon } from 'react-native-elements'
import PropTypes from 'prop-types'

export default class FormTextArea extends Component {

  static propTypes = {
    title: PropTypes.string,
    placeholder: PropTypes.string,
    autoFocus: PropTypes.bool,
    maxLength: PropTypes.number,
    editEnable: PropTypes.bool,
    returnKeyType: PropTypes.string,
    onValueChanged: PropTypes.func,
    value: PropTypes.string,
    keyName: PropTypes.string,
    // containerStyle: PropTypes.style,

    error: PropTypes.any,   //报错信息，没有报错传 null
  }
  static defaultProps = {
    title: "",
    placeholder: "请输入",
    maxLength: null,
    editEnable: true,
    returnKeyType: 'next',
    value: null,
    error: null,
    onValueChanged: (text, keyName, sender) => { }
  };

  constructor(props) {
    super(props);
    this.state = Object.assign({
      // inputvalue: props.value
    }, this.state)
  };


  render() {
    const { title, placeholder, onValueChanged, maxLength, value, keyName, editEnable, error, containerStyle, ...attributes } = this.props
    return (
      <View style={[styles.container,containerStyle]}>
        {title != null && title.length > 0 &&
          (<Text style={[styles.titleLab, this.props.subTitleLab]}>{title}</Text>)
        }
        <TextInput
          {...attributes}
          placeholder={placeholder}
          multiline={true}
          editable={editEnable}
          style={[styles.fontInputSize, styles.borderStyle, error ? styles.errorBorderStyle : null]}
          value={value}
          autoCapitalize='none'
          maxLength={maxLength}
          onChangeText={(text) => {
            this.props.error = null
            onValueChanged(text, keyName, null)
          }}
          onSubmitEditing={(text) => {

          }}
          onFocus={() => {
            // console.log(Keyboard)
          }}
        />
        {maxLength && editEnable && <Text style={styles.textLength}>{value ? value.length : 0}/{maxLength}个字</Text>}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: "100%",
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  titleLab: {
    width: "100%",
    height: 50,
    lineHeight: 50,
    fontFamily: "PingFangSC-Medium",
    fontSize: 14,
    color: "#353535",
  },
  fontInputSize: {
    width: '100%',
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#F4F4F4',
    padding: 15,
    paddingTop: 15,
  },
  borderStyle: {
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  errorBorderStyle: {
    borderColor: '#FF0000',
  },
  textLength: {
    position: 'absolute',
    right: 25,
    bottom: 25,
    color: '#808080'
  }
})
