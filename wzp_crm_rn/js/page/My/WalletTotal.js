

// /**
//  * WalletTotal 钱包余额页面
//  */
// import React, { Component } from 'react';
// import {  StyleSheet, Text, Image,View,TouchableOpacity,TextInput,FlatList } from 'react-native';
// import {Button,Icon} from 'react-native-elements';
// class HeaderRight extends React.Component {
//   render() {
//     return (
//       <TouchableOpacity style={{marginRight:23}}
//         onPress= {()=>{
//           this.props.navigation.navigate('Game')
//         }}
//       ><Text style={{fontSize: 18}}>明细</Text></TouchableOpacity>
//     );
//   }
// }
// export default class WalletTotal extends Component {
//   static navigationOptions = ({ navigation, navigationOptions }) => {
//     const { params } = navigation.state;
//     return {
//       title:'钱包',
//       headerRight:<HeaderRight navigation={navigation}/>
//       /* These values are used instead of the shared configuration! */
     
//     };
//   };
//   constructor(props) {
//     super(props)
//   }
//   render() {
//     return (
//       <View style={styles.containerView}>
//         <Image
//           style={{width: 90,height:90,marginTop: 32}}
//           source={require('../../res/imgs/yuerIcon.png')}
//         />
//         <View style={{marginTop:32,marginBottom: 54,justifyContent:'center',alignItems:'center'}}>
//           <Text>余额(元)</Text>
//           <Text style={{fontSize: 50,marginTop:10}}>8888.00</Text>
//         </View>
//         <View style={{width:'100%',alignItems: 'center'}}>
//           <Button
//             fontSize={18}
//             backgroundColor='#4D66FD' borderRadius={2} buttonStyle={styles.entryButton} containerViewStyle={styles.btnWrap}
//             title='充值'
//             onPress={()=>{
//               // navigate('WalletTotal')    
//             }}
//           />
//           <Button
//             fontSize={18}
//             color="#000"
//             backgroundColor='#fff' borderRadius={2} buttonStyle={{borderWidth: 1,borderColor:'#ddd'}} containerViewStyle={styles.btnWrap}
//             title='提现'
//             onPress={()=>{
//               // navigate('WalletTotal')    
//             }}
//           />
//         </View>
//       </View>
//     )
//   }
// }
// const styles = StyleSheet.create({
//   fontSize16: {
//     fontSize: 16
//   },
//   containerView: {
//     flex:1,
//     backgroundColor: '#fff',
//     // justifyContent:'center',
//     alignItems:'center'
//   },
//   btnWrap: {
//     width: '80%'
//   },
//   entryButton: {
//     width: '100%',
//     height: 50,
//     marginBottom: 16
//   }
// })
