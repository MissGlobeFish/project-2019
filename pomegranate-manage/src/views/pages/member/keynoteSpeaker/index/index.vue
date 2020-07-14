<template>
  <d2-container :filename="filename" type="card">
    <template slot="header">
      <!-- 页面导航 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>课程活动管理</el-breadcrumb-item>
        <el-breadcrumb-item>主讲嘉宾</el-breadcrumb-item>
      </el-breadcrumb>
    </template>

    <template>
      <div class="containerBox">

        <!-- 头部 -->
        <div class="top">
          <div class="top-title">
            <span>&nbsp;主讲嘉宾</span>
            <span style="margin-left:20px;font-size:12px;">你可以在该页面管理讲师和嘉宾的信息</span>
          </div>
          <div class="creat-module">
              <el-button type="primary" icon="el-icon-edit-outline" plain @click="handleNewTeachers">创建讲师嘉宾</el-button>
          </div>
        </div>

        <!-- 创建讲师嘉宾 dialog -->
        <el-dialog class="newLecturerDialog" title="创建讲师嘉宾" :append-to-body="true" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">

          <!-- dialog-body -->
          <el-form :model="lecturerForm" ref="lecturerForm" label-width="120px" class="demo-ruleForm">

            <!-- 图片上传位置 -->
            <el-form-item label="照片：" prop="teacherImage">
              <el-upload
                id="headerImg"
                class="avatar-uploader"
                :disabled='isLookOver'
                :action="uploadImgUrl"
                :headers='uploadHeaders'
                :show-file-list="false"
                :before-upload = "beforeUpload"
                :on-error = "UploadError"
                :on-success = "UploadSuccess">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>

            <el-form-item label="姓名：" prop="teacherName" :rules="{ required: true, message: '姓名不能为空', trigger: 'blur' }">
              <el-input :disabled='isLookOver' type="teacherName" v-model="lecturerForm.teacherName" autocomplete="off" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <!-- <el-form-item label="现任职务：" prop="productType">
              <el-input type="productType" v-model.number="lecturerForm.productType" autocomplete="off"></el-input>
            </el-form-item> -->
            <el-form-item label="授课人类型：" prop="teacherType" :rules="{ required: true, message: '请选择授课人类型', trigger: 'change' }">
              <el-select :disabled='isLookOver' type="teacherType" v-model="lecturerForm.teacherType" autocomplete="off" placeholder="请选择授课人类型">
                <el-option label="讲师" value="T1"></el-option>
                <el-option label="嘉宾" value="T2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="otherLabel" label="其他介绍："></el-form-item>
            <el-form-item class="otherLabel" prop="teacherDesc">
              <d2-ueditor v-model="lecturerForm.teacherDesc"/>
            </el-form-item>
          </el-form>

          <!-- dialog-footer -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="handleCancel('lecturerForm')">取 消</el-button>
            <el-button v-if="isState != 'LookOver'" type="primary" @click="handleDialogSave('lecturerForm')">保 存</el-button>
          </span>

        </el-dialog>

        <!-- 表格 -->
        <el-table :data="tableData"  v-loading="loading" :header-cell-style="{background:'#F9F9F9',color:'#323232',}" height="640" style="width: 100%;">
          <el-table-column type="index" fixed width="100" align="center"></el-table-column>
          <el-table-column prop="teacherName" label="姓名" width="300" align="center"></el-table-column>
          <el-table-column prop="teacherType" label="授课人类型" align="center"></el-table-column>
          <el-table-column prop="source" label="来源" width="300" align="center"></el-table-column>
          <el-table-column prop="lastCreateTime" label="创建时间" width="300" align="center"></el-table-column>
          <el-table-column label="操作"  fixed='right' width="300" align="center">
            <template slot-scope="scope">
                <el-button type="primary" size="small" plain @click.native.prevent="handleEdit(scope.$index, tableData)">编辑</el-button>
                <el-button type="primary" size="small" plain @click="handleDelete(scope.$index, tableData)">删除</el-button>
                <el-button type="primary" size="small" plain @click.native.prevent="handleLookOver(scope.$index, tableData)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>

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
    </template>
  </d2-container>
