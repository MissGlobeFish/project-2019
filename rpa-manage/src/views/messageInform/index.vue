<template>
  <div class="app-container">
    <el-form class="message-box" ref="messageForm" :model="messageForm" label-width="120px" size="small" v-loading="listLoading">
      <p class="title-box">消息通知配置</p>
      <el-form-item label="smtp服务器地址" prop="smtp">
        <el-input v-model="messageForm.smtp" placeholder="请输入地址"></el-input>
      </el-form-item>
      <el-form-item label="端口" prop="smtpPort">
        <el-input v-model="messageForm.smtpPort" placeholder="请输入端口号"></el-input>
      </el-form-item>
      <el-form-item label="邮件发送账号" prop="sender">
        <el-input v-model="messageForm.sender" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          placeholder="请输入密码"
          :key="passwordStatus"
          ref="passwords"
          v-model="messageForm.password"
          :type="passwordStatus"
          name="passwords"
          tabindex="2"
          auto-complete="on"
        />
        <!-- <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordStatus === 'passwords' ? 'eye' : 'eye-open'" />
        </span> -->
      </el-form-item>
      <el-form-item label="收件人信息" prop="receiver">
        <el-input v-model="messageForm.receiver" type="textarea" :rows="6" placeholder="请输入收件人信息"></el-input>
      </el-form-item>
      <el-form-item style="float:right;">
        <el-button type="primary" @click="onSubmit">保 存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import { getMessage, editMessage } from '@/api/messageInform'

export default {
  data() {
    return {
      messageForm: {
        id: '',
        smtp: '',
        smtpPort: '',
        sender: '',
        password: '',
        receiver: ''
      },
      passwordStatus: 'passwords',
      listLoading: false
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    //获取表格数据
    fetchData() {
      //this.listLoading = true
      getMessage().then(response => {
        this.listLoading = false;
        this.messageForm = {
          id: response.id,
          smtp: response.smtp,
          smtpPort: response.smtpPort,
          sender: response.sender,
          password: response.password,
          receiver: response.receiver
        }
      })
    },
    showPwd() {
      if (this.passwordStatus === 'passwords') {
        this.passwordStatus = ''
      } else {
        this.passwordStatus = 'passwords'
      }
      this.$nextTick(() => {
        this.$refs.passwords.focus()
      })
    },
    onSubmit() {
      editMessage(this.messageForm).then(response => {
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
  
  .message-box{
    width: 50%;
    min-height: 600px;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
    padding: 15px 30px 40px;
    .title-box{
      text-align: center;
      padding-bottom: 15px;
      font-weight: bold;
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 0;
      font-size: 12px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
</style>
