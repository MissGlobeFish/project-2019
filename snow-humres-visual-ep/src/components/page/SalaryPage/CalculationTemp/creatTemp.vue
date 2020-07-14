<template>
    <div class="calculate-steps">
      <!-- 创建模板 -->
      <div class="step-content">
        <div class="tip-wrap">
          <p class="tip-title">{{currentActive == 0 ? '1' : '2'}}</p>
          <p>{{currentActive == 0 ? '添加数据源' : '填写计算公式'}}</p>
        </div>
        <!-- 第一步 添加数据源 -->
        <div class="content-item item-1" v-if="currentActive == 0">
          <AddDataSource v-on:handleNext="handleNext" ref="addDataSource"/>
        </div>
        <!-- 第二步 填写计算公式 -->
        <div class="content-item item-2" v-if="currentActive == 1">
          <el-tabs type="border-card">
            <el-tab-pane  v-for="(item, index) in this.$store.state.creatForm.DataBaseVal " :key="index"  :label="item.title">
              <div class="temp-wrap">
                 <el-button v-for="(subitem,subindex) in item.columns" :key="subindex" @click="handleFiled(item,subitem,index.subindex)">{{subitem.title}}</el-button>
              </div>
            </el-tab-pane>
          </el-tabs>

          <el-tabs @tab-click="handleClick" style="margin-top: 20px">
            <el-tab-pane label="对应关系">
              <div class="cal-wrap">
                <p style="text-align: center;color: #409EFF;letter-spacing: 6px;font-size: 20px;margin: 10px auto;">添加关系</p>
                  <div class="cal-table">
                    <draggable @start="drag=true" @end="drag=false" v-model="RelateTable">
                      <el-tag v-for="(item, index) in RelateTable" :key="index" closable @close="handleCloseRelate(item)">{{item.mainTitle+"·"+item.title}}</el-tag>
                    </draggable>
                  </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="计算公式">
              <!--   v-if="!isAddRelate" -->
              <div>
                <div class="cal-wrap">
                  <p style="text-align: center;color: #409EFF;letter-spacing: 6px;font-size: 20px;margin: 10px auto;">计算模块输出</p>
                  <div class="cal-table">
                    <!-- <el-button @click="test()">全部删除</el-button> -->
                    <draggable @start="drag=true" @end="drag=false" v-model="calTable">
                      <el-tag v-for="(item, index) in calTable" :key="index" closable @close="handleCloseFiled(item)" @click="addFormula(item,calTable)">{{item.title}}</el-tag>
                      <el-button class="el-icon-circle-plus" @click="addFormula('add')">添加</el-button>
                    </draggable>
                  </div>
                  <p class="tip">*提示： 还可点击上面模板表格中的字段添加！</p>
                </div>
                
              </div>
            </el-tab-pane>
            <div class="step-operation">
              <el-button class="el-icon-caret-left" @click="cancleCreat()" :disabled="isSHowFormulaForm">取消创建</el-button>
              <el-button @click="currentActive--" :disabled="isSHowFormulaForm">上一步</el-button>
              <el-button type="primary" @click="endCreat()" :disabled="isSHowFormulaForm">完成</el-button>
            </div>
          </el-tabs>
          <!-- 计算公式输出 -->
          <Formula :isSHowFormulaForm = "isSHowFormulaForm" ref="formula" v-on:cancle="handleCancle" :formulaForm="formulaForm"/>
        </div>
      </div>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import AddDataSource from './AddDataSource'