</template>
<script>
import https from '../../../../../https.js'
export default {
  components: {},
  data () {
    return {
      filename: __filename,
      loading: false,// 表格加载
      isState: '',//判断弹框在新增/编辑/查看的状态下
      isLookOver: false,//查看只读状态
      dialogVisible: false, //  新建/编辑弹框显示
      lecturerForm: { // 新建/编辑商品表单数据
        lastCreateTime: '',
        teacherDesc: '',
        teacherId: '',
        teacherImage: '',
        teacherName: '',
        teacherType: '',
      },
      tableData: [], // 初始列表数组

      /* 讲师照片上传 */
      uploadImgUrl: '/pomegranate/web/file',
      uploadHeaders: {
        'token': localStorage.getItem('token')
      },
      imageUrl: '',

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

    // 查询初始列表
    getTableList () {
      this.loading = true;
      let self = this;
      https.fetchGet('/pomegranate/web/teacher?pageNum='+ self.pageNum +'&pageSize='+ self.pageSize)
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
            let list = res.data.list;
            for (const i in list) {
              if (list[i].teacherType == 'T1') {
                list[i].teacherType = '讲师';
              }else if(list[i].teacherType == 'T2'){
                list[i].teacherType = '嘉宾';
              }
              if (list[i].source == 'S1') {
                list[i].source = '自身维护';
              }else if(list[i].source == 'S2'){
                list[i].source = '嘉宾报名';
              }
            }
        }
      })
      .catch(function(err){
        self.loading = false;
        self.$message({
          type: 'warning',
          message: '请求失败！'
        });
      })
    },

    //讲师照片上传
    beforeUpload(file) {
        const isLt5M = file.size / 1024 / 1024 / 1024 / 1024 / 1024  < 5;
        if (!isLt5M) {
          this.$message.error('上传照片大小不能超过 5MB!');
        }
        return  isLt5M;
      },
      UploadSuccess(response, file) {//文件上传成功后
        if (response) {
          this.imageUrl = response;
          this.lecturerForm.teacherImage = response;
          this.$message({
            message: "照片上传成功！",
            type: "success"
          });
        } else {
          this.$message({
            message: "照片上传发生错误，请检查文件格式！",
            type: "warning"
          });
        }
      },
      UploadError(err, file, fileList) {//文件上传失败
        this.$message({
          message: "照片上传失败，请检查后重试！",
          type: "error"
        });
    },

    //创建讲师嘉宾
    handleNewTeachers(){
      this.dialogVisible = true;
      this.isLookOver = false;
      this.isState = 'new';
      this.lecturerForm.teacherDesc = '';
      this.imageUrl = '';
    },

    //查看
    handleLookOver(index, rows){
      this.dialogVisible = true;
      this.isLookOver = true;
      this.isState = 'LookOver';
      let self = this;
      https.fetchGet('/pomegranate/web/teacher/'+rows[index].teacherId)
      .then(function(res){
        if (res.data.code) {
          self.$message({
              type: 'warning',
              message: '信息查询失败，请稍后重试！'
          });
        }else{
          self.lecturerForm = res.data;
          self.imageUrl = res.data.teacherImage;
        }
      })
      .catch(function(err){
        self.$message({
          type: 'warning',
          message: '查看讲师嘉宾信息失败！'
        });
      })
    },

    //编辑
    handleEdit(index, rows){
      this.dialogVisible = true;
      this.isLookOver = false;
      this.isState = 'edit';
      let self = this;
      https.fetchGet('/pomegranate/web/teacher/'+rows[index].teacherId)
      .then(function(res){
        if (res.data.code) {
          self.$message({
              type: 'warning',
              message: '信息查询失败，请稍后重试！'
          });
        }else{
          self.lecturerForm = res.data;
          self.imageUrl = res.data.teacherImage;
        }
      })
      .catch(function(err){
        self.$message({
          type: 'warning',
          message: '查看讲师嘉宾信息失败！'
        });
      })
    },

    //删除
    handleDelete(index, rows){
      this.$confirm('此操作将永久删除讲师嘉宾 [ ' + rows[index].teacherName + ' ] , 是否继续？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let self = this;
        https.fetchDelete('/pomegranate/web/teacher/' + rows[index].teacherId)
        .then(function(res){
          if (res.data.code) {
              self.$message({
                  type: 'warning',
                  message: '讲师嘉宾删除失败！'
              });
          }else{
              self.getTableList();
              self.$message({
                type: 'success',
                message: '讲师嘉宾删除成功！'
              });
          }
        })
        .catch(function(err){
          self.$message({
            type: 'warning',
            message: '讲师嘉宾删除失败！'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },

    //取消
    handleCancel(formName){
      this.dialogVisible = false;
      this.$refs[formName].resetFields();
      this.lecturerForm.teacherDesc = '';
      this.imageUrl = '';
    },

    //保存创建讲师嘉宾
    handleDialogSave(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.lecturerForm.source == '自身维护') {
            this.lecturerForm.source = 'S1';
          }else if(this.lecturerForm.source == '嘉宾报名'){
            this.lecturerForm.source = 'S2';
          }
          if (this.lecturerForm.teacherImage) {
            if (this.lecturerForm.teacherDesc) {
              this.submitTeachers(formName, this.isState);
              this.dialogVisible = false;
            }else{
              this.$alert('请编辑讲师介绍后再提交！', {
                  confirmButtonText: '确定',
                  type: 'warning',
              });
            }
          }else{
            this.$alert('请上传讲师照片！', {
                confirmButtonText: '确定',
                type: 'warning',
            });
          }
        } else {
          return false;
        }
      });
    },

    //提交讲师嘉宾信息
    submitTeachers(formName, isState){
      let self = this;
      if (isState == 'new') {//新增
        https.fetchPost('/pomegranate/web/teacher', self.lecturerForm)
        .then(function(res){
          if (res.data.code) {
              self.$message({
                  type: 'warning',
                  message: '信息提交失败，请检查后重试！'
              });
          }else{
              self.getTableList();
              self.$refs[formName].resetFields();
              self.lecturerForm.teacherDesc = '';
              self.imageUrl = '';
              self.$message({
                type: 'success',
                message: '保存成功！',
              });
          }
        })
        .catch(function(err){
          self.$message({
            type: 'warning',
            message: '保存失败！'
          });
        })
      }else if(isState == 'edit'){//编辑
        https.fetchPut('/pomegranate/web/teacher', self.lecturerForm)
        .then(function(res){
          if (res.data.code) {
              self.$message({
                  type: 'warning',
                  message: '信息提交失败，请检查后重试！'
              });
          }else{
              self.getTableList();
              self.$refs[formName].resetFields();
              self.lecturerForm.teacherDesc = '';
              self.imageUrl = '';
              self.$message({
                type: 'success',
                message: '保存成功！',
              });
          }
        })
        .catch(function(err){
          self.$message({
            type: 'warning',
            message: '保存失败！'
          });
        })
      }
    },

    //误操作关闭 dialog 的提示
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
          this.$refs.lecturerForm.resetFields();
          this.lecturerForm.teacherDesc = '';
          this.imageUrl = '';
        })
        .catch(_ => {});
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
  .newLecturerDialog{
    .el-dialog{
      margin-top: 30px !important;
      .el-dialog__header{
        background: #F9F9F9;
        border-bottom: 1px solid #DDDDDD;
      }
      .el-input{
        width: 70%;
      }
      .el-select{
        width: 70%;
        .el-input{
          width: 100%;
        }
      }
      .otherLabel{
        label{
          width: 120px !important;
        }
        .el-form-item__content{
          line-height: 0;
          margin-left: 0 !important;
        }
      }
    }
  }
  .el-table{
    box-shadow: 1px 1px 4px 1px rgba(204, 204, 204, 0.5);
  }
  /* 头像 style */
  #headerImg .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
  }
  .avatar {
    width: 148px;
    height: 148px;
    object-fit: cover;
    display: block;
  }
</style>
