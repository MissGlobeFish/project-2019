/**
 * DeviceInfo  查询设备信息页面
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    Alert,
    View,
    FlatList,
} from 'react-native';
import ListCommon from '../../common/ListCommon';
import ajax from '../../config/Fetch';
// import PersistanceManger from '../../util/PersistanceManger';


export default class DeviceInfo extends Component {
    static navigationOptions = {
        title: '设备信息',
    };
    _keyExtractor = (item, index) => item.key;

    constructor(props) {
        super(props)
        this.state = {
            infoData: {},
            listDataSource: [],
            refreshing: true,
            isEmptyData: false,
        }
    }

    _emptyComponent() {
        return (
            <View style={styles.emptyContent}>
                <Image style={styles.emptyImage} source={require('../../res/imgs/EmptyIcon.png')} />
                <Text style={styles.emptyText}> 没有检测到任何信息 </Text>
                <View style={styles.emotyPlaceholder}/>
            </View>
        )
    }

    render() {
        const { getParam } = this.props.navigation;
        const { refreshing, listDataSource, isEmptyData } = this.state;
        return (
            <View style={styles.container}>
                {/* <Text>{getParam('deviceId')}</Text>
                <Text>{this.state.testText}</Text> */}
                {isEmptyData ? this._emptyComponent() :
                    (<FlatList
                        style={styles.flatListStyle}
                        data={listDataSource}
                        refreshing={refreshing}
                        keyExtractor={this._keyExtractor}
                        renderItem={({ item }) => <ListCommon
                            key={item.title}
                            listKey={item.title}
                            listValue={item.value}
                        />}
                    />)}
            </View>
        );
    }

    //组件成功加载
    componentDidMount() {
        this.loadDeviceData()
    }

    loadDeviceData() {
        const { getParam, goBack } = this.props.navigation;
        this.setState({ refreshing: true })
        ajax.get('equipment-info', {
            equipmentCode: getParam('deviceId')
        }).then(res => {
            console.log(res)
            if (res.data.deviceType == null) {
                this.setState({
                    isEmptyData: true
                })
                return
            }
            this.setState({
                refreshing: false,
                infoData: res.data
            })
            this.configeListData()
        }).catch(error => {
            alert("查询失败！")
            this.setState({ refreshing: false })
        })

    }

    configeListData() {
        const { infoData } = this.state
        var newDatas = []
        newDatas = [
            {
                title: "项目名称",
                value: infoData.prjName,
            },
            {
                title: "项目账号",
                value: infoData.loginName,
            },
            {
                title: "设备类型",
                value: infoData.deviceType,
            },
            {
                title: "设备状态",
                value: infoData.deviceStatus,
            },
            {
                title: "仓库",
                value: infoData.repertory,
            },
            {
                title: "仓位",
                value: infoData.position,
            },
            {
                title: "无心跳次数",
                value: infoData.offlineCount,
            },
        ]
        if (infoData.picker != null && infoData.picker != "") {
            newDatas.push({
                title: "领料人",
                value: infoData.picker,
            })
        }
        this.setState({ listDataSource: newDatas })
        this.setState({ testText: '设置成功' })

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f9',
    },
    flatListStyle: {
        // paddingLeft: 15,
        // paddingRight: 15,
        // backgroundColor: '#FFFFFF'
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
    }
});
