/**
 * Search 搜索
 */


import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  TouchableNativeFeedback,
  FlatList,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { Icon } from 'react-native-elements'
import SearchCard from '../../common/SearchCard';
import New from '../../common/New';
import CompanySystem from '../../common/CompanySystem';
import EmpCrad from '../../common/EmpCrad';
import ajax from '../../config/Fetch';
const { width, height } = Dimensions.get('window');
type Props = {};
export default class Search extends Component<Props> {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.textRef = {};
    this.state = {
      ready: false,
      data: [],
      flag: null,
      text: '',
      modalVisible: true,
      domHeights: [],
      show: false,
      tabs: [
      ],
      TABSTYPE: {
        NEWS: '新闻',
        NOTICE: '通知',
        RANKING: '小宝人物志',
        SYSTEM: '制度',
        EMP: '名片',
        // BOOK: '图书',
      },
      tabIndex: 0
    }
  }
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  renderTab(lists, tabIndex) {
    return (
      lists.map((list, index) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => this.clickToScroll(index, list)}>
            <View style={[styles.tab, index === this.state.tabIndex && styles.tabAtive]}>
              <Text style={styles.tabText}>{this.state.TABSTYPE[list]}</Text>
            </View>
          </TouchableOpacity>)
      })
    )
  }
  _onPressItem(label, id) {
    if (label === 'EMP') {
      return;
    }
    const { navigate } = this.props.navigation;
    navigate('DetailsPage', { label: label, id: id })
  }
  renderCardList(list, separators) {

    return (
      <View ref={(ref) => this.textRef = { ...this.textRef, [list]: ref }}>
        <SearchCard title={this.state.TABSTYPE[list]} type={list} search={this.state.text} >
          {this.state.data[list].map((data, index) => {
            const label = list;
            let component;
            if (label === 'NEWS' || label === 'RANKING') {
              component = <New data={data} likes={true} search={this.state.text} />
            } else if (label === 'EMP') {
              component = <EmpCrad title={this.state.TABSTYPE[list]} data={data} search={this.state.text} />
            } else if (label === 'SYSTEM') {
              component = <CompanySystem />
            } else if (label === 'NOTICE') {
              component = <New data={data} search={this.state.text} />
            }
            return <TouchableOpacity onPress={() => this._onPressItem(label, data.id)} key={index}>
              {component}
            </TouchableOpacity>
          })
          }
        </SearchCard>
      </View>
      // )
      // })
    )
  }
  _moreCallback(type, search) {
    // console.log(search);
    this.props.navigation.navigate('MorePage', {
      searchKey: search,
      label: type
    });
  }
  componentDidMount() {
    //  组件装载之后
    console.log('--componentDidMount--');

  }
  clickToScroll(index, type) {
    this.setState({ tabIndex: index })
    this._flatList.scrollToIndex({ viewPosition: 0, index: index })
  }
  onScroll = (event) => {
    let offsetY = event.nativeEvent.contentOffset.y
    let opacity = offsetY
    // if(opacity > 5 || opacity < -5) { // 这里可以优化减少render， 1和0 滑快了会有些影响， 这里你可以看着给值， 当然也可以不优化
    //   return
    // }
    let heights = 0;
    let section = [];
    if (this.state.domHeights.length === 0) {
      this.state.tabs.map((tab) => {
        let obj = {};
        this.textRef[tab].measure((fx, fy, width, height, px, py) => {
          console.log('Component width is: ' + width)
          console.log('Component height is: ' + height)
          console.log('X offset to frame: ' + fx)
          console.log('Y offset to frame: ' + fy)
          console.log('X offset to page: ' + px)
          console.log('Y offset to page: ' + py)
          //然后用scrollTo跳转到对应位置        //x是水平方向        //y是垂直方向       
          heights = heights + height;
          section.push(heights);

        })
      })
      this.setState({
        domHeights: section
      })
    }
    let domHeights = this.state.domHeights;
    for (let i = 0; i < domHeights.length; i++) {
      if (offsetY < domHeights[i]) {
        this.setState({ tabIndex: i })
        return;
      }
    }
  }
  _onSubmit(obj) {
    // this.scrollTo({ x: 0, y: 0, animated: true });
    if (!this.state.text) {
      return;
    }

    ajax.get('search', { keyWords: this.state.text }).then(res => {
      // console.log(res);
      let tabs = Object.keys(res).filter(tab => {
        return res[tab].length > 0
      });

      if (tabs.length === 0) {
        Alert.alert(
          '提示',
          '您搜索的内容为空',
          [
            { text: '确定', onPress: () => console.log('OK Pressed') },
          ],
          { cancelable: false }
        )
        return;
      }
      tabs = Object.keys(this.state.TABSTYPE).filter(tab => {
        return tabs.indexOf(tab) !== -1;
      });
      this.setState({
        data: res,
        tabs: tabs,
        show: true,
        tabIndex: 0
      });
    }).catch(err => {
      Alert.alert(
        '提示',
        '服务超时，稍后在试',
        { cancelable: false }
      )
    })

    // this.setState({ show: true })
  }
  _getRef = (flatList) => {
    this._flatList = flatList; const reObj = this._flatList; return reObj;
  }

  render() {
    const { navigate, goBack, modalVisible } = this.props.navigation;
    const { show, text, tabs, tabIndex } = this.state;
    return (
      <SafeAreaView style={[styles.container, !show && styles.containerOther]} >
        <View style={[styles.searchBox, !show && styles.searchBoxBorder]} >
          <View style={styles.search}>
            <Icon iconStyle={styles.searchIcon}
              name="search"
              size={20}
              color="#8B8B8B" />
            <TextInput style={styles.searchInput}
              placeholder="输入关键字"
              returnKeyType="search"
              onChangeText={(text) => this.setState({ text })}
              onSubmitEditing={(text) => this._onSubmit(text)}
              value={text}
              underlineColorAndroid="transparent"
              autoFocus={true}
            />
            {
              !!!text || <Icon iconStyle={styles.searchIcon}
                name="cancel"
                size={20}
                onPress={() => this.setState({ text: '' })}
                color="#8B8B8B" />
            }

          </View>
          <TouchableOpacity
            style={styles.cancel}
            onPress={() => goBack()}>
            <Text
              style={{
                fontSize: 16,
                color: '#353535'
              }}>取消</Text>

          </TouchableOpacity>
        </View>
        {
          show && <View>
            <View style={{ height: 45 }}>
              <View style={styles.tabs}>

                {this.renderTab(tabs, tabIndex)}
              </View>
            </View>




            <FlatList
              style={{ height: height - 130, backgroundColor: '#E8E8E8'}}
              ref={(flatList) => this._flatList = flatList}
              onScroll={this.onScroll}
              data={tabs}
              extraData={this.state}
              keyExtractor={(item, index) => `${item}`}
              renderItem={({ item }) =>
                <TouchableOpacity ref={(ref) => this.textRef = { ...this.textRef, [item]: ref }} >
                  <SearchCard title={this.state.TABSTYPE[item]} type={item} search={this.state.text} moreCallback={this.state.data[item].length === 2 && this._moreCallback.bind(this)} >
                    {this.state.data[item] ? this.state.data[item].map((data, index) => {
                      const label = item;
                      let component;
                      if (label === 'NEWS' || label === 'RANKING') {
                        component = <New data={data} likes={true} search={this.state.text} />
                      } else if (label === 'EMP') {
                        component = <EmpCrad title={this.state.TABSTYPE[item]} data={data} search={this.state.text} />
                      } else if (label === 'SYSTEM') {
                        component = <CompanySystem />
                      } else if (label === 'NOTICE') {
                        component = <New data={data} search={this.state.text} />
                      }
                      return <TouchableOpacity onPress={() => this._onPressItem(label, data.id)} key={index}>
                        {component}
                      </TouchableOpacity>
                    }) : <Text>{item}</Text>
                    }
                  </SearchCard>
                </TouchableOpacity>


              }
            />

          </View>
        }


      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',//'#E8E8E8',
    flex: 1,
  },
  containerOther: {
    backgroundColor: '#FFFFFF',
  },
  searchBox: {
    paddingTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#E1E1E1',
    backgroundColor: '#fff'
  },
  searchBoxBorder: {
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 30,
    backgroundColor: '#F5F5F5',
    marginRight: 10,
    marginLeft: 20,
    marginBottom: 5,
    borderRadius: 5,
    flex: 5
  },
  searchIcon: {
    paddingLeft: 10,
    paddingRight: 5
  },
  searchInput: {

    height: 40,
    flex: 4.5,
    // fontSize: 12,
    // flexDirection: 'row',
    // height: 24,
    // paddingTop: 20,
    // paddingBottom: 20,
    fontSize: 14,
    // lineHeight: 60
    // marginleft: -5,
    // backgroundColor: 'red'
  },
  cancel: {
    flex: .7,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 5
  },
  tabs: {
    flex: 1,
    flexDirection: 'row',
    height: 45,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  tab: {
    height: 45,

    marginLeft: 12.5,
    marginRight: 12.5,
    justifyContent: 'center',
    // backgroundColor: '#F5F5F5'
  },
  tabAtive: {
    borderBottomWidth: 2,
    borderBottomColor: '#4D66FD'
  },
  tabText: {
    fontSize: 14,
    lineHeight: 16,
    color: '#808080',
  }
});


// <ScrollView style={{ height: height - 140 }} onScroll={this.onScroll} ref='myScrollView'
// // scrollEventThrottle={16}
// >
//   {this.renderCardList(tabs)}
// </ScrollView> 