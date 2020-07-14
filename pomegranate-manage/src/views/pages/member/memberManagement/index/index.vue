<template>
  <d2-container :filename="filename" type="card">
    <template slot="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>会员管理</el-breadcrumb-item>
        <el-breadcrumb-item>会员管理</el-breadcrumb-item>
      </el-breadcrumb>
    </template>
      <div>

        <!-- 头部 -->
        <div class="top">
          <div class="top-title">
            <span>&nbsp;会员管理</span>
            <span style="margin-left:20px;font-size:12px;">你可以在该页面对会员进行管理</span>
          </div>
        </div>

        <el-dialog class="linkDialog" title="" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <span>请点击 <a :href="excelLink" @click="clickLink">导出 <i class="el-icon-upload"></i></a> 下载会员管理列表！</span>
        </el-dialog>

        <!-- 查询 -->
        <el-form :inline="true" :model="formInline" ref="formInline" class="demo-form-inline">
          <el-form-item label="" prop="name">
            <el-input v-model="formInline.name" placeholder="姓名"></el-input>
          </el-form-item>
          <el-form-item label="" prop="memberNo">
            <el-input v-model="formInline.memberNo" placeholder="用户编码"></el-input>
          </el-form-item>
          <el-form-item label="" prop="phoneNum">
            <el-input v-model="formInline.phoneNum" placeholder="手机"></el-input>
          </el-form-item>
          <el-form-item label="" prop="cardTypeName">
            <el-select v-model="formInline.cardTypeName" value-key="id" @change="changeCardType" placeholder="请选择会员类型">
                <el-option v-for="item in memberTypes" :key="item.id" :label="item.name" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="time">
            <el-date-picker
              v-model="formInline.time"
              type="daterange"
              range-separator="至"
              start-placeholder="创建开始日期"
              end-placeholder="创建结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="" prop="edate">
            <el-date-picker
              v-model="formInline.edate"
              type="daterange"
              range-separator="至"
              start-placeholder="会员到期开始日期"
              end-placeholder="会员到期结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">查询</el-button>
            <el-button type="primary" @click="handleReset('formInline')">重置</el-button>
          </el-form-item>
        </el-form>

        <!-- 表格 -->
        <d2-crud 
        :index-row="indexRow"
        :columns="columns" 
        :data="tableData" 
        :options="options" 
        :loading="loading" 
        :rowHandle="rowHandle"
        @custom-emit-1="handleLookOver"
        @custom-emit-2="handleDelete">
            <el-button slot="header" type="text"  icon="el-icon-upload" style="margin:5px 20px;float:right;" @click="handleExcel">导出</el-button>
        </d2-crud>

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
            dialogVisible: false,//导出弹框

            /* 查询表单对象 */
            formInline: {
                name: null,
                memberNo: null,
                phoneNum: null,
                cardTypeName: null,
                cardType: null,
                time: null,
                edate: null,
                expireBeginDate: null,
                expireEndDate: null,
                beginDate: null,
                endDate: null,
            },
            screenFormInline: {},

            /* 导出链接 */
            excelLink: '',

            /* 会员列表 */
            indexRow: {
                width: '100',
                align: "center",
                fixed: true,
            },//排序
            columns: [
                {
                    title: '用户编码',
                    key: 'memberNo',
                    width: '250',
                    align: "center"
                },
                {
                    title: '姓名',
                    key: 'name',
                    align: "center"
                },
                {
                    title: '手机',
                    key: 'phoneNum',
                    width: '150',
                    align: "center"
                },
                {
                    title: '会员类型',
                    key: 'cardTypeName',
                    width: '100',
                    align: "center"
                },
                {
                    title: '签到次数',
                    key: 'signNum',
                    width: '100',
                    align: "center"
                },
                {
                    title: '出勤率',
                    key: 'attendance',
                    width: '100',
                    align: "center"
                },
                {
                    title: '创建时间',
                    key: 'lastCreateTime',
                    width: '300',
                    align: "center"
                },
                {
                    title: '会员到期时间',
                    key: 'expireDate',
                    width: '200',
                    align: "center",
                }
            ],//表格头部分类
            tableData: [],//表格数据
            options: {
                height: '600',
                headerCellStyle({ row, rowIndex}) {
                    return 'background:#F9F9F9;color:#323232' 
                }
            },//表格样式表
            rowHandle: {
                width: '180',
                align: "center",
                fixed: 'right',
                custom: [
                {
                    text: '查看',
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
                }
                ]
            },//自定义操作列

            /* 会员类型下拉列表 */
            memberTypes: [],

            /* 分页 */
            total: 0,
            pageNum: 1,
            pageSize: 10,
        }
    },
    created() {
        this.getTableList({});
        this.getMemberTypes();
    },
    methods: {
    // 查询交易列表
        getTableList (val) {
            this.loading = true;
            let self = this;
            self.screenFormInline = val;
            https.fetchPost('/pomegranate/web/member/list/find?pageNum='+ self.pageNum +'&pageSize='+ self.pageSize, val)
            .then(function(res){
                if (res.data.code) {
                    self.loading = false;
                    self.$message({
                        type: 'warning',
                        message: '列表查询失败，请稍后重试！'
                    });
                }else{
                    self.loading = false;
                    self.tableData = res.data.list;
                    self.total = parseInt(res.data.total);
                    self.tableData.forEach(element => {
                        if (element.attendance != 0) {
                            element.attendance = element.attendance * 100 + '%';
                        }
                    });
                }
            })
            .catch(function(err){
                self.loading = false;
                self.$message({
                    type: 'warning',
                    message: '会员列表查询失败！'
                });
            })
        },

        //查询会员类型
        getMemberTypes(){
            let self = this;
            https.fetchGet( '/pomegranate/web/baseInfo/member')
            .then(function(res){
                if (res.data.code) {
                    self.$message({
                        type: 'warning',
                        message: '信息查询失败，请稍后重试！'
                    });
                }else{
                    self.memberTypes = res.data;
                }
            })
            .catch(function(err){
                self.$message({
                type: 'warning',
                message: '查询会员类型失败！',
                });
            })
        },

        //选择会员类型
        changeCardType(val){
            this.formInline.cardTypeName = val.name;
            this.formInline.cardType = val.id;
        },

        //筛选
        handleQuery(){
            if (this.formInline.time) {
                let time = [];
                this.formInline.time.forEach(i => {
                    let date = new Date(i);
                    let y = date.getFullYear();
                    let m = (date.getMonth() + 1)<10?'0'+(date.getMonth() + 1):(date.getMonth() + 1);
                    let d = date.getDate()<10?'0'+date.getDate():date.getDate();
                    time.push(y + '/' + m + '/' + d);
                });
                this.formInline.beginDate = time[0];
                this.formInline.endDate = time[1];
            }
            if (this.formInline.edate) {
                let edate = [];
                this.formInline.edate.forEach(i => {
                    let date = new Date(i);
                    let y = date.getFullYear();
                    let m = (date.getMonth() + 1)<10?'0'+(date.getMonth() + 1):(date.getMonth() + 1);
                    let d = date.getDate()<10?'0'+date.getDate():date.getDate();
                    edate.push(y + '/' + m + '/' + d);
                });
                this.formInline.expireBeginDate = edate[0];
                this.formInline.expireEndDate = edate[1];
            }
            this.getTableList(this.formInline);
        },

        //重置表单
        handleReset(formName){
            this.$refs[formName].resetFields();
            this.formInline.time = null;
            this.formInline.edate = null;
            this.formInline.beginDate = null;
            this.formInline.endDate = null;
            this.formInline.expireBeginDate = null;
            this.formInline.expireEndDate = null;
            this.getTableList({});
        },

        //查看会员详情
        handleLookOver({index, row}) {
            this.$router.push({
                name: 'pages-member-memberManagement-page-memberDetails',
                params: row,
            })
            console.log(row)
            localStorage.setItem("memberDetails", JSON.stringify(row));
        },

        //删除
        handleDelete({index, row}){
            this.$confirm('此操作将永久删除会员 [ ' + row.name + ' ] , 是否继续？', '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let self = this;
                https.fetchDelete('/pomegranate/web/member/delete/' + row.id)
                .then(function(res){
                    if (res.data.code) {
                        self.$message({
                            type: 'warning',
                            message: '会员删除失败！'
                        });
                    }else{
                        self.getTableList({});
                        self.$message({
                            type: 'success',
                            message: '会员删除成功！'
                        });
                    }
                })
                .catch(function(err){
                    self.$message({
                        type: 'warning',
                        message: '会员删除失败！'
                    });
                })
            }).catch(() => {
                this.$message({
                type: 'info',
                message: '已取消删除'
                });          
            });
        },

        //导出表格
        handleExcel(){
            let self = this;
            https.fetchPost('/pomegranate/web/member/excel', self.screenFormInline)
            .then(function(res){
                if (res.data.code) {
                    self.$message({
                        type: 'warning',
                        message: '表格导出失败，请稍后重试！'
                    });
                }else{
                    self.dialogVisible = true;
                    self.excelLink = res.data;
                }
            })
            .catch(function(err){
                self.$message({
                    type: 'warning',
                    message: '表格导出失败！'
                });
            })  
        },

        //导出成功关闭提示框
        clickLink(){
            this.dialogVisible = false;
        },

        //误操作提示框
        handleClose(done) {
            done();
        },

        //切换当页显示数据条数
        handleSizeChange(val) {
            this.pageNum = 1;
            this.pageSize = val;
            this.getTableList({})
        },
        
        //切换页码
        handleCurrentChange(val) {
            this.pageNum = val;
            this.getTableList({})
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
    .linkDialog{
        margin-top: 15% !important;
        .el-dialog__body{
            text-align: center;
        }
    }
    .el-table,.d2-crud{
        box-shadow: 1px 1px 4px 1px rgba(204, 204, 204, 0.5);
        .d2-crud-header{
            overflow: hidden;
        }
        .d2-crud-body{
            padding: 0 !important;
        }
    }
</style>
