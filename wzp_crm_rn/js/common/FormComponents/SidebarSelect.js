
/**
 * SidebarSelect --- 侧边抽屉，筛选框
 */
import React, { Component } from 'react';
import { TextInput, StyleSheet, Text,SafeAreaView, View, Image, TouchableOpacity,ScrollView,LayoutAnimation } from 'react-native';
import { Icon } from 'react-native-elements'

import { Header } from 'react-navigation';
import RightSidebar from '../Sidebar/RightSidebar'
import propTypes from 'prop-types'
export default class SidebarSelect extends RightSidebar {

  static propTypes = {
    choiceContent: propTypes.array,
    handleSelect: propTypes.func
  }
  static defaultProps = {
    choiceContent: [],
    handleSelect: (selectItems)=>{}
  };

  constructor(props) {
    super(props);
    
    //配置默认返回值
    let defaultSelectItems = []
    this.props.choiceContent.map((item, index)=>{
      var value = []
      item.children.forEach((selectItem)=>{
        if (selectItem.childselect){
          value.push(selectItem.formId)
        }
      })
      defaultSelectItems[index] = {
        paramKey: item.paramKey,
        value: value
      }
    })
    // console.log("初始化返回值", defaultSelectItems)
    this.state = {
      isSelect: -1,//  -1代表折叠
      isChecked: false,
      selectItem: defaultSelectItems,
      choiceContent: this.props.choiceContent // 筛选数据
    }
  }
  // 一级菜单栏事件
  itemTap = (index) => {
    // 点击的item如果是同一个, 就置为初始状态-1, 也就是折叠的状态
    let select = index;
    if (this.state.isSelect === index){
        select = -1;
    }
    LayoutAnimation.easeInEaseOut();
    this.state.isSelect = select
    this.updateSibling()
  }
  // 一级菜单Dom
  componentDom(sectionIndex,item,childCom) {
    return(
      <View style={styles.content}  key={sectionIndex}>      
        <TouchableOpacity style={styles.contentHead}
          activeOpacity={0.75}
          onPress={()=>{
            this.state.currSection= sectionIndex
            this.itemTap(sectionIndex)
          }}
        >
          <Text>{item.name}</Text>
          {/*判断是否为当前点击的菜单，以及菜单是否展开    this.state.currSection == index && this.state.isSelect != -1*/}
          <Image defaultSource={require('../../res/imgs/arrow-icon.png')} style={[styles.arrowIcon,(this.state.currSection == sectionIndex && this.state.isSelect != -1)? styles.transform180 : null ]}></Image>
        </TouchableOpacity>
        {this.state.isSelect === sectionIndex  && childCom}
    </View>
    )
  }
  // 二级菜单Dom
  childDom(sectionIndex,item,indexChild,itemChild) {
    return (
      <TouchableOpacity style={styles.itemChoice} key={indexChild}
        activeOpacity={0.75}
         onPress={()=>{
          if (item.isCheckBox) { // 多选
            let selectedValues = this.state.selectItem[sectionIndex].value
            if (itemChild.childselect) { // 判断是否被选中过，点击取消选中
              let delIndex = selectedValues.indexOf(itemChild.formId);
              selectedValues.splice(delIndex,1);
            } else {
              selectedValues.push(itemChild.formId); // 没有被选中，push到已选择数组中
            }
            itemChild.childselect = !itemChild.childselect;
          } else { // 单选
            let itemChildren = item.children; // 二级菜单data
            let isChildselect = itemChildren.find((element) => (element.childselect == true));// 查找已被选中的选项
            let selectedValues = this.state.selectItem[sectionIndex].value
            if (isChildselect) { // 当被选中
              isChildselect.childselect = false;
              let delIndex = selectedValues.indexOf(isChildselect.formId); 
              selectedValues.splice(delIndex,1);// 从选中数组中删除
            }
            itemChild.childselect = true; // 选中选项
            selectedValues.push(itemChild.formId); // 添加到选中数组中
          }
          this.updateSibling()
        }}
      >
        <Text style={{color: '#fff'}}>{itemChild.name}</Text>
        <View style={[styles.choiceIcon]}>
        {(itemChild.childselect) && <Image source={require('../../res/imgs/currChoice.png')} style={styles.currChoice}></Image>}
        </View>
      </TouchableOpacity>
    )
  }
  // 筛选选择框主函数
  choiceRender() {
    const {choiceContent} = this.state;
    let component=[]; // 一级菜单栏数组
    choiceContent.forEach((item,sectionIndex)=>{ 
      let childCom=[]; // 二级菜单栏数组
      item.children.forEach((itemChild,indexChild)=>{
        childCom.push(this.childDom(sectionIndex,item,indexChild,itemChild))
      })
      component.push(this.componentDom(sectionIndex,item,childCom))
    })
    return component;
  }
  // render渲染父组件
  subRender() {
    return(
      <SafeAreaView>
        <ScrollView>
          <View style={styles.title}>
            <Text></Text>
            <Text style={styles.titleText}>筛选</Text>
            <TouchableOpacity onPress={()=>{
              this.hideModalByFadeIn();
              this.props.handleSelect(this.state.selectItem)
            }}><Text style={styles.confirmBtn}>确定</Text></TouchableOpacity>
          </View>
          {this.choiceRender()}
        </ScrollView>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    width: '100%',
    height: Header.HEIGHT, // 导航的高度
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff'
  },
  titleText: {
    fontSize: 18,
    color:'#323232',
    fontWeight: 'bold'
  },
  confirmBtn: {
    color: '#306FFE',
    fontSize: 16
  },
  content: {
    marginTop: 15,
  },
  contentHead: {
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  choiceIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#808080',
    position:'relative',
  },
  itemChoice:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 44,
    backgroundColor: '#3f3f3f',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#44454B'
  },
  currChoice: {
    position:'absolute',
    width: 21,
    height: 21,
    left: -1,
    top: -1,
    right:0
},
rowBack: {
  alignItems: 'center',
  backgroundColor: '#ff0000',
  flexDirection: 'row',
  justifyContent: 'space-between',
  flex: 1,
  paddingRight: 20
},
rowFront: {
  alignItems: 'center',
  backgroundColor: '#CCC',
  borderBottomColor: 'black',
  borderBottomWidth: 1,
  justifyContent: 'center',
  height: 50,
},
leftView: {
  width: 75,
  alignItems: 'center',
  backgroundColor: 'green',
  height: 50,
  justifyContent: 'center'
},
arrowIcon: {
  width: 12,
  height: 18,
  transform: [{rotate:'180deg'}]
},
transform180: {
  transform: [{rotate:'360deg'}]
}
});
