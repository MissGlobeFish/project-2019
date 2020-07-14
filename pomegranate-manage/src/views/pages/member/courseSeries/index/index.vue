<template>
  <d2-container :filename="filename" type="card">
    <template slot="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>课程活动管理</el-breadcrumb-item>
        <el-breadcrumb-item>课程活动系列</el-breadcrumb-item>
      </el-breadcrumb>
    </template>
      <div>
        <!-- 头部 -->
        <div class="top">
          <div class="top-title">
            <span>&nbsp;课程活动系列</span>
            <span style="margin-left:20px;font-size:12px;">你可以在该页面管理课程活动大类</span>
          </div>
          <div class="creat-module">
              <el-button type="primary" icon="el-icon-edit-outline" plain @click="handleSeries">新建系列</el-button>
          </div>
        </div>

        <!-- 新建系列 dialog -->
        <el-dialog class="newSeriesDialog" title="新建系列" :append-to-body="true" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">

          <!-- dialog-body -->
          <el-form :model="seriesForm" ref="seriesForm" label-width="100px" class="demo-ruleForm">

            <el-form-item label="系列类型：" prop="courseType" :rules="{ required: true, message: '请选择系列类型', trigger: 'blur' }">
                <el-radio v-model="seriesForm.courseType" label="C1">课程</el-radio>
                <el-radio v-model="seriesForm.courseType" label="C2">活动</el-radio>
            </el-form-item>
            <el-form-item label="系列名称：" prop="courseName" :rules="{ required: true, message: '系列名称不能为空', trigger: 'blur' }">
              <el-input v-model="seriesForm.courseName" placeholder="请输入系列名称" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>

          <!-- dialog-footer -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="handleCancel('seriesForm')">取 消</el-button>
            <el-button type="primary" @click="handleDialogSave('seriesForm')">保 存</el-button>
          </span>

        </el-dialog>

        <!-- 表格 -->
        <d2-crud 
        :index-row="indexRow"
        :columns="columns" 
        :data="tableData" 
        :options="options" 
        :loading="loading" 
        :rowHandle="rowHandle"
        @custom-emit-1="handleEdit"
        @custom-emit-2="handleDelete"/>

        <!-- 分页 -->
        <div class="pagination">
          <el-pagination 
          style="margin: 20px 0;text-align: right;"
          @size-change="handleSizeChange" 
          @current-change="handleCurrentChange" 
          :page-sizes="[10, 20, 50, 100, 200, 300, 400]" 
          :page-size="pageSize" 
          layout="total, sizes, prev, pager, next" 
          :total="total">
          </el-pagination>
        </div>
      </div>
   
  </d2-container>
</template>

