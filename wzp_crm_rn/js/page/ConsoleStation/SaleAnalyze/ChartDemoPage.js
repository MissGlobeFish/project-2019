/**
* 销量分析折线图
*/
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SaleAnalysisChart from '../../../common/SaleAnalysis/SaleAnalysisChart';
import PieChart from '../../../common/SaleAnalysis/PieChart';
import BarChart from '../../../common/SaleAnalysis/BarChart';

export default class ChartDemoPage extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: ' 图表DEMO',
      headerBackTitle: null,
    }
  }

  //Interactive Data

  constructor(props) {
    super(props);
    this.state = {
     
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

  //Render
  render() {
    const { chartOptions } = this.state
    return (
      <View style={styles.container}>
        <SaleAnalysisChart option={chartOptions} height={200} />
        <BarChart height= {200} />
        <PieChart option={chartOptions} height={200} containerStyle={styles.pieChartBox}></PieChart>
      </View>
    );
  }


  //Action && Handeler

  //UserFunction

  //NetWorks


}

//Styles
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  pieChartBox: {
    marginTop: 100
  }
})