import React, { Component } from 'react'
import {
    View,
    ScrollView,
    Text,
    Image,
    StyleSheet,
    Platform,
    TouchableOpacity,
    Dimensions
} from 'react-native'
import PropTypes from 'prop-types';
//屏幕信息
//获取屏幕的宽度和高度
let { width } = Dimensions.get('window');

export default class Banner extends Component {

    static defaultProps = {
        title: '',
        duration: 10000,
        data: []
    }
    static propTypes = {
        data: PropTypes.any,
        onBannerClick: PropTypes.func,
    }
    constructor(props) {
        super(props);
        this.state = {
            //当前显示的下标
            position: 0,
            money: []
        }
    }
    _getImages() {
        let images = [];
        for (let i = 0; i < this.props.data.length; i++) {
            images.push(
                <TouchableOpacity activeOpacity={1} key={i} onPress={() => this.props.onBannerClick(this.props.data[i])}>
                    <Image source={{ uri: this.props.data[i]['image'] }}
                        style={styles.image} />
                </TouchableOpacity>
            );
        }
        return images;
    }

    getIndicators() {
        let circles = [];

        for (let i = 0; i < this.props.data.length; i++) {
            circles.push(
                <Text key={i}
                    style={i == this.state.position ? styles.selected : styles.unselected}>
                    &bull;
                </Text>
            )
        }
        return circles;
    }

    onAnimationEnd(v) {
        let offsetX = v.nativeEvent.contentOffset.x;
        let position = Math.round(offsetX / width);
        this.setState({
            position: position
        });

        if (Platform.OS !== "ios") {
            this.startTimer();
        }
    }

    componentDidMount() {
        this.startTimer();
    }
    startTimer() {
        let scrollView = this.refs.scrollView;
        this.timer = setInterval(() => {
            let curr = this.state.position;
            if (curr + 1 > this.props.data.length - 1) {
                curr = 0;
            } else {
                curr++;
            }
            this.setState({
                position: curr,
            });
            scrollView.scrollTo({ x: curr * width, y: 0, animated: true })
        }, this.props.duration);
    }
    componentWillUnmount(nextProps, nextState) {
        clearInterval(this.timer);
    }
    render() {
        const { data } = this.props;
        return (
            <View style={styles.container}>
                <ScrollView
                    ref="scrollView"
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled={true}
                    onMomentumScrollEnd={(v) => this.onAnimationEnd(v)}
                    onTouchStart={() => clearInterval(this.timer)}
                    onTouchEnd={() => this.startTimer()}
                >

                    {this._getImages()}
                </ScrollView>
                <View style={styles.indicator}>
                    <Text style={{ marginLeft: 16, width: width - 32 - 12 * data.length, fontSize: 16, color: 'white', }} numberOfLines={1}>
                        {this.props.data.length > 0 && this.props.data[this.state.position]['title']}</Text>
                    {this.getIndicators()}
                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 0,
        width: width,
        height: 188
    },
    image: {
        width: width,
        height: 188,
    },
    indicator: {
        width: width,
        height: 40,
        position: 'absolute',
        bottom: 0,//放置在底部
        backgroundColor: 'rgba(0,0,0,0.5)',
        flexDirection: 'row',
        alignItems: 'center',
    },
    unselected: {
        marginLeft: 4,
        fontSize: 20,//也就是圆点的大小
        color: 'gray',
        textAlign: 'right'
    },
    selected: {
        marginLeft: 4,
        fontSize: 20,//也就是圆点的大小
        color: 'white',
        textAlign: 'right'
    }
});

module.export = Banner;