<script>
import https from '../../../../../https.js'
export default {
    data () {
        return {
            filename: __filename,
            loading: false,// 表格加载
            dialogVisible: false,//新建编辑弹框显示

            /* 表单对象 */
            seriesForm: {
                courseType: '',
                courseName: '',
            },
            isState: '',//判断新增或编辑

            /* 会员列表 */
            indexRow: {
                width: '100',
                align: "center",
                fixed: true,
            },//排序
            columns: [
                {
                    title: '系列编号',
                    key: 'courseNo',
                    width: '300',
                    align: "center"
                },
                {
                    title: '系列名称',
                    key: 'courseName',
                    align: "center"
                },
                {
                    title: '系列类型',
                    key: 'courseType',
                    width: '300',
                    align: "center"
                },
            ],//表格头部分类
            tableData: [],//表格数据
            options: {
                height: '640',
                headerCellStyle({ row, rowIndex}) {
                    return 'background:#F9F9F9;color:#323232' 
                }
            },//表格样式表
            rowHandle: {
                width: '180',
                align: "center",
                fixed: 'right',
                custom: [{
                    text: '编辑',
                    type: 'primary',
                    plain: 'plain',
                    size: 'small',
                    emit: 'custom-emit-1'
                },{
                    text: '删除',
                    type: 'primary',
                    plain: 'plain',
                    size: 'small',
                    emit: 'custom-emit-2'
                }]
            },//自定义操作列

            /* 分页 */
            total: 0,
            pageNum: 1,
            pageSize: 10,
        }
    },
    created() {
        this.getTableList();
    },
    methods: {
        // 查询系列列表
        getTableList (val) {
            this.loading = true;
            let self = this;
            https.fetchGet('/pomegranate/web/course/type?pageNum='+ self.pageNum +'&pageSize='+ self.pageSize)
            .then(function(res){
                if (res.data.code) {
                    self.loading = false;
                    self.$message({
                        type: 'warning',
                        message: '信息查询失败，请稍后重试！'
                    });
                }else{
                    self.loading = false;
                    self.tableData = res.data.list;
                    self.total = parseInt(res.data.total);
                    self.tableData.forEach(i => {
                        if (i.courseType == 'C1') {
                            i.courseType = '课程';
                        }else if (i.courseType == 'C2') {
                            i.courseType = '活动';
                        }
                    });
                }
            })
            .catch(function(err){
                self.loading = false;
                self.$message({
                    type: 'warning',
                    message: '列表请求失败！'
                });
            })
        },

        //创建系列
        handleSeries(){
            this.dialogVisible = true;
            this.seriesForm = {
                courseType: '',
                courseName: '',
            };
            this.isState = 'new';
        },

        //编辑系列
        handleEdit({index, row}) {
            this.dialogVisible = true;
            let types;
            if (row.courseType == '课程') {
                types = 'C1';
            }else if (row.courseType == '活动') {
                types = 'C2';
            }
            this.seriesForm = {
                courseType: types,
                courseName: row.courseName,
                courseId: row.courseId,
                courseDesc: row.courseDesc,
                courseNo: row.courseNo,
            }
            this.isState = 'edit';
        },

        //删除系列
        handleDelete({index, row}){
            this.$confirm('此操作将永久删除系列 [ ' + row.courseName + ' ] , 是否继续？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let self = this;
                https.fetchDelete('/pomegranate/web/course/type/' + row.courseId)
                .then(function(res){
                    if (res.data.code) {
                        self.$message({
                            type: 'warning',
                            message: '系列删除失败！'
                        });
                    }else{
                        self.getTableList();
                        self.$message({
                            type: 'success',
                            message: '系列删除成功！'
                        });
                    }
                })
                .catch(function(err){
                    self.$message({
                        type: 'warning',
                        message: '系列删除失败！'
                    });
                })
            }).catch(() => {
                this.$message({
                type: 'info',
                message: '已取消删除'
                });          
            });
        },

        //确认创建系列
        handleDialogSave(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.dialogVisible = false;
                    let self = this;
                    if (self.isState == 'new') {
                        https.fetchPost('/pomegranate/web/course/type', self.seriesForm)
                        .then(function(res){
                            if (res.data.code) {
                                self.$message({
                                    type: 'warning',
                                    message: '信息提交失败，请检查后重试！'
                                });
                            }else{
                                self.dialogVisible = false;
                                self.getTableList();
                                self.$message({
                                    type: 'success',
                                    message: '创建系列成功！',
                                });
                            }
                        })
                        .catch(function(err){
                            self.$message({
                                type: 'warning',
                                message: '创建系列失败 ！'
                            });
                        })
                    }else if(self.isState == 'edit'){
                        https.fetchPut('/pomegranate/web/course/type', self.seriesForm)
                        .then(function(res){
                            if (res.data.code) {
                                self.$message({
                                    type: 'warning',
                                    message: '信息提交失败，请检查后重试！'
                                });
                            }else{
                                self.dialogVisible = false;
                                self.getTableList();
                                self.$message({
                                    type: 'success',
                                    message: '编辑系列成功！',
                                });
                            }
                        })
                        .catch(function(err){
                            self.$message({
                                type: 'warning',
                                message: '编辑系列失败 ！'
                            });
                        })
                    }
                } else {
                    return false;
                }
            });
        },

        //取消创建系列
        handleCancel(formName){
            this.dialogVisible = false;
            this.$refs['seriesForm'].resetFields();
        },

        //误操作关闭 dialog 的提示
        handleClose(done) {
            this.$confirm('确认关闭？编辑的内容将不会被保存！, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$refs['seriesForm'].resetFields();
                done();
            }).catch(() => {});
        },

        //切换当页显示数据条数
        handleSizeChange(val) {
            this.pageNum = 1;
            this.pageSize = val;
            this.getTableList()
        },
        
        //切换页码
        handleCurrentChange(val) {
            this.pageNum = val;
            this.getTableList()
        },
        
    }
}
</script>

<style lang="scss">
    ul,li{ 
        padding: 0;
        margin: 0;
        list-style: none;
    }
    .el-table,.d2-crud{
        box-shadow: 1px 1px 4px 1px rgba(204, 204, 204, 0.5);
        .d2-crud-body{
            padding: 0 !important;
        }
    }
    .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;

        .top-title{
            font-size: 24px;
            color: #323232;
        }
    }
    .newSeriesDialog{
        .el-dialog{
            .el-dialog__header{
                background: #F9F9F9;
                border-bottom: 1px solid #DDDDDD;
            }
            .el-input{
                width: 60%;
            }
            .el-select{
                width: 60%;
                .el-input{
                width: 100%;
                }
            }
        }
    }
</style>