import Formula from './Formula'
export default {
    name:'creatTemp',
    components: {
      draggable,AddDataSource,Formula
    },
    props: {

    },
    data() {
      return {
        id: '',//计算模板ID
        isAddRelate: true,// 正在添加关系
        isSHowFormulaForm: false,// 计算公式开启关闭
        currentActive: 0,// 目前进行第几步
        currentRowVal: '', // 从数据源里选中的单个值
        tempTab: this.$store.state.creatForm.DataBaseVal,// tab切换--输入模板
        calTable: [], // 选中数据源字段
        RelateTable: [],// 选中数据源字段到关系（我不懂这个）
        arr: [],// 关系主表
        formulaForm: {},//计算公式模板数据
        add: false, // 添加自定义公式状态／原有字段or新增字段状态
        // selectAddFormula: [],
        table_relation_column: [],// 对应关系
        isEdit: false,
      };
    },
    computed: {

    },
    mounted () {
    },
    watch: {
    },
    methods: {
      handleNext(data) {
        this.currentActive++
      },
      handleFiled(data,subdata,index,subindex) { // 选择tab切换上面模板字段
        console.log(subdata)
        if(this.isAddRelate) { // 选择添加关系
          let isRepeat = this.arr.indexOf(data.mainTableName);
          console.log(this.arr,'arr')
          if(isRepeat != -1) {
          this.$set(this.RelateTable,isRepeat,subdata);
          } else {
            this.arr.push(data.mainTableName);
            this.RelateTable.push(subdata)
          }
         } else {// 选择计算字段
          if (this.add) {
            this.$refs.formula.selectAddFormula(subdata)
          } else {
            let isCalRepeat = this.calTable.indexOf(subdata);// 避免选择重复
            if (isCalRepeat != -1) {
              this._log_warn('请勿选择相同字段')
              return false
            }
            this.calTable.push(subdata)
          }
        }
      },
      handleCloseFiled(data) { // 删除计算选中的模板字段
        this.calTable.splice(this.calTable.indexOf(data),1)
      },
      handleCloseRelate(data) { // 删除计关系的模板字段
        this.RelateTable.splice(this.RelateTable.indexOf(data),1);
        this.arr.splice(this.arr.indexOf(data.mainTableName),1);
      },
      addFormula(val,calTable) { // 添加计算公式
        if(val == 'add') {
          this.add = true;
        } else {
          this.add = false
        }
        this.isSHowFormulaForm = true;
        if(val) {
          this.$refs.formula.addFormulaEvent(val,calTable)
        } else {
          this.$refs.formula.addFormulaEvent()
        }
      },
      cancleCreat() {
        this.$store.commit('newIsShow',false)
      },
      /**
       * @param table_relation_column 对应关系
       * @param source_table 选中数据源（并且添加到对应关系）
       * @param tableStructure 完整表结构
       */
      endCreat() { // 完成
        this.table_relation_column = [];
        this.RelateTable.forEach((item, index)=>{
          this.table_relation_column.push({
            relation_column: `${item.mainTableName}.${item.name}`,
            name: item.name,
            mainTableName: item.mainTableName,
            mainTitle: item.mainTitle,
            title: item.title
          })
        })

        let sourceTable = this.$store.state.creatForm.DataBaseVal,source_table = []
        sourceTable.forEach((item, index)=>{
          source_table.push({name: item.mainTableName,title: item.title,id: item.id})
        })

        let tableStr = {main_table: {table_relation_column: this.table_relation_column,columns: this.calTable,source_table:source_table}};
        let tableStructure = JSON.stringify(tableStr);
        let obj = {
          title: this.$store.state.creatForm.title,// 模板名称
          templateCode: this.$store.state.creatForm.templateCode,// 模板编码
          tableStructure, // 表结构
          id: this.id
        }
        if (this.calTable==null || this.calTable == '' || this.calTable == undefined || 
            this.table_relation_column==null || this.table_relation_column == ''|| this.table_relation_column == undefined) {
          this._log_warn('请检查选择关系和计算公式是否为空')
          return
        }
        console.log(obj,'传送的东西')
        // return
        this.handleSubmit(obj);
      },
      handleCancle(data) {
        this.isSHowFormulaForm = data;
      },
      addRelate() {// 添加关系
        this.isAddRelate = !this.isAddRelate;
      },
      handleClick(tab,event) {
        this.isAddRelate = tab.index == 0 ?  true : false
      },
      handleSubmit(obj) {
        let ajaxUrl = this.isEdit ? this.putAjax(`${SALARY_URL}/template/salary`,obj):this.postAjax(`${SALARY_URL}/template/salary`,obj)
        ajaxUrl.then((res)=>{
          if (res.code == 1) {
            this._log_success('操作成功')
            // TODU 模板创建成功刷新父组件列表，并返回父组件
            this.$parent.handleInit()
            this.$store.commit('newIsShow',false);
            this.$store.commit('newCreatForm', {});
          } else {
            this._log_success(res.msg)
          }
        }).catch((error)=>{})
      },
      /**
       * handleDetail 编辑请求回显表结构方法
       * @param id 当前选择id
       * @param {boolean} isEdit 判断是编辑还是修改
       */
      handleDetail(id,isEdit) { // 表结构
        this.id=id;
        this.isEdit = isEdit;
        this.getAjax(`${SALARY_URL}/template/salary/${id}`).then(res => {
          this.$refs.addDataSource.parentProp(res.data);// 添加数据源数据回显
          let data = JSON.parse(res.data.tableStructure);
          console.log(data,'data')
          this.calTable = data.main_table.columns;// 计算模块数据回显
          this.RelateTable = data.main_table.table_relation_column; // 对应关系数据回显
          for (var i=0;i<this.RelateTable.length;i++) { // 把对应关系主表添加到数组中，避免重复选择
            this.arr.push(this.RelateTable[i].mainTableName)
          }
        }).catch(error => {
        })
      },
      // test() { // 临时
      //   this.calTable = []
      // }
    },
   
};
</script> 

