<template>

<span class="DeptSelectorSingle">
  <el-input
    placeholder="点击选择部门"
    suffix-icon="el-icon-search"
    class="handle-input mr10"
    @click.native="selectOption.flag && openDeptDialog()"
    v-model="selectOption.deptPath"
    :disabled="selectOption.status">
  </el-input>

  <el-dialog title="组织架构 ( 单选 )" :visible.sync="dialogTreeVisible">
    <el-tree
      :data="data"
      :show-checkbox="true"
      :expand-on-click-node="false"
      :check-strictly="true"
      node-key="id"
      ref="tree"
      @current-change="reselect"
      highlight-current>
    </el-tree>
    
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogTreeVisible = false">取 消</el-button>
      <el-button @click="resetChecked">清 空</el-button>
      <el-button type="primary" @click="getCheckedKeys()">确 定</el-button>
    </span>
  </el-dialog>
</span>
</template>

<script>

  export default {
    props: ["selectOption"],
    data() {
      return { 
        dialogTreeVisible: false,
        deptCode: "", 
        deptName: '',
        tempID: "", 
        data: [{label:'加载中...'}]
      };
    }, 
    created(){ 
      this.getTrees();
    },
    methods:{
      setDisabled(trees){
        trees.map(tree => {
                tree.disabled = true;
                if(tree.children) this.setDisabled(tree.children);
              });
      },
      getTrees(){
        let self = this; 
        let url =  global.HUMRES_URL +  "/humres/deptmanage/findDeptTrees/"+self.selectOption.org;
        this.$http.get(url, self.option).then(
          function(data) {
            if (data.body.flag) {
              let trees = data.body.list;
              this.setDisabled(trees); 
              self.data = trees; 
            } else {
              self.$message({
                message: data.body.msg,
                type: 'warning'
              });
            }
          },
          function(error) {
            // 这里是处理错误的回调
            self.$message({
              message: "请求超时！",
              type: 'error'
            });
          }
        );
      },
      reselect(data, checked, indeterminate){ 
        this.$refs.tree.setChecked(this.tempID, false, false);
        this.$refs.tree.setChecked(data.id, true, false);
        this.deptCode = data.id;
        this.deptName = data.path;
        this.tempID = data.id;  
      },
      resetChecked() {//清空被选择的树
        this.$refs.tree.setChecked(this.tempID, false, false);
        this.deptCode = '';
        this.deptName = '';
        this.selectOption.deptPath ='';
      },
      openDeptDialog(){//点击选择的input
        this.dialogTreeVisible = true;
        this.getTrees();
      },
      getCheckedKeys(){//确定
        this.selectOption.deptPath = this.deptName;  
        this.$emit('deptSelecotrSingle',this.selectOption.deptPath,this.deptCode);
        this.dialogTreeVisible = false;
      }
    }
  };
</script>
<style lang="less" scoped>
.DeptSelectorSingle{
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;//阻止文字被选中

    .el-input{
      width: 100% !important;
    }
}
</style>