import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { Icon } from 'react-native-elements'
import PropTypes from 'prop-types'



export default class ClaimingExpensesDetailList extends Component {

    static propTypes = {
        editEnable: PropTypes.bool,
        value: PropTypes.array,

        onDeleteRowAtIndex: PropTypes.func, //删除某一项的回调
        onPressRowAtIndex: PropTypes.func   //点击某一项的回调
    }

    static defaultProps = {
        editEnable: true,
        value: [],
        onDeleteRowAtIndex: (index) => { },
        onPressRowAtIndex: (index) => { }
    }


    //报销金额
    getExpensesNumber() {
        const { value } = this.props
        var total = 0 
        value.forEach(item => {
            total += item.expenseAmount * 1
        });
        return total
    }

    //申请金额合计
    getApplyNumber() {
        const { value } = this.props
        var total = 0 
        value.forEach(item => {
            total += item.requestAmount * 1
        });
        return total
    }

    render() {
        const { value, editEnable, onPressRowAtIndex, onDeleteRowAtIndex } = this.props
        return (
            <View style={styles.container}>
                <SwipeListView
                    useFlatList
                    style={{ width: "100%", }}
                    data={value}
                    renderItem={(data, rowMap) => (
                        <View style={styles.rowBorder}>
                            <TouchableOpacity style={styles.rowContainer} activeOpacity={0.7}
                                onPress={() => {
                                    onPressRowAtIndex(data.index)
                                }}>
                                <Text style={styles.titleLab}> {data.item.exp.name} </Text>
                                <Text style={styles.valueLab}> {data.item.expenseAmount} </Text>
                                <Icon iconStyle={styles.arrowIcon}
                                    name="chevron-thin-right"
                                    type='entypo'
                                    size={18}
                                    color="#8B8B8B" />
                            </TouchableOpacity>
                        </View>
                    )}
                    renderHiddenItem={(data, rowMap) => (
                        <TouchableOpacity
                            style={styles.rowBack}
                            activeOpacity={0.7}
                            onPress={() => {
                                // console.log("点击删除")
                                onDeleteRowAtIndex(data.index)
                            }}>
                            <Text allowFontScaling={false} style={{ color: '#fff' }}>删除</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item, index) => item.exp.name + index}
                    disableRightSwipe={true}
                    closeOnRowBeginSwipe={true}
                    disableLeftSwipe={!editEnable}
                    leftOpenValue={75}
                    rightOpenValue={-75}
                    previewRowKey={'0'}
                    onRowDidOpen={(rowKey) => { console.log(rowKey) }}
                />
                {value.length > 0 ? (
                    <View style={styles.numberBox}>
                        <Text style={styles.numberLab}> {"申请报销金额合计：" + this.getExpensesNumber()} </Text>
                        <Text style={styles.numberLab}> {"申请付/退款金额合计：" + this.getApplyNumber()} </Text>
                    </View>
                ) : null}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    rowBorder: {
        width: "100%",
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 10,
    },
    rowContainer: {
        width: "100%",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: '#e8e8e8',
        borderBottomWidth: 0.5,
        minHeight: 50,
    },
    titleLab: {
        maxWidth: "30%",
        marginRight: 10,
        fontFamily: "PingFangSC-Medium",
        fontSize: 14,
        color: "#353535",
    },
    valueLab: {
        fontSize: 14,
        flex: 5,
        textAlign: 'right',
        lineHeight: 24,
        fontFamily: 'PingFangSC-Regular',
        fontSize: 14,
        color: '#353535',
    },
    arrowIcon: {
        paddingLeft: 5,
    },
    rowBack: {
        // width: "100%",
        alignItems: 'center',
        backgroundColor: '#FF0000',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: 20
    },
    numberBox: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        width: "100%",
    },
    numberLab: {
        marginTop: 10,
        width: "100%",
        fontFamily: "PingFangSC-Medium",
        fontSize: 14,
        color: "#353535",
    },

});