<style lang="less">
.calculate-steps {
  li {
    list-style: none;
  }
  .step-content {
    margin-top: 20px;
    .tip-wrap {
      text-align: center;
      font-size: 14px;
      color: #666;
      margin-bottom: 20px;
      .tip-title {
        font-size: 14px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin: 10px auto;
        /* background-color: #409eff; */
        /* padding: 5px 10px; */
        color: #409eff;
        text-align: center;
        line-height: 30px;
        border: 1px solid #409eff;
      }
    }
    .tag {
      margin-right: 10px
    }
    .item-1 {}
    .item-2 {
      margin: auto;
      .temp-wrap { // 第一个个表格
        &>.el-button {
            margin-left: 10px;
            margin-top: 10px;
        }
        .temp-content-item {
          display: flex;
          border: 1px solid #d4d4d4;
          border-top: none;
          align-items: center;
          li {
            padding: 6px;
          }
          .temp-name {
            width: 20%;
            color: #606266;
            letter-spacing: 2px;
          }
          .temp-cont {
            flex: 1;
            border-left: 1px solid #d4d4d4;
          }
          &:first-child {
            border-top: 1px solid #d4d4d4;
          }
          .el-button {
            margin: 5px 8px;
          }
        }
      }
      .cal-wrap { // 第二个表格
        padding: 10px;
        margin-top: 20px;
        box-shadow: 2px 2px 4px 2px rgba(204, 204, 204, 0.5);
        .cal-table {
          margin-top: 20px;
          text-align: center;
          min-height:100px;
          .el-button {
            margin: 5px 8px;
          }
          .el-tag {
            margin: 5px 8px;
            color: #606266;
            border: 1px solid #dcdfe6;
            background: #fff;
            line-height: 0;
            height: auto;
            padding: 12px 20px;
            font-size: 14px;
            .el-icon-close {
              color:#d4d4d4;
              height: 14px;
            }
          }
        }
        .tip  {
          color: #8a8a8a;
          font-size: 12px;
          text-align: right;
        }
      }
      .step-operation {
        text-align: right;
        margin-top: 20px;
      }
  }
  } 
}
</style>
