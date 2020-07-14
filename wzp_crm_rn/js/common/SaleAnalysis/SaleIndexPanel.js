/**
*  销售指数面板
*/
import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import propTypes from 'prop-types'

const screenWidth = Dimensions.get('window').width;

export default class SaleIndexPanel extends Component {


  static defaultProps = {
    datas: [
      { indexName: "加载中...", count: '...', percent: "...", desc: "数据加载中..." },
    ],

    didSelectAtIndex: (item) => { }
  }
  static propTypes = {
    datas: propTypes.array, //基本数据
    didSelectAtIndex: propTypes.func, //选中某一个指数
  }

  //Interactive Data

  constructor(props) {
    super(props);
    this.state = {
      selectIndex: 0, //选中指数
      blockMinWidth: screenWidth, //模块最小宽度
    }

  };

  //Life Cycle
  componentWillMount() {

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  //SubRenders


  indexItems() {
    const { datas } = this.props
    var indexDatas = datas
    //计算模块宽度
    var width = screenWidth
    if (indexDatas.length <= 1) {
      width = screenWidth
    } else if (indexDatas.length <= 3) {
      width = screenWidth / indexDatas.length - 5
    } else if (indexDatas.length > 3) {
      width = screenWidth / 3.25 - 5
    }
    this.state.blockMinWidth = width

    var items = indexDatas.map((item, index) => {
      //是否是选中状态
      let isSelected = this.state.selectIndex == index
      let blockRef = "indexBolck" + index
      return (
        <View
          key={blockRef}
          style={[
            styles.indexBlockContainer,
            { marginRight: indexDatas.length > 1 ? 5 : 0 }
          ]}>
          <TouchableOpacity
            ref={blockRef}
            activeOpacity={0.75}
            style={[
              styles.indexBlock,
              { minWidth: width },
              // isSelected ? styles.indexBlockSelected : null
            ]}
            onPress={() => { this.didselectBlock(index, item, blockRef) }}
          >
            {!isSelected || <Image
              source={require('../../res/imgs/SaleIndexBackIMG.png')}
              style={{ position: 'absolute', width: '100%', height: '100%' }}
            />}
            <Text style={[styles.nameLabStyle, isSelected ? { color: '#fff' } : null]}>
              {item.indexName}
            </Text>
            <Text style={[styles.valueLabStyle, isSelected ? { color: '#fff' } : null]}>
              {item.count ? item.count : 0}
            </Text>
            {item.percent &&
              <Text style={[styles.percentLabStyle, isSelected ? { color: '#fff' } : null]}>
                {item.percent}
              </Text>
            }


          </TouchableOpacity>
          {!isSelected || <View style={styles.indexBlockTriangle} />}
        </View>

      )
    })

    return items
  }

  //Render
  render() {
    const { style, datas } = this.props
    const { selectIndex } = this.state
    return (
      <View style={[styles.backContentBox, style]}>
        <ScrollView
          ref="saleIndexScroll"
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.indexContainer}>
          {this.indexItems()}
        </ScrollView>
        {
          datas.length > 0 &&
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionLabel}>{"说明: " + datas[selectIndex]?.desc }</Text>
          </View>
        }

      </View>
    );
  }


  //Action && Handeler

  /**
   * 选中某一个指数的回调
   *
   * @param {*} index
   * @param {*} item
   * @param {*} blockRef
   * @memberof SaleIndexPanel
   */
  didselectBlock(index, item, blockRef) {
    const { blockMinWidth } = this.state
    const { didSelectAtIndex } = this.props
    this.setState({
      selectIndex: index
    })

    //TODO: 暂时按照最小宽度计算
    var offsetX = (blockMinWidth + 5) * (index - 2)
    this.refs.saleIndexScroll.scrollTo({ x: offsetX < 0 ? 0 : offsetX, y: 0, animated: true })

    if (didSelectAtIndex != null) {
      didSelectAtIndex(item)
    }
  }

  //UserFunction

  /**
     *  刷新数据
     */
  refresh() {
    const { didSelectAtIndex, datas } = this.props
    this.setState({
      selectIndex: 0,
    })
    if (didSelectAtIndex != null) {
      didSelectAtIndex(datas[0])
    }
  }

  //NetWorks


}

//Styles
const styles = StyleSheet.create({
  backContentBox: {
    backgroundColor: "#edeffd",
    minHeight: 100,
  },
  indexContainer: {
    width: '100%',
    minHeight: 75,
  },

  //指数模块
  indexBlockContainer: {
    alignItems: 'center',
    // backgroundColor: 'orange',
    // marginBottom: 5,
  },
  indexBlock: {
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
  },
  //指数模块选中状态
  // indexBlockSelected: {
  //   backgroundColor: '#4193FF'
  // },
  //选中状态的三角
  indexBlockTriangle: {
    // width: 0,
    // height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 7.5,
    borderRightWidth: 7.5,
    borderTopWidth: 7.5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#4193FF',
    zIndex: 999,
  },
  //指数名称
  nameLabStyle: {
    fontFamily: "PingFangSC-Regular",
    fontSize: 14,
    color: '#353535',
    textAlign: "center"
  },
  //指数值
  valueLabStyle: {
    fontFamily: "PingFangSC-Semibold",
    fontSize: 18,
    color: '#4D66FD',
    textAlign: "center"
  },
  //指数百分比
  percentLabStyle: {
    fontFamily: "PingFangSC-Regular",
    fontSize: 12,
    color: '#353535',
    textAlign: "center"
  },
  //描述框
  descriptionBox: {
    width: '100%',
    marginTop: -5,
    minHeight: 30,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  descriptionLabel: {
    fontFamily: "PingFangSC-Regular",
    fontSize: 12,
    color: "#747AA7",
  }
})