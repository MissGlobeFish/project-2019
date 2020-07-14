/**
 * FormInput --- 表单输入框
 */
import React, { Component } from 'react';
import { TextInput, StyleSheet, Text, View, Image, Button } from 'react-native';
import { Icon } from 'react-native-elements'
import FormBaseComponents from './FormBaseComponents'
import PropTypes from 'prop-types'

export default class FormInput extends FormBaseComponents {

  static propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    placeholder: PropTypes.string,
    autoFocus: PropTypes.bool,
    maxLength: PropTypes.number,
    secureTextEntry: PropTypes.bool,
    returnKeyType: PropTypes.string,
    onValueChanged: PropTypes.func,
    
    value: PropTypes.string,
    keyName: PropTypes.string,
  }
  static defaultProps = {
    title: "",
    subtitle: "",
    placeholder: "请输入",
    editEnable: true,
    secureTextEntry: false,
    returnKeyType: 'next',
    value: "",
    onValueChanged: (text, keyName, sender ) => { }
  };

  constructor(props) {
    super(props)
    this.state = Object.assign({
      // inputvalue: props.value
    },this.state)
  }

  render() {
    return super.render();
  }

  subRender() {
    const { title, subtitle, placeholder, onValueChanged, value, keyName, editEnable,...attributes } = this.props
    // const { inputvalue } = this.state
    return (
      <View style={styles.container} onStartShouldSetResponder={this.itemOnClicked.bind(this)}>
        <Text style={styles.titleLab}>{title}</Text>
        <Text style={styles.subtitleLab}>{subtitle}</Text>
        <TextInput
          {...attributes}
          editable={editEnable}
          placeholder={editEnable ? placeholder : ""}
          placeholderTextColor="#808080"
          ref="input"
          style={styles.fontInputSize}
          textAlign='right'
          autoCapitalize='none'
          value={value}
          onChangeText={(text) => {
            this.props.error = null
            onValueChanged(text, keyName, null)
          }}
          onFocus={(event) => {
            this.setState({
              isEdit: true,
            })
          }}
          onBlur={(event) => {
            this.setState({
              isEdit: false,
            })
          }}
        />
        {/* {!value || <Icon iconStyle={styles.searchIcon}
          name="cancel"
          size={20}
          onPress={() => {
            onValueChanged(this ,keyName, '')
          }}
          color="#8B8B8B" />} */}
      </View>
    )
  }


  itemOnClicked(event){
    const { editEnable } = this.props
    if (editEnable){
      this.refs.input.focus()
    }
    return editEnable
  }




}

const styles = StyleSheet.create({

  container: {
    // backgroundColor: 'green',
    width: "100%",
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },

  titleLab: {
    maxWidth: "40%",
    marginRight: 10,
    fontFamily: "PingFangSC-Medium",
    fontSize: 14,
    color: "#353535",
  },
  subtitleLab:{
    fontFamily: "PingFangSC-Regular",
    fontSize: 14,
    color: "#808080",
    lineHeight: 24,
  },
  fontInputSize: {
    fontSize: 14,
    flex: 5,
    height: 50,

    // fontFamily: "PingFangSC-Regular",
    // fontSize: 14,
    // color: "#353535",
  },
  searchIcon: {
    paddingLeft: 10,
    paddingRight: 5
  }

});
