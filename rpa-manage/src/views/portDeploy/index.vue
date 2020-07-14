<template>
  <div class="app-container">
    <el-form class="port-box" ref="portForm" :model="portForm" label-width="80px" size="small" v-loading="listLoading">
      <p class="title-box">接口配置信息</p>
      <el-form-item label="接口" prop="url">
        <el-input v-model="portForm.url" placeholder="请输入接口"></el-input>
      </el-form-item>
      <el-form-item style="float:right;">
        <el-button type="primary" @click="onSubmit">保 存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { getPort, editPort } from '@/api/portDeploy'

export default {
  data() {
    return {
      portForm: {
        id: '',
        name: '',
        url: ''
      },
      listLoading: false
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    //获取表格数据
    fetchData() {
      this.listLoading = true
      getPort().then(response => {
        this.listLoading = false;
        this.portForm = {
          id: response.id,
          name: response.name,
          url: response.url,
        }
      })
    },
    onSubmit() {
      editPort(this.portForm).then(response => {
        this.$message({
          message: '保存成功！',
          type: 'success'
        });
        this.fetchData();
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  $dark_gray:#889aa4;
  
  .port-box{
    width: 50%;
    min-height: 600px;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
    padding: 15px 30px;
    .title-box{
      text-align: center;
      padding-bottom: 15px;
      font-weight: bold;
    }
  }
</style>
