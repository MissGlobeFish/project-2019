/**
 * 我发起的--单据--单据列表组件 
 */
import React, { Component } from 'react';
import {StyleSheet, Text, View,ScrollView,TouchableOpacity,Image} from 'react-native';
import ReceiptContent from '../../common/consoleComponent/ReceiptContent'
import PersistanceManger from '../../util/PersistanceManger';
// import ajax from '../../config/Fetch';

// 单据状态
const statusMenu = {
  A : '',
  B : '审核中',
  C : '已审核',
  D : '驳回'
}
const formIdArr = ['ER_ExpReimbursement']
export default class ReceiptList extends Component {
  constructor(props){
    super(props);
    this.state = {
    }
  };
   //单据状态过滤
  filterStatus(data,val) {
    if (val == "A") {
      data.status = statusMenu.A
    } else if (val == "B") {
      data.status = statusMenu.B
    } else if (val == "C") {
      data.status = statusMenu.C
    } else if (val == "D") {
      data.status = statusMenu.D
    } else {
      return
    }
  }
  //单据类型颜色过滤
  filterColor(data,val) {
    if (val==formIdArr[0]) {
      data.backgroundColor = '#4D66FD'
    } else {
      data.backgroundColor = '#4D66FD'
    }
  }
  render() { 
    const {data} = this.props;
    this.filterStatus(data,data.status)
    this.filterColor(data,data.formId)
    return (
        <View style={styles.container}>
          <View style={[{paddingHorizontal: 15}]}>
              <View style={[styles.margin10,styles.top]}>
                <View style={styles.topType}>
                  <View style={[styles.topTypeWrap,{backgroundColor:data.backgroundColor}]}><Text style={[styles.topTypeName,styles.commonText]}>{data.formName}</Text></View>
                  <Text style={[styles.commonText,styles.commonColor]}>{data.billNo}</Text>
                </View>
                <Text style={[styles.topStatus,styles.commonText]}>{data.status}</Text>
              </View>
              <ReceiptContent content={data.specialEntity} type={data.formName}/>
            </View>
            <View style={[styles.bottom]}>
              <Text style={[styles.commonText,styles.commonColor]}>{data.billDate}</Text>
              <Text style={[styles.commonText,styles.commonColor]}>{data.creator}</Text>
            </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#fff',
    borderRadius: 2,
    marginHorizontal: 20,
    marginTop: 20
  },
  top: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  topType: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  topTypeWrap: {
    backgroundColor: '#4D66FD',
    borderRadius: 2,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginRight: 10
  },
  topTypeName: {
    color: '#fff',
  },
  topStatus: {
    color: '#ff0000',
  },
  margin10: {
    marginTop: 10
  },
  commonText: {
    fontSize: 14
  },
  commonColor: {
    color: '#808080'
  },
  mid: {
    marginVertical: 10
  },
  bottom: {
    paddingHorizontal: 15,
    fontSize: 14,
    marginTop: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor:'#e8e8e8',
    color: '#808080',
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})
