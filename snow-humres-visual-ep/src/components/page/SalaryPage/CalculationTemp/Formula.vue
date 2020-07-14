<template>
<transition name="move" mode="out-in">
  <div class="cal-wrap" v-if="isSHowFormulaForm">
    <p style="text-align: center;color: #409EFF;letter-spacing: 6px;font-size: 20px;margin: 10px auto;">计算公式输出</p>
    <el-form ref="formulaForm"  label-width="120px" :model="formulaForm">
      <el-form-item label="计算公式名称:" prop="title" :rules="{required: true, message: '请输入模板名称',trigger: ''}">
        <el-input placeholder="请输入公式名称" v-model="formulaForm.title" :disabled="isDisabled"></el-input>
      </el-form-item>
      <el-form-item label="计算公式类型:" prop="data_type" :rules="{required: true, message: '请输入模板名称',trigger: ''}">
        <el-select v-model="formulaForm.data_type" placeholder="请选择">
          <el-option v-for="item in tempAddOptions" :key="item.data_type" :label="item.value" :value="item.data_type"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="计算公式选项:">
          <el-button class="el-icon-circle-plus" style="line-height: 1.1" size="small" type="primary" @click="addFormulaItem('add')" :disabled="isDisabled">添加</el-button>
          <span style="color: #8a8a8a;font-size: 12px">(提示：点击最上方的选项卡模板进行选择字段)</span>
      </el-form-item>
      <el-form-item label="详细计算公式:" v-if="formulaForm.calculateValue[0]? formulaForm.calculateValue[0].formulaStr : false"><span>{{formulaForm.calculateValue[0].formulaStr}}</span></el-form-item>
      <!-- <el-form-item v-else :rules="rules.title">
        <draggable @start="drag=true" @end="drag=false" v-model="formulaForm.calculateValue" style="display: flex;flex-wrap: wrap;">
          <div style="display: inline-bloFck;position: relative;margin: 5px"  v-for="(i, idx) in formulaForm.calculateValue" :key="idx">
            <i class="el-icon-error" style="position: absolute;z-index: 9;right: -5px;top: -5px;" @click="delFormulaItem(i,idx)"></i>
            <el-input class="inline-input"
              :disabled="idx == 0 && isDisabled"
              v-model="formulaForm.calculateValue[idx].title" placeholder="请输入内容" @select="handleSelect"></el-input>
          </div>
          
        </draggable> 
      </el-form-item> -->

       
        <draggable @start="drag=true" @end="drag=false" v-model="formulaForm.calculateValue" style="display: flex;flex-wrap: wrap;margin-left: 120px" v-else>
          <div style="display: inline-bloFck;position: relative;margin: 5px"  v-for="(i, idx) in formulaForm.calculateValue" :key="idx">
            <i class="el-icon-error" style="position: absolute;z-index: 9;right: -5px;top: -5px;" @click="delFormulaItem(i,idx)"></i>
            <el-form-item  :rules="rules.title" :prop="'calculateValue.'+idx+'.title'" label-width="0">
            <el-input class="inline-input"
              :disabled="idx == 0 && isDisabled"
              v-model="formulaForm.calculateValue[idx].title" placeholder="请输入内容" @select="handleSelect"></el-input>
            </el-form-item> 
          </div>
          
        </draggable> 
      
     
    </el-form >
    <div slot="footer" class="dialog-footer" style="text-align:right">
      <el-button @click="handleCancle">取 消</el-button>
      <el-button type="primary" @click="handleConfirm('formulaForm')">确 定</el-button>
    </div>
  </div>
  </transition>
</template>

<script>
let dataType = {
  string: 'STRING',
  number: 'NUMBER',
  datetime: 'DATETIME'
}
import draggable from 'vuedraggable'
export default {
    components: {
      draggable
    },
    props: {
      isSHowFormulaForm: {
        type: Boolean,
        default: () => {
            return false
        }
      }
    },
    data() {
      return {
        filterArr: [],//远程搜索数据过滤数组
        formulaForm: {
          title: '',data_type: '',// 计算公式名称
          calculateValue: [],// 计算公式选中选项
        }, 
        isDisabled: false,
        tempAddOptions: [
          {data_type: dataType.string,value: '文本'},
          {data_type: dataType.number,value: '数值'},
          {data_type: dataType.datetime,value: '日期'}
        ],
        rules: {
          title:[{required: true, message: '请输入', trigger: 'blur'},{pattern:/[\u4e00-\u9fa5+*-/a-zA-Z0-9]/g, message: '请重新输入',trigger: 'blur'}]
        },
      };
    },
    computed: {

    },
    mounted () {
    },
    watch: {

    },
    methods: {
      handleSelect(item) {// 下拉框选择的值
        console.log(item);
      },
      addFormulaEvent(data,calTable) { // 添加计算公式
        console.log(data,'datadata')
        this.isDisabled = false;
        this.formulaForm.title  = '';
        // return
        if (data && data != 'add') { // 已有字段添加公式
          let val = JSON.parse(JSON.stringify(data));
          this.formulaForm.title = val ? val.title : '';
          this.formulaForm.data_type = val ? val.data_type : '';
          this.formulaForm.calculateValue=[val];
          this.isDisabled = true;
        } else { // 自定义添加公式
          this.formulaForm.calculateValue = [];
        }
      },
      selectAddFormula(data) { //从模板中选择字段---计算公式
        this.formulaForm.calculateValue.push(data);
      },
      addFormulaItem() { //添加公式选项
        this.formulaForm.calculateValue.push({title: ''});
      },
      delFormulaItem(data,index) { // 删除公式选项
        if(index == 0 && this.isDisabled) {
          return
        }
        this.formulaForm.calculateValue.splice(index,1);// 删除下拉框里面的数据
      },
      handleCancle() {//取消
        this.$parent.add = false;
        this.$parent.isSHowFormulaForm = false;
      },
      handleConfirm(formName) {// 确定
      console.log('确定')
        this.$refs[formName].validate((valid)=> {
          if(valid) {
            let addFormulaObj = {},formula = '',formulaStr = '';
            this.formulaForm.calculateValue.forEach((item, index)=>{
              if(!item.formula) { // 是否有公式
                formulaStr += item.title;
                if (item.mainTableName) {
                  if (item.data_type == 'NUMBER') {
                    formula +=  `ifnull(${item.mainTableName}.${item.name},0)`
                  } else {
                     formula += `${item.mainTableName}.${item.name}`
                  }
                } else {
                  formula += item.title
                }
              } else {
                formulaStr += item.formulaStr
                formula += item.formula
              }
            })
            addFormulaObj = {
              title: this.formulaForm.title,
              data_type: this.formulaForm.data_type,
              formula: formula,
              formulaStr: formulaStr
            };
            console.log(this.$parent.calTable)
                // return       
            this.$parent.calTable.forEach((item, index) =>{
              if(item.title == addFormulaObj.title) {
                this.$parent.calTable.splice(index,1);
              }
            })
            console.log(addFormulaObj)
          // return
            this.$parent.calTable.push(addFormulaObj);
            this.$parent.isSHowFormulaForm = false;
            this.$parent.add = false;
            // console.log(this.$parent.calTable)
          } else {
            console.log('验证没有通过')
            
          }
        })
      }
    },
};
</script>

<style scoped lang="less">

</style>
