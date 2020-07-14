/**
 * HumanSearchPage 用户搜索
 */

import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    DeviceEventEmitter
} from 'react-native';
import { Icon } from 'react-native-elements'
import ajax from '../../config/Fetch';

export default class HumanSearchPage extends Component<Props> {

    static navigationOptions = ({ navigation }) => {
        return {
            title: '查找人员',
            headerBackTitle: null,
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            searchText: "",
            searchResult: []
        }
    }

    componentDidMount() {

    }


    _emptyComponent() {
        return (
            <View style={styles.emptyContent}>
                {/* <Image style={styles.emptyImage} source={require('../../res/imgs/EmptyIcon.png')} /> */}
                <Text style={styles.emptyText}> 没有搜索到任何信息 </Text>
                <View style={styles.emotyPlaceholder} />
            </View>
        )
    }

    render() {
        const { searchText, searchResult } = this.state
        return (
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <View style={styles.search}>
                        <Icon iconStyle={styles.searchIcon}
                            name="search"
                            size={20}
                            color="#8B8B8B" />
                        <TextInput style={styles.searchInput}
                            placeholder="输入关键字"
                            returnKeyType="search"
                            ref="searchInput"
                            value={searchText}
                            underlineColorAndroid="transparent"
                            autoFocus={true}
                            onChangeText={(text) => {
                                this.setState({
                                    searchText: text
                                }, () => {
                                    this.search()
                                })
                            }}
                            onSubmitEditing={(text) => {
                                this.search()
                            }}
                        />
                        {
                            !!!searchText || <Icon iconStyle={styles.searchIcon}
                                name="cancel" size={20}
                                onPress={() => this.setState({ searchText: '' })}
                                color="#8B8B8B" />
                        }
                    </View>
                </View>
                {/* 结果列表 */}

                {searchText.length > 0 && searchResult.length == 0 ? this._emptyComponent() :
                    (<FlatList
                        style={styles.flatListStyle}
                        data={searchResult}
                        keyExtractor={(item, index) => item.empCode}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.cellContainer} activeOpacity={1}
                                onPress={() => {
                                    this.didSelectRow(item)
                                 }}
                            >
                                <Text style={styles.titleLab}>{item.empName}</Text>
                                <Icon iconStyle={styles.arrowIcon}
                                    name="chevron-thin-right"
                                    type='entypo'
                                    size={18}
                                    color="#8B8B8B"
                                />
                            </TouchableOpacity>
                        )}
                        onScrollBeginDrag={() => {
                            this.refs.searchInput.blur()
                        }}
                    />)}
            </View>
        )
    }


    /**
     * 查询
     *
     * @memberof ContactUnitSearchPage
     */
    search() {
        const { searchText } = this.state
        let self = this
        ajax.get('humenSearch', {searchKey: searchText})
            .then((res) => {
                self.setState({
                    searchResult: res
                })
            })
    }


    didSelectRow(dataInfo){
        var callBack = this.props.navigation.getParam('callBack')
        if (callBack != undefined) {
            callBack(dataInfo)
        }
        this.props.navigation.goBack()
    }


}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E8E8E8',
        flex: 1,
    },
    searchContainer: {
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 4,
    },
    search: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F2',
    },
    searchIcon: {
        paddingLeft: 10,
        paddingRight: 5
    },
    searchInput: {
        height: 28,
        flex: 4.5,
        fontSize: 14,
        paddingVertical: 0,
    },

    emptyContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyImage: {
        flex: 0.25,
        resizeMode: 'contain',
    },
    emptyText: {
        marginTop: 20,
        fontSize: 16,
        textAlign: 'center',
        color: '#353535',
    },
    emotyPlaceholder: {
        height: '20%'
    },

    cellContainer: {
        width: '100%',
        backgroundColor: '#fff',
        minHeight: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: '#e8e8e8',
        borderBottomWidth: 0.5,
        paddingHorizontal: 15,
    },
    titleLab: {
        fontFamily: "PingFangSC-Medium",
        fontSize: 14,
        color: "#353535",
    },

});
