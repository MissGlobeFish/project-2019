/**
* 薪酬绩效
*/
import React, { Component } from 'react';
import { StyleSheet, Text, View,ScrollView,TouchableOpacity,TextInput,Dimensions,FlatList } from 'react-native';
import PersistanceManger from '../../../util/PersistanceManger';
import ajax from '../../../config/Fetch';
import Toast from '../../../common/Toast'
let { height } = Dimensions.get('window');
export default class  SalaryPage extends Component {

   static navigationOptions = ({ navigation }) => {
    let rightNavigateBtnTapped = navigation.getParam('rightNavigateBtnTapped')
     return {
       title: '薪酬绩效',
       headerBackTitle: null,
       headerRight: 
       <TouchableOpacity style={{marginRight: 16}} onPress={rightNavigateBtnTapped}>
         <Text style={{color: '#306FFE',fontSize: 16 }}>确定</Text>
       </TouchableOpacity>
     }
   }

   //Interactive Data

   constructor(props) {
    super(props);
    this.state = {
      listData: [],
      errorStatus:[],
      refreshing: false,
      searchObj: {
        pageNum: 1,
        pageSize: 10,
        searchKey: '',
        assess: PersistanceManger.ShareInstance().empCode
      }
    }
  };

   //Life Cycle
  componentWillMount() {
    const { setParams } = this.props.navigation;
    const {listData} = this.state;
    setParams({
      rightNavigateBtnTapped: () => {
        listData.forEach((item,index)=>{
          if (!item.score) {
            this.state.errorStatus[index] = 1;
            this.setState({
              errorStatus: this.state.errorStatus
            })
          } else {
            this.state.errorStatus[index] = 0;
            this.setState({
              errorStatus: this.state.errorStatus
            })
          }
        })
        return
        ajax.put(`salaryPerformance`,this.state.listData).then((res)=>{
          Toast.showSuccess('添加成功')
          this.setState({
            refreshing: false
          })
        }).catch((error)=>{
          this.setState({
            refreshing: false
          })
          console.log(error)
        })
      }
    })
  }

   componentDidMount() {
    //  this.handleInit(this.state.searchObj)
   }

   componentWillUnmount() {

   }

   //SubRenders

   eachList() {
     let component = [];
     const {listData,errorStatus} = this.state;
     listData.forEach((item,index)=>{
       component.push(
        <View  style={[styles.tableCommon,styles.tabelItem]} key={index}>
          <View style={[styles.item]}>
            <Text style={[styles.itemText]}>{item.assessName}</Text>
          </View>
          <View style={[styles.item]}>
            <Text style={[styles.itemText]}>{item.beingAssessedName}</Text>
          </View>
          <View style={[styles.item,errorStatus[index] == 1 ? styles.itemError : '']}>
            <TextInput placeholder="请输入比例" style={[styles.itemText,{height: '100%'}]} 
            // editable={this.state.listData[index].score.toString() ? false : true}
              // autoFocus={true}
              // keyboardType='numeric'
              clearButtonMode="always"
              value={this.state.listData[index].score.toString()}
              onChangeText ={(text)=>{
                this.state.listData[index].score = text;
                this.setState({
                  listData: this.state.listData
                },()=>{
                  console.log(this.state.listData)
                })
              }} ></TextInput>
          </View>
        </View>
        )
     })
     return component;
   }
   //Render
   render() {
    return (
     <View>
       <ScrollView style={styles.contanier}>
         <View style={[styles.tableHead,styles.tableCommon]}>
            <View style={[styles.item]}>
              <Text style={[styles.headText]}>考核人</Text>
            </View>
           <View style={[styles.item]}>
             <Text style={styles.headText}>被考核人</Text>
           </View>
           <View style={[styles.item]}>
            <Text style={styles.headText}>比例</Text>
           </View>
         </View>
          {this.eachList()}
       </ScrollView>
     </View>
    );
  }

  onRefresh = () => {
    if (!this.state.refreshing) {
      this.handleInit(this.state.searchObj)
    }
  }
  /**
   * handleInit 请求被考核人信息
   */

   handleInit(obj) {
    this.setState({
      refreshing: true
    })
    ajax.getOther(`salaryPerformance`,obj.assess,obj).then((res)=>{
      const {list} = res;
      let newList = [];
      list.map((item,index)=>{
        newList.push({
          id: item.id,
          assess: item.assess,
          assessName: item.assessName,
          beingAssessed: item.beingAssessed,
          beingAssessedName: item.beingAssessedName,
          score: item.score
        })
      })
      console.log(newList)
      this.setState({
        refreshing: false,
        listData: newList
      })
    }).catch((error)=>{
      this.setState({
        refreshing: false
      })
      console.log(error)
    })
   }

}

//Styles
const styles = StyleSheet.create({
  contanier: {
    height: height,
    backgroundColor: '#fff',
    paddingHorizontal:  15
  },
  tableHead: {
    paddingVertical: 10,
    borderBottomColor: '#306FFE',
    borderBottomWidth: 1
  },
  tableCommon: {
    flexDirection: 'row',
    
    justifyContent: 'space-between'
  },
  tabelItem: {
    height: 36,
    alignItems: 'center',
    borderBottomColor: '#eee',
    borderBottomWidth: 1
  },
  item: {
    flex: 1
  },
  headText: {
    fontSize: 16,
    color: '#306FFE',
    textAlign: 'center'
  },
  itemText: {
    textAlign: 'center'
  },
  itemError: {
    borderBottomWidth: 1,
    borderBottomColor: 'red'
  }
})