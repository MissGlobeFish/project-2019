import React, { Component } from 'react';
import { TextInput, StyleSheet, Text, View, Image,Button } from 'react-native';
import { Icon } from 'react-native-elements'
export default class FormList extends Component {
  constructor(props){
    super(props)
    this.state = {
      inputvalue: ''
    }
  }
  handleBlur() {
    this.refs.input.blur();
  }
  render() {
    return (
      <View style={[styles.inputContainer,this.props.FormBorderStyle]}>
        <TextInput 
          placeholderTextColor="#808080"
          ref="input"
          style={styles.fontInputSize}
          placeholder="请输入"
          autoCapitalize='none'
          placeholder={this.props.placeholder}
          autoFocus={this.props.autoFocus}
          autoCapitalize='none'
          maxLength= {this.props.maxLength}
          secureTextEntry = {true}
          value = {this.state.inputvalue}
          onChangeText ={(text)=>{
          this.setState({
            inputvalue:text
          })
          this.props.fn(text)
        }}
        />
       {!!! this.state.inputvalue ||  <Icon iconStyle={styles.searchIcon}
              name="cancel"
              size={20}
              onPress={()=>{
                this.setState({
                  inputvalue:''
                })
                this.props.fn('')
              }}
              color="#8B8B8B"/>}
     
      </View>
    );
  }
}

const styles = StyleSheet.create({
  errorBorder: {
    borderBottomColor: 'red'
  },
  corrBorder: {
    borderBottomColor: 'red' 
  },
  inputContainer: {
    flexDirection: 'row',
    flex: 5,
    marginLeft:0,
    marginRight:0,
    marginTop: 16,
    position: 'relative',
    height: 60,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor:'#e8e8e8'
  },
  fontInputSize: {
    fontSize: 14,
    flex: 5,
    height:  60,
  },
  searchIcon: {
    paddingLeft: 10,
    paddingRight: 5
  }
});
