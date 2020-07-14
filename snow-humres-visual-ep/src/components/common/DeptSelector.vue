<template>

<span class="deptSelector">
  <el-input
    placeholder="点击选择部门"
    readonly
    suffix-icon="el-icon-search"
    class="handle-input mr10"
    @click.native="openDeptDialog()"
    v-model="dept_names">
  </el-input>

  <el-dialog title="组织架构" :visible.sync="dialogTreeVisible">
    <el-tree
      :data="data"
      show-checkbox
      default-expand-all
      node-key="id"
      ref="tree"
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
    data() {
      return {
      data: [{
          id: 'D001',
          label: '软件研发部',
          children: [{
            id: 'D002',
            label: 'ERP团队',
            children: [{
              id: 'D003',
              label: '实施'
            }, {
              id: 'D004',
              label: '研发测试'
            }]
          }]
        }, {
          id: 'D005',
          label: '人力行政部',
          children: [{
            id: 'D006',
            label: '薪酬组'
          }, {
            id: 'D007',
            label: '员工关系组'
          }]
        }, {
          id: 'D006',
          label: '广告部',
          children: [{
            id: 'D007',
            label: '成都区'
          }, {
            id: 'D008',
            label: '二级 3-2'
          }]
        }],
        dept_names : "",
        depts: "",
        deptnames: "",
        dialogTreeVisible: false
      };
    },
    methods:{
      getCheckedKeys() {//确定
        this.dept_names = '';
        this.$refs.tree.getCheckedNodes().map(item => {
          this.depts += item.id + ',';
          this.deptnames += item.label + ',';
        });
        this.depts = this.depts.substring(0,this.depts.length-1);
        this.deptnames = this.deptnames.substring(0,this.depts.length-1);
        this.dept_names = this.deptnames;
        this.dialogTreeVisible = false;
        this.$emit("deptNameBack", this.dept_names);
      },
      resetChecked() {//清空
        this.$refs.tree.setCheckedKeys([]);
        this.dept_names = '';
        this.depts = '';
        this.deptnames = '';
      },
      openDeptDialog() {//点击input打开选框
        this.dialogTreeVisible = true;
      }
    }
  };
</script>
<style lang="less" scoped>
.deptSelector{
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;//阻止文字被选中

    .el-input{
      width: auto;
    }
}
</style>