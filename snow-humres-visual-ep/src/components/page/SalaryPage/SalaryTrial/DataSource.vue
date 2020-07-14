<template>
  <!-- 薪酬试算/数据源 -->
  <div class="data-wrap">
    <div class=" sub-box-shadow">
      <div class="data-source">
        <div class="son-title">数据源: <span style="font-size: 12px;color: #666;">(绿色代表本月已上传数据，红色代表未上传数据)</span>   </div>
        <div>
          <el-row>
            <el-col :span="3" v-for="(item, index) in data" :key="index">
              <el-card :body-style="{ padding: '0px'}" style="margin: 10px;">
                <div style="padding: 14px;text-align: center;height: 60px">
                  <p>{{item.title}}</p>
                  <div :class="item.isData ? 'el-icon-success': 'el-icon-warning'" class="data-source-item"></div>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <!-- <el-button v-for="(item, index) in data" :key="index" :class="item.isData ?'isGreen' : 'isRed'" @click="upLoadData(item)">{{item.name}}</el-button> -->
        </div>
      </div>

      <div class="cal-formula">
        <div class="son-title">计算公式:<span style="font-size: 12px;color: #666;">(点击可查看详细公式)</span></div>
        <div style="text-align: center">
          <el-table border style="width: 100%" :data="tableData" :show-header="false">
            <!-- <span>1231</span> -->
            <el-table-column  v-for="(item, index) in tableHeadData" :key="index" >
              <template slot-scope="scope">
                <p @click="lookfFormula(item)" slot="reference">{{item.title}}</p>
              </template>
            </el-table-column>
          </el-table>
          <el-form align="left" style="height: 60px;">
            <el-form-item  v-show="isShowItemFormular"  :label="formularName+':'">{{formulaStr}}</el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  props: {
    data: {
      type: Array,
      default: ()=>{
        return []
      }
    },
    tableHeadData: {
      type: Array,
      default:()=>{
        return []
      }
    }
  },
  data() {
    return {
      isShowItemFormular: false,//查看具体公式
      tableData: [{}],
      formularName: '',//计算公式名称
      formulaStr: ''
    };
  },
  computed: {

  },
  mounted () {

  },
  watch: {

  },
  methods: {
    upLoadData(val) {
      if(val.isData) {
        return
      } else {
        console.log('上传数据')
      }
    },
    lookfFormula(val) {//查看公式
      console.log(val)
      //TODU判断是否有公式可以点击，有--继续，没有--return
      this.isShowItemFormular = true;      
      this.formularName = val.title;
      this.formulaStr = val.formulaStr ? val.formulaStr : val.title
    }
  },
};
</script>

<style scoped lang="less">
.data-wrap {
  margin-top: 20px;
}
.son-title {
    // text-align: center;
    font-size: 16px;
    margin-bottom: 8px;
    color: #333;
}
.isGreen {
  background-color: #79ad5d;
  color: #fff;
}
.isRed {
  background-color: #F56C6C;
  color: #fff;
}
.data-source {
  margin-top: 20px;
}
.cal-formula {
  margin-top: 40px;
}
.data-source-item {
   margin-top: 5px;
}
.data-source-item.el-icon-success {
  color: #79ad5d;
}
.data-source-item.el-icon-warning {
  color: #F56C6C;
}
</style>
