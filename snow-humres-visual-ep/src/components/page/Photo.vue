<template>
      <div class="salaryImport">
          <div class="importBox">

              <div class="crumbs">
                <el-breadcrumb separator="/">
                  <el-breadcrumb-item><i class="el-icon-sold-out"></i> 人员组织管理</el-breadcrumb-item>
                  <el-breadcrumb-item>工作照</el-breadcrumb-item>
                </el-breadcrumb>
              </div>

              <div class="handle-box photo-search">
                  <div class="search">
                      <el-input v-model="searchForm.empName" placeholder="姓名" class="handle-input mr10"></el-input>
                      <el-input v-model="searchForm.deptNamePath" placeholder="部门" class="handle-input mr10"></el-input>
                      <el-button type="primary" class="el-icon-search" @click="search" plain> 搜索</el-button>
                  </div>
              </div>

              <el-row>
                <el-col :span="6" v-for="(item,index) in photos" :key="index" style="margin-top:10px;">
                  <el-card :body-style="{ padding: '0px' }">
                    <img :src="item.filePath" class="image">
                    <div style="padding: 14px;">
                      <span>{{ item.empName }}</span>
                      <div class="bottom clearfix">
                        <time class="time">{{ item.deptNamePath }}</time>
                      </div>
                      <el-button type="text" class="button" @click="drop(item.fileName)">删除</el-button>
                    </div>
                  </el-card>
                </el-col>
            </el-row>

          </div>

          <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%">
            <span>删除照片后无法恢复，请确定是否继续操作</span>
            <input type="text" v-model="dropFile" style="display:none;">
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dropPhoto()">确 定</el-button>
            </span>
          </el-dialog>


      </div>
</template>

<script>
export default {
  data() {
    return {
      currentDate: new Date(),
      photos: [],
      dialogVisible: false,
      dropFile: '',
      searchForm: {
        empName: '',
        deptNamePath: ''
      },
      option: {
        timeout: 30 * 1000 //30秒过期
      }
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    search(){
      this.loadData();
    },
    loadData(){
      let self = this;
      let _url =  global.HUMRES_URL + '/humres/empmanage/photo/list';
      self.$http.post(_url, self.searchForm, self.option).then(function(data) {
          if (data.body.flag) {
            self.photos = data.body.datas;
          } else {
            self.$message({
              message: data.body.msg,
              type: "warning"
            });
          }
        },
        function(error) { // 这里是处理错误的回调
          self.$message({
            message: "请求超时！",
            type: 'error'
          });
        });
    },
    drop(key){
      this.dialogVisible = true;
      this.dropFile = key;
    },
    dropPhoto(){
      let self = this;
      let _url =  global.HUMRES_URL + '/humres/empmanage/photo/drop';
      self.$http.post(_url,self.dropFile,self.option).then(function(data) {
          this.dropFile = '';
          if (data.body.flag) {
            self.photos = data.body.datas;
            self.$message({
              message: '提交成功！',
              type: "success"
            });
            this.dialogVisible = false;
            this.loadData();
          } else {
            self.$message({
              message: data.body.msg,
              type: "warning"
            });
          }
        },
        function(error) { // 这里是处理错误的回调
          this.dropFile = '';
          self.$message({
            message: "请求超时！",
            type: 'error'
          });
        });
    }
  }
};
</script>

<style lang="less">

    .photo-search {
      .button {
      padding: 0;
      float: right;
      margin-bottom: 10px;
      margin-top:10px;
      }
    }
    
    .time {
    font-size: 12px;
    color: #999;
    }

    .bottom {
    margin-top: 13px;
    line-height: 12px;
    }



    .image {
    width: 100%;
    display: block;
    height:220px;
    }

    .clearfix:before,
    .clearfix:after {
      display: table;
      content: "";
    }

    .clearfix:after {
      clear: both
    }

    .el-card {
      margin-right:15px;
    }


    .salaryImport {
      background: #fff;
        .importBox{
          box-shadow: 2px 2px 4px 2px rgba(204, 204, 204, 0.5);
          padding: 20px;

          .crumbs{
              margin-bottom: 40px;
          }
          .contents{
            .topInfo{
              margin-bottom: 30px;
            }

          }
        }
    }
</style>
