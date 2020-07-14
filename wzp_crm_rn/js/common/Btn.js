import React, { Component } from 'react';
import { TextInput, StyleSheet, Text, View, Image } from 'react-native';
import { Icon, Button } from 'react-native-elements'
export default class Btn extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const {btnContainer, loading,  ...attributes} = this.props
    return (
      <View style={[styles.btnContainer, btnContainer]}>
        <Button title="提交"
          {...attributes}
          titleStyle={{fontSize: 16}}
          buttonStyle={[styles.btnStyle]}
          containerStyle={[styles.btn]}
          loading={loading}
          disabled={loading}
          onPress={() => {
            this.props.handleBtn()
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1
  },
  btn: {
    width: '84%',
    height: 55,
    maxWidth: 315,
    justifyContent: 'center',
    margin: 0,
    padding: 0
  },
  btnStyle: {
    height: '100%',
    backgroundColor: '#4D66FD',
    borderRadius: 4,
  }
});
